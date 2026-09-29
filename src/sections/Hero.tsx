import { useEffect, useState } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { usePublishedProjects } from '@/hooks/usePublishedProjects'
import { useProfilePhoto } from '@/hooks/useProfilePhoto'

const PULSE_ITEMS = [
  { label: 'SYSTEM STATUS', value: 'ONLINE', tone: 'success' as const },
  { label: 'AUTOMATION', value: 'ACTIVE', tone: 'success' as const },
  { label: 'AI', value: 'READY', tone: 'blue' as const },
]

export function Hero() {
  const [tick, setTick] = useState(0)
  const { projects } = usePublishedProjects()
  const { photoUrl } = useProfilePhoto()
  const shippedCount = projects.length

  useEffect(() => {
    const id = setInterval(() => setTick((current) => current + 1), 2400)
    return () => clearInterval(id)
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <header id="home" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[1.15fr_0.85fr] md:gap-8 md:px-8 md:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-1.5 font-mono text-[12px] text-ink-soft">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Available for new projects
          </div>

          <div className="flex items-center gap-3">
            {photoUrl && (
              <img
                src={photoUrl}
                alt="Karim"
                className="h-11 w-11 rounded-full border border-border object-cover"
              />
            )}
            <div>
              <p className="font-mono text-sm font-medium text-accent">Karim</p>
              <p className="mt-1 font-mono text-[13px] uppercase tracking-[0.1em] text-ink-dim">
                Software Developer · Automation · AI · Systems
              </p>
            </div>
          </div>

          <h1 className="mt-5 max-w-xl font-display text-[2.3rem] font-bold leading-[1.12] tracking-tight text-ink md:text-[3.1rem]">
            From manual workflows to <span className="text-accent">intelligent software.</span>
          </h1>

          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-ink-soft">
            I build business automation, AI-powered tools, browser extensions, real-time monitoring systems,
            internal management platforms, and delivery &amp; operations systems — software that replaces manual,
            repetitive work with something that runs on its own.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => scrollTo('work')}
              className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-accent bg-accent px-5 py-3 text-[14px] font-medium text-on-accent transition-colors hover:bg-accent-strong"
            >
              Explore My Work
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-border px-5 py-3 text-[14px] font-medium text-ink transition-colors hover:border-ink-dim"
            >
              Let's Work Together
              <Mail className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-start justify-center md:justify-end">
          <div className="w-full max-w-[300px] rounded-[var(--radius-lg)] border border-border bg-surface p-1 shadow-token-lg">
            <div className="flex items-center gap-1.5 border-b border-border px-3 py-2.5">
              <span className="h-2 w-2 rounded-full bg-danger/60" />
              <span className="h-2 w-2 rounded-full bg-warning/60" />
              <span className="h-2 w-2 rounded-full bg-success/60" />
              <span className="ml-2 font-mono text-[11px] text-ink-dim">system.status</span>
            </div>
            <div className="flex flex-col gap-3 p-4">
              {PULSE_ITEMS.map((item, index) => (
                <div key={item.label} className="flex items-center justify-between border-b border-border/70 pb-3 last:border-none last:pb-0">
                  <span className="font-mono text-[11px] uppercase tracking-wide text-ink-dim">{item.label}</span>
                  <span
                    key={tick + index}
                    className="inline-flex items-center gap-1.5 font-mono text-[12px] font-semibold text-success animate-fade-up"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {item.value}
                  </span>
                </div>
              ))}
              <div className="mt-1 rounded-[var(--radius-sm)] bg-surface-2 px-3 py-2 font-mono text-[10.5px] leading-relaxed text-ink-dim">
                {shippedCount} systems shipped · 0 client identities exposed
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
