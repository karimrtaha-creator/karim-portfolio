import { useState } from 'react'
import { Pause, Play, Volume2 } from 'lucide-react'
import { DemoPageShell } from '@/components/layout/DemoPageShell'
import { ProductFrame } from '@/components/ui/ProductFrame'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useInterval } from '@/hooks/useInterval'
import { formatClock } from '@/lib/format'
import { playAlertBeep } from './beep'
import { INITIAL_PAGES, type WatcherEvent, type WatchedPage } from './data'
import { cn } from '@/lib/cn'

function formatSeconds(total: number): string {
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function WebWatcherDemo() {
  const { push } = useToast()
  const [pages, setPages] = useState<WatchedPage[]>(INITIAL_PAGES)
  const [events, setEvents] = useState<WatcherEvent[]>([])

  // Reads `pages` from this render's closure (useInterval always calls the latest
  // callback) and computes the new list plus any breach events up front, then
  // calls each setState exactly once — never nested inside another updater.
  useInterval(() => {
    const breaches: WatcherEvent[] = []

    const nextPages = pages.map((page) => {
      if (!page.monitoring) return page
      const delta = Math.floor(Math.random() * 3) - 1
      const waiting = Math.max(0, page.waiting + delta)
      const longestWaitingSeconds = waiting > 0 ? page.longestWaitingSeconds + Math.floor(Math.random() * 8) : 0
      const answered = page.answered + (delta < 0 ? 1 : 0)

      if (waiting > page.threshold && page.waiting <= page.threshold) {
        breaches.push({
          at: formatClock(new Date()),
          page: page.name,
          message: `Waiting calls exceeded threshold (${waiting} > ${page.threshold})`,
        })
      }

      return { ...page, waiting, longestWaitingSeconds, answered }
    })

    setPages(nextPages)

    for (const breach of breaches) {
      playAlertBeep()
      push({
        title: 'Threshold exceeded',
        description: `${breach.page}: ${breach.message}`,
        tone: 'warning',
      })
    }
    if (breaches.length > 0) {
      setEvents((currentEvents) => [...breaches, ...currentEvents].slice(0, 20))
    }
  }, 2200)

  const toggleMonitoring = (id: string) => {
    setPages((current) => current.map((page) => (page.id === id ? { ...page, monitoring: !page.monitoring } : page)))
  }

  return (
    <DemoPageShell slug="web-watcher">
      <ProductFrame title="web-watcher — operational alerts" accent="violet">
        <div className="mb-4 flex items-center gap-2 text-[12.5px] text-ink-dim">
          <Volume2 className="h-3.5 w-3.5" />
          Monitored pages update every couple of seconds. Crossing the threshold triggers an audio + toast alert.
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-3">
            {pages.map((page) => {
              const breached = page.waiting > page.threshold
              return (
                <div
                  key={page.id}
                  className={cn(
                    'rounded-[var(--radius-md)] border bg-surface p-4',
                    breached && page.monitoring ? 'border-danger/50 bg-danger-soft' : 'border-border',
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={cn('h-2 w-2 rounded-full', page.monitoring ? 'bg-success animate-pulse' : 'bg-ink-faint')} />
                      <span className="text-[13.5px] font-medium text-ink">{page.name}</span>
                      {breached && page.monitoring && <Badge tone="danger">Threshold Exceeded</Badge>}
                    </div>
                    <Button
                      size="sm"
                      variant={page.monitoring ? 'secondary' : 'primary'}
                      icon={page.monitoring ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      onClick={() => toggleMonitoring(page.id)}
                    >
                      {page.monitoring ? 'Stop' : 'Start'}
                    </Button>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className={cn('font-mono text-lg font-semibold', breached && page.monitoring ? 'text-danger' : 'text-ink')}>
                        {page.waiting}
                      </p>
                      <p className="text-[10.5px] uppercase tracking-wide text-ink-dim">Waiting</p>
                    </div>
                    <div>
                      <p className="font-mono text-lg font-semibold text-ink">{page.answered}</p>
                      <p className="text-[10.5px] uppercase tracking-wide text-ink-dim">Answered</p>
                    </div>
                    <div>
                      <p className="font-mono text-lg font-semibold text-ink">{formatSeconds(page.longestWaitingSeconds)}</p>
                      <p className="text-[10.5px] uppercase tracking-wide text-ink-dim">Longest Wait</p>
                    </div>
                  </div>
                  <p className="mt-2 text-center text-[11px] text-ink-dim">Threshold: {page.threshold} waiting calls</p>
                </div>
              )
            })}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink">Event history</h3>
            <div className="flex max-h-96 flex-col overflow-y-auto rounded-[var(--radius-md)] border border-border bg-surface">
              {events.length === 0 && <p className="p-4 text-center text-[13px] text-ink-dim">No alerts yet — leave a page monitoring and wait.</p>}
              {events.map((event, index) => (
                <div key={index} className="border-b border-border px-3.5 py-2.5 text-[12.5px] last:border-none">
                  <p className="font-mono text-[11px] text-ink-dim">{event.at} · {event.page}</p>
                  <p className="text-ink-soft">{event.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ProductFrame>
    </DemoPageShell>
  )
}
