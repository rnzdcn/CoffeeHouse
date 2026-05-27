import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, normalizeOrder } from '@/lib/api'
import type { Order, OrderStatus } from '@/lib/types'

export function useOrdersQuery(params?: { status?: OrderStatus; limit?: number }) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const search = new URLSearchParams()
      if (params?.status) search.set('status', params.status)
      const orders = await api.get<Order[]>(`/orders?${search}`)
      const normalized = orders.map(normalizeOrder)
      return params?.limit ? normalized.slice(0, params.limit) : normalized
    },
  })
}

type CreateOrderItem = {
  productId: string
  qty: number
  notes?: string
  sugar?: string
  ice?: string
}

export function useCreateOrderMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (items: CreateOrderItem[]) => api.post<Order>('/orders', { items }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Order placed successfully')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useUpdateOrderStatusMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      api.patch<Order>(`/orders/${id}/status`, { status }),
    onSuccess: (order) => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      const label: Record<OrderStatus, string> = {
        pending: 'Order marked as pending',
        preparing: 'Order is now preparing',
        ready: 'Order is ready',
        completed: 'Order completed',
      }
      toast.success(label[order.status] ?? 'Order updated')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
