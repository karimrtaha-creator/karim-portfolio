export interface DemoZone {
  id: string
  name: string
  branchId: string
  active: boolean
  fee: number
}

export const INITIAL_ZONES: DemoZone[] = [
  { id: 'z-a', name: 'Zone A', branchId: 'br-downtown', active: true, fee: 35 },
  { id: 'z-b', name: 'Zone B', branchId: 'br-downtown', active: true, fee: 45 },
  { id: 'z-c', name: 'Zone C', branchId: 'br-downtown', active: false, fee: 55 },
  { id: 'z-d', name: 'Zone D', branchId: 'br-nasrcity', active: true, fee: 30 },
  { id: 'z-e', name: 'Zone E', branchId: 'br-nasrcity', active: true, fee: 40 },
  { id: 'z-f', name: 'Zone F', branchId: 'br-maadi', active: true, fee: 35 },
  { id: 'z-g', name: 'Zone G', branchId: 'br-heliopolis', active: true, fee: 40 },
]
