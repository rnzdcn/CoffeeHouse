import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY })
      toast.success('Product created')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useUpdateProductMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Omit<Product, 'id'>>) =>
      api.patch<Product>(`/products/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY })
      toast.success('Product updated')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useDeleteProductMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/products/${id}`),
    onSuccess: (_, id) => {
      qc.setQueryData<Product[]>(KEY, (prev) => prev?.filter((p) => p.id !== id) ?? [])
      qc.invalidateQueries({ queryKey: KEY })
      toast.success('Product deleted')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useToggleAvailabilityMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch<Product>(`/products/${id}/availability`),
    onSuccess: (product) => {
      qc.invalidateQueries({ queryKey: KEY })
      toast.success(product.available ? 'Marked as available' : 'Marked as unavailable')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
