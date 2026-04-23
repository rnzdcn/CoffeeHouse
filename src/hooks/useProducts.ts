import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/lib/mockData'
import { products } from '@/lib/mockData'

const fetchProducts = async (category: string, search: string): Promise<Product[]> => {
  await new Promise((r) => setTimeout(r, 250))
  let result = category === 'all' ? products : products.filter((p) => p.category === category)
  if (search.trim()) {
    const q = search.trim().toLowerCase()
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    )
  }
  return result
}

export function useProducts(category: string, search = '') {
  return useQuery({
    queryKey: ['products', category, search],
    queryFn: () => fetchProducts(category, search),
    staleTime: 30_000,
  })
}
