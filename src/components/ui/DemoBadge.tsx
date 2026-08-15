export function DemoBadge({ className }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-demo/40 bg-demo-soft px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-demo-ink ${className ?? ''}`}
      role="note"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-demo opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-demo" />
      </span>
      Public Demo — All Data Is Fictional
    </div>
  )
}
