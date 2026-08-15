export type AccentColor = 'accent' | 'amber' | 'violet' | 'blue' | 'rose' | 'teal'

export type ProjectStatus = 'completed' | 'in-progress' | 'archived'
export type Visibility = 'draft' | 'published'
export type DemoType = 'external' | 'internal' | 'none'

export interface CaseStudy {
  problem: string
  solution: string
  keyFeatures: string[]
  architecture: string
  contribution: string
  challenges: string
  result: string
  whatIBuilt?: string
}

export interface Project {
  id: string
  slug: string
  number: string
  category: string
  title: string
  accent: AccentColor
  featured: boolean
  statusBadge?: string
  tags: string[]
  description: string
  capabilities: string[]
  tech: string[]
  caseStudy: CaseStudy

  status: ProjectStatus
  visibility: Visibility
  sortOrder: number

  demoType: DemoType
  demoPath?: string
  demoUrl?: string
  githubUrl?: string
  liveUrl?: string

  thumbnail?: string
  screenshots?: string[]
  architectureImage?: string

  createdAt: string
  updatedAt: string
}
