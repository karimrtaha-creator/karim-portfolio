import { useMemo, useState } from 'react'
import { Download, RadioTower } from 'lucide-react'
import { DemoPageShell } from '@/components/layout/DemoPageShell'
import { ProductFrame } from '@/components/ui/ProductFrame'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatTile } from '@/components/ui/StatTile'
import { Table, Td, Th } from '@/components/ui/Table'
import { useToast } from '@/components/ui/Toast'
import { useInterval } from '@/hooks/useInterval'
import { formatClock } from '@/lib/format'
import { INITIAL_COUPONS, type CouponStatus, type DemoCoupon } from '@/data/demoCoupons'

const STATUS_TONE: Record<CouponStatus, 'success' | 'blue' | 'warning' | 'danger'> = {
  valid: 'success',
  used: 'blue',
  pending: 'warning',
  duplicate: 'danger',
}

const NEW_CODE_PREFIXES = ['DEMO', 'TEST', 'SAMPLE']

export function CouponTrackerDemo() {
  const { push } = useToast()
  const [coupons, setCoupons] = useState<DemoCoupon[]>(INITIAL_COUPONS)
  const [watching, setWatching] = useState(false)

  useInterval(
    () => {
      const prefix = NEW_CODE_PREFIXES[Math.floor(Math.random() * NEW_CODE_PREFIXES.length)]
      const code = `${prefix}-${Math.floor(1000 + Math.random() * 8999)}`
      const isDuplicate = coupons.some((c) => c.code === code)
      const coupon: DemoCoupon = {
        code,
        status: isDuplicate ? 'duplicate' : 'pending',
        capturedAt: formatClock(new Date()),
        value: [30, 40, 50, 60][Math.floor(Math.random() * 4)],
      }
      setCoupons((current) => [coupon, ...current].slice(0, 24))
      push({ title: isDuplicate ? 'Duplicate code captured' : 'New coupon captured', description: code, tone: isDuplicate ? 'warning' : 'info' })
    },
    watching ? 4000 : null,
  )

  const counts = useMemo(
    () => ({
      total: coupons.length,
      valid: coupons.filter((c) => c.status === 'valid').length,
      used: coupons.filter((c) => c.status === 'used').length,
      pending: coupons.filter((c) => c.status === 'pending').length,
      duplicates: coupons.filter((c) => c.status === 'duplicate').length,
    }),
    [coupons],
  )

  const exportCsv = () => {
    push({ title: 'Report exported', description: `${coupons.length} rows — demo export only`, tone: 'success' })
  }

  return (
    <DemoPageShell slug="coupon-tracker">
      <ProductFrame
        title="coupon-tracker — merchant portal"
        accent="amber"
        actions={
          <Button size="sm" variant={watching ? 'secondary' : 'primary'} icon={<RadioTower className="h-3.5 w-3.5" />} onClick={() => setWatching((w) => !w)}>
            {watching ? 'Watching…' : 'Start Watching'}
          </Button>
        }
      >
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatTile label="Total Codes" value={counts.total} />
          <StatTile label="Valid" value={counts.valid} tone="success" />
          <StatTile label="Used" value={counts.used} />
          <StatTile label="Pending" value={counts.pending} tone="warning" />
          <StatTile label="Duplicates" value={counts.duplicates} tone="danger" />
        </div>

        <div className="mb-3 flex items-center justify-between">
          <p className="text-[13px] text-ink-soft">
            {watching ? 'Watching the portal — new codes capture automatically.' : 'Start watching to simulate live capture, or review what\'s already been captured.'}
          </p>
          <Button size="sm" variant="secondary" icon={<Download className="h-3.5 w-3.5" />} onClick={exportCsv}>
            Export
          </Button>
        </div>

        <Table>
          <thead>
            <tr>
              <Th>Code</Th>
              <Th>Status</Th>
              <Th>Captured</Th>
              <Th>Value</Th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon, index) => (
              <tr key={`${coupon.code}-${index}`}>
                <Td className="font-mono">{coupon.code}</Td>
                <Td>
                  <Badge tone={STATUS_TONE[coupon.status]} dot>
                    {coupon.status}
                  </Badge>
                </Td>
                <Td className="font-mono text-ink-dim">{coupon.capturedAt}</Td>
                <Td>{coupon.value} EGP</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ProductFrame>
    </DemoPageShell>
  )
}
