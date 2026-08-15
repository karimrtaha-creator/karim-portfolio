import type { Project } from '@/data/types'

/**
 * Serializes the draft project list back into a valid, drop-in replacement
 * for src/data/projects.ts. JSON is a strict subset of TS object-literal
 * syntax, so JSON.stringify is a safe, always-correct formatter here —
 * no hand-rolled pretty-printer that could mis-escape a string and produce
 * broken source.
 */
export function exportProjectsAsSource(projects: Project[]): string {
  const sorted = [...projects].sort((a, b) => a.sortOrder - b.sortOrder)
  const body = JSON.stringify(sorted, null, 2)

  return `import type { Project } from './types'

export const PROJECTS: Project[] = ${body}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug)
}

/** Public-facing lookup — draft projects must never be reachable by guessing their URL. */
export function getPublishedProjectBySlug(slug: string): Project | undefined {
  const project = getProjectBySlug(slug)
  return project?.visibility === 'published' ? project : undefined
}
`
}

export function downloadProjectsFile(projects: Project[]) {
  const source = exportProjectsAsSource(projects)
  const blob = new Blob([source], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'projects.ts'
  link.click()
  URL.revokeObjectURL(url)
}

export async function copyProjectsToClipboard(projects: Project[]): Promise<void> {
  const source = exportProjectsAsSource(projects)
  await navigator.clipboard.writeText(source)
}
