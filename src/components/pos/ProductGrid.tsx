import type { Product } from '@/lib/mockData'
import { ProductCard } from './ProductCard'

type ProductGridProps = {
  products: Product[]
  isLoading: boolean
}

const SKELETON_COUNT = 6

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
            <div className="h-36 bg-muted" />
            <div className="p-3.5 space-y-3">
              <div className="space-y-1.5">
                <div className="h-3.5 bg-muted rounded-full w-3/4" />
                <div className="h-3 bg-muted rounded-full w-full" />
              </div>
              <div className="h-7 bg-muted rounded-lg" />
              <div className="h-8 bg-muted rounded-xl" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  )
}
