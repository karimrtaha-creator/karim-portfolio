import { useState } from 'react'
import { Building2, Headset, ShoppingBag, Truck, UserCog } from 'lucide-react'
import { DemoPageShell } from '@/components/layout/DemoPageShell'
import { ProductFrame } from '@/components/ui/ProductFrame'
import { Tabs, type TabOption } from '@/components/ui/Tabs'
import { OrderLifecycle } from './OrderLifecycle'
import { CustomerView } from './CustomerView'
import { DispatcherView } from './DispatcherView'
import { DriverView } from './DriverView'
import { BranchManagerView } from './BranchManagerView'
import { GeneralManagerView } from './GeneralManagerView'
import { useDeliveryState, type DeliveryRole } from './state'

const ROLE_OPTIONS: TabOption<DeliveryRole>[] = [
  { value: 'customer', label: 'Customer', icon: <ShoppingBag className="h-3.5 w-3.5" /> },
  { value: 'dispatcher', label: 'Dispatcher', icon: <Headset className="h-3.5 w-3.5" /> },
  { value: 'driver', label: 'Driver', icon: <Truck className="h-3.5 w-3.5" /> },
  { value: 'branch-manager', label: 'Branch Manager', icon: <Building2 className="h-3.5 w-3.5" /> },
  { value: 'general-manager', label: 'General Manager', icon: <UserCog className="h-3.5 w-3.5" /> },
]

export function DeliveryDemo() {
  const [role, setRole] = useState<DeliveryRole>('customer')
  const [state, dispatch] = useDeliveryState()

  return (
    <DemoPageShell slug="delivery-platform">
      <div className="mb-6">
        <OrderLifecycle />
      </div>

      <ProductFrame title="delivery.ops — multi-branch console" accent="accent" actions={<Tabs options={ROLE_OPTIONS} value={role} onChange={setRole} ariaLabel="Switch role view" />}>
        {role === 'customer' && <CustomerView state={state} dispatch={dispatch} />}
        {role === 'dispatcher' && <DispatcherView state={state} dispatch={dispatch} />}
        {role === 'driver' && <DriverView state={state} dispatch={dispatch} />}
        {role === 'branch-manager' && <BranchManagerView state={state} dispatch={dispatch} />}
        {role === 'general-manager' && <GeneralManagerView state={state} dispatch={dispatch} />}
      </ProductFrame>
    </DemoPageShell>
  )
}
