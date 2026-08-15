import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type BadgeTone = 'neutral' | 'accent' | 'amber' | 'violet' | 'blue' | 'rose' | 'teal' | 'success' | 'warning' | 'danger' | 'demo'

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-surface-2 text-ink-soft border-border',
  accent: 'bg-accent-soft text-accent-ink border-accent/30',
  amber: 'bg-amber-soft text-amber-ink border-amber/30',
  violet: 'bg-violet-soft text-violet-ink border-violet/30',
  blue: 'bg-blue-soft text-blue-ink border-blue/30',
  rose: 'bg-rose-soft text-rose-ink border-rose/30',
  teal: 'bg-teal-soft text-teal-ink border-teal/30',
  success: 'bg-success-soft text-success border-success/30',
  warning: 'bg-warning-soft text-warning border-warning/30',
  danger: 'bg-danger-soft text-danger border-danger/30',
  demo: 'bg-demo-soft text-demo-ink border-demo/30',
}

const DOT_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-ink-dim',
  accent: 'bg-accent',
  amber: 'bg-amber',
  violet: 'bg-violet',
  blue: 'bg-blue',
  rose: 'bg-rose',
  teal: 'bg-teal',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  demo: 'bg-demo',
}

export function Badge({
  children,
  tone = 'neutral',
  className,
  dot = false,
}: {
  children: ReactNode
  tone?: BadgeTone
  className?: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', DOT_CLASSES[tone])} aria-hidden />}
      {children}
    </span>
  )
}
