import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type DialogProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  React.useEffect(() => {
    if (!open) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-sm mx-4 bg-card rounded-2xl shadow-2xl',
          'border border-border p-6',
          className
        )}
      >
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h3 className="font-heading text-base font-semibold text-foreground">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="ml-auto -mr-1 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
          >
            <X size={17} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
