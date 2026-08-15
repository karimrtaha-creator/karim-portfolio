import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { SLAPanel } from './SLAPanel'
import { STATUS_LABEL, STATUS_TONE } from './orderHelpers'
import type { DeliveryDispatch, DeliveryState } from './state'
import { ROLE_ACTOR } from './state'

export function DispatcherView({ state, dispatch }: { state: DeliveryState; dispatch: DeliveryDispatch }) {
  const { push } = useToast()
  const [selectedDriver, setSelectedDriver] = useState<Record<string, string>>({})
  const actor = ROLE_ACTOR.dispatcher

  const readyQueue = state.orders.filter((order) => order.status === 'ready')
  const assigningQueue = state.orders.filter((order) => order.status === 'dispatcher_assignment')
  const inFlight = state.orders.filter((order) => ['driver_assigned', 'out_for_delivery', 'otp_verification'].includes(order.status))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Ready for dispatch ({readyQueue.length})</h3>
        {readyQueue.length === 0 ? (
          <p className="text-[13px] text-ink-dim">Nothing waiting — the branch queue is clear.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {readyQueue.map((order) => {
              const branch = state.branches.find((b) => b.id === order.branchId)
              return (
                <Card key={order.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[13px] font-semibold text-ink">{order.id}</span>
                    <Badge tone={STATUS_TONE[order.status]}>{STATUS_LABEL[order.status]}</Badge>
                  </div>
                  <p className="mt-1.5 text-[13px] text-ink-soft">{branch?.name} · {order.customerName}</p>
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      dispatch({ type: 'ADVANCE_ORDER', orderId: order.id, actor })
                      push({ title: 'Assignment started', description: `${order.id} moved to dispatcher assignment`, tone: 'info' })
                    }}
                  >
                    Begin Assignment
                  </Button>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Assigning driver ({assigningQueue.length})</h3>
        {assigningQueue.length === 0 ? (
          <p className="text-[13px] text-ink-dim">No orders currently awaiting a driver.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {assigningQueue.map((order) => {
              const branch = state.branches.find((b) => b.id === order.branchId)
              const branchDrivers = state.drivers.filter((d) => d.branchId === order.branchId && d.availability !== 'offline')
              return (
                <Card key={order.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[13px] font-semibold text-ink">{order.id}</span>
                    <Badge tone={STATUS_TONE[order.status]}>{STATUS_LABEL[order.status]}</Badge>
                  </div>
                  <p className="mt-1.5 text-[13px] text-ink-soft">{branch?.name} · {order.customerName}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <select
                      value={selectedDriver[order.id] ?? branchDrivers[0]?.id ?? ''}
                      onChange={(event) => setSelectedDriver((current) => ({ ...current, [order.id]: event.target.value }))}
                      className="flex-1 rounded-[var(--radius-sm)] border border-border bg-surface px-2.5 py-1.5 text-[13px] text-ink focus:border-accent focus:outline-none"
                    >
                      {branchDrivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} — {driver.availability === 'available' ? 'available' : 'on delivery'}
                        </option>
                      ))}
                    </select>
                    <Button
                      size="sm"
                      onClick={() => {
                        const driverId = selectedDriver[order.id] ?? branchDrivers[0]?.id
                        if (!driverId) return
                        dispatch({ type: 'ASSIGN_DRIVER', orderId: order.id, driverId, actor })
                        dispatch({ type: 'ADVANCE_ORDER', orderId: order.id, actor })
                        push({ title: 'Driver assigned', description: `${order.id} handed off to a driver`, tone: 'success' })
                      }}
                    >
                      Assign
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Live operational board ({inFlight.length} in flight)</h3>
        <SLAPanel orders={state.orders} branches={state.branches} />
      </div>
    </div>
  )
}
