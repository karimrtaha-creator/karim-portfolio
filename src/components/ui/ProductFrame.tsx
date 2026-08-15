import type { ReactNode } from 'react'
import { DemoBadge } from './DemoBadge'
import { accentClasses } from '@/lib/accent'
import type { AccentColor } from '@/data/types'
import { cn } from '@/lib/cn'

export function ProductFrame({
  title,
  accent,
  actions,
  children,
}: {
  title: string
  accent: AccentColor
  actions?: ReactNode
  children: ReactNode
}) {
  const classes = accentClasses(accent)
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-token-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-2 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
          </div>
          <span className={cn('h-2 w-2 rounded-full', classes.dot)} aria-hidden />
          <span className="font-mono text-[13px] font-medium text-ink">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <DemoBadge />
        </div>
      </div>
      <div className="bg-bg-inset p-4 md:p-6">{children}</div>
    </div>
  )
}
