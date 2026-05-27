import { useCategoriesQuery } from '@/hooks/useCategories'
import { cn } from '@/lib/utils'

type CategoryTabsProps = {
  active: string
  onChange: (id: string) => void
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const { data: categories = [], isLoading } = useCategoriesQuery()

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-28 rounded-xl bg-muted animate-pulse shrink-0" />
        ))}
      </div>
    )
  }

  const tabs = [
    { id: 'all', label: 'All menu', emoji: '🍽️' },
    ...categories.map((c) => ({ id: c.slug, label: c.name, emoji: c.emoji })),
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium shrink-0',
            'transition-all duration-150 border',
            active === tab.id
              ? 'border-primary/60 bg-primary/10 text-primary'
              : 'border-transparent bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <span className="text-base leading-none">{tab.emoji}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
