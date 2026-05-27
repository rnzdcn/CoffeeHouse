import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/hooks/useCategories'
import type { ApiCategory } from '@/lib/types'
import { CategoryDialog, categoryToForm, EMPTY_CAT } from './CategoryDialog'
import { DeleteDialog } from './DeleteDialog'
import { cn } from '@/lib/utils'

export function CategoriesSection() {
  const { data: categories = [], isLoading } = useCategoriesQuery()
  const createMutation = useCreateCategoryMutation()
  const updateMutation = useUpdateCategoryMutation()
  const deleteMutation = useDeleteCategoryMutation()

  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ApiCategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ApiCategory | null>(null)

  return (
    <div>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 lg:px-5 py-3 border-b border-border/60">
          <div>
            <h2 className="font-heading font-semibold text-foreground text-xs lg:text-sm">
              Categories
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">{categories.length} total</p>
          </div>
          <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1.5">
            <Plus size={14} />
            Add Category
          </Button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-border/40">
              {['Emoji', 'Name', ''].map((h, i) => (
                <th
                  key={i}
                  className={cn(
                    'text-[11px] text-muted-foreground font-medium py-2.5 px-3 text-left',
                    i === 0 && 'pl-4 lg:pl-5 w-16',
                    i === 3 && 'pr-4 lg:pr-5 text-right'
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {[0, 1, 2, 3].map((j) => (
                    <td key={j} className="px-3 py-4">
                      <div className="h-4 bg-muted rounded-lg animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                  No categories yet
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-muted/30 transition-colors duration-150">
                  <td className="pl-4 lg:pl-5 px-3 py-3">
                    <span className="text-xl">{cat.emoji}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-heading font-semibold text-foreground text-xs lg:text-sm">
                      {cat.name}
                    </span>
                  </td>
                  {/*<td className="px-3 py-3">*/}
                  {/*  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">*/}
                  {/*    {cat.slug}*/}
                  {/*  </span>*/}
                  {/*</td>*/}
                  <td className="pr-4 lg:pr-5 pl-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditTarget(cat)}
                        title="Edit"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        title="Delete"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-150"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CategoryDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={(form) => createMutation.mutate(form)}
        title="Add Category"
      />

      <CategoryDialog
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        onSubmit={(form) => editTarget && updateMutation.mutate({ id: editTarget.id, ...form })}
        initial={editTarget ? categoryToForm(editTarget) : EMPTY_CAT}
        title="Edit Category"
      />

      <DeleteDialog
        open={deleteTarget !== null}
        name={deleteTarget?.name ?? null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
