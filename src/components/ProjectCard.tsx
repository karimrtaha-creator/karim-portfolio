import { Link } from 'react-router-dom'
import { ArrowUpRight, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { accentClasses } from '@/lib/accent'
import type { Project } from '@/data/types'
import { cn } from '@/lib/cn'

/** Shared between the public project gallery and the admin preview screen —
 *  there is exactly one place project cards are rendered from. */
export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const classes = accentClasses(project.accent)
  const demoHref = project.demoType === 'internal' ? project.demoPath : project.demoType === 'external' ? project.demoUrl : undefined

  return (
    <Card
      hover
      className={cn(
        'flex flex-col p-6',
        featured && 'md:p-8 border-accent/40 shadow-token-lg',
      )}
    >
      {featured && (
        <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">Featured Project</p>
      )}
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className={cn('font-mono text-xs', classes.text)}>{project.number}</span>
        {project.statusBadge && <Badge tone="success">{project.statusBadge}</Badge>}
      </div>

      <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-dim">{project.category}</p>
      <h3 className={cn('font-semibold text-ink', featured ? 'text-2xl' : 'text-lg')}>{project.title}</h3>
      <p className={cn('mt-3 text-ink-soft', featured ? 'text-[15px] leading-relaxed' : 'text-[14px] leading-relaxed')}>
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Badge key={tag} tone={project.accent}>
            {tag}
          </Badge>
        ))}
      </div>

      <ul className={cn('mt-4 flex flex-col gap-1.5', !featured && 'hidden md:flex')}>
        {(featured ? project.capabilities : project.capabilities.slice(0, 3)).map((capability) => (
          <li key={capability} className="flex gap-2 text-[13px] text-ink-soft">
            <span className={cn('mt-1.5 h-1 w-1 shrink-0 rounded-full', classes.dot)} aria-hidden />
            {capability}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tech.map((tech) => (
          <span key={tech} className="rounded-[var(--radius-sm)] border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10.5px] text-ink-dim">
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5 pt-2">
        {demoHref && project.demoType === 'internal' && (
          <Link
            to={demoHref}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3.5 py-2 text-[13px] font-medium text-on-accent transition-opacity hover:opacity-90',
              classes.solidBg,
            )}
          >
            {featured ? 'Open Interactive Demo' : 'Explore Demo'}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
        {demoHref && project.demoType === 'external' && (
          <a
            href={demoHref}
            target="_blank"
            rel="noreferrer"
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3.5 py-2 text-[13px] font-medium text-on-accent transition-opacity hover:opacity-90',
              classes.solidBg,
            )}
          >
            {featured ? 'Open Interactive Demo' : 'Explore Demo'}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
        <Link
          to={`/work/${project.slug}`}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:border-ink-dim"
        >
          <FileText className="h-3.5 w-3.5" />
          Case Study
        </Link>
      </div>
    </Card>
  )
}
