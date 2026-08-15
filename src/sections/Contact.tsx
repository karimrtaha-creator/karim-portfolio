import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons'

const LINKS = [
  { label: 'karim.r.taha@gmail.com', href: 'mailto:karim.r.taha@gmail.com', icon: Mail },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/karim-ramadan-999779204', icon: LinkedinIcon },
  { label: 'GitHub', href: 'https://github.com/karimrtaha-creator', icon: GithubIcon },
]

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 pb-24 pt-4 md:px-8">
      <div className="rounded-[var(--radius-lg)] bg-ink px-6 py-14 text-center text-bg md:px-16 md:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-faint">F1 · Contact</p>
        <h2 className="mx-auto mt-4 max-w-xl font-display text-2xl font-bold leading-tight md:text-3xl">
          Have a workflow that should be automated?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-bg/70">
          Tell me what you're trying to improve. I'll help turn the workflow into a practical software solution.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-bg/20 px-4 py-2.5 text-[13.5px] font-medium text-bg transition-colors hover:bg-bg/10"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
