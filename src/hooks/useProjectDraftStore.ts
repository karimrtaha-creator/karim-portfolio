import { useCallback, useEffect, useState } from 'react'
import { PROJECTS } from '@/data/projects'
import type { Project } from '@/data/types'

const STORAGE_KEY = 'karim-portfolio-admin-drafts'

function loadFromStorage(): Project[] {
  if (typeof window === 'undefined') return PROJECTS
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return PROJECTS
  try {
    const parsed = JSON.parse(raw) as Project[]
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch {
    // fall through to the real source file
  }
  return PROJECTS
}

function save(projects: Project[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

function nextSortOrder(projects: Project[]): number {
  return projects.reduce((max, p) => Math.max(max, p.sortOrder), 0) + 1
}

function makeId(): string {
  return `proj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function useProjectDraftStore() {
  const [projects, setProjects] = useState<Project[]>(loadFromStorage)

  useEffect(() => {
    save(projects)
  }, [projects])

  const getById = useCallback((id: string) => projects.find((p) => p.id === id), [projects])

  const create = useCallback((draft: Partial<Project>): Project => {
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
    setProjects((current) => [...current, project])
    return project
  }, [projects])

  const update = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((current) =>
      current.map((p) => {
        if (p.id !== id) return p
        return { ...p, ...patch, updatedAt: new Date().toISOString() }
      }),
    )
  }, [])

  /** Only one project can be featured at a time — the public hero slot assumes this. */
  const setFeatured = useCallback((id: string, featured: boolean) => {
    setProjects((current) =>
      current.map((p) => {
        if (p.id === id) return { ...p, featured, updatedAt: new Date().toISOString() }
        return featured && p.featured ? { ...p, featured: false } : p
      }),
    )
  }, [])

  const setVisibility = useCallback((id: string, visibility: Project['visibility']) => {
    update(id, { visibility })
  }, [update])

  const remove = useCallback((id: string) => {
    setProjects((current) => current.filter((p) => p.id !== id))
  }, [])

  const duplicate = useCallback((id: string) => {
    setProjects((current) => {
      const source = current.find((p) => p.id === id)
      if (!source) return current
      const now = new Date().toISOString()
      const copy: Project = {
        ...source,
        id: makeId(),
        slug: `${source.slug}-copy`,
        title: `${source.title} (Copy)`,
        featured: false,
        visibility: 'draft',
        sortOrder: nextSortOrder(current),
        createdAt: now,
        updatedAt: now,
      }
      return [...current, copy]
    })
  }, [])

  const reorder = useCallback((id: string, direction: 'up' | 'down') => {
    setProjects((current) => {
      const sorted = [...current].sort((a, b) => a.sortOrder - b.sortOrder)
      const index = sorted.findIndex((p) => p.id === id)
      const swapWith = direction === 'up' ? index - 1 : index + 1
      if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return current
      const a = sorted[index]
      const b = sorted[swapWith]
      const aOrder = a.sortOrder
      const bOrder = b.sortOrder
      return current.map((p) => {
        if (p.id === a.id) return { ...p, sortOrder: bOrder }
        if (p.id === b.id) return { ...p, sortOrder: aOrder }
        return p
      })
    })
  }, [])

  /** Discards local drafts and reloads from the real, committed source file. */
  const resetFromSource = useCallback(() => {
    setProjects(PROJECTS)
  }, [])

  const hasUnsavedChanges = JSON.stringify(projects) !== JSON.stringify(PROJECTS)

  return {
    projects: [...projects].sort((a, b) => a.sortOrder - b.sortOrder),
    getById,
    create,
    update,
    setFeatured,
    setVisibility,
    remove,
    duplicate,
    reorder,
    resetFromSource,
    hasUnsavedChanges,
  }
}
