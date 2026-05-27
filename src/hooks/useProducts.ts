import { useQuery } from '@tanstack/react-query'
import { api, normalizeProduct } from '@/lib/api'
import type { Product } from '@/lib/mockData'

export function useProducts(category: string, search = '') {
  return useQuery({
    queryKey: ['products', 'available', category, search],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (category !== 'all') params.set('category', category)
      if (search.trim()) params.set('search', search.trim())
      const products = await api.get<Product[]>(`/products?${params}`)
      return products.filter((p) => p.available).map(normalizeProduct)
    },
    staleTime: 30_000,
  })
}
