import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Card({
  children,
  className,
  hover = false,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; hover?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border border-border bg-surface shadow-token-sm',
        hover && 'transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-dim hover:shadow-token-md',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
