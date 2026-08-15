export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 text-center md:px-8">
        <p className="font-mono text-[13px] text-ink-dim">
          © {new Date().getFullYear()} KARIM.DEV | OPERATIONAL EFFICIENCY ENGINEER
        </p>
        <p className="text-xs text-ink-faint">All demo data on this site is fictional. See each demo for details.</p>
      </div>
    </footer>
  )
}
