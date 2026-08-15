export function formatEGP(amount: number): string {
  return `${amount.toLocaleString('en-US')} EGP`
}

export function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function formatMinutes(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? '-' : ''
  const abs = Math.abs(totalMinutes)
  const mins = Math.floor(abs)
  return `${sign}${String(mins).padStart(2, '0')} min`
}

export function relativeTimeFromNow(date: Date, now: Date = new Date()): string {
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.round(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin === 1) return '1 min ago'
  if (diffMin < 60) return `${diffMin} min ago`
  const hrs = Math.round(diffMin / 60)
  return `${hrs}h ago`
}
