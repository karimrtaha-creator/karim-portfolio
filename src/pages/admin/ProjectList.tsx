import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, Copy, Eye, Loader2, Pencil, Star, Trash2, Upload } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useProjectDraftStore } from '@/hooks/useProjectDraftStore'
import { useProfilePhoto } from '@/hooks/useProfilePhoto'
import { uploadProfilePhoto } from '@/lib/uploadAsset'
import { updateProfilePhotoUrl } from '@/lib/siteSettingsApi'
import type { Project } from '@/data/types'

const STATUS_TONE: Record<Project['status'], 'success' | 'blue' | 'neutral'> = {
  completed: 'success',
  'in-progress': 'blue',
  archived: 'neutral',
}

function ProfilePhotoCard() {
  const { photoUrl } = useProfilePhoto()
  const { push } = useToast()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    try {
      const url = await uploadProfilePhoto(file)
      await updateProfilePhotoUrl(url)
      push({ title: 'Profile photo updated', description: 'Live on the site now.', tone: 'success' })
    } catch (error) {
      push({ title: 'Upload failed', description: error instanceof Error ? error.message : 'Unknown error', tone: 'warning' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mb-6 flex items-center gap-4 rounded-[var(--radius-md)] border border-border bg-surface-2 p-4">
      <label className="relative flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-border text-ink-faint hover:border-ink-dim">
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
        ) : previewUrl || photoUrl ? (
          <img src={previewUrl ?? photoUrl ?? undefined} alt="" className="h-full w-full object-cover" />
        ) : (
          <Upload className="h-5 w-5" />
        )}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void handleFile(file)
          }}
        />
      </label>
      <div>
        <p className="text-[13.5px] font-medium text-ink">Profile Photo</p>
        <p className="mt-0.5 text-[12.5px] text-ink-soft">Shown next to your name in the hero. Click the circle to replace it — goes live immediately.</p>
      </div>
    </div>
  )
}

export function ProjectList() {
  const { projects, loading, error, remove, duplicate, reorder, setFeatured, setVisibility } = useProjectDraftStore()
  const { push } = useToast()

  const onError = (error: unknown) => {
    push({ title: 'Action failed', description: error instanceof Error ? error.message : 'Unknown error', tone: 'warning' })
  }

  const onDelete = async (project: Project) => {
    if (!window.confirm(`Delete "${project.title}"? This can't be undone.`)) return
    try {
      await remove(project.id)
      push({ title: 'Project deleted', description: project.title, tone: 'warning' })
    } catch (error) {
      onError(error)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Projects</h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            Changes save automatically — no code edits or deployments needed. Toggle Publish to control what's live.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/projects/new">
            <Button size="sm">New Project</Button>
          </Link>
        </div>
      </div>

      <ProfilePhotoCard />

      {error && (
        <div className="mb-6 rounded-[var(--radius-md)] border border-danger/40 bg-danger-soft p-4 text-[13px] text-danger">
          Couldn't load projects: {error}. If this is a fresh setup, make sure the migrations in{' '}
          <code className="font-mono text-[12px]">supabase/migrations/</code> have been applied to your Supabase project.
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center text-[13px] text-ink-dim">Loading…</div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {projects.map((project, index) => (
            <div key={project.id} className="flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-4">
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  onClick={() => reorder(project.id, 'up').catch(onError)}
                  disabled={index === 0}
                  className="rounded-[var(--radius-sm)] border border-border p-1 text-ink-dim transition-colors hover:text-ink disabled:opacity-30"
                  aria-label={`Move ${project.title} up`}
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  onClick={() => reorder(project.id, 'down').catch(onError)}
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
                  onClick={() => setFeatured(project.id, !project.featured).catch(onError)}
                >
                  {project.featured ? 'Unfeature' : 'Feature'}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setVisibility(project.id, project.visibility === 'published' ? 'draft' : 'published').catch(onError)}
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
                <Button size="sm" variant="ghost" icon={<Copy className="h-3.5 w-3.5" />} onClick={() => duplicate(project.id).catch(onError)}>
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
      )}
    </AdminLayout>
  )
}
