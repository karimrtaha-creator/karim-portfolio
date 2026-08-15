import { DEMO_MENU } from '@/data/demoMenu'
import type { DemoOrder, OrderStatus } from '@/data/demoOrders'

export function orderItemsTotal(order: DemoOrder): number {
  return order.items.reduce((sum, line) => {
    const menuItem = DEMO_MENU.find((item) => item.id === line.menuItemId)
    return sum + (menuItem?.price ?? 0) * line.quantity
  }, 0)
}

export function orderGrandTotal(order: DemoOrder): number {
  return orderItemsTotal(order) + order.deliveryFee
}

export const ACTIVE_STATUSES: OrderStatus[] = [
  'new',
  'accepted',
  'preparing',
  'ready',
  'dispatcher_assignment',
  'driver_assigned',
  'out_for_delivery',
  'otp_verification',
]

export const STATUS_TONE: Record<OrderStatus, 'neutral' | 'accent' | 'amber' | 'blue' | 'success' | 'danger'> = {
  new: 'neutral',
  accepted: 'blue',
  preparing: 'amber',
  ready: 'amber',
  dispatcher_assignment: 'blue',
  driver_assigned: 'blue',
  out_for_delivery: 'accent',
  otp_verification: 'accent',
  delivered: 'success',
  cancelled: 'danger',
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'New',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready: 'Ready',
  dispatcher_assignment: 'Dispatcher Assignment',
  driver_assigned: 'Driver Assigned',
  out_for_delivery: 'Out for Delivery',
  otp_verification: 'OTP Verification',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}
