import { useState } from 'react'
import { Table, Td, Th } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { computeSla } from '@/lib/sla'
import { useInterval } from '@/hooks/useInterval'
import type { DemoOrder } from '@/data/demoOrders'
import type { DemoBranch } from '@/data/demoBranches'
import { ACTIVE_STATUSES } from './orderHelpers'

export function SLAPanel({ orders, branches }: { orders: DemoOrder[]; branches: DemoBranch[] }) {
  const [, forceTick] = useState(0)
  useInterval(() => forceTick((n) => n + 1), 15_000)

  const activeOrders = orders.filter((order) => ACTIVE_STATUSES.includes(order.status) && order.status !== 'new')

  return (
    <Table>
      <thead>
        <tr>
          <Th>Order</Th>
          <Th>Branch</Th>
          <Th>Expected</Th>
          <Th>Elapsed</Th>
          <Th>Remaining</Th>
          <Th>SLA Status</Th>
        </tr>
      </thead>
      <tbody>
        {activeOrders.map((order) => {
          const branch = branches.find((item) => item.id === order.branchId)
          const sla = computeSla(new Date(order.acceptedAt), order.slaMinutes)
          const tone = sla.state === 'breached' ? 'danger' : sla.state === 'at-risk' ? 'warning' : 'success'
          return (
            <tr key={order.id}>
              <Td className="font-mono">{order.id}</Td>
              <Td>{branch?.name ?? '—'}</Td>
              <Td>{order.slaMinutes} min</Td>
              <Td>{Math.max(0, Math.round(sla.elapsedMinutes))} min</Td>
              <Td className={sla.remainingMinutes < 0 ? 'text-danger' : undefined}>
                {sla.remainingMinutes < 0 ? '+' : ''}
                {Math.round(Math.abs(sla.remainingMinutes))} min{sla.remainingMinutes < 0 ? ' over' : ' left'}
              </Td>
              <Td>
                <Badge tone={tone} dot>
                  {sla.state === 'breached' ? 'Breached' : sla.state === 'at-risk' ? 'At Risk' : 'On Track'}
                </Badge>
              </Td>
            </tr>
          )
        })}
        {activeOrders.length === 0 && (
          <tr>
            <Td colSpan={6} className="text-center text-ink-dim">
              No active orders in flight right now.
            </Td>
          </tr>
        )}
      </tbody>
    </Table>
  )
}
