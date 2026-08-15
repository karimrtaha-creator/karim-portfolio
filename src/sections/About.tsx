import { Bot, GitBranch, LayoutDashboard, PlugZap, ShieldCheck, Truck } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const FOCUS_AREAS = [
  { icon: PlugZap, label: 'Internal tools & workflow automation' },
  { icon: Bot, label: 'Browser extensions & AI-assisted operations' },
  { icon: LayoutDashboard, label: 'Real-time dashboards & monitoring' },
  { icon: ShieldCheck, label: 'Role-based management systems' },
  { icon: Truck, label: 'Delivery & order management platforms' },
  { icon: GitBranch, label: 'Alerting & operational visibility' },
]

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHeading eyebrow="B1 · About" title="I build software around real operational problems." />
      <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
        <ScrollReveal>
          <p className="text-[17px] leading-relaxed text-ink-soft">
            Reducing repetitive work, improving visibility, automating decisions, and giving teams tools that fit
            the way they already work — that's the throughline across everything below. Most of it started the
            same way: a manual process that was slow, error-prone, or invisible until something went wrong, turned
            into software that runs on its own and tells you when it needs attention.
          </p>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
            The systems on this page are real, in-production tools — showcased here through fictional, sanitized
            demos so the underlying capability is visible without exposing any client's actual data.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FOCUS_AREAS.map((area) => (
              <li
                key={area.label}
                className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-4"
              >
                <area.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <span className="text-[14px] leading-snug text-ink">{area.label}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  )
}
