export interface ServiceAvailability {
  delivery: boolean
  takeaway: boolean
  dineIn: boolean
}

export interface DemoBranch {
  id: string
  name: string
  availability: ServiceAvailability
  todaysOrders: number
  pending: number
  completed: number
}

export const INITIAL_BRANCHES: DemoBranch[] = [
  {
    id: 'br-downtown',
    name: 'Downtown Branch',
    availability: { delivery: true, takeaway: true, dineIn: false },
    todaysOrders: 84,
    pending: 7,
    completed: 71,
  },
  {
    id: 'br-nasrcity',
    name: 'Nasr City Branch',
    availability: { delivery: true, takeaway: true, dineIn: true },
    todaysOrders: 61,
    pending: 4,
    completed: 55,
  },
  {
    id: 'br-maadi',
    name: 'Maadi Branch',
    availability: { delivery: true, takeaway: false, dineIn: true },
    todaysOrders: 47,
    pending: 3,
    completed: 42,
  },
  {
    id: 'br-heliopolis',
    name: 'Heliopolis Branch',
    availability: { delivery: true, takeaway: true, dineIn: true },
    todaysOrders: 58,
    pending: 6,
    completed: 49,
  },
  {
    id: 'br-alex',
    name: 'Alexandria Branch',
    availability: { delivery: false, takeaway: true, dineIn: true },
    todaysOrders: 33,
    pending: 2,
    completed: 30,
  },
]
