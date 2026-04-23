import { categoryTabs } from '@/lib/mockData'
import { cn } from '@/lib/utils'

type CategoryTabsProps = {
  active: string
  onChange: (id: string) => void
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categoryTabs.map((tab) => (
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
