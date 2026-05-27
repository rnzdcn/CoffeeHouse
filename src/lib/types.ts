export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed'

export type OrderItem = {
  id: string
  productId: string
  name: string
  qty: number
  unitPrice: number
  notes?: string
  sugar?: string
  ice?: string
}

export type Order = {
  id: string
  orderNumber: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  createdAt: string
  updatedAt: string
}

export type DashboardStats = {
  totalSales: number
  orderCount: number
  avgOrderValue: number
  topItem: string | { name: string; qty: number }
}

export type HourlySale = {
  hour: string
  sales: number
}

export type TopItem = {
  name: string
  sold: number
}
