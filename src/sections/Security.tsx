import {
  Activity,
  Fingerprint,
  Gauge,
  KeyRound,
  ListChecks,
  Lock,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const PRACTICES = [
  { icon: Fingerprint, title: 'Authentication', body: 'Account-based access with session handling appropriate to each platform.' },
  { icon: KeyRound, title: 'Authorization', body: 'Role-based permission checks enforced on every protected action.' },
  { icon: ShieldCheck, title: 'Role-Based Access', body: 'Each role sees exactly the data and controls it needs — nothing more.' },
  { icon: ListChecks, title: 'Input Validation', body: 'Server-side validation on every write path, not just client-side hints.' },
  { icon: Gauge, title: 'Rate Limiting', body: 'Sensitive endpoints throttled to blunt abuse and brute-force attempts.' },
  { icon: ScrollText, title: 'Audit Logging', body: 'Administrative and state-changing actions recorded with actor and timestamp.' },
  { icon: Lock, title: 'Data Isolation', body: 'Access boundaries enforced at the data layer, not just hidden in the UI.' },
  { icon: ShieldAlert, title: 'Error Handling', body: 'Failures degrade safely and surface actionable feedback, not raw internals.' },
  { icon: Activity, title: 'Monitoring', body: 'Operational conditions tracked so issues surface before they escalate.' },
]

export function Security() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHeading
        eyebrow="E1 · Engineering"
        title="Production engineering, not just prototypes."
        description="Every system on this page is built with these practices in mind — implementation details stay private, but the discipline is consistent."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRACTICES.map((practice, index) => (
          <ScrollReveal key={practice.title} delay={index * 40}>
            <div className="h-full rounded-[var(--radius-md)] border border-border bg-surface p-5">
              <practice.icon className="mb-3 h-5 w-5 text-accent" aria-hidden />
              <h3 className="mb-1.5 text-[15px] font-semibold text-ink">{practice.title}</h3>
              <p className="text-[13.5px] leading-relaxed text-ink-soft">{practice.body}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
