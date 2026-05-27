import { useState } from 'react'
import { useCategoriesQuery } from '@/hooks/useCategories'
import type { Category, Product } from '@/lib/mockData'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export type FormState = {
  name: string
  description: string
  category: Category
  price: string
  cost: string
  imageUrl: string
  available: boolean
}

export const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  category: '',
  price: '',
  cost: '',
  imageUrl: '',
  available: true,
}

export function productToForm(p: Product): FormState {
  return {
    name: p.name,
    description: p.description,
    category: p.category,
    price: String(p.price),
    cost: String(p.cost),
    imageUrl: p.imageUrl,
    available: p.available,
  }
}

type ProductDialogProps = {
  open: boolean
  onClose: () => void
  onSubmit: (form: FormState) => void
  initial?: FormState
  title: string
}

export function ProductDialog({ open, onClose, onSubmit, initial = EMPTY_FORM, title }: ProductDialogProps) {
  const { data: apiCategories = [] } = useCategoriesQuery()
  const [form, setForm] = useState<FormState>(initial)
  const patch = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price || !form.cost) return
    onSubmit(form)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} className="max-w-md" key={open ? 'open' : 'closed'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder="Espresso"
              required
              autoFocus
              className="h-9 text-sm"
            />
          </div>
          <div>
            <Label>Category</Label>
            <select
              value={form.category}
              onChange={(e) => patch({ category: e.target.value as Category })}
              className={cn(
                'flex h-9 w-full rounded-xl border border-border bg-muted/40 px-3',
                'text-sm text-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60',
                'transition-all duration-150'
              )}
            >
              {apiCategories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <textarea
            value={form.description}
            onChange={(e) => patch({ description: e.target.value })}
            placeholder="Short product description…"
            rows={2}
            className={cn(
              'flex w-full rounded-xl border border-border bg-muted/40 px-4 py-2.5',
              'text-sm text-foreground placeholder:text-muted-foreground resize-none',
              'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60',
              'transition-all duration-150'
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Price ($)</Label>
            <Input
              type="number" min="0" step="0.01"
              value={form.price}
              onChange={(e) => patch({ price: e.target.value })}
              placeholder="0.00"
              required
              className="h-9 text-sm"
            />
          </div>
          <div>
            <Label>Cost ($)</Label>
            <Input
              type="number" min="0" step="0.01"
              value={form.cost}
              onChange={(e) => patch({ cost: e.target.value })}
              placeholder="0.00"
              required
              className="h-9 text-sm"
            />
          </div>
        </div>

        <div>
          <Label>Image URL</Label>
          <Input
            value={form.imageUrl}
            onChange={(e) => patch({ imageUrl: e.target.value })}
            placeholder="https://…"
            className="h-9 text-sm"
          />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => patch({ available: e.target.checked })}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-sm text-foreground/80">Available for sale</span>
        </label>

        <div className="flex gap-2 pt-1">
          <Button type="button" variant="outline" size="sm" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" className="flex-1">
            Save
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
