import { Clock, CheckCircle2, ChefHat, RefreshCw } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { useOrdersQuery, useUpdateOrderStatusMutation } from '@/hooks/useOrders'
import type { Order, OrderStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    dot: 'bg-yellow-500',
  },
  preparing: {
    label: 'Preparing',
    icon: ChefHat,
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/20',
    dot: 'bg-primary',
  },
  ready: {
    label: 'Ready',
    icon: CheckCircle2,
    color: 'text-green-500',
    bg: 'bg-green-500/10 border-green-500/20',
    dot: 'bg-green-500',
  },
}

const NEXT_STATUS: Record<string, OrderStatus> = {
  pending: 'preparing',
  preparing: 'ready',
}

function formatRelativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (diff < 1) return 'just now'
  if (diff < 60) return `${diff} min ago`
  return `${Math.floor(diff / 60)}h ago`
}

function OrderCard({
  order,
  onStatusChange,
  isPending,
}: {
  order: Order
  onStatusChange: (id: string, status: OrderStatus) => void
  isPending: boolean
}) {
  const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
  if (!cfg) return null

  return (
    <div
      className={cn(
        'bg-card rounded-2xl border p-3.5 lg:p-4 flex flex-col gap-3 transition-all duration-200',
        cfg.bg
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-heading font-bold text-foreground text-sm lg:text-base">
            {order.orderNumber}
          </span>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {formatRelativeTime(order.createdAt)}
          </p>
        </div>
        <div
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border',
            cfg.bg,
            cfg.color
          )}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
          {cfg.label}
        </div>
      </div>

      <ul className="space-y-1">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-xs lg:text-sm">
            <span className="text-muted-foreground">×{item.qty}</span>
            <span className="text-foreground">{item.name}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-border/40 pt-2">
        <span className="text-xs lg:text-sm font-semibold text-foreground">
          ${order.total.toFixed(2)}
        </span>
        {order.status !== 'ready' ? (
          <button
            onClick={() => onStatusChange(order.id, NEXT_STATUS[order.status])}
            disabled={isPending}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold',
              'bg-primary text-white hover:bg-primary/90 active:scale-[0.97] transition-all duration-150',
              'disabled:opacity-60 disabled:pointer-events-none'
            )}
          >
            <cfg.icon size={12} />
            {order.status === 'pending' ? 'Start' : 'Ready'}
          </button>
        ) : (
          <div className="flex items-center gap-1 text-[11px] font-medium text-green-500">
            <CheckCircle2 size={13} />
            Done
          </div>
        )}
      </div>
    </div>
  )
}

export default function KitchenPage() {
  const { data: allOrders = [], refetch, isFetching } = useOrdersQuery()
  const updateStatus = useUpdateOrderStatusMutation()

  const orders = allOrders.filter((o) => o.status !== 'completed')

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateStatus.mutate({ id, status })
  }

  const pending = orders.filter((o) => o.status === 'pending')
  const preparing = orders.filter((o) => o.status === 'preparing')
  const ready = orders.filter((o) => o.status === 'ready')
  const activeOrders = orders.filter((o) => o.status !== 'ready').length

  const columns = [
    { status: 'pending' as OrderStatus, label: 'Pending', dot: 'bg-yellow-500', items: pending },
    { status: 'preparing' as OrderStatus, label: 'Preparing', dot: 'bg-primary', items: preparing },
    { status: 'ready' as OrderStatus, label: 'Ready', dot: 'bg-green-500', items: ready },
  ]

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex items-center justify-between px-4 lg:px-6 pt-4 lg:pt-6 pb-4 shrink-0">
          <div>
            <h1 className="font-heading font-bold text-foreground text-base lg:text-xl">
              Kitchen Display
            </h1>
            <p className="text-muted-foreground text-xs lg:text-sm mt-0.5">
              {activeOrders} active order{activeOrders !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-xl border border-border text-xs lg:text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
          >
            <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-6">
          <div className="grid grid-cols-3 gap-3 lg:gap-5 h-full">
            {columns.map(({ status, label, dot, items }) => (
              <div key={status} className="flex flex-col min-h-0">
                <div className="flex items-center gap-2 mb-3 shrink-0">
                  <span className={cn('w-2 h-2 rounded-full shrink-0', dot)} />
                  <h2 className="font-heading font-semibold text-foreground text-xs lg:text-sm truncate">
                    {label}
                  </h2>
                  <span className="ml-auto text-[11px] text-muted-foreground bg-muted rounded-full px-2 py-0.5 shrink-0">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {items.map((o) => (
                    <OrderCard
                      key={o.id}
                      order={o}
                      onStatusChange={handleStatusChange}
                      isPending={updateStatus.isPending}
                    />
                  ))}
                  {items.length === 0 && (
                    <p className="text-center py-8 text-xs text-muted-foreground">
                      No {label.toLowerCase()} orders
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
