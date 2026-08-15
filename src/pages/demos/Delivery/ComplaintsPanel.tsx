import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import type { ComplaintStatus, ComplaintPriority, DemoComplaint } from '@/data/demoComplaints'
import type { DeliveryDispatch } from './state'

const PRIORITY_TONE: Record<ComplaintPriority, 'danger' | 'amber' | 'neutral'> = {
  high: 'danger',
  medium: 'amber',
  low: 'neutral',
}

const STATUS_TONE: Record<ComplaintStatus, 'danger' | 'blue' | 'success'> = {
  open: 'danger',
  assigned: 'blue',
  resolved: 'success',
}

export function ComplaintsPanel({ complaints, dispatch }: { complaints: DemoComplaint[]; dispatch: DeliveryDispatch }) {
  const { push } = useToast()
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({})

  return (
    <div className="flex flex-col gap-3">
      {complaints.map((complaint) => (
        <Card key={complaint.id} className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="font-mono text-[13px] font-semibold text-ink">Complaint #{complaint.id}</span>
                <Badge tone={PRIORITY_TONE[complaint.priority]}>{complaint.priority}</Badge>
                <Badge tone={STATUS_TONE[complaint.status]} dot>
                  {complaint.status}
                </Badge>
              </div>
              <p className="text-[13px] text-ink-soft">
                {complaint.category} · Order <span className="font-mono">{complaint.orderId}</span> · {complaint.customerName}
              </p>
              {complaint.assignedTo && <p className="mt-1 text-[12.5px] text-ink-dim">Assigned to {complaint.assignedTo}</p>}
              {complaint.compensation && (
                <p className="mt-1 text-[12.5px] text-accent">Compensation: {complaint.compensation}</p>
              )}
            </div>
          </div>

          {complaint.notes.length > 0 && (
            <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
              {complaint.notes.map((note, index) => (
                <p key={index} className="text-[12.5px] text-ink-soft">
                  <span className="font-mono text-ink-dim">{note.at}</span> — {note.by}: {note.text}
                </p>
              ))}
            </div>
          )}

          {complaint.status !== 'resolved' && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
              {complaint.status === 'open' && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    dispatch({ type: 'UPDATE_COMPLAINT', complaintId: complaint.id, status: 'assigned', assignedTo: 'Branch Manager Demo' })
                    push({ title: 'Complaint assigned', description: `${complaint.id} assigned to Branch Manager Demo`, tone: 'info' })
                  }}
                >
                  Assign
                </Button>
              )}
              <input
                value={noteDraft[complaint.id] ?? ''}
                onChange={(event) => setNoteDraft((current) => ({ ...current, [complaint.id]: event.target.value }))}
                placeholder="Add internal note…"
                className="min-w-[160px] flex-1 rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-1.5 text-[13px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  const note = noteDraft[complaint.id]?.trim()
                  if (!note) return
                  dispatch({ type: 'UPDATE_COMPLAINT', complaintId: complaint.id, note })
                  setNoteDraft((current) => ({ ...current, [complaint.id]: '' }))
                }}
              >
                Add Note
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  dispatch({
                    type: 'UPDATE_COMPLAINT',
                    complaintId: complaint.id,
                    status: 'resolved',
                    compensation: '20 EGP discount — next order',
                    note: 'Resolved with goodwill compensation.',
                  })
                  push({ title: 'Complaint resolved', description: `${complaint.id} marked resolved`, tone: 'success' })
                }}
              >
                Resolve + Compensate
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
