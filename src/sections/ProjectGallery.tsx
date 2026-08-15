import { PROJECTS } from '@/data/projects'
import { ProjectCard } from '@/components/ProjectCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function ProjectGallery() {
  const published = PROJECTS.filter((project) => project.visibility === 'published').sort((a, b) => a.sortOrder - b.sortOrder)
  const featured = published.find((project) => project.featured)
  const rest = published.filter((project) => !project.featured)

  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHeading
        eyebrow="A1 · Work"
        title="Six systems, each solving a real operational problem."
        description="Every project below has a fully interactive demo — explore the dashboard, click through the workflow, and see how it actually works. All data shown is fictional."
      />

      {featured && (
        <ScrollReveal className="mb-8">
          <ProjectCard project={featured} featured />
        </ScrollReveal>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {rest.map((project, index) => (
          <ScrollReveal key={project.slug} delay={index * 60}>
            <ProjectCard project={project} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
