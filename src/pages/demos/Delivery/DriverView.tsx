import { useState } from 'react'
import { MapPin, Navigation, Package } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { DEMO_MENU } from '@/data/demoMenu'
import { INITIAL_DRIVERS } from '@/data/demoDrivers'
import { STATUS_LABEL, STATUS_TONE } from './orderHelpers'
import type { DeliveryDispatch, DeliveryState } from './state'

export function DriverView({ state, dispatch }: { state: DeliveryState; dispatch: DeliveryDispatch }) {
  const { push } = useToast()
  const [driverId, setDriverId] = useState(INITIAL_DRIVERS[3]?.id ?? INITIAL_DRIVERS[0].id)
  const [accepted, setAccepted] = useState<Set<string>>(new Set())
  const [arrived, setArrived] = useState<Set<string>>(new Set())
  const [otpDrafts, setOtpDrafts] = useState<Record<string, string>>({})

  const driver = state.drivers.find((d) => d.id === driverId)
  const myOrders = state.orders.filter(
    (order) => order.driverId === driverId && ['driver_assigned', 'out_for_delivery', 'otp_verification'].includes(order.status),
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-[13px] text-ink-soft" htmlFor="driver-select">
          Viewing as
        </label>
        <select
          id="driver-select"
          value={driverId}
          onChange={(event) => setDriverId(event.target.value)}
          className="rounded-[var(--radius-sm)] border border-border bg-surface px-2.5 py-1.5 text-[13px] text-ink focus:border-accent focus:outline-none"
        >
          {state.drivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <Badge tone={driver?.availability === 'available' ? 'success' : driver?.availability === 'on-delivery' ? 'blue' : 'neutral'} dot>
          {driver?.availability.replace('-', ' ')}
        </Badge>
      </div>

      {myOrders.length === 0 && (
        <Card className="p-8 text-center text-[13px] text-ink-dim">No order currently assigned to this driver.</Card>
      )}

      {myOrders.map((order) => {
        const branch = state.branches.find((b) => b.id === order.branchId)
        const zone = state.zones.find((z) => z.id === order.zoneId)
        const hasAccepted = accepted.has(order.id)
        const hasArrived = arrived.has(order.id)

        return (
          <Card key={order.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[14px] font-semibold text-ink">{order.id}</span>
              <Badge tone={STATUS_TONE[order.status]}>{STATUS_LABEL[order.status]}</Badge>
            </div>

            <div className="mt-3 grid gap-2 text-[13.5px] text-ink-soft sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-ink-dim" /> {order.customerName} · {branch?.name}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-ink-dim" /> {zone?.name ?? 'Zone —'}
              </p>
            </div>

            <ul className="mt-2 flex flex-wrap gap-1.5">
              {order.items.map((line, index) => {
                const menuItem = DEMO_MENU.find((item) => item.id === line.menuItemId)
                return (
                  <li key={index} className="rounded-[var(--radius-sm)] border border-border bg-surface-2 px-2 py-0.5 text-[12px] text-ink-soft">
                    {line.quantity}× {menuItem?.name}
                  </li>
                )
              })}
            </ul>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              {order.status === 'driver_assigned' && !hasAccepted && (
                <Button
                  size="sm"
                  onClick={() => {
                    setAccepted((current) => new Set(current).add(order.id))
                    push({ title: 'Order accepted', description: `${order.id} accepted by ${driver?.name}`, tone: 'info' })
                  }}
                >
                  Accept
                </Button>
              )}

              {order.status === 'driver_assigned' && hasAccepted && (
                <Button
                  size="sm"
                  icon={<Navigation className="h-3.5 w-3.5" />}
                  onClick={() => {
                    dispatch({ type: 'ADVANCE_ORDER', orderId: order.id, actor: driver?.name ?? 'Driver Demo' })
                    push({ title: 'Delivery started', description: `${order.id} is out for delivery`, tone: 'info' })
                  }}
                >
                  Start Delivery
                </Button>
              )}

              {order.status === 'out_for_delivery' && !hasArrived && (
                <Button size="sm" variant="secondary" onClick={() => setArrived((current) => new Set(current).add(order.id))}>
                  Arrived
                </Button>
              )}

              {order.status === 'out_for_delivery' && hasArrived && (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={otpDrafts[order.id] ?? ''}
                    onChange={(event) => setOtpDrafts((current) => ({ ...current, [order.id]: event.target.value }))}
                    placeholder="Enter customer OTP"
                    maxLength={4}
                    className="w-36 rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-1.5 font-mono text-[13px] tracking-widest text-ink placeholder:tracking-normal placeholder:text-ink-faint focus:border-accent focus:outline-none"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const code = otpDrafts[order.id] ?? ''
                      if (code !== order.otp) {
                        push({ title: 'Incorrect OTP', description: 'That code doesn\'t match — ask the customer to confirm.', tone: 'warning' })
                        return
                      }
                      dispatch({ type: 'CONFIRM_OTP', orderId: order.id, code, actor: driver?.name ?? 'Driver Demo' })
                      push({ title: 'OTP verified', description: `${order.id} confirmed`, tone: 'success' })
                    }}
                  >
                    Confirm OTP
                  </Button>
                </div>
              )}

              {order.status === 'otp_verification' && (
                <Button
                  size="sm"
                  onClick={() => {
                    dispatch({ type: 'ADVANCE_ORDER', orderId: order.id, actor: driver?.name ?? 'Driver Demo' })
                    push({ title: 'Order delivered', description: `${order.id} completed`, tone: 'success' })
                  }}
                >
                  Complete Order
                </Button>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
