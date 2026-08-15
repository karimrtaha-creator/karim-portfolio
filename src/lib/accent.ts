import type { AccentColor } from '@/data/types'

interface AccentClasses {
  text: string
  bg: string
  border: string
  solidBg: string
  dot: string
}

const MAP: Record<AccentColor, AccentClasses> = {
  accent: { text: 'text-accent', bg: 'bg-accent-soft', border: 'border-accent', solidBg: 'bg-accent', dot: 'bg-accent' },
  amber: { text: 'text-amber', bg: 'bg-amber-soft', border: 'border-amber', solidBg: 'bg-amber', dot: 'bg-amber' },
  violet: { text: 'text-violet', bg: 'bg-violet-soft', border: 'border-violet', solidBg: 'bg-violet', dot: 'bg-violet' },
  blue: { text: 'text-blue', bg: 'bg-blue-soft', border: 'border-blue', solidBg: 'bg-blue', dot: 'bg-blue' },
  rose: { text: 'text-rose', bg: 'bg-rose-soft', border: 'border-rose', solidBg: 'bg-rose', dot: 'bg-rose' },
  teal: { text: 'text-teal', bg: 'bg-teal-soft', border: 'border-teal', solidBg: 'bg-teal', dot: 'bg-teal' },
}

export function accentClasses(accent: AccentColor): AccentClasses {
  return MAP[accent]
}
