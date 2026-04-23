import { useState } from 'react'
import type { Product } from '@/lib/mockData'
import { ProductCard } from './ProductCard'

type ProductGridProps = {
  products: Product[]
  isLoading: boolean
}

const SKELETON_COUNT = 6

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-start">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-[88px] h-[88px] rounded-xl bg-muted shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3.5 bg-muted rounded-full w-3/4" />
                <div className="h-3 bg-muted rounded-full w-full" />
                <div className="h-3 bg-muted rounded-full w-2/3" />
                <div className="h-5 bg-muted rounded-full w-1/3 mt-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">☕</span>
        <p className="font-heading font-semibold text-foreground">No items found</p>
        <p className="text-sm text-muted-foreground mt-1">Try a different category or search</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-start">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isExpanded={expandedId === product.id}
          onExpand={() => setExpandedId(product.id)}
          onCollapse={() => setExpandedId(null)}
        />
      ))}
    </div>
  )
}
