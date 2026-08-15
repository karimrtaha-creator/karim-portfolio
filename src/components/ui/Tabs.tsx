import { cn } from '@/lib/cn'

export interface TabOption<T extends string> {
  value: T
  label: string
  icon?: React.ReactNode
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: TabOption<T>[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-1 rounded-[var(--radius-md)] border border-border bg-surface-2 p-1"
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[calc(var(--radius-md)-4px)] px-3 py-2 text-[13px] font-medium transition-colors duration-150',
              active ? 'bg-surface text-ink shadow-token-sm' : 'text-ink-dim hover:text-ink-soft',
            )}
          >
            {option.icon}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
