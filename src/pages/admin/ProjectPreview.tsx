import { Link, Navigate, useParams } from 'react-router-dom'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProjectCard } from '@/components/ProjectCard'
import { useProjectDraftStore } from '@/hooks/useProjectDraftStore'
import { accentClasses } from '@/lib/accent'

export function ProjectPreview() {
  const { id } = useParams<{ id: string }>()
  const { getById } = useProjectDraftStore()
  const project = id ? getById(id) : undefined

  if (!project) return <Navigate to="/admin/projects" replace />

  const classes = accentClasses(project.accent)

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Preview — {project.title}</h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            Rendered with the exact same <code className="font-mono text-[12px]">ProjectCard</code> component the public
            gallery uses — no separate preview styling to drift out of sync.
          </p>
        </div>
        <Link to={`/admin/projects/${project.id}/edit`}>
          <Button variant="secondary">Back to Edit</Button>
        </Link>
      </div>

      <div className="mb-10">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-dim">Gallery card</p>
        <div className="max-w-xl">
          <ProjectCard project={project} featured={project.featured} />
        </div>
      </div>

      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-dim">Case study content</p>
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`font-mono text-xs ${classes.text}`}>{project.number}</span>
            <Badge tone="neutral">{project.category}</Badge>
            {project.statusBadge && <Badge tone="success">{project.statusBadge}</Badge>}
          </div>
          <h2 className="font-display text-2xl font-bold text-ink">{project.title}</h2>
          <p className="mt-2 max-w-2xl text-[14px] text-ink-soft">{project.description}</p>

          <div className="mt-6 flex flex-col gap-5">
            {[
              { title: 'Problem', body: project.caseStudy.problem },
              { title: 'Solution', body: project.caseStudy.solution },
              { title: 'Key Features', body: project.caseStudy.keyFeatures },
              { title: 'Technical Architecture', body: project.caseStudy.architecture },
              { title: 'My Contribution', body: project.caseStudy.contribution },
              { title: 'Challenges', body: project.caseStudy.challenges },
              { title: 'Result', body: project.caseStudy.result },
            ].map((block) => (
              <div key={block.title}>
                <p className="mb-1.5 font-mono text-[11px] uppercase tracking-wide text-amber">{block.title}</p>
                {Array.isArray(block.body) ? (
                  <ul className="list-inside list-disc text-[13.5px] text-ink">
                    {block.body.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[13.5px] text-ink">{block.body || <span className="text-ink-faint">Not filled in yet</span>}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {project.visibility !== 'published' && (
        <p className="mt-6 text-center text-[12.5px] text-ink-dim">
          This project is a <span className="font-medium text-ink-soft">draft</span> — it will not appear on the public
          site until you publish and export it.
        </p>
      )}
    </AdminLayout>
  )
}
