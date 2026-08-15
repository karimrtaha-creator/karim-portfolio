export type CouponStatus = 'valid' | 'used' | 'pending' | 'duplicate'

export interface DemoCoupon {
  code: string
  status: CouponStatus
  capturedAt: string
  value: number
}

export const INITIAL_COUPONS: DemoCoupon[] = [
  { code: 'DEMO-4821', status: 'valid', capturedAt: '09:12', value: 50 },
  { code: 'TEST-1938', status: 'used', capturedAt: '09:15', value: 30 },
  { code: 'SAMPLE-7720', status: 'pending', capturedAt: '09:21', value: 40 },
  { code: 'DEMO-3305', status: 'valid', capturedAt: '09:26', value: 50 },
  { code: 'TEST-5561', status: 'used', capturedAt: '09:33', value: 25 },
  { code: 'SAMPLE-9102', status: 'valid', capturedAt: '09:40', value: 60 },
  { code: 'DEMO-4821', status: 'duplicate', capturedAt: '09:47', value: 50 },
  { code: 'TEST-2287', status: 'pending', capturedAt: '09:52', value: 35 },
  { code: 'SAMPLE-6634', status: 'used', capturedAt: '10:01', value: 45 },
  { code: 'DEMO-8813', status: 'valid', capturedAt: '10:08', value: 50 },
]
