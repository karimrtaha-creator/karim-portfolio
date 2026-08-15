export interface AuditEntry {
  at: string
  actor: string
  action: string
}

export const INITIAL_AUDIT_LOG: AuditEntry[] = [
  { at: '08:41', actor: 'Branch Manager Demo', action: 'Accepted order ORD-10482' },
  { at: '08:44', actor: 'Dispatcher Demo', action: 'Assigned ORD-10483 to Driver Demo 04' },
  { at: '08:47', actor: 'Driver Demo 04', action: 'Marked ORD-10483 as arrived' },
  { at: '08:51', actor: 'Driver Demo 04', action: 'Confirmed OTP and completed ORD-10483' },
  { at: '08:52', actor: 'General Manager Demo', action: 'Viewed company-wide performance report' },
  { at: '08:58', actor: 'Branch Manager Demo', action: 'Disabled dine-in for Alexandria Branch' },
  { at: '09:03', actor: 'System', action: 'SLA breach detected on ORD-10471' },
]

export const TEAM_OPS_AUDIT_LOG: AuditEntry[] = [
  { at: '08:12', actor: 'Tarek Demo', action: 'Approved leave request for Hassan Demo' },
  { at: '08:26', actor: 'Dina Demo', action: 'Updated KPI score for Sara Demo' },
  { at: '08:34', actor: 'Tarek Demo', action: 'Created new user account for Karim Demo' },
  { at: '08:47', actor: 'Laila Demo', action: 'Reassigned task "Onboard new logistics hire"' },
  { at: '09:05', actor: 'Tarek Demo', action: 'Changed role for Laila Demo to Team Leader' },
]
