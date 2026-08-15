import { useState } from 'react'
import { Bot, Check, MessageSquare, Sparkles } from 'lucide-react'
import { DemoPageShell } from '@/components/layout/DemoPageShell'
import { ProductFrame } from '@/components/ui/ProductFrame'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { findMenuItem } from '@/data/demoMenu'
import { formatEGP } from '@/lib/format'
import { cn } from '@/lib/cn'

const CHAT_MESSAGES = [
  { from: 'customer' as const, text: 'عايز 2 كشري كبير وواحد طاجن لحمة' },
  { from: 'customer' as const, text: 'ومعاها زجاجة مشروب غازي' },
  { from: 'employee' as const, text: 'تمام، الاجمالي 245 جنيه' },
]

const EXTRACTED_LINES = [
  { nameAr: 'كشري كبير', quantity: 2 },
  { nameAr: 'طاجن لحمة', quantity: 1 },
  { nameAr: 'مشروب غازي', quantity: 1 },
]

const EMPLOYEE_ENTERED_TOTAL = 245
const CONFIDENCE_SCORE = 93

type Stage = 'idle' | 'chat' | 'structured' | 'pricing' | 'validation'
const STAGE_ORDER: Stage[] = ['chat', 'structured', 'pricing', 'validation']
const STAGE_LABEL: Record<Stage, string> = {
  idle: '',
  chat: 'Chat',
  structured: 'Structured Order',
  pricing: 'Price Calculation',
  validation: 'Validation',
}

export function OrderAnalyzerDemo() {
  const [stage, setStage] = useState<Stage>('idle')

  const lines = EXTRACTED_LINES.map((line) => {
    const menuItem = findMenuItem(line.nameAr)!
    return { ...line, menuItem, lineTotal: menuItem.price * line.quantity }
  })
  const expectedTotal = lines.reduce((sum, line) => sum + line.lineTotal, 0)
  const difference = EMPLOYEE_ENTERED_TOTAL - expectedTotal

  const analyze = () => {
    setStage('chat')
    STAGE_ORDER.slice(1).forEach((nextStage, index) => {
      setTimeout(() => setStage(nextStage), (index + 1) * 550)
    })
  }

  const stageIndex = stage === 'idle' ? -1 : STAGE_ORDER.indexOf(stage)
  const showResult = stage === 'validation'

  return (
    <DemoPageShell slug="order-analyzer">
      <ProductFrame title="order-analyzer — chat intake" accent="teal">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-ink-dim">
              <MessageSquare className="h-3.5 w-3.5" /> Order chat
            </p>
            <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-surface p-4">
              {CHAT_MESSAGES.map((message, index) => (
                <div key={index} className={cn('flex', message.from === 'employee' ? 'justify-end' : 'justify-start')} dir="rtl">
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed',
                      message.from === 'employee' ? 'bg-accent text-on-accent' : 'bg-surface-2 text-ink',
                    )}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <Button
              className="mt-4 w-full"
              icon={<Sparkles className="h-4 w-4" />}
              onClick={analyze}
              disabled={stage !== 'idle' && stage !== 'validation'}
            >
              {stage === 'validation' ? 'Re-run Analysis' : 'Analyze Conversation'}
            </Button>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-ink-dim">
              <Bot className="h-3.5 w-3.5" /> AI pipeline
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {STAGE_ORDER.map((step, index) => (
                <div
                  key={step}
                  className={cn(
                    'flex items-center gap-1.5 rounded-[var(--radius-sm)] border px-3 py-1.5 text-[12px] font-medium transition-colors',
                    index <= stageIndex ? 'border-teal bg-teal-soft text-teal-ink' : 'border-border text-ink-dim',
                  )}
                >
                  {index < stageIndex || (index === stageIndex && showResult) ? <Check className="h-3 w-3" /> : null}
                  {STAGE_LABEL[step]}
                </div>
              ))}
            </div>

            {stage === 'idle' && (
              <div className="rounded-[var(--radius-md)] border border-dashed border-border p-6 text-center text-[13px] text-ink-dim">
                Click "Analyze Conversation" to run the pipeline.
              </div>
            )}

            {stage !== 'idle' && !showResult && (
              <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface p-6 text-[13px] text-ink-soft">
                <span className="h-2 w-2 animate-pulse rounded-full bg-teal" />
                Running {STAGE_LABEL[stage].toLowerCase()}…
              </div>
            )}

            {showResult && (
              <div className="flex flex-col gap-4 animate-fade-up">
                <div className="rounded-[var(--radius-md)] border border-border bg-surface">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-ink-dim">Item</th>
                        <th className="px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-ink-dim">Qty</th>
                        <th className="px-3 py-2 text-right font-mono text-[11px] uppercase tracking-wide text-ink-dim">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line) => (
                        <tr key={line.menuItem.id} className="border-b border-border last:border-none">
                          <td className="px-3 py-2 text-ink">{line.menuItem.name}</td>
                          <td className="px-3 py-2 text-ink-soft">{line.quantity}×</td>
                          <td className="px-3 py-2 text-right font-mono text-ink">{formatEGP(line.lineTotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex items-center justify-between border-t border-border px-3.5 py-2.5">
                    <span className="text-[13px] font-medium text-ink">Expected Total</span>
                    <span className="font-mono text-[14px] font-semibold text-ink">{formatEGP(expectedTotal)}</span>
                  </div>
                </div>

                <div
                  className={cn(
                    'rounded-[var(--radius-md)] border p-4',
                    difference === 0 ? 'border-success/40 bg-success-soft' : 'border-warning/40 bg-warning-soft',
                  )}
                >
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-ink-soft">Employee Entered Total</span>
                    <span className="font-mono font-semibold text-ink">{formatEGP(EMPLOYEE_ENTERED_TOTAL)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[13px]">
                    <span className="text-ink-soft">Difference</span>
                    <span className={cn('font-mono font-semibold', difference === 0 ? 'text-success' : 'text-warning')}>
                      {difference > 0 ? '+' : ''}
                      {formatEGP(difference)}
                    </span>
                  </div>
                </div>

                <Badge tone="teal" className="w-fit">
                  AI Confidence — {CONFIDENCE_SCORE}%
                </Badge>
              </div>
            )}
          </div>
        </div>
      </ProductFrame>
    </DemoPageShell>
  )
}
