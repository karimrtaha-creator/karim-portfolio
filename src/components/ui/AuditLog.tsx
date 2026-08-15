import type { AuditEntry } from '@/data/demoAuditLog'

export function AuditLog({ entries }: { entries: AuditEntry[] }) {
  return (
    <div className="flex max-h-80 flex-col gap-0 overflow-y-auto rounded-[var(--radius-md)] border border-border bg-surface">
      {entries.map((entry, index) => (
        <div
          key={`${entry.at}-${index}`}
          className="flex items-start gap-3 border-b border-border px-4 py-2.5 text-[13px] last:border-none animate-fade-up"
        >
          <span className="shrink-0 font-mono text-[11.5px] text-ink-dim">{entry.at}</span>
          <span className="text-ink-soft">
            <span className="font-medium text-ink">{entry.actor}</span> — {entry.action}
          </span>
        </div>
      ))}
      {entries.length === 0 && <p className="p-4 text-center text-[13px] text-ink-dim">No activity yet.</p>}
    </div>
  )
}
