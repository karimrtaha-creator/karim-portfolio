import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { StatTile } from '@/components/ui/StatTile'
import { Tabs } from '@/components/ui/Tabs'
import { Table, Td, Th } from '@/components/ui/Table'
import { buildChartData, summarize, type TimeRange } from './chartData'
import { ComplaintsPanel } from './ComplaintsPanel'
import { AuditLog } from '@/components/ui/AuditLog'
import type { DeliveryDispatch, DeliveryState } from './state'

const RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
]

export function GeneralManagerView({ state, dispatch }: { state: DeliveryState; dispatch: DeliveryDispatch }) {
  const [range, setRange] = useState<TimeRange>('today')
  const chartData = useMemo(() => buildChartData(range), [range])
  const totals = useMemo(() => summarize(chartData), [chartData])

  const deliveredCount = state.orders.filter((o) => o.status === 'delivered').length
  const cancelledCount = state.orders.filter((o) => o.status === 'cancelled').length
  const pendingCount = state.orders.length - deliveredCount - cancelledCount
  const activeDrivers = state.drivers.filter((d) => d.availability !== 'offline').length
  const branchesOnline = state.branches.filter((b) => b.availability.delivery || b.availability.takeaway || b.availability.dineIn).length
  const openComplaints = state.complaints.filter((c) => c.status !== 'resolved').length

  const gridStroke = 'var(--border)'
  const axisColor = 'var(--ink-dim)'

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Orders" value={totals.orders} />
        <StatTile label="Completed" value={totals.completed} tone="success" />
        <StatTile label="Pending" value={pendingCount} tone="warning" />
        <StatTile label="Cancelled" value={totals.cancelled} tone="danger" />
        <StatTile label="Avg Delivery" value={27} suffix="min" />
        <StatTile label="SLA Breaches" value={1} tone="danger" />
        <StatTile label="Active Drivers" value={activeDrivers} tone="success" />
        <StatTile label="Branches Online" value={branchesOnline} tone="success" />
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-ink">Order volume</h3>
          <Tabs options={RANGE_OPTIONS} value={range} onChange={setRange} ariaLabel="Chart time range" />
        </div>
        <div className="h-64 rounded-[var(--radius-md)] border border-border bg-surface p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke={gridStroke} vertical={false} />
              <XAxis dataKey="label" stroke={axisColor} fontSize={11} tickLine={false} axisLine={{ stroke: gridStroke }} />
              <YAxis stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} width={28} />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'var(--ink)',
                }}
              />
              <Bar dataKey="orders" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" fill="var(--danger)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold text-ink">Completed vs. cancelled trend</h3>
        <div className="h-56 rounded-[var(--radius-md)] border border-border bg-surface p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke={gridStroke} vertical={false} />
              <XAxis dataKey="label" stroke={axisColor} fontSize={11} tickLine={false} axisLine={{ stroke: gridStroke }} />
              <YAxis stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} width={28} />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'var(--ink)',
                }}
              />
              <Line type="monotone" dataKey="completed" stroke="var(--success)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="cancelled" stroke="var(--danger)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Branch performance</h3>
        <Table>
          <thead>
            <tr>
              <Th>Branch</Th>
              <Th>Today's Orders</Th>
              <Th>Pending</Th>
              <Th>Completed</Th>
              <Th>Delivery</Th>
            </tr>
          </thead>
          <tbody>
            {state.branches.map((branch) => (
              <tr key={branch.id}>
                <Td>{branch.name}</Td>
                <Td>{branch.todaysOrders}</Td>
                <Td>{branch.pending}</Td>
                <Td>{branch.completed}</Td>
                <Td>{branch.availability.delivery ? 'ON' : 'OFF'}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Complaints ({openComplaints} open)</h3>
        <ComplaintsPanel complaints={state.complaints} dispatch={dispatch} />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Audit log</h3>
        <AuditLog entries={state.auditLog} />
      </div>
    </div>
  )
}
