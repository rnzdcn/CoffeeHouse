import { useMemo } from 'react'
import { useInventoryStore } from '@/stores/useInventoryStore'

export function useProducts(category: string, search = '') {
  const allProducts = useInventoryStore((s) => s.products)

  const data = useMemo(() => {
    let result = allProducts.filter((p) => p.available)
    if (category !== 'all') result = result.filter((p) => p.category === category)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }
    return result
  }, [allProducts, category, search])

  return { data, isLoading: false }
}
