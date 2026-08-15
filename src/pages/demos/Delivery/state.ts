import { useReducer } from 'react'
import { INITIAL_ORDERS, ORDER_STAGES, type DemoOrder, type OrderLineItem, type OrderStatus } from '@/data/demoOrders'
import { INITIAL_BRANCHES, type DemoBranch, type ServiceAvailability } from '@/data/demoBranches'
import { INITIAL_DRIVERS, type DemoDriver } from '@/data/demoDrivers'
import { INITIAL_ZONES, type DemoZone } from '@/data/demoZones'
import { INITIAL_COMPLAINTS, type ComplaintStatus, type DemoComplaint } from '@/data/demoComplaints'
import { INITIAL_AUDIT_LOG, type AuditEntry } from '@/data/demoAuditLog'
import { formatClock } from '@/lib/format'

export type DeliveryRole = 'customer' | 'dispatcher' | 'driver' | 'branch-manager' | 'general-manager'

export const ROLE_ACTOR: Record<DeliveryRole, string> = {
  customer: 'Customer',
  dispatcher: 'Dispatcher Demo',
  driver: 'Driver Demo 01',
  'branch-manager': 'Branch Manager Demo',
  'general-manager': 'General Manager Demo',
}

export interface DeliveryState {
  orders: DemoOrder[]
  branches: DemoBranch[]
  drivers: DemoDriver[]
  zones: DemoZone[]
  complaints: DemoComplaint[]
  auditLog: AuditEntry[]
  nextOrderSeq: number
}

type Action =
  | { type: 'ADVANCE_ORDER'; orderId: string; actor: string }
  | { type: 'ASSIGN_DRIVER'; orderId: string; driverId: string; actor: string }
  | { type: 'CONFIRM_OTP'; orderId: string; code: string; actor: string }
  | { type: 'CREATE_ORDER'; branchId: string; zoneId: string; items: OrderLineItem[]; deliveryFee: number; customerName: string }
  | { type: 'TOGGLE_SERVICE'; branchId: string; service: keyof ServiceAvailability }
  | { type: 'TOGGLE_ZONE'; zoneId: string }
  | { type: 'UPDATE_COMPLAINT'; complaintId: string; status?: ComplaintStatus; assignedTo?: string; note?: string; compensation?: string }
  | { type: 'LOG'; entry: string; actor: string }

function pushAudit(state: DeliveryState, actor: string, action: string): AuditEntry[] {
  return [{ at: formatClock(new Date()), actor, action }, ...state.auditLog].slice(0, 40)
}

function nextStatus(current: OrderStatus): OrderStatus | null {
  const index = ORDER_STAGES.findIndex((stage) => stage.status === current)
  if (index === -1 || index === ORDER_STAGES.length - 1) return null
  return ORDER_STAGES[index + 1].status
}

