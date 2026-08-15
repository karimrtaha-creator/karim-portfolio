import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FileCode2, Loader2, Upload } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useProjectDraftStore } from '@/hooks/useProjectDraftStore'
import { uploadProjectAsset, uploadProjectDemo, type AssetKind } from '@/lib/uploadAsset'
import type { AccentColor, CaseStudy, DemoType, Project, ProjectStatus } from '@/data/types'

const ACCENTS: AccentColor[] = ['accent', 'amber', 'violet', 'blue', 'rose', 'teal']
const STATUSES: ProjectStatus[] = ['completed', 'in-progress', 'archived']
const DEMO_TYPES: DemoType[] = ['none', 'internal', 'external']

const EMPTY_CASE_STUDY: CaseStudy = {
  problem: '',
  solution: '',
  keyFeatures: [],
  architecture: '',
  contribution: '',
  challenges: '',
  result: '',
}

function toLines(value: string[] | undefined): string {
  return (value ?? []).join('\n')
}
function fromLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-medium text-ink-soft">{label}</span>
      {children}
      {hint && <span className="text-[11.5px] text-ink-faint">{hint}</span>}
    </label>
  )
}

const inputClass =
  'w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none'
const textareaClass = `${inputClass} min-h-24 resize-y`

function ImagePathField({
  label,
  value,
  onChange,
  slug,
  kind,
}: {
  label: string
  value: string | undefined
  onChange: (v: string) => void
  slug: string
  kind: AssetKind
}) {
  const { push } = useToast()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    try {
      const url = await uploadProjectAsset(file, slug, kind)
      onChange(url)
      push({ title: 'Uploaded', description: label, tone: 'success' })
    } catch (error) {
      push({ title: 'Upload failed', description: error instanceof Error ? error.message : 'Unknown error', tone: 'warning' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Field label={label} hint="Uploads to Supabase Storage and fills this field with the public URL automatically.">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Uploaded image URL will appear here"
          className={inputClass}
        />
        <label className="relative flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[var(--radius-sm)] border border-dashed border-border text-ink-faint hover:border-ink-dim">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
          ) : previewUrl || value ? (
            <img src={previewUrl ?? value} alt="" className="h-full w-full object-cover" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
        </label>
      </div>
    </Field>
  )
}

function UploadDemoField({ slug, onUploaded }: { slug: string; onUploaded: (url: string) => void }) {
  const { push } = useToast()
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setFileName(file.name)
    setUploading(true)
    try {
      const url = await uploadProjectDemo(file, slug)
      onUploaded(url)
      push({ title: 'Demo uploaded', description: 'Live Website URL was filled in automatically.', tone: 'success' })
    } catch (error) {
      push({ title: 'Upload failed', description: error instanceof Error ? error.message : 'Unknown error', tone: 'warning' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Field label="Upload Demo (HTML file)" hint="Uploads a standalone .html file to its own storage location and fills Live Website URL with the public link.">
      <label
        className={`flex w-full cursor-pointer items-center gap-2.5 rounded-[var(--radius-sm)] border border-dashed px-3 py-2 text-[13px] transition-colors ${
          uploading ? 'border-border text-ink-faint' : 'border-border text-ink-soft hover:border-ink-dim'
        }`}
      >
        {uploading ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent" /> : <FileCode2 className="h-4 w-4 shrink-0" />}
        <span className="truncate">{uploading ? 'Uploading…' : fileName ? fileName : 'Choose an .html file'}</span>
        <input
          type="file"
          accept=".html,.htm,text/html"
          className="hidden"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
      </label>
    </Field>
  )
}

export function ProjectForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { push } = useToast()
  const { getById, create, update } = useProjectDraftStore()
  const existing = id ? getById(id) : undefined

  const [draft, setDraft] = useState<Partial<Project>>(
    existing ?? {
      title: '',
      slug: '',
      number: '',
      category: '',
      description: '',
      accent: 'accent',
      tags: [],
      capabilities: [],
      tech: [],
      status: 'in-progress',
      demoType: 'none',
      caseStudy: EMPTY_CASE_STUDY,
    },
  )

  const set = <K extends keyof Project>(key: K, value: Project[K]) => setDraft((current) => ({ ...current, [key]: value }))
  const setCaseStudy = <K extends keyof CaseStudy>(key: K, value: CaseStudy[K]) =>
    setDraft((current) => ({ ...current, caseStudy: { ...(current.caseStudy ?? EMPTY_CASE_STUDY), [key]: value } }))

  const save = () => {
    if (!draft.title?.trim() || !draft.slug?.trim() || !draft.category?.trim() || !draft.description?.trim()) {
      push({ title: 'Missing required fields', description: 'Name, slug, category, and description are required.', tone: 'warning' })
      return
    }
    if (existing) {
      update(existing.id, draft)
      push({ title: 'Saved', description: draft.title, tone: 'success' })
    } else {
      const created = create(draft)
      push({ title: 'Draft created', description: created.title, tone: 'success' })
      navigate(`/admin/projects/${created.id}/edit`, { replace: true })
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">{existing ? 'Edit Project' : 'New Project'}</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/admin/projects')}>
            Cancel
          </Button>
          <Button onClick={save}>{existing ? 'Save Changes' : 'Create Draft'}</Button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <section className="grid gap-4 sm:grid-cols-2">
          <Field label="Project Name *">
            <input className={inputClass} value={draft.title ?? ''} onChange={(e) => set('title', e.target.value)} />
          </Field>
          <Field label="Slug *" hint="Used in the URL — letters, numbers, hyphens.">
            <input className={inputClass} value={draft.slug ?? ''} onChange={(e) => set('slug', e.target.value)} />
          </Field>
          <Field label="Category *">
            <input className={inputClass} value={draft.category ?? ''} onChange={(e) => set('category', e.target.value)} />
          </Field>
          <Field label="Accent Color">
            <select className={inputClass} value={draft.accent ?? 'accent'} onChange={(e) => set('accent', e.target.value as AccentColor)}>
              {ACCENTS.map((accent) => (
                <option key={accent} value={accent}>
                  {accent}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputClass} value={draft.status ?? 'in-progress'} onChange={(e) => set('status', e.target.value as ProjectStatus)}>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status Badge Text" hint="Optional — e.g. 'COMPLETED SYSTEM'.">
            <input className={inputClass} value={draft.statusBadge ?? ''} onChange={(e) => set('statusBadge', e.target.value)} />
          </Field>
        </section>

        <section>
          <Field label="Short Description *">
            <textarea className={textareaClass} value={draft.description ?? ''} onChange={(e) => set('description', e.target.value)} />
          </Field>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <Field label="Tags" hint="One per line.">
            <textarea className={textareaClass} value={toLines(draft.tags)} onChange={(e) => set('tags', fromLines(e.target.value))} />
          </Field>
          <Field label="Capabilities" hint="One per line.">
            <textarea className={textareaClass} value={toLines(draft.capabilities)} onChange={(e) => set('capabilities', fromLines(e.target.value))} />
          </Field>
          <Field label="Tech Stack" hint="One per line — only real, actually-used technologies.">
            <textarea className={textareaClass} value={toLines(draft.tech)} onChange={(e) => set('tech', fromLines(e.target.value))} />
          </Field>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Field label="Demo Type">
            <select className={inputClass} value={draft.demoType ?? 'none'} onChange={(e) => set('demoType', e.target.value as DemoType)}>
              {DEMO_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
          {draft.demoType === 'internal' && (
            <Field label="Internal Demo Route" hint="Must match an existing route registered in App.tsx.">
              <input className={inputClass} value={draft.demoPath ?? ''} onChange={(e) => set('demoPath', e.target.value)} placeholder="/demo/your-route" />
            </Field>
          )}
          {draft.demoType === 'external' && (
            <Field label="Demo URL">
              <input className={inputClass} value={draft.demoUrl ?? ''} onChange={(e) => set('demoUrl', e.target.value)} placeholder="https://…" />
            </Field>
          )}
          <Field label="GitHub URL">
            <input className={inputClass} value={draft.githubUrl ?? ''} onChange={(e) => set('githubUrl', e.target.value)} />
          </Field>
          <Field label="Live Website URL">
            <input className={inputClass} value={draft.liveUrl ?? ''} onChange={(e) => set('liveUrl', e.target.value)} />
          </Field>
          <UploadDemoField slug={draft.slug ?? ''} onUploaded={(url) => set('liveUrl', url)} />
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <ImagePathField label="Thumbnail" value={draft.thumbnail} onChange={(v) => set('thumbnail', v)} slug={draft.slug ?? ''} kind="thumbnail" />
          <ImagePathField
            label="Architecture Image"
            value={draft.architectureImage}
            onChange={(v) => set('architectureImage', v)}
            slug={draft.slug ?? ''}
            kind="architecture"
          />
        </section>

        <section className="border-t border-border pt-6">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">Case Study</h2>
          <div className="flex flex-col gap-4">
            <Field label="Problem">
              <textarea className={textareaClass} value={draft.caseStudy?.problem ?? ''} onChange={(e) => setCaseStudy('problem', e.target.value)} />
            </Field>
            <Field label="Solution">
              <textarea className={textareaClass} value={draft.caseStudy?.solution ?? ''} onChange={(e) => setCaseStudy('solution', e.target.value)} />
            </Field>
            <Field label="Key Features" hint="One per line.">
              <textarea className={textareaClass} value={toLines(draft.caseStudy?.keyFeatures)} onChange={(e) => setCaseStudy('keyFeatures', fromLines(e.target.value))} />
            </Field>
            <Field label="Technical Architecture">
              <textarea className={textareaClass} value={draft.caseStudy?.architecture ?? ''} onChange={(e) => setCaseStudy('architecture', e.target.value)} />
            </Field>
            <Field label="What I Built">
              <textarea className={textareaClass} value={draft.caseStudy?.whatIBuilt ?? ''} onChange={(e) => setCaseStudy('whatIBuilt', e.target.value)} />
            </Field>
            <Field label="My Contribution">
              <textarea className={textareaClass} value={draft.caseStudy?.contribution ?? ''} onChange={(e) => setCaseStudy('contribution', e.target.value)} />
            </Field>
            <Field label="Challenges">
              <textarea className={textareaClass} value={draft.caseStudy?.challenges ?? ''} onChange={(e) => setCaseStudy('challenges', e.target.value)} />
            </Field>
            <Field label="Result">
              <textarea className={textareaClass} value={draft.caseStudy?.result ?? ''} onChange={(e) => setCaseStudy('result', e.target.value)} />
            </Field>
          </div>
        </section>
      </div>

      <div className="mt-8 flex justify-end gap-2 border-t border-border pt-6">
        <Button variant="secondary" onClick={() => navigate('/admin/projects')}>
          Cancel
        </Button>
        <Button onClick={save}>{existing ? 'Save Changes' : 'Create Draft'}</Button>
      </div>
    </AdminLayout>
  )
}
