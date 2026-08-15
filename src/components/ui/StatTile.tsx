import type { ReactNode } from 'react'
import { useCountUp } from '@/hooks/useCountUp'
import { cn } from '@/lib/cn'

export function StatTile({
  label,
  value,
  suffix,
  tone = 'neutral',
  icon,
}: {
  label: string
  value: number
  suffix?: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger'
  icon?: ReactNode
}) {
  const animated = useCountUp(value, true)

  const toneClass = {
    neutral: 'text-ink',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  }[tone]

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
      <div className="mb-2 flex items-center justify-between text-ink-dim">
        <span className="font-mono text-[11px] uppercase tracking-wide">{label}</span>
        {icon}
      </div>
      <div className={cn('font-mono text-2xl font-semibold tabular-nums', toneClass)}>
        {animated}
        {suffix && <span className="ml-1 text-sm font-normal text-ink-dim">{suffix}</span>}
      </div>
    </div>
  )
}
