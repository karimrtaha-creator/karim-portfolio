import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, Clipboard, Copy, Download, Eye, Pencil, RotateCcw, Star, Trash2 } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useProjectDraftStore } from '@/hooks/useProjectDraftStore'
import { copyProjectsToClipboard, downloadProjectsFile } from '@/lib/exportProjects'
import type { Project } from '@/data/types'

const STATUS_TONE: Record<Project['status'], 'success' | 'blue' | 'neutral'> = {
  completed: 'success',
  'in-progress': 'blue',
  archived: 'neutral',
}

export function ProjectList() {
  const { projects, remove, duplicate, reorder, setFeatured, setVisibility, resetFromSource, hasUnsavedChanges } =
    useProjectDraftStore()
  const { push } = useToast()

  const onDelete = (project: Project) => {
    if (!window.confirm(`Delete "${project.title}"? This can't be undone within this draft session.`)) return
    remove(project.id)
    push({ title: 'Project deleted', description: project.title, tone: 'warning' })
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Projects</h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            {hasUnsavedChanges ? 'You have unexported local changes.' : 'In sync with the committed source file.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/projects/new">
            <Button size="sm">New Project</Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 rounded-[var(--radius-md)] border border-border bg-surface-2 p-4">
        <p className="mb-3 text-[13px] text-ink-soft">
          This list only lives in your browser until you export it. Publishing means: export → paste over{' '}
          <code className="font-mono text-[12px] text-ink">src/data/projects.ts</code> → commit → deploy.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={<Download className="h-3.5 w-3.5" />}
            onClick={() => downloadProjectsFile(projects)}
          >
            Download projects.ts
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={<Clipboard className="h-3.5 w-3.5" />}
            onClick={async () => {
              await copyProjectsToClipboard(projects)
              push({ title: 'Copied', description: 'projects.ts source copied to clipboard', tone: 'success' })
            }}
          >
            Copy to Clipboard
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon={<RotateCcw className="h-3.5 w-3.5" />}
            onClick={() => {
              if (!window.confirm('Discard local drafts and reload from the committed source file?')) return
              resetFromSource()
              push({ title: 'Reloaded from source', tone: 'info' })
            }}
          >
            Reset from Source
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {projects.map((project, index) => (
          <div key={project.id} className="flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-4">
            <div className="flex shrink-0 flex-col gap-1">
              <button
                onClick={() => reorder(project.id, 'up')}
                disabled={index === 0}
                className="rounded-[var(--radius-sm)] border border-border p-1 text-ink-dim transition-colors hover:text-ink disabled:opacity-30"
                aria-label={`Move ${project.title} up`}
              >
                <ArrowUp className="h-3 w-3" />
              </button>
              <button
                onClick={() => reorder(project.id, 'down')}
                disabled={index === projects.length - 1}
                className="rounded-[var(--radius-sm)] border border-border p-1 text-ink-dim transition-colors hover:text-ink disabled:opacity-30"
                aria-label={`Move ${project.title} down`}
              >
                <ArrowDown className="h-3 w-3" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[14px] font-medium text-ink">{project.title}</span>
                <Badge tone={STATUS_TONE[project.status]}>{project.status}</Badge>
                <Badge tone={project.visibility === 'published' ? 'success' : 'neutral'} dot>
                  {project.visibility}
                </Badge>
                {project.featured && <Badge tone="amber">Featured</Badge>}
              </div>
              <p className="mt-1 truncate text-[12.5px] text-ink-dim">{project.category || 'No category set'}</p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                size="sm"
                variant="ghost"
                icon={<Star className="h-3.5 w-3.5" />}
                onClick={() => setFeatured(project.id, !project.featured)}
              >
                {project.featured ? 'Unfeature' : 'Feature'}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setVisibility(project.id, project.visibility === 'published' ? 'draft' : 'published')}
              >
                {project.visibility === 'published' ? 'Unpublish' : 'Publish'}
              </Button>
              <Link to={`/admin/projects/${project.id}/preview`}>
                <Button size="sm" variant="ghost" icon={<Eye className="h-3.5 w-3.5" />}>
                  Preview
                </Button>
              </Link>
              <Link to={`/admin/projects/${project.id}/edit`}>
                <Button size="sm" variant="ghost" icon={<Pencil className="h-3.5 w-3.5" />}>
                  Edit
                </Button>
              </Link>
              <Button size="sm" variant="ghost" icon={<Copy className="h-3.5 w-3.5" />} onClick={() => duplicate(project.id)}>
                Duplicate
              </Button>
              <Button size="sm" variant="ghost" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => onDelete(project)}>
                Delete
              </Button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="rounded-[var(--radius-md)] border border-dashed border-border p-10 text-center text-[13px] text-ink-dim">
            No projects yet.
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
