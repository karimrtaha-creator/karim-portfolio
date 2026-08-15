import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const GROUPS: { title: string; items: string[] }[] = [
  { title: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'Vite', 'HTML / CSS', 'Recharts'] },
  { title: 'Backend & Automation', items: ['Python', 'Flask', 'REST APIs', 'Google Apps Script', 'Chrome Extensions (Manifest V3)'] },
  { title: 'Data & Realtime', items: ['PostgreSQL', 'Supabase', 'Realtime Subscriptions', 'Row-Level Security'] },
  { title: 'Mobile & Extensions', items: ['Flutter', 'Firebase Cloud Messaging', 'PWA'] },
  { title: 'AI', items: ['Local LLM (Ollama)', 'AI-Assisted Automation', 'Structured Extraction'] },
]

export function TechStack() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHeading eyebrow="D1 · Skills" title="Technology, applied only where it's actually used." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((group, index) => (
          <ScrollReveal key={group.title} delay={index * 60}>
            <div className="h-full rounded-[var(--radius-md)] border border-border bg-surface p-5">
              <h3 className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-dim">{group.title}</h3>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-[var(--radius-sm)] border border-border bg-surface-2 px-2.5 py-1 text-[13px] text-ink"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
