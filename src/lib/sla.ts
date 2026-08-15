export type SlaState = 'on-track' | 'at-risk' | 'breached'

export interface SlaComputation {
  elapsedMinutes: number
  remainingMinutes: number
  state: SlaState
}

/** Pure clock-driven SLA math: given a start time and an SLA budget, compute
 *  elapsed/remaining minutes and a status tier. At-risk kicks in inside the
 *  last 20% of the budget. */
export function computeSla(
  startedAt: Date,
  slaBudgetMinutes: number,
  now: Date = new Date(),
): SlaComputation {
  const elapsedMinutes = (now.getTime() - startedAt.getTime()) / 60000
  const remainingMinutes = slaBudgetMinutes - elapsedMinutes
  const state: SlaState =
    remainingMinutes < 0 ? 'breached' : remainingMinutes <= slaBudgetMinutes * 0.2 ? 'at-risk' : 'on-track'
  return { elapsedMinutes, remainingMinutes, state }
}
