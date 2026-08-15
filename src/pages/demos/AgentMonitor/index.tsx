import { useState } from 'react'
import { AlertTriangle, PhoneCall, PhoneOff, Coffee, CheckCircle2 } from 'lucide-react'
import { DemoPageShell } from '@/components/layout/DemoPageShell'
import { ProductFrame } from '@/components/ui/ProductFrame'
import { Badge } from '@/components/ui/Badge'
import { StatTile } from '@/components/ui/StatTile'
import { useToast } from '@/components/ui/Toast'
import { useInterval } from '@/hooks/useInterval'
import { AGENT_STATE_LABEL, INITIAL_AGENTS, LONG_BREAK_THRESHOLD_MINUTES, type AgentState, type DemoAgent } from '@/data/demoAgents'
import { cn } from '@/lib/cn'

const STATE_ICON: Record<AgentState, typeof PhoneCall> = {
  available: CheckCircle2,
  'on-call': PhoneCall,
  'on-break': Coffee,
  'logged-out': PhoneOff,
}

const STATE_CYCLE: AgentState[] = ['available', 'on-call', 'on-break', 'logged-out']

export function AgentMonitorDemo() {
  const { push } = useToast()
  const [agents, setAgents] = useState<DemoAgent[]>(INITIAL_AGENTS)

  useInterval(() => {
    setAgents((current) => current.map((agent) => ({ ...agent, stateMinutes: agent.stateMinutes + 1 })))
  }, 3000)

  // Simulates a live floor: every so often, one agent's status changes on its own.
  // Reads `agents` from this render's closure (useInterval always calls the latest
  // callback), so state is only ever written via setAgents — never inside its updater.
  useInterval(() => {
    const index = Math.floor(Math.random() * agents.length)
    const agent = agents[index]
    const nextState = STATE_CYCLE.filter((state) => state !== agent.state)[Math.floor(Math.random() * 3)]
    push({ title: `${agent.name} is now ${AGENT_STATE_LABEL[nextState]}`, tone: 'info' })
    setAgents((current) => current.map((item, i) => (i === index ? { ...item, state: nextState, stateMinutes: 0 } : item)))
  }, 9000)

  const setState = (id: string, state: AgentState) => {
    setAgents((current) => current.map((agent) => (agent.id === id ? { ...agent, state, stateMinutes: 0 } : agent)))
    const agent = agents.find((a) => a.id === id)
    push({ title: `${agent?.name} is now ${AGENT_STATE_LABEL[state]}`, tone: 'info' })
  }

  const counts = STATE_CYCLE.reduce(
    (acc, state) => ({ ...acc, [state]: agents.filter((a) => a.state === state).length }),
    {} as Record<AgentState, number>,
  )

  return (
    <DemoPageShell slug="agent-monitor">
      <ProductFrame title="agent-monitor — live roster" accent="blue">
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Available" value={counts.available} tone="success" />
          <StatTile label="On Call" value={counts['on-call']} />
          <StatTile label="On Break" value={counts['on-break']} tone="warning" />
          <StatTile label="Logged Out" value={counts['logged-out']} />
        </div>

        <div className="flex flex-col gap-2.5">
          {agents.map((agent) => {
            const Icon = STATE_ICON[agent.state]
            const longBreak = agent.state === 'on-break' && agent.stateMinutes >= LONG_BREAK_THRESHOLD_MINUTES
            return (
              <div
                key={agent.id}
                className={cn(
                  'flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border bg-surface p-3.5',
                  longBreak ? 'border-danger/50 bg-danger-soft' : 'border-border',
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-ink-dim" />
                  <div>
                    <p className="text-[13.5px] font-medium text-ink">{agent.name}</p>
                    <p className="text-[12px] text-ink-dim">{agent.stateMinutes} min in this state</p>
                  </div>
                  {longBreak && (
                    <Badge tone="danger" dot>
                      <AlertTriangle className="h-3 w-3" /> Long Break
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {STATE_CYCLE.map((state) => (
                    <button
                      key={state}
                      onClick={() => setState(agent.id, state)}
                      className={cn(
                        'rounded-[var(--radius-sm)] border px-2.5 py-1 text-[11.5px] font-medium transition-colors',
                        agent.state === state
                          ? 'border-transparent bg-ink text-bg'
                          : 'border-border text-ink-soft hover:border-ink-dim',
                      )}
                    >
                      {AGENT_STATE_LABEL[state]}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-4 text-[12.5px] text-ink-dim">
          Agent states change on their own every so often to simulate a live floor — you can also change one
          manually below. Let a break run past {LONG_BREAK_THRESHOLD_MINUTES} minutes to see the long-break alert.
        </p>
      </ProductFrame>
    </DemoPageShell>
  )
}
