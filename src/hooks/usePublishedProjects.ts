import { useEffect, useState } from 'react'
import { PROJECTS as BUNDLED_PROJECTS } from '@/data/projects'
import { fetchPublishedProjects } from '@/lib/projectsApi'
import type { Project } from '@/data/types'

const STATIC_FALLBACK = BUNDLED_PROJECTS.filter((project) => project.visibility === 'published').sort(
  (a, b) => a.sortOrder - b.sortOrder,
)

/**
 * Module-level cache so every component sharing this hook fires one network
 * request per page load, not one per mount, and so a visitor always gets an
 * immediate paint from the bundled list before (possibly) being replaced by
 * live data — a missing/misconfigured/down Supabase project can therefore
 * never leave a visitor looking at a blank gallery, only a stale one.
 */
let cachedPublished: Project[] | null = null
let inflight: Promise<Project[]> | null = null

async function loadPublished(): Promise<Project[]> {
  const live = await fetchPublishedProjects()
  return live.length > 0 ? live.sort((a, b) => a.sortOrder - b.sortOrder) : STATIC_FALLBACK
}

/** Public gallery data — live from Supabase when reachable, bundled static data otherwise. */
export function usePublishedProjects() {
  const [projects, setProjects] = useState<Project[]>(cachedPublished ?? STATIC_FALLBACK)
  const [loading, setLoading] = useState(cachedPublished === null)

  useEffect(() => {
    if (cachedPublished) return
    inflight ??= loadPublished()
    let cancelled = false
    inflight.then((result) => {
      if (cancelled) return
      cachedPublished = result
      setProjects(result)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { projects, loading }
}

/**
 * Per-slug lookup for the case-study and internal-demo routes. `loading`
 * must be checked before `project` — a project only added through the admin
 * DB (not in the bundled fallback) briefly looks "not found" until the live
 * fetch resolves, and callers navigate away on a false "not found".
 */
export function usePublishedProject(slug: string | undefined) {
  const { projects, loading } = usePublishedProjects()
  const project = slug ? projects.find((p) => p.slug === slug) : undefined
  return { project, loading }
}
