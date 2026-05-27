import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}

export function useUpdateOrderStatusMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      api.patch<Order>(`/orders/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}
