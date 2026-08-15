import { Bell, Cog, Database, Globe, User, Zap } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/cn'

const NODES = [
  { icon: User, label: 'User' },
  { icon: Globe, label: 'Web / Extension' },
  { icon: Cog, label: 'Application Logic' },
  { icon: Database, label: 'Database / API' },
  { icon: Zap, label: 'Automation' },
  { icon: Bell, label: 'Notifications / AI' },
]

export function Architecture() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25)

  return (
    <section id="systems" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHeading
        eyebrow="C1 · Systems"
        title="How I build systems."
        description="The same core pipeline underlies every project on this page, whether it's a browser extension, a management platform, or a delivery system."
      />

      <div
        ref={ref}
        className="flex flex-col items-stretch gap-0 rounded-[var(--radius-lg)] border border-border bg-surface p-6 md:flex-row md:items-center md:p-10"
      >
        {NODES.map((node, index) => (
          <div key={node.label} className="flex flex-1 flex-col items-stretch md:flex-row md:items-center">
            <div className="flex flex-col items-center gap-2 py-3 md:py-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent-soft text-accent">
                <node.icon className="h-5 w-5" aria-hidden />
              </div>
              <span className="text-center font-mono text-[11px] uppercase tracking-wide text-ink-soft">{node.label}</span>
            </div>

            {index < NODES.length - 1 && (
              <div
                className="mx-auto h-8 w-px overflow-hidden bg-border md:mx-3 md:h-px md:w-full md:min-w-6"
                aria-hidden
              >
                <div
                  className={cn(
                    'h-full w-full origin-top bg-accent transition-transform duration-700 ease-out md:origin-left',
                    inView ? 'scale-y-100 md:scale-x-100' : 'scale-y-0 md:scale-x-0',
                  )}
                  style={{ transitionDelay: `${index * 120}ms` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
