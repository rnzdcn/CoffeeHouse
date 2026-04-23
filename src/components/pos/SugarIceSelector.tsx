import { cn } from '@/lib/utils'

type SugarIceSelectorProps = {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}

export function SugarIceSelector({ label, options, value, onChange }: SugarIceSelectorProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2 font-medium">{label}</p>
      <div className="flex gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150',
              value === opt
                ? 'border-primary text-primary bg-primary/10 ring-1 ring-primary/40'
                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
