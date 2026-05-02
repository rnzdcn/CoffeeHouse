import { DollarSign, ShoppingBag, TrendingUp, Award } from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Sidebar } from '@/components/layout/Sidebar'
import { mockOrders } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const STATS = [
  {
    label: 'Total Sales Today',
    value: '$1,284.50',
    change: '+12.4%',
    positive: true,
    icon: DollarSign,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    label: 'Orders Count',
    value: '47',
    change: '+8 from yesterday',
    positive: true,
    icon: ShoppingBag,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Avg Order Value',
    value: '$27.33',
    change: '+2.1%',
    positive: true,
    icon: TrendingUp,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    label: 'Top Item',
    value: 'Cappuccino',
    change: '14 sold today',
    positive: true,
    icon: Award,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
]

const HOURLY_SALES = [
  { hour: '8am', sales: 48 },
  { hour: '9am', sales: 124 },
  { hour: '10am', sales: 98 },
  { hour: '11am', sales: 176 },
  { hour: '12pm', sales: 214 },
  { hour: '1pm', sales: 189 },
  { hour: '2pm', sales: 143 },
  { hour: '3pm', sales: 167 },
  { hour: '4pm', sales: 201 },
  { hour: '5pm', sales: 138 },
  { hour: '6pm', sales: 87 },
]

const TOP_ITEMS = [
  { name: 'Cappuccino', sold: 14 },
  { name: 'Latte', sold: 11 },
  { name: 'Cold Brew', sold: 9 },
  { name: 'Espresso', sold: 8 },
  { name: 'Affogato', sold: 5 },
]

const RECENT_ORDERS = [
  ...mockOrders,
  {
    id: 'o6',
    orderNumber: '#1006',
    items: [{ name: 'Affogato', qty: 2 }, { name: 'Espresso', qty: 1 }],
    status: 'ready' as const,
    time: '15 min ago',
    total: 16.5,
  },
  {
    id: 'o7',
    orderNumber: '#1007',
    items: [{ name: 'Caramel Latte', qty: 2 }],
    status: 'ready' as const,
    time: '18 min ago',
    total: 10.4,
  },
]

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  preparing: 'bg-primary/10 text-primary border-primary/20',
  ready: 'bg-green-500/10 text-green-500 border-green-500/20',
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg">
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <p className="font-heading font-semibold text-foreground text-sm">
        ${payload[0].value}
      </p>
    </div>
  )
}

function TruncatedTick({ x, y, payload }: any) {
  const max = 12
  const text = payload.value.length > max ? payload.value.slice(0, max) + '…' : payload.value
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fontSize={10} fill="var(--color-muted-foreground)">
      {text}
    </text>
  )
}

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg">
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <p className="font-heading font-semibold text-foreground text-sm">
        {payload[0].value} sold
      </p>
    </div>
  )
}

export default function AdminPage() {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="px-4 lg:px-6 pt-4 lg:pt-6 pb-8">
          {/* Header */}
          <div className="mb-5 lg:mb-7">
            <h1 className="font-heading font-bold text-foreground text-base lg:text-xl">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-xs lg:text-sm mt-0.5">
              Wednesday, April 23, 2026
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 mb-5 lg:mb-6">
            {STATS.map(({ label, value, change, positive, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] lg:text-xs text-muted-foreground font-medium leading-snug">
                    {label}
                  </p>
                  <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center shrink-0', bg)}>
                    <Icon size={14} className={color} />
                  </div>
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground text-lg lg:text-2xl">
                    {value}
                  </p>
                  <p className={cn('text-[11px] mt-1', positive ? 'text-green-500' : 'text-destructive')}>
                    {change}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 lg:gap-4 mb-5 lg:mb-6">
            {/* Hourly sales area chart */}
            <div className="xl:col-span-2 bg-card rounded-2xl border border-border p-4 lg:p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-heading font-semibold text-foreground text-xs lg:text-sm">
                    Sales Today
                  </h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Hourly revenue</p>
                </div>
                <span className="text-[11px] font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                  +12.4%
                </span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={HOURLY_SALES} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#salesGradient)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                    isAnimationActive
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top items bar chart */}
            <div className="bg-card rounded-2xl border border-border p-4 lg:p-5">
              <div className="mb-4">
                <h2 className="font-heading font-semibold text-foreground text-xs lg:text-sm">
                  Top Items
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">Units sold today</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={TOP_ITEMS} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={<TruncatedTick />}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip content={<BarTooltip />} />
                  <Bar
                    dataKey="sold"
                    fill="var(--color-primary)"
                    radius={[0, 4, 4, 0]}
                    isAnimationActive
                    animationDuration={900}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent orders table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 lg:px-5 py-3 border-b border-border/60">
              <h2 className="font-heading font-semibold text-foreground text-xs lg:text-sm">
                Recent Orders
              </h2>
              <span className="text-[11px] text-muted-foreground">
                {RECENT_ORDERS.length} orders
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead>
                  <tr className="border-b border-border/40">
                    {['Order', 'Time', 'Items', 'Status', 'Amount'].map((h, i) => (
                      <th
                        key={h}
                        className={cn(
                          'text-[11px] text-muted-foreground font-medium py-2.5 px-3',
                          i === 0 && 'pl-4 lg:pl-5 text-left',
                          i === 4 && 'pr-4 lg:pr-5 text-right',
                          i > 0 && i < 4 && 'text-left'
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {RECENT_ORDERS.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors duration-150">
                      <td className="pl-4 lg:pl-5 pr-3 py-3">
                        <span className="font-heading font-semibold text-foreground text-xs lg:text-sm">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                          {order.time}
                        </span>
                      </td>
                      <td className="px-3 py-3 max-w-[180px]">
                        <p className="text-xs lg:text-sm text-foreground truncate">
                          {order.items.map((i) => `${i.name} ×${i.qty}`).join(', ')}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            'text-[11px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap',
                            STATUS_STYLES[order.status]
                          )}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="pr-4 lg:pr-5 pl-3 py-3 text-right">
                        <span className="font-semibold text-foreground text-xs lg:text-sm">
                          ${order.total.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
