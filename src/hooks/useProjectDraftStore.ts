import { useCallback, useEffect, useState } from 'react'
import { deleteProjectRow, fetchAllProjects, insertProject, updateProjectRow } from '@/lib/projectsApi'
import type { Project } from '@/data/types'

function nextSortOrder(projects: Project[]): number {
  return projects.reduce((max, p) => Math.max(max, p.sortOrder), 0) + 1
}

function makeId(): string {
  return `proj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Admin project list, backed directly by the `projects` table — every
 * mutation here writes straight to Supabase (optimistic local update first,
 * then the network call), so publishing a project is immediate: no more
 * export-to-file + commit + deploy step.
 */
export function useProjectDraftStore() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchAllProjects()
      .then((result) => {
        if (!cancelled) setProjects(result)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load projects.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const getById = useCallback((id: string) => projects.find((p) => p.id === id), [projects])

  const create = useCallback(
    async (draft: Partial<Project>): Promise<Project> => {
      const now = new Date().toISOString()
      const project: Project = {
        id: makeId(),
        slug: draft.slug ?? '',
        number: draft.number ?? '',
        category: draft.category ?? '',
        title: draft.title ?? 'Untitled Project',
        accent: draft.accent ?? 'accent',
        featured: false,
        tags: draft.tags ?? [],
        description: draft.description ?? '',
        capabilities: draft.capabilities ?? [],
        tech: draft.tech ?? [],
        caseStudy: draft.caseStudy ?? {
          problem: '',
          solution: '',
          keyFeatures: [],
          architecture: '',
          contribution: '',
          challenges: '',
          result: '',
        },
        status: draft.status ?? 'in-progress',
        visibility: 'draft',
        sortOrder: nextSortOrder(projects),
        demoType: draft.demoType ?? 'none',
        demoPath: draft.demoPath,
        demoUrl: draft.demoUrl,
        githubUrl: draft.githubUrl,
        liveUrl: draft.liveUrl,
        thumbnail: draft.thumbnail,
        screenshots: draft.screenshots,
        architectureImage: draft.architectureImage,
        createdAt: now,
        updatedAt: now,
      }
      await insertProject(project)
      setProjects((current) => [...current, project])
      return project
    },
    [projects],
  )

  const update = useCallback(
    async (id: string, patch: Partial<Project>) => {
      const current = projects.find((p) => p.id === id)
      if (!current) return
      const updated: Project = { ...current, ...patch, updatedAt: new Date().toISOString() }
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)))
      await updateProjectRow(updated)
    },
    [projects],
  )

  /** Only one project can be featured at a time — the public hero slot assumes this. */
  const setFeatured = useCallback(async (id: string, featured: boolean) => {
    const now = new Date().toISOString()
    const toPersist: Project[] = []
    setProjects((current) =>
      current.map((p) => {
        if (p.id === id) {
          const next = { ...p, featured, updatedAt: now }
          toPersist.push(next)
          return next
        }
        if (featured && p.featured) {
          const next = { ...p, featured: false, updatedAt: now }
          toPersist.push(next)
          return next
        }
        return p
      }),
    )
    await Promise.all(toPersist.map((p) => updateProjectRow(p)))
  }, [])

  const setVisibility = useCallback(
    async (id: string, visibility: Project['visibility']) => {
      await update(id, { visibility })
    },
    [update],
  )

  const remove = useCallback(async (id: string) => {
    setProjects((current) => current.filter((p) => p.id !== id))
    await deleteProjectRow(id)
  }, [])

  const duplicate = useCallback(
    async (id: string) => {
      const source = projects.find((p) => p.id === id)
      if (!source) return
      const now = new Date().toISOString()
      const copy: Project = {
        ...source,
        id: makeId(),
        slug: `${source.slug}-copy`,
        title: `${source.title} (Copy)`,
        featured: false,
        visibility: 'draft',
        sortOrder: nextSortOrder(projects),
        createdAt: now,
        updatedAt: now,
      }
      await insertProject(copy)
      setProjects((current) => [...current, copy])
    },
    [projects],
  )

  const reorder = useCallback(
    async (id: string, direction: 'up' | 'down') => {
      const sorted = [...projects].sort((a, b) => a.sortOrder - b.sortOrder)
      const index = sorted.findIndex((p) => p.id === id)
      const swapWith = direction === 'up' ? index - 1 : index + 1
      if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return
      const a = sorted[index]
      const b = sorted[swapWith]
      const aUpdated = { ...a, sortOrder: b.sortOrder }
      const bUpdated = { ...b, sortOrder: a.sortOrder }
      setProjects((current) =>
        current.map((p) => {
          if (p.id === a.id) return aUpdated
          if (p.id === b.id) return bUpdated
          return p
        }),
      )
      await Promise.all([updateProjectRow(aUpdated), updateProjectRow(bUpdated)])
    },
    [projects],
  )

  return {
    projects: [...projects].sort((a, b) => a.sortOrder - b.sortOrder),
    loading,
    error,
    getById,
    create,
    update,
    setFeatured,
    setVisibility,
    remove,
    duplicate,
    reorder,
  }
}
