import { useState } from 'react'
import { Lock, ShieldCheck } from 'lucide-react'
import { DemoPageShell } from '@/components/layout/DemoPageShell'
import { ProductFrame } from '@/components/ui/ProductFrame'
import { Tabs, type TabOption } from '@/components/ui/Tabs'
import { Table, Td, Th } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { StatTile } from '@/components/ui/StatTile'
import { DEMO_EMPLOYEES, DEMO_TASKS, type EmployeeRole } from '@/data/demoEmployees'
import { TEAM_OPS_AUDIT_LOG } from '@/data/demoAuditLog'
import { AuditLog } from '@/components/ui/AuditLog'
import { cn } from '@/lib/cn'

const ROLE_OPTIONS: TabOption<EmployeeRole>[] = [
  { value: 'employee', label: 'Employee' },
  { value: 'team-leader', label: 'Team Leader' },
  { value: 'manager', label: 'Manager' },
  { value: 'administrator', label: 'Administrator' },
]

const VISIBILITY: Record<EmployeeRole, string[]> = {
  employee: ['Own attendance', 'Own KPI', 'Own tasks'],
  'team-leader': ['Own attendance', 'Own KPI', 'Own tasks', 'Team performance', 'Team tasks'],
  manager: ['Team performance', 'All tasks', 'All attendance', 'All KPIs', 'Performance reviews'],
  administrator: ['Users', 'Roles', 'Audit log', 'System configuration'],
}

export function TeamOpsDemo() {
  const [role, setRole] = useState<EmployeeRole>('employee')
  const currentUser = DEMO_EMPLOYEES.find((e) => e.role === role) ?? DEMO_EMPLOYEES[0]

  return (
    <DemoPageShell slug="team-ops">
      <ProductFrame title="team-ops — role-scoped console" accent="rose" actions={<Tabs options={ROLE_OPTIONS} value={role} onChange={setRole} ariaLabel="Switch role view" />}>
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3.5 py-2.5">
          <ShieldCheck className="h-4 w-4 text-accent" />
          <span className="text-[12.5px] text-ink-soft">
            Signed in as <span className="font-medium text-ink">{currentUser.name}</span> ({ROLE_OPTIONS.find((r) => r.value === role)?.label}) — visible now:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {VISIBILITY[role].map((item) => (
              <Badge key={item} tone="rose">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Attendance" value={currentUser.attendanceRate} suffix="%" tone="success" />
          <StatTile label="KPI" value={currentUser.kpi} suffix="%" />
          <StatTile label="Open Tasks" value={currentUser.tasksOpen} tone="warning" />
          <StatTile label="Points" value={currentUser.points} />
        </div>

        {role === 'employee' && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-ink">My tasks</h3>
            <TaskList assignee={currentUser.name} />
            <LockedNote items={['Team performance', 'Other employees\' data', 'User & role management']} />
          </div>
        )}

        {role === 'team-leader' && (
          <div className="mt-6 flex flex-col gap-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">{currentUser.department} team performance</h3>
              <EmployeeTable employees={DEMO_EMPLOYEES.filter((e) => e.department === currentUser.department)} />
            </div>
            <LockedNote items={['Salary & compensation data', 'User & role management', 'Other departments']} />
          </div>
        )}

        {role === 'manager' && (
          <div className="mt-6 flex flex-col gap-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">Team-wide performance</h3>
              <EmployeeTable employees={DEMO_EMPLOYEES} />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">Task board</h3>
              <TaskList />
            </div>
            <LockedNote items={['System configuration', 'Role management']} />
          </div>
        )}

        {role === 'administrator' && (
          <div className="mt-6 flex flex-col gap-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">Users &amp; roles</h3>
              <EmployeeTable employees={DEMO_EMPLOYEES} showRole />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">Audit log</h3>
              <AuditLog entries={TEAM_OPS_AUDIT_LOG} />
            </div>
          </div>
        )}
      </ProductFrame>
    </DemoPageShell>
  )
}

function EmployeeTable({ employees, showRole = false }: { employees: typeof DEMO_EMPLOYEES; showRole?: boolean }) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Name</Th>
          <Th>Department</Th>
          {showRole && <Th>Role</Th>}
          <Th>Attendance</Th>
          <Th>KPI</Th>
          <Th>Points</Th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <Td>{employee.name}</Td>
            <Td>{employee.department}</Td>
            {showRole && (
              <Td>
                <Badge tone="neutral">{employee.role.replace('-', ' ')}</Badge>
              </Td>
            )}
            <Td>{employee.attendanceRate}%</Td>
            <Td>{employee.kpi}%</Td>
            <Td>{employee.points}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

function TaskList({ assignee }: { assignee?: string }) {
  const tasks = assignee ? DEMO_TASKS.filter((task) => task.assignee === assignee) : DEMO_TASKS
  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between rounded-[var(--radius-sm)] border border-border bg-surface px-3.5 py-2.5">
          <div>
            <p className="text-[13px] text-ink">{task.title}</p>
            <p className="text-[11.5px] text-ink-dim">{task.assignee} · Due {task.due}</p>
          </div>
          <Badge tone={task.status === 'done' ? 'success' : task.status === 'in-progress' ? 'blue' : 'neutral'}>
            {task.status.replace('-', ' ')}
          </Badge>
        </div>
      ))}
      {tasks.length === 0 && <p className="text-[13px] text-ink-dim">No tasks assigned.</p>}
    </div>
  )
}

function LockedNote({ items }: { items: string[] }) {
  return (
    <div className={cn('flex items-start gap-2.5 rounded-[var(--radius-md)] border border-dashed border-border p-3.5 text-[12.5px] text-ink-dim')}>
      <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>This role can't see: {items.join(', ')} — hidden and blocked at the data layer, not just the UI.</span>
    </div>
  )
}
