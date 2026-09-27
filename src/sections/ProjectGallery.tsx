import { PROJECTS } from '@/data/projects'
import { ProjectCard } from '@/components/ProjectCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']

export function ProjectGallery() {
  const published = PROJECTS.filter((project) => project.visibility === 'published').sort((a, b) => a.sortOrder - b.sortOrder)
  const featured = published.find((project) => project.featured)
  const rest = published.filter((project) => !project.featured)
  const countWord = NUMBER_WORDS[published.length] ?? String(published.length)

  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHeading
        eyebrow="A1 · Work"
        title={`${countWord} systems, each solving a real operational problem.`}
        description="Most projects below have a fully interactive demo — explore the dashboard, click through the workflow, and see how it actually works. All demo data shown is fictional; live products link out to the real thing."
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
