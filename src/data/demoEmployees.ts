export type EmployeeRole = 'employee' | 'team-leader' | 'manager' | 'administrator'

export interface DemoEmployee {
  id: string
  name: string
  department: string
  role: EmployeeRole
  attendanceRate: number
  kpi: number
  tasksOpen: number
  tasksDone: number
  points: number
}

export const DEMO_EMPLOYEES: DemoEmployee[] = [
  { id: 'e1', name: 'Sara Demo', department: 'Operations', role: 'employee', attendanceRate: 96, kpi: 88, tasksOpen: 3, tasksDone: 21, points: 142 },
  { id: 'e2', name: 'Hassan Demo', department: 'Operations', role: 'employee', attendanceRate: 91, kpi: 79, tasksOpen: 5, tasksDone: 17, points: 108 },
  { id: 'e3', name: 'Laila Demo', department: 'Support', role: 'team-leader', attendanceRate: 98, kpi: 93, tasksOpen: 2, tasksDone: 34, points: 201 },
  { id: 'e4', name: 'Karim Demo', department: 'Logistics', role: 'employee', attendanceRate: 88, kpi: 74, tasksOpen: 6, tasksDone: 12, points: 84 },
  { id: 'e5', name: 'Dina Demo', department: 'Support', role: 'manager', attendanceRate: 99, kpi: 95, tasksOpen: 1, tasksDone: 40, points: 260 },
  { id: 'e6', name: 'Tarek Demo', department: 'Administration', role: 'administrator', attendanceRate: 97, kpi: 90, tasksOpen: 0, tasksDone: 29, points: 210 },
]

export const DEPARTMENTS = ['Operations', 'Support', 'Logistics', 'Administration'] as const

export interface DemoTask {
  id: string
  title: string
  assignee: string
  status: 'todo' | 'in-progress' | 'done'
  due: string
}

export const DEMO_TASKS: DemoTask[] = [
  { id: 't1', title: 'Review weekly attendance report', assignee: 'Sara Demo', status: 'in-progress', due: 'Today' },
  { id: 't2', title: 'Update shift schedule template', assignee: 'Hassan Demo', status: 'todo', due: 'Tomorrow' },
  { id: 't3', title: 'KPI check-in — Support team', assignee: 'Laila Demo', status: 'done', due: 'Yesterday' },
  { id: 't4', title: 'Onboard new logistics hire', assignee: 'Karim Demo', status: 'todo', due: 'This week' },
]
