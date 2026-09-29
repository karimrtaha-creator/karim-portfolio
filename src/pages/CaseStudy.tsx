import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { usePublishedProject } from '@/hooks/usePublishedProjects'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { accentClasses } from '@/lib/accent'

export function CaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const { project, loading } = usePublishedProject(slug)

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center text-[13px] text-ink-dim">Loading…</div>
  if (!project) return <Navigate to="/" replace />

  const classes = accentClasses(project.accent)

  const blocks: { title: string; body: string | string[] }[] = [
    { title: '01 — Problem', body: project.caseStudy.problem },
    { title: '02 — Solution', body: project.caseStudy.solution },
    { title: '03 — Key Features', body: project.caseStudy.keyFeatures },
    { title: '04 — Technical Architecture', body: project.caseStudy.architecture },
    { title: '05 — My Contribution', body: project.caseStudy.contribution },
    { title: '06 — Challenges', body: project.caseStudy.challenges },
    { title: '07 — Result', body: project.caseStudy.result },
  ]

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-14">
      <Link to="/#work" className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-ink-dim transition-colors hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to work
      </Link>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`font-mono text-xs ${classes.text}`}>{project.number}</span>
        <Badge tone="neutral">{project.category}</Badge>
        {project.statusBadge && <Badge tone="success">{project.statusBadge}</Badge>}
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">{project.title}</h1>
      <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-soft">{project.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span key={tech} className="rounded-[var(--radius-sm)] border border-border bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-ink-soft">
            {tech}
          </span>
        ))}
      </div>

      {project.demoPath && (
        <Link to={project.demoPath} className="mt-6 inline-block">
          <Button icon={<ArrowUpRight className="h-4 w-4" />}>Explore Interactive Demo</Button>
        </Link>
      )}

      <div className="mt-12 flex flex-col gap-10 border-t border-border pt-10">
        {blocks.map((block) => (
          <section key={block.title}>
            <h2 className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.12em] text-amber">{block.title}</h2>
            {Array.isArray(block.body) ? (
              <ul className="flex flex-col gap-2">
                {block.body.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-ink">
                    <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${classes.solidBg}`} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[15px] leading-relaxed text-ink">{block.body}</p>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
