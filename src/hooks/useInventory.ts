import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, normalizeProduct } from '@/lib/api'
import type { Product } from '@/lib/mockData'

const KEY = ['products']

export function useInventoryQuery() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const products = await api.get<Product[]>('/products')
      return products.map(normalizeProduct)
    },
  })
}

export function useCreateProductMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Product, 'id'>) => api.post<Product>('/products', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useUpdateProductMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Omit<Product, 'id'>>) =>
      api.patch<Product>(`/products/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteProductMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useToggleAvailabilityMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch<Product>(`/products/${id}/availability`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
