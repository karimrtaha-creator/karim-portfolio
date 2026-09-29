import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import { usePublishedProject } from '@/hooks/usePublishedProjects'
import { Badge } from '@/components/ui/Badge'
import { accentClasses } from '@/lib/accent'

export function DemoPageShell({ slug, children }: { slug: string; children: ReactNode }) {
  const { project, loading } = usePublishedProject(slug)
  if (loading) return null
  if (!project) return null
  const classes = accentClasses(project.accent)

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
      <Link
        to="/#work"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-ink-dim transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to work
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className={`font-mono text-xs ${classes.text}`}>{project.number}</span>
            <Badge tone="neutral">{project.category}</Badge>
            {project.statusBadge && <Badge tone="success">{project.statusBadge}</Badge>}
          </div>
          <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">{project.title}</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">{project.description}</p>
        </div>
        <Link
          to={`/work/${project.slug}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] border border-border px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:border-ink-dim"
        >
          <FileText className="h-3.5 w-3.5" />
          View Case Study
        </Link>
      </div>

      {children}
    </div>
  )
}
