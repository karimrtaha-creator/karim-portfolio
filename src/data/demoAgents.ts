export type AgentState = 'available' | 'on-call' | 'on-break' | 'logged-out'

export interface DemoAgent {
  id: string
  name: string
  state: AgentState
  /** minutes elapsed in the current state, seeded for the demo */
  stateMinutes: number
}

export const AGENT_STATE_LABEL: Record<AgentState, string> = {
  available: 'Available',
  'on-call': 'On Call',
  'on-break': 'On Break',
  'logged-out': 'Logged Out',
}

export const LONG_BREAK_THRESHOLD_MINUTES = 20

export const INITIAL_AGENTS: DemoAgent[] = [
  { id: 'agt-1', name: 'Ahmed Hassan', state: 'available', stateMinutes: 3 },
  { id: 'agt-2', name: 'Omar Ali', state: 'on-call', stateMinutes: 7 },
  { id: 'agt-3', name: 'Mariam Adel', state: 'on-break', stateMinutes: 24 },
  { id: 'agt-4', name: 'Youssef Samir', state: 'available', stateMinutes: 1 },
  { id: 'agt-5', name: 'Nour Khaled', state: 'logged-out', stateMinutes: 46 },
]
