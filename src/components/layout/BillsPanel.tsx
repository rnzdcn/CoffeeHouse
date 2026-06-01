import { useState } from 'react'
import { Bell, FileText, Minus, Plus, Trash2, CheckCircle2, Tag, X, ChevronLeft } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCartStore, cartSubtotal } from '@/stores/useCartStore'
import { useCreateOrderMutation } from '@/hooks/useOrders'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const DISCOUNT_RATE = 0.10

type BillsPanelProps = {
  isOpen: boolean
  onClose: () => void
}

export function BillsPanel({ isOpen, onClose }: BillsPanelProps) {
  const { user } = useAuthStore()
  const { items, updateQty, updateNotes, clearCart } = useCartStore()
  const createOrder = useCreateOrderMutation()

  const [notesOpen, setNotesOpen] = useState<string | null>(null)
  const [notesText, setNotesText] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)

  const [discountCode, setDiscountCode] = useState('')
  const [appliedCode, setAppliedCode] = useState<string | null>(null)

  const openNotes = (cartId: string, current: string) => {
    setNotesText(current)
    setNotesOpen(cartId)
  }

  const saveNotes = () => {
    if (notesOpen) updateNotes(notesOpen, notesText)
    setNotesOpen(null)
  }

  const applyDiscount = () => {
    const code = discountCode.trim()
    if (code) {
      setAppliedCode(code)
      setDiscountCode('')
    }
  }

  const removeDiscount = () => setAppliedCode(null)

  const handleCheckout = () => {
    if (items.length === 0) return
    createOrder.mutate(
      items.map((i) => ({
        productId: i.id,
        qty: i.qty,
        notes: i.notes || undefined,
        sugar: i.sugar || undefined,
        ice: i.ice || undefined,
      })),
      {
        onSuccess: () => {
          clearCart()
          setAppliedCode(null)
          setSuccessOpen(true)
          onClose()
        },
      }
    )
  }

  const subtotal = cartSubtotal(items)
  const discount = appliedCode ? subtotal * DISCOUNT_RATE : 0
  const total = subtotal - discount

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      <aside className={cn(
        'flex flex-col border-l border-border/60 bg-card/50',
        // Mobile: fixed right-side drawer with slide transition
        'fixed inset-y-0 right-0 z-50 w-[85vw] max-w-[340px]',
        'transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full',
        // Desktop: static sidebar, always visible
        'lg:relative lg:inset-auto lg:z-auto lg:w-[320px] xl:w-[340px] lg:shrink-0',
        'lg:translate-x-0 lg:shadow-none',
      )}>

        {/* Mobile drawer handle / close row */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border/60 bg-background/80">
          <span className="font-heading font-bold text-sm text-foreground">Your Cart</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Profile header */}
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-border/60">
          <img
            src={
              user?.avatar ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
            }
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
            <p className="text-[11px] text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 relative shrink-0">
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
          </button>
        </div>

        {/* Bills heading */}
        <div className="px-4 py-2.5 flex items-center justify-between">
          <h2 className="font-heading font-bold text-foreground text-sm">Bills</h2>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[11px] text-muted-foreground hover:text-destructive transition-colors duration-150 flex items-center gap-1"
            >
              <Trash2 size={11} />
              Clear
            </button>
          )}
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-4 space-y-0.5 pb-2 min-h-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <span className="text-3xl mb-2.5">🛒</span>
              <p className="text-xs font-medium text-foreground">Cart is empty</p>
              <p className="text-[11px] text-muted-foreground mt-1">Add items from the menu</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartId}
                className="flex items-center gap-2 py-2 border-b border-border/40 last:border-0"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-9 h-9 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                  <span className="text-[10px] text-muted-foreground leading-snug">
                    {[item.sugar && `${item.sugar} sugar`, item.ice].filter(Boolean).join(' · ')}
                  </span>
                  {item.notes && (
                    <p className="text-[10px] text-primary mt-0.5 truncate">"{item.notes}"</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-semibold text-foreground">
                    ₱{(item.price * item.qty).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => openNotes(item.cartId, item.notes)}
                      className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-150"
                      title="Add note"
                    >
                      <FileText size={11} />
                    </button>
                    <button
                      onClick={() => updateQty(item.cartId, item.qty - 1)}
                      className="w-5 h-5 flex items-center justify-center rounded-md bg-muted text-foreground hover:bg-muted/80 transition-colors duration-150"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-[11px] font-semibold w-4 text-center tabular-nums">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.cartId, item.qty + 1)}
                      className="w-5 h-5 flex items-center justify-center rounded-md bg-muted text-foreground hover:bg-muted/80 transition-colors duration-150"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Discount card */}
        <div className="px-4 py-3 border-t border-border/60">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Tag size={11} />
            Discount Card
          </p>
          {appliedCode ? (
            <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
              <div>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400">10% off applied</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{appliedCode}</p>
              </div>
              <button
                onClick={removeDiscount}
                className="w-5 h-5 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-150"
              >
                <X size={11} />
              </button>
            </div>
          ) : (
            <div className="flex gap-1.5">
              <Input
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyDiscount()}
                placeholder="Enter card code…"
                className="h-8 text-xs flex-1"
              />
              <button
                onClick={applyDiscount}
                disabled={!discountCode.trim()}
                className={cn(
                  'h-8 px-3 rounded-xl text-xs font-semibold transition-all duration-150',
                  'bg-primary text-primary-foreground',
                  'hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Totals */}
        {items.length > 0 && (
          <div className="px-4 py-3 border-t border-border/60 space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            {appliedCode && (
              <div className="flex justify-between text-xs border-t border-dashed border-border/60 pt-1.5">
                <span className="text-muted-foreground">Discount (10%)</span>
                <span className="text-green-500 font-medium">-₱{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-heading font-bold text-foreground text-sm border-t border-border/60 pt-1.5">
              <span>Total</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Checkout */}
        <div className="px-4 pb-4 pt-2">
          {createOrder.isError && (
            <p className="text-[11px] text-destructive mb-2 text-center">
              {createOrder.error?.message ?? 'Failed to place order'}
            </p>
          )}
          <button
            disabled={items.length === 0 || createOrder.isPending}
            onClick={handleCheckout}
            className={cn(
              'w-full py-3 rounded-full text-sm font-bold transition-all duration-150',
              'bg-gradient-to-r from-primary to-primary/80 text-white',
              'shadow-lg shadow-primary/25 hover:shadow-primary/40',
              'hover:from-primary/90 hover:to-primary/70 active:scale-[0.98]',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none'
            )}
          >
            {createOrder.isPending ? 'Placing order…' : `Checkout · ₱${total.toFixed(2)}`}
          </button>
        </div>
      </aside>

      {/* Notes dialog */}
      <Dialog open={notesOpen !== null} onClose={() => setNotesOpen(null)} title="Order notes">
        <textarea
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          placeholder="Special instructions, allergies, preferences…"
          className={cn(
            'w-full h-28 resize-none rounded-xl border border-border bg-muted/40 px-4 py-3',
            'text-sm text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60',
            'transition-all duration-150'
          )}
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setNotesOpen(null)}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={saveNotes}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all duration-150"
          >
            Save
          </button>
        </div>
      </Dialog>

      {/* Order success dialog */}
      <Dialog open={successOpen} onClose={() => setSuccessOpen(false)} title="Order placed">
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
            <CheckCircle2 size={24} className="text-green-500" />
          </div>
          <p className="text-sm text-muted-foreground">
            Your order has been sent to the kitchen.
          </p>
        </div>
        <button
          onClick={() => setSuccessOpen(false)}
          className="w-full mt-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all duration-150"
        >
          Done
        </button>
      </Dialog>
    </>
  )
}