function reducer(state: DeliveryState, action: Action): DeliveryState {
  switch (action.type) {
    case 'ADVANCE_ORDER': {
      const order = state.orders.find((item) => item.id === action.orderId)
      if (!order) return state
      const upcoming = nextStatus(order.status)
      if (!upcoming) return state
      if (upcoming === 'driver_assigned' && !order.driverId) return state
      if (upcoming === 'delivered' && order.status !== 'otp_verification') return state

      const updatedOrders = state.orders.map((item) =>
        item.id === action.orderId
          ? {
              ...item,
              status: upcoming,
              history: [...item.history, { status: upcoming, at: formatClock(new Date()), by: action.actor }],
            }
          : item,
      )
      const label = ORDER_STAGES.find((stage) => stage.status === upcoming)?.label ?? upcoming
      return {
        ...state,
        orders: updatedOrders,
        auditLog: pushAudit(state, action.actor, `${label} — ${action.orderId}`),
      }
    }

    case 'ASSIGN_DRIVER': {
      const updatedOrders = state.orders.map((item) =>
        item.id === action.orderId ? { ...item, driverId: action.driverId } : item,
      )
      const driver = state.drivers.find((item) => item.id === action.driverId)
      return {
        ...state,
        orders: updatedOrders,
        auditLog: pushAudit(state, action.actor, `Assigned ${action.orderId} to ${driver?.name ?? action.driverId}`),
      }
    }

    case 'CONFIRM_OTP': {
      const order = state.orders.find((item) => item.id === action.orderId)
      if (!order) return state
      if (order.otp !== action.code) return state
      const updatedOrders = state.orders.map((item) =>
        item.id === action.orderId
          ? {
              ...item,
              status: 'otp_verification' as OrderStatus,
              history: [...item.history, { status: 'otp_verification' as OrderStatus, at: formatClock(new Date()), by: action.actor }],
            }
          : item,
      )
      return {
        ...state,
        orders: updatedOrders,
        auditLog: pushAudit(state, action.actor, `OTP verified for ${action.orderId}`),
      }
    }

    case 'CREATE_ORDER': {
      const id = `ORD-${10486 + state.nextOrderSeq}`
      const order: DemoOrder = {
        id,
        customerName: action.customerName,
        branchId: action.branchId,
        zoneId: action.zoneId,
        items: action.items,
        deliveryFee: action.deliveryFee,
        status: 'new',
        driverId: null,
        otp: String(Math.floor(1000 + ((state.nextOrderSeq * 7919) % 9000))),
        slaMinutes: 30,
        acceptedAt: new Date().toISOString(),
        history: [{ status: 'new', at: formatClock(new Date()), by: 'Customer' }],
      }
      return {
        ...state,
        orders: [order, ...state.orders],
        nextOrderSeq: state.nextOrderSeq + 1,
        auditLog: pushAudit(state, 'Customer', `Placed new order ${id}`),
      }
    }

    case 'TOGGLE_SERVICE': {
      const branches = state.branches.map((branch) =>
        branch.id === action.branchId
          ? { ...branch, availability: { ...branch.availability, [action.service]: !branch.availability[action.service] } }
          : branch,
      )
      const branch = branches.find((item) => item.id === action.branchId)
      const state2 = { ...state, branches }
      return {
        ...state2,
        auditLog: pushAudit(
          state2,
          'Branch Manager Demo',
          `${action.service} set to ${branch?.availability[action.service] ? 'ON' : 'OFF'} — ${branch?.name}`,
        ),
      }
    }

    case 'TOGGLE_ZONE': {
      const zones = state.zones.map((zone) => (zone.id === action.zoneId ? { ...zone, active: !zone.active } : zone))
      return { ...state, zones }
    }

    case 'UPDATE_COMPLAINT': {
      const complaints = state.complaints.map((complaint) => {
        if (complaint.id !== action.complaintId) return complaint
        return {
          ...complaint,
          status: action.status ?? complaint.status,
          assignedTo: action.assignedTo ?? complaint.assignedTo,
          compensation: action.compensation ?? complaint.compensation,
          notes: action.note
            ? [...complaint.notes, { at: formatClock(new Date()), by: 'General Manager Demo', text: action.note }]
            : complaint.notes,
        }
      })
      return { ...state, complaints }
    }

    case 'LOG': {
      return { ...state, auditLog: pushAudit(state, action.actor, action.entry) }
    }

    default:
      return state
  }
}

function initialState(): DeliveryState {
  return {
    orders: INITIAL_ORDERS,
    branches: INITIAL_BRANCHES,
    drivers: INITIAL_DRIVERS,
    zones: INITIAL_ZONES,
    complaints: INITIAL_COMPLAINTS,
    auditLog: INITIAL_AUDIT_LOG,
    nextOrderSeq: 1,
  }
}

export function useDeliveryState() {
  return useReducer(reducer, undefined, initialState)
}

export type DeliveryDispatch = ReturnType<typeof useDeliveryState>[1]
