import { supabase } from '@/lib/supabase'
import type { Project } from '@/data/types'

const TABLE = 'projects'

/**
 * Only the handful of top-level columns follow SQL's snake_case
 * convention — nested JSON (tags, capabilities, tech, caseStudy,
 * screenshots) keeps the exact same keys as the Project type, since jsonb
 * content isn't a SQL identifier and doesn't need renaming.
 */
type ProjectRow = {
  id: string
  slug: string
  number: string
  category: string
  title: string
  accent: Project['accent']
  featured: boolean
  status_badge: string | null
  tags: Project['tags']
  description: string
  capabilities: Project['capabilities']
  tech: Project['tech']
  case_study: Project['caseStudy']
  status: Project['status']
  visibility: Project['visibility']
  sort_order: number
  demo_type: Project['demoType']
  demo_path: string | null
  demo_url: string | null
  github_url: string | null
  live_url: string | null
  thumbnail: string | null
  screenshots: Project['screenshots'] | null
  architecture_image: string | null
  created_at: string
  updated_at: string
}

export function mapRowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    number: row.number,
    category: row.category,
    title: row.title,
    accent: row.accent,
    featured: row.featured,
    statusBadge: row.status_badge ?? undefined,
    tags: row.tags ?? [],
    description: row.description,
    capabilities: row.capabilities ?? [],
    tech: row.tech ?? [],
    caseStudy: row.case_study,
    status: row.status,
    visibility: row.visibility,
    sortOrder: row.sort_order,
    demoType: row.demo_type,
    demoPath: row.demo_path ?? undefined,
    demoUrl: row.demo_url ?? undefined,
    githubUrl: row.github_url ?? undefined,
    liveUrl: row.live_url ?? undefined,
    thumbnail: row.thumbnail ?? undefined,
    screenshots: row.screenshots ?? undefined,
    architectureImage: row.architecture_image ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapProjectToRow(project: Project): ProjectRow {
  return {
    id: project.id,
    slug: project.slug,
    number: project.number,
    category: project.category,
    title: project.title,
    accent: project.accent,
    featured: project.featured,
    status_badge: project.statusBadge ?? null,
    tags: project.tags,
    description: project.description,
    capabilities: project.capabilities,
    tech: project.tech,
    case_study: project.caseStudy,
    status: project.status,
    visibility: project.visibility,
    sort_order: project.sortOrder,
    demo_type: project.demoType,
    demo_path: project.demoPath ?? null,
    demo_url: project.demoUrl ?? null,
    github_url: project.githubUrl ?? null,
    live_url: project.liveUrl ?? null,
    thumbnail: project.thumbnail ?? null,
    screenshots: project.screenshots ?? null,
    architecture_image: project.architectureImage ?? null,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
  }
}

/** Public read — relies on the "published only" RLS policy for the anon role. */
export async function fetchPublishedProjects(): Promise<Project[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from(TABLE).select('*').eq('visibility', 'published').order('sort_order', { ascending: true })
  if (error || !data) return []
  return (data as ProjectRow[]).map(mapRowToProject)
}

/** Admin read — the authenticated RLS policy returns every row regardless of visibility. */
export async function fetchAllProjects(): Promise<Project[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from(TABLE).select('*').order('sort_order', { ascending: true })
  if (error) throw error
  return (data as ProjectRow[]).map(mapRowToProject)
}

export async function insertProject(project: Project): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.from(TABLE).insert(mapProjectToRow(project))
  if (error) throw error
}

export async function updateProjectRow(project: Project): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.from(TABLE).update(mapProjectToRow(project)).eq('id', project.id)
  if (error) throw error
}

export async function deleteProjectRow(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
