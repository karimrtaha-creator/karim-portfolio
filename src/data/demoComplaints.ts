export type ComplaintStatus = 'open' | 'assigned' | 'resolved'
export type ComplaintPriority = 'low' | 'medium' | 'high'

export interface ComplaintNote {
  at: string
  by: string
  text: string
}

export interface DemoComplaint {
  id: string
  orderId: string
  customerName: string
  category: string
  priority: ComplaintPriority
  status: ComplaintStatus
  assignedTo: string | null
  notes: ComplaintNote[]
  compensation: string | null
}

export const INITIAL_COMPLAINTS: DemoComplaint[] = [
  {
    id: 'C-2041',
    orderId: 'ORD-10482',
    customerName: 'Demo Customer',
    category: 'Late Delivery',
    priority: 'high',
    status: 'open',
    assignedTo: null,
    notes: [],
    compensation: null,
  },
  {
    id: 'C-2038',
    orderId: 'ORD-10475',
    customerName: 'Demo Customer',
    category: 'Missing Item',
    priority: 'medium',
    status: 'assigned',
    assignedTo: 'Branch Manager Demo',
    notes: [{ at: '08:15', by: 'General Manager Demo', text: 'Assigned to branch for review.' }],
    compensation: null,
  },
  {
    id: 'C-2029',
    orderId: 'ORD-10461',
    customerName: 'Demo Customer',
    category: 'Order Accuracy',
    priority: 'low',
    status: 'resolved',
    assignedTo: 'Branch Manager Demo',
    notes: [
      { at: 'Yesterday', by: 'Branch Manager Demo', text: 'Confirmed substitution was communicated at order time.' },
      { at: 'Yesterday', by: 'Branch Manager Demo', text: 'Resolved — goodwill discount applied on next order.' },
    ],
    compensation: '20 EGP discount — next order',
  },
]
