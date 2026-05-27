import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { ProductsSection } from '@/components/inventory/ProductsSection'
import { CategoriesSection } from '@/components/inventory/CategoriesSection'
import { cn } from '@/lib/utils'

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="px-4 lg:px-6 pt-4 lg:pt-6 pb-8">

          <div className="flex items-start justify-between mb-5 lg:mb-7">
            <div>
              <h1 className="font-heading font-bold text-foreground text-base lg:text-xl">
                Inventory
              </h1>
              <p className="text-muted-foreground text-xs lg:text-sm mt-0.5">
                Manage products and categories
              </p>
            </div>
            <div className="flex items-center gap-1 bg-muted/60 rounded-xl p-1">
              {(['products', 'categories'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-150',
                    activeTab === tab
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'categories' ? <CategoriesSection /> : <ProductsSection />}

        </div>
      </main>
    </div>
  )
}
