export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="mb-3 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.15em] text-amber">
        <span className="h-px w-8 bg-amber/50" aria-hidden />
        {eyebrow}
      </div>
      <h2 className="max-w-2xl font-display text-[1.75rem] font-bold leading-tight tracking-tight text-ink md:text-[2.1rem]">
        {title}
      </h2>
      {description && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">{description}</p>}
    </div>
  )
}
