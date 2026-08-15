import type { OrderStatus } from '@/data/demoOrders'

export const STAGE_DETAIL: Record<OrderStatus, string> = {
  new: 'Customer places an order through the app — items, address, and delivery zone are selected, and the order lands in the branch queue.',
  accepted: 'Branch confirms the order is receivable and it enters the prep queue. This is the start of the branch\'s prep-time clock.',
  preparing: 'Kitchen prepares the order. Prep time is tracked separately from delivery time and counted against the branch, not the driver.',
  ready: 'Order is packaged and ready, waiting to be picked up by the dispatcher for driver assignment.',
  dispatcher_assignment: 'Dispatcher reviews the ready queue and assigns the next available driver based on zone and load.',
  driver_assigned: 'Driver receives the order details — customer, delivery zone, items, and any delivery notes.',
  out_for_delivery: 'Driver picks up the order. Hand-off is dispatcher-confirmed with a photographed receipt, which starts the delivery-time clock — separating branch responsibility from driver responsibility.',
  otp_verification: 'On arrival, the driver asks the customer for their one-time code to confirm the right person is receiving the order before handoff.',
  delivered: 'Order is marked delivered. The full timestamped history — order to delivery — is now attributable end to end.',
  cancelled: 'Order was cancelled before delivery.',
}
