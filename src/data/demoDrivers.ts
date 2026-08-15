export type DriverAvailability = 'available' | 'on-delivery' | 'offline'

export interface DemoDriver {
  id: string
  name: string
  branchId: string
  availability: DriverAvailability
  deliveriesToday: number
}

export const INITIAL_DRIVERS: DemoDriver[] = [
  { id: 'drv-01', name: 'Driver Demo 01', branchId: 'br-downtown', availability: 'available', deliveriesToday: 9 },
  { id: 'drv-02', name: 'Driver Demo 02', branchId: 'br-downtown', availability: 'on-delivery', deliveriesToday: 7 },
  { id: 'drv-03', name: 'Driver Demo 03', branchId: 'br-nasrcity', availability: 'available', deliveriesToday: 11 },
  { id: 'drv-04', name: 'Driver Demo 04', branchId: 'br-maadi', availability: 'on-delivery', deliveriesToday: 8 },
  { id: 'drv-05', name: 'Driver Demo 05', branchId: 'br-heliopolis', availability: 'offline', deliveriesToday: 5 },
  { id: 'drv-06', name: 'Driver Demo 06', branchId: 'br-downtown', availability: 'available', deliveriesToday: 6 },
]
