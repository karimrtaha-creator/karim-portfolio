export type OrderStatus =
  | 'new'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'dispatcher_assignment'
  | 'driver_assigned'
  | 'out_for_delivery'
  | 'otp_verification'
  | 'delivered'
  | 'cancelled'

export const ORDER_STAGES: { status: OrderStatus; label: string; role: string }[] = [
  { status: 'new', label: 'New Order', role: 'Customer' },
  { status: 'accepted', label: 'Order Accepted', role: 'Branch' },
  { status: 'preparing', label: 'Preparing', role: 'Branch' },
  { status: 'ready', label: 'Ready', role: 'Branch' },
  { status: 'dispatcher_assignment', label: 'Dispatcher Assignment', role: 'Dispatcher' },
  { status: 'driver_assigned', label: 'Driver Assigned', role: 'Dispatcher' },
  { status: 'out_for_delivery', label: 'Out for Delivery', role: 'Driver' },
  { status: 'otp_verification', label: 'OTP Verification', role: 'Driver' },
  { status: 'delivered', label: 'Delivered', role: 'Driver' },
]

export interface OrderLineItem {
  menuItemId: string
  quantity: number
}

export interface OrderHistoryEntry {
  status: OrderStatus
  at: string
  by: string
}

export interface DemoOrder {
  id: string
  customerName: string
  branchId: string
  zoneId: string
  items: OrderLineItem[]
  deliveryFee: number
  status: OrderStatus
  driverId: string | null
  otp: string
  slaMinutes: number
  /** ISO timestamp — computed once at module load so SLA countdowns tick forward in real time */
  acceptedAt: string
  history: OrderHistoryEntry[]
}

function minutesAgoIso(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

export const INITIAL_ORDERS: DemoOrder[] = [
  {
    id: 'ORD-10482',
    customerName: 'Ahmed Demo',
    branchId: 'br-downtown',
    zoneId: 'z-a',
    items: [
      { menuItemId: 'm1', quantity: 2 },
      { menuItemId: 'm7', quantity: 1 },
    ],
    deliveryFee: 35,
    status: 'preparing',
    driverId: null,
    otp: '5182',
    slaMinutes: 30,
    acceptedAt: minutesAgoIso(12),
    history: [
      { status: 'new', at: '08:39', by: 'Customer' },
      { status: 'accepted', at: '08:41', by: 'Branch Manager Demo' },
      { status: 'preparing', at: '08:42', by: 'Branch Manager Demo' },
    ],
  },
  {
    id: 'ORD-10483',
    customerName: 'Sara Demo',
    branchId: 'br-maadi',
    zoneId: 'z-f',
    items: [{ menuItemId: 'm4', quantity: 1 }],
    deliveryFee: 35,
    status: 'out_for_delivery',
    driverId: 'drv-04',
    otp: '7734',
    slaMinutes: 32,
    acceptedAt: minutesAgoIso(27),
    history: [
      { status: 'new', at: '08:20', by: 'Customer' },
      { status: 'accepted', at: '08:21', by: 'Branch Manager Demo' },
      { status: 'preparing', at: '08:22', by: 'Branch Manager Demo' },
      { status: 'ready', at: '08:34', by: 'Branch Manager Demo' },
      { status: 'dispatcher_assignment', at: '08:35', by: 'Dispatcher Demo' },
      { status: 'driver_assigned', at: '08:36', by: 'Dispatcher Demo' },
      { status: 'out_for_delivery', at: '08:38', by: 'Driver Demo 04' },
    ],
  },
  {
    id: 'ORD-10484',
    customerName: 'Omar Demo',
    branchId: 'br-nasrcity',
    zoneId: 'z-d',
    items: [
      { menuItemId: 'm2', quantity: 3 },
      { menuItemId: 'm8', quantity: 3 },
    ],
    deliveryFee: 30,
    status: 'delivered',
    driverId: 'drv-03',
    otp: '2290',
    slaMinutes: 28,
    acceptedAt: minutesAgoIso(41),
    history: [
      { status: 'new', at: '07:58', by: 'Customer' },
      { status: 'accepted', at: '07:59', by: 'Branch Manager Demo' },
      { status: 'preparing', at: '08:00', by: 'Branch Manager Demo' },
      { status: 'ready', at: '08:11', by: 'Branch Manager Demo' },
      { status: 'dispatcher_assignment', at: '08:12', by: 'Dispatcher Demo' },
      { status: 'driver_assigned', at: '08:13', by: 'Dispatcher Demo' },
      { status: 'out_for_delivery', at: '08:15', by: 'Driver Demo 03' },
      { status: 'otp_verification', at: '08:33', by: 'Driver Demo 03' },
      { status: 'delivered', at: '08:34', by: 'Driver Demo 03' },
    ],
  },
  {
    id: 'ORD-10485',
    customerName: 'Nour Demo',
    branchId: 'br-heliopolis',
    zoneId: 'z-g',
    items: [{ menuItemId: 'm5', quantity: 2 }],
    deliveryFee: 40,
    status: 'new',
    driverId: null,
    otp: '8841',
    slaMinutes: 25,
    acceptedAt: minutesAgoIso(1),
    history: [{ status: 'new', at: '09:02', by: 'Customer' }],
  },
  {
    id: 'ORD-10486',
    customerName: 'Youssef Demo',
    branchId: 'br-downtown',
    zoneId: 'z-b',
    items: [
      { menuItemId: 'm1', quantity: 1 },
      { menuItemId: 'm4', quantity: 1 },
    ],
    deliveryFee: 45,
    status: 'ready',
    driverId: null,
    otp: '3357',
    slaMinutes: 30,
    acceptedAt: minutesAgoIso(22),
    history: [
      { status: 'new', at: '08:44', by: 'Customer' },
      { status: 'accepted', at: '08:45', by: 'Branch Manager Demo' },
      { status: 'preparing', at: '08:46', by: 'Branch Manager Demo' },
      { status: 'ready', at: '09:00', by: 'Branch Manager Demo' },
    ],
  },
]
