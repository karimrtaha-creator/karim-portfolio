export type TimeRange = 'today' | '7d' | '30d'

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface ChartPoint {
  label: string
  orders: number
  completed: number
  cancelled: number
}

const RANGE_CONFIG: Record<TimeRange, { points: number; seed: number; labelFor: (index: number) => string; base: number }> = {
  today: {
    points: 8,
    seed: 11,
    base: 14,
    labelFor: (index) => `${String((8 + index * 2) % 24).padStart(2, '0')}:00`,
  },
  '7d': {
    points: 7,
    seed: 27,
    base: 68,
    labelFor: (index) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
  },
  '30d': {
    points: 30,
    seed: 43,
    base: 62,
    labelFor: (index) => `Day ${index + 1}`,
  },
}

export function buildChartData(range: TimeRange): ChartPoint[] {
  const config = RANGE_CONFIG[range]
  const rand = mulberry32(config.seed)
  const points: ChartPoint[] = []

  for (let i = 0; i < config.points; i++) {
    const orders = Math.round(config.base + rand() * config.base * 0.6)
    const cancelled = Math.round(orders * (0.02 + rand() * 0.05))
    const completed = orders - cancelled - Math.round(rand() * 3)
    points.push({ label: config.labelFor(i), orders, completed: Math.max(completed, 0), cancelled })
  }
  return points
}

export function summarize(points: ChartPoint[]) {
  return points.reduce(
    (acc, point) => ({
      orders: acc.orders + point.orders,
      completed: acc.completed + point.completed,
      cancelled: acc.cancelled + point.cancelled,
    }),
    { orders: 0, completed: 0, cancelled: 0 },
  )
}
