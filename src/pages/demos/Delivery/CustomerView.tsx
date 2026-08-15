import { useMemo, useState } from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { DEMO_MENU } from '@/data/demoMenu'
import { formatEGP } from '@/lib/format'
import { STATUS_LABEL, STATUS_TONE, orderGrandTotal } from './orderHelpers'
import type { DeliveryDispatch, DeliveryState } from './state'

const CUSTOMER_NAME = 'You (Demo)'

export function CustomerView({ state, dispatch }: { state: DeliveryState; dispatch: DeliveryDispatch }) {
  const { push } = useToast()
  const [branchId, setBranchId] = useState(state.branches[0].id)
  const [zoneId, setZoneId] = useState(state.zones.find((z) => z.branchId === branchId && z.active)?.id ?? '')
  const [cart, setCart] = useState<Record<string, number>>({})

  const zonesForBranch = state.zones.filter((zone) => zone.branchId === branchId)
  const selectedZone = state.zones.find((zone) => zone.id === zoneId)
  const deliveryFee = selectedZone?.fee ?? 0

  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ item: DEMO_MENU.find((m) => m.id === id)!, qty })),
    [cart],
  )
  const itemsTotal = cartLines.reduce((sum, line) => sum + line.item.price * line.qty, 0)
  const grandTotal = itemsTotal + deliveryFee

  const myOrders = state.orders.filter((order) => order.customerName === CUSTOMER_NAME)

  const adjustQty = (id: string, delta: number) =>
    setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + delta) }))

  const placeOrder = () => {
    if (cartLines.length === 0 || !selectedZone) return
    dispatch({
      type: 'CREATE_ORDER',
      branchId,
      zoneId,
      items: cartLines.map((line) => ({ menuItemId: line.item.id, quantity: line.qty })),
      deliveryFee,
      customerName: CUSTOMER_NAME,
    })
    push({ title: 'Order placed', description: 'Your order was sent to the branch.', tone: 'success' })
    setCart({})
  }

  const categories = Array.from(new Set(DEMO_MENU.map((item) => item.category)))

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="mb-1 block text-[12px] text-ink-dim">Branch</label>
            <select
              value={branchId}
              onChange={(event) => {
                const nextBranch = event.target.value
                setBranchId(nextBranch)
                setZoneId(state.zones.find((z) => z.branchId === nextBranch && z.active)?.id ?? '')
              }}
              className="rounded-[var(--radius-sm)] border border-border bg-surface px-2.5 py-1.5 text-[13px] text-ink focus:border-accent focus:outline-none"
            >
              {state.branches
                .filter((b) => b.availability.delivery)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[12px] text-ink-dim">Delivery zone</label>
            <select
              value={zoneId}
              onChange={(event) => setZoneId(event.target.value)}
              className="rounded-[var(--radius-sm)] border border-border bg-surface px-2.5 py-1.5 text-[13px] text-ink focus:border-accent focus:outline-none"
            >
              {zonesForBranch.map((zone) => (
                <option key={zone.id} value={zone.id} disabled={!zone.active}>
                  {zone.name} {zone.active ? `(${zone.fee} EGP)` : '(unavailable)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {categories.map((category) => (
          <div key={category}>
            <h3 className="mb-2 text-sm font-semibold text-ink">{category}</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {DEMO_MENU.filter((item) => item.category === category).map((item) => (
                <Card key={item.id} className="flex items-center justify-between p-3.5">
                  <div>
                    <p className="text-[13.5px] font-medium text-ink">{item.name}</p>
                    <p className="text-[12.5px] text-ink-dim">{formatEGP(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustQty(item.id, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-ink-soft hover:border-ink-dim"
                      aria-label={`Remove one ${item.name}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-4 text-center text-[13px] tabular-nums">{cart[item.id] ?? 0}</span>
                    <button
                      onClick={() => adjustQty(item.id, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-ink-soft hover:border-ink-dim"
                      aria-label={`Add one ${item.name}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-ink">Your cart</h3>
          </div>
          {cartLines.length === 0 ? (
            <p className="text-[13px] text-ink-dim">Add items from the menu to get started.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {cartLines.map((line) => (
                <li key={line.item.id} className="flex items-center justify-between text-[13px] text-ink-soft">
                  <span>
                    {line.qty}× {line.item.name}
                  </span>
                  <span className="font-mono">{formatEGP(line.item.price * line.qty)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-[13px]">
            <div className="flex justify-between text-ink-soft">
              <span>Items</span>
              <span className="font-mono">{formatEGP(itemsTotal)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Delivery fee</span>
              <span className="font-mono">{formatEGP(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-[14px] font-semibold text-ink">
              <span>Total</span>
              <span className="font-mono">{formatEGP(grandTotal)}</span>
            </div>
          </div>
          <Button className="mt-4 w-full" disabled={cartLines.length === 0} onClick={placeOrder}>
            Place Order
          </Button>
        </Card>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-ink">Your orders</h3>
          {myOrders.length === 0 ? (
            <p className="text-[13px] text-ink-dim">Orders you place in this demo will appear here.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {myOrders.map((order) => (
                <Card key={order.id} className="p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[13px] font-semibold text-ink">{order.id}</span>
                    <Badge tone={STATUS_TONE[order.status]}>{STATUS_LABEL[order.status]}</Badge>
                  </div>
                  <p className="mt-1 text-[12.5px] text-ink-dim">Total {formatEGP(orderGrandTotal(order))}</p>
                  {(order.status === 'out_for_delivery' || order.status === 'otp_verification') && (
                    <p className="mt-1.5 rounded-[var(--radius-sm)] bg-accent-soft px-2.5 py-1.5 font-mono text-[12.5px] text-accent-ink">
                      Delivery code: {order.otp} — give this to your driver to confirm handoff. Switch to the Driver
                      tab to try it.
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
