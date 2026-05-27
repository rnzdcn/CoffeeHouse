import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/lib/mockData'
import { useCartStore } from '@/stores/useCartStore'
import { cn } from '@/lib/utils'

const SUGAR_OPTIONS = ['0%', '25%', '50%', '75%', '100%']
const TEMP_OPTIONS = ['Ice', 'Hot'] as const

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [sugar, setSugar] = useState('50%')
  const [temp, setTemp] = useState<'Ice' | 'Hot'>('Ice')
  const addItem = useCartStore((s) => s.addItem)

  const isCoffee = product.category === 'coffee'

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      notes: '',
      sugar,
      ice: isCoffee ? temp : '',
      imageUrl: product.imageUrl,
    })
  }

  return (
    <div className={cn(
      'bg-card rounded-2xl border border-border overflow-hidden flex flex-col',
      'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8',
      'transition-all duration-200 group'
    )}>
      {/* Image */}
      <div className="relative h-36 overflow-hidden bg-muted shrink-0">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl select-none">☕</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <span className="absolute bottom-2.5 right-2.5 font-heading font-bold text-white text-sm
          bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full leading-none">
          ${product.price.toFixed(2)}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3.5 gap-3">

        {/* Name + description */}
        <div>
          <h3 className="font-heading font-semibold text-foreground text-sm leading-snug truncate">
            {product.name}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Sugar */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Sugar
          </p>
          <div className="flex gap-1">
            {SUGAR_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setSugar(opt)}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-[10px] font-semibold border transition-all duration-150',
                  sugar === opt
                    ? 'bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/30'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted/60'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Temperature — coffee only */}
        {isCoffee && (
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Temperature
            </p>
            <div className="flex p-0.5 bg-muted rounded-xl gap-0.5">
              {TEMP_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setTemp(opt)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[10px]',
                    'text-xs font-semibold transition-all duration-150',
                    temp === opt
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="text-sm leading-none">{opt === 'Ice' ? '🧊' : '🔥'}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add button */}
        <button
          onClick={handleAdd}
          className={cn(
            'mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl',
            'text-xs font-bold tracking-wide',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90 active:scale-[0.98]',
            'shadow-sm shadow-primary/30',
            'transition-[background-color,transform] duration-150'
          )}
        >
          <ShoppingBag size={13} />
          Add to order
        </button>
      </div>
    </div>
  )
}
