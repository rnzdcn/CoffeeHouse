import { useState } from 'react'
import { Search, ShoppingCart } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { BillsPanel } from '@/components/layout/BillsPanel'
import { CategoryTabs } from '@/components/pos/CategoryTabs'
import { ProductGrid } from '@/components/pos/ProductGrid'
import { useProducts } from '@/hooks/useProducts'
import { Input } from '@/components/ui/input'
import { useCartStore, cartSubtotal } from '@/stores/useCartStore'
import { cn } from '@/lib/utils'

export default function PosPage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const { data: products = [], isLoading } = useProducts(category, search)
  const { items } = useCartStore()
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = cartSubtotal(items)

  const categoryLabel =
    category === 'all'
      ? 'All'
      : category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header — stacks on narrow screens, row on wider */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-2.5 lg:gap-6 px-4 lg:px-6 pt-4 lg:pt-6 pb-3 lg:pb-4">
          <div className="shrink-0">
            <h1 className="font-heading font-bold text-foreground text-base lg:text-xl leading-tight">
              Welcome to Coffeehouse
            </h1>
            <p className="text-muted-foreground text-xs lg:text-sm mt-0.5">Choose the category</p>
          </div>
          <div className="w-full lg:flex-1 lg:max-w-sm relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search menu…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="px-4 lg:px-6 pb-3">
          <CategoryTabs active={category} onChange={setCategory} />
        </div>

        {/* Section heading */}
        <div className="flex items-center justify-between px-4 lg:px-6 pb-2.5">
          <h2 className="font-heading font-semibold text-foreground text-xs lg:text-sm">
            {categoryLabel} menu
          </h2>
          <span className="text-xs text-muted-foreground">
            {isLoading ? '…' : `${products.length} result${products.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-4">
          <ProductGrid products={products} isLoading={isLoading} />
        </div>

        {/* Mobile cart trigger bar — hidden on desktop */}
        <div className="lg:hidden shrink-0 px-4 py-3 border-t border-border/60 bg-background/95 backdrop-blur-sm">
          <button
            onClick={() => setCartOpen(true)}
            className={cn(
              'w-full flex items-center justify-between',
              'py-3 px-4 rounded-2xl',
              'bg-gradient-to-r from-primary to-primary/80 text-white',
              'shadow-lg shadow-primary/25 active:scale-[0.98]',
              'transition-all duration-150'
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white text-primary text-[10px] font-bold flex items-center justify-center leading-none">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold">
                {itemCount === 0 ? 'Cart is empty' : `${itemCount} item${itemCount !== 1 ? 's' : ''}`}
              </span>
            </div>
            {itemCount > 0 && (
              <span className="text-sm font-bold">₱{subtotal.toFixed(2)}</span>
            )}
          </button>
        </div>
      </main>

      <BillsPanel isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
