import { useState } from 'react'
import type { ApiCategory } from '@/lib/types'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export type CategoryForm = { name: string; slug: string; emoji: string }

export const EMPTY_CAT: CategoryForm = { name: '', slug: '', emoji: '' }

export function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function categoryToForm(c: ApiCategory): CategoryForm {
  return { name: c.name, slug: c.slug, emoji: c.emoji }
}

type CategoryDialogProps = {
  open: boolean
  onClose: () => void
  onSubmit: (form: CategoryForm) => void
  initial?: CategoryForm
  title: string
}

export function CategoryDialog({ open, onClose, onSubmit, initial = EMPTY_CAT, title }: CategoryDialogProps) {
  const [form, setForm] = useState<CategoryForm>(initial)
  const patch = (p: Partial<CategoryForm>) => setForm((f) => ({ ...f, ...p }))

  const handleNameChange = (name: string) => patch({ name, slug: toSlug(name) })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.slug.trim()) return
    onSubmit(form)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} key={open ? 'open' : 'closed'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label>Name</Label>
          <Input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Coffee"
            required
            autoFocus
            className="h-9 text-sm"
          />
        </div>
        <div>
          <Label>Slug</Label>
          <Input
            value={form.slug}
            onChange={(e) => patch({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            placeholder="coffee"
            required
            className="h-9 text-sm font-mono"
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Used as the category identifier in products.
          </p>
        </div>
        <div>
          <Label>Emoji</Label>
          <Input
            value={form.emoji}
            onChange={(e) => patch({ emoji: e.target.value })}
            placeholder="☕"
            className="h-9 text-sm"
          />
        </div>
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
