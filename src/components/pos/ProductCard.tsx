import { useState } from 'react'
import { ShoppingBag, ChevronDown } from 'lucide-react'
import type { Product } from '@/lib/mockData'
import { useCartStore } from '@/stores/useCartStore'
import { SugarIceSelector } from './SugarIceSelector'
import { cn } from '@/lib/utils'

const SUGAR_OPTIONS = ['20%', '40%', '60%']
const ICE_OPTIONS = ['20%', '40%', '60%']

type ProductCardProps = {
  product: Product
  isExpanded: boolean
  onExpand: () => void
  onCollapse: () => void
}

export function ProductCard({ product, isExpanded, onExpand, onCollapse }: ProductCardProps) {
  const [sugar, setSugar] = useState('40%')
  const [ice, setIce] = useState('40%')
  const addItem = useCartStore((s) => s.addItem)

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      notes: '',
      sugar,
      ice,
      imageUrl: product.imageUrl,
    })
    onCollapse()
  }

  return (
    <div
      className={cn(
        'bg-card rounded-2xl border overflow-hidden',
        'transition-[border-color,box-shadow] duration-200',
        isExpanded
          ? 'border-primary/40 shadow-lg shadow-primary/5'
          : 'border-border hover:border-border/80 hover:shadow-md'
      )}
    >
      {/* Static top section */}
      <div className="flex gap-3 p-4">
        <div className="shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-[88px] h-[88px] rounded-xl object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-foreground text-sm leading-snug truncate">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="font-heading font-bold text-foreground text-base">
              ${product.price.toFixed(2)}
            </span>
            <button
              onClick={isExpanded ? onCollapse : onExpand}
              className={cn(
                'flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full',
                'transition-colors duration-150',
                isExpanded
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {isExpanded ? 'Close' : 'Details'}
              <ChevronDown
                size={13}
                className={cn(
                  'transition-transform duration-300 ease-in-out',
                  isExpanded ? 'rotate-180' : 'rotate-0'
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/*
        Expandable section.
        Uses the CSS grid-template-rows trick so height animates smoothly
        without needing to know the content's pixel height in advance.
        grid-rows-[0fr] → grid-rows-[1fr] collapses/expands the inner div
        while overflow:hidden clips it.
      */}
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden min-h-0">
          <div
            className={cn(
              'px-4 pb-4 pt-3 space-y-3 border-t border-border/60',
              'transition-opacity duration-200',
              isExpanded ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="flex flex-wrap gap-3">
              <SugarIceSelector
                label="Sugar"
                options={SUGAR_OPTIONS}
                value={sugar}
                onChange={setSugar}
              />
              <SugarIceSelector
                label="Ice"
                options={ICE_OPTIONS}
                value={ice}
                onChange={setIce}
              />
            </div>
            <button
              onClick={handleAdd}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold',
                'bg-primary text-primary-foreground',
                'hover:bg-primary/90 active:scale-[0.98]',
                'shadow-sm shadow-primary/30',
                'transition-[background-color,transform] duration-150'
              )}
            >
              <ShoppingBag size={15} />
              Add to billing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
