import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, Td, Th } from '@/components/ui/Table'
import { useToast } from '@/components/ui/Toast'
import type { ServiceAvailability } from '@/data/demoBranches'
import { STATUS_LABEL, STATUS_TONE } from './orderHelpers'
import type { DeliveryDispatch, DeliveryState } from './state'
import { ROLE_ACTOR } from './state'

const SERVICES: { key: keyof ServiceAvailability; label: string }[] = [
  { key: 'delivery', label: 'Delivery' },
  { key: 'takeaway', label: 'Takeaway' },
  { key: 'dineIn', label: 'Dine-in' },
]

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-border bg-surface-2 px-3 py-2 text-left"
      aria-pressed={on}
    >
      <span className="text-[13px] text-ink">{label}</span>
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${on ? 'bg-success' : 'bg-border-strong'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-token-sm transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </span>
    </button>
  )
}

export function BranchManagerView({ state, dispatch }: { state: DeliveryState; dispatch: DeliveryDispatch }) {
  const { push } = useToast()
  const [branchId, setBranchId] = useState(state.branches[0].id)
  const branch = state.branches.find((b) => b.id === branchId)!
  const actor = ROLE_ACTOR['branch-manager']

  const branchOrders = state.orders.filter(
    (order) => order.branchId === branchId && ['new', 'accepted', 'preparing'].includes(order.status),
  )
  const branchZones = state.zones.filter((zone) => zone.branchId === branchId)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {state.branches.map((b) => (
          <button
            key={b.id}
            onClick={() => setBranchId(b.id)}
            className={`rounded-[var(--radius-sm)] border px-3 py-1.5 text-[13px] font-medium transition-colors ${
              b.id === branchId ? 'border-accent bg-accent-soft text-accent-ink' : 'border-border text-ink-soft hover:border-ink-dim'
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-ink">Service availability</h3>
          <div className="grid gap-2 sm:grid-cols-3">
            {SERVICES.map((service) => (
              <Toggle
                key={service.key}
                label={service.label}
                on={branch.availability[service.key]}
                onClick={() => dispatch({ type: 'TOGGLE_SERVICE', branchId, service: service.key })}
              />
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-ink">Today at {branch.name}</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="font-mono text-xl font-semibold text-ink">{branch.todaysOrders}</p>
              <p className="text-[11px] uppercase tracking-wide text-ink-dim">Orders</p>
            </div>
            <div>
              <p className="font-mono text-xl font-semibold text-warning">{branch.pending}</p>
              <p className="text-[11px] uppercase tracking-wide text-ink-dim">Pending</p>
            </div>
            <div>
              <p className="font-mono text-xl font-semibold text-success">{branch.completed}</p>
              <p className="text-[11px] uppercase tracking-wide text-ink-dim">Completed</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Delivery zones</h3>
        <Table>
          <thead>
            <tr>
              <Th>Zone</Th>
              <Th>Status</Th>
              <Th>Delivery Fee</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {branchZones.map((zone) => (
              <tr key={zone.id}>
                <Td>{zone.name}</Td>
                <Td>
                  <Badge tone={zone.active ? 'success' : 'neutral'} dot>
                    {zone.active ? 'Active' : 'Disabled'}
                  </Badge>
                </Td>
                <Td>{zone.active ? `${zone.fee} EGP` : '—'}</Td>
                <Td>
                  <Button size="sm" variant="ghost" onClick={() => dispatch({ type: 'TOGGLE_ZONE', zoneId: zone.id })}>
                    {zone.active ? 'Disable' : 'Enable'}
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Kitchen queue ({branchOrders.length})</h3>
        {branchOrders.length === 0 ? (
          <p className="text-[13px] text-ink-dim">No orders waiting on the branch right now.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {branchOrders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[13px] font-semibold text-ink">{order.id}</span>
                  <Badge tone={STATUS_TONE[order.status]}>{STATUS_LABEL[order.status]}</Badge>
                </div>
                <p className="mt-1.5 text-[13px] text-ink-soft">{order.customerName}</p>
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    dispatch({ type: 'ADVANCE_ORDER', orderId: order.id, actor })
                    push({ title: 'Order updated', description: `${order.id} moved forward`, tone: 'info' })
                  }}
                >
                  {order.status === 'new' ? 'Accept Order' : order.status === 'accepted' ? 'Start Preparing' : 'Mark Ready'}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
