import { useState } from 'react'
import { ORDER_STAGES } from '@/data/demoOrders'
import { STAGE_DETAIL } from './stageDetails'
import { cn } from '@/lib/cn'

export function OrderLifecycle() {
  const [active, setActive] = useState(0)
  const activeStage = ORDER_STAGES[active]

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 md:p-6">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-ink-dim">
        Order lifecycle — click a stage to see what happens
      </p>

      <div className="flex flex-wrap gap-2">
        {ORDER_STAGES.map((stage, index) => (
          <button
            key={stage.status}
            onClick={() => setActive(index)}
            className={cn(
              'flex items-center gap-2 rounded-[var(--radius-sm)] border px-3 py-1.5 text-[12.5px] font-medium transition-colors',
              index === active
                ? 'border-accent bg-accent-soft text-accent-ink'
                : 'border-border text-ink-soft hover:border-ink-dim',
            )}
          >
            <span className="font-mono text-[10.5px] text-ink-dim">{String(index + 1).padStart(2, '0')}</span>
            {stage.label}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-[var(--radius-md)] bg-surface-2 p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="rounded-[var(--radius-sm)] border border-border bg-surface px-2 py-0.5 font-mono text-[10.5px] text-ink-dim">
            {activeStage.role}
          </span>
          <span className="text-[13.5px] font-semibold text-ink">{activeStage.label}</span>
        </div>
        <p className="text-[13.5px] leading-relaxed text-ink-soft">{STAGE_DETAIL[activeStage.status]}</p>
      </div>
    </div>
  )
}
