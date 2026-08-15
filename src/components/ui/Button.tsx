import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-strong border-accent',
  secondary: 'bg-transparent text-ink border-border hover:border-ink-dim hover:-translate-y-0.5',
  ghost: 'bg-transparent text-ink-soft border-transparent hover:bg-surface-2',
  danger: 'bg-danger text-white border-danger hover:opacity-90',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-[13px]',
  md: 'px-4 py-2.5 text-sm',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: Variant
  size?: Size
  icon?: ReactNode
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
