import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from '@tanstack/react-table'
import {
  Search,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog } from '@/components/ui/dialog'
import { useInventoryStore } from '@/stores/useInventoryStore'
import { categoryTabs, type Category, type Product } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const CATEGORY_LABELS: Record<string, string> = {
  coffee: 'Coffee',
  milky: 'Milky milk',
  bobaan: 'Bobaan',
  'ice-cream': 'Ice cream',
  dessert: 'Dessert',
}

// ─── Form helpers ────────────────────────────────────────────────────────────

type FormState = {
  name: string
  description: string
  category: Category
  price: string
  cost: string
  imageUrl: string
  available: boolean
}

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  category: 'coffee',
  price: '',
  cost: '',
  imageUrl: '',
  available: true,
}

function productToForm(p: Product): FormState {
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

// ─── Product dialog ───────────────────────────────────────────────────────────

type ProductDialogProps = {
  open: boolean
  onClose: () => void
  onSubmit: (form: FormState) => void
  initial?: FormState
  title: string
}

function ProductDialog({ open, onClose, onSubmit, initial = EMPTY_FORM, title }: ProductDialogProps) {
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
              {categoryTabs.filter((t) => t.id !== 'all').map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
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

// ─── Delete dialog ────────────────────────────────────────────────────────────

function DeleteDialog({
  open,
  product,
  onClose,
  onConfirm,
}: {
  open: boolean
  product: Product | null
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onClose={onClose} title="Delete Product">
      <p className="text-sm text-muted-foreground mb-5">
        Are you sure you want to delete{' '}
        <span className="font-semibold text-foreground">{product?.name}</span>? This cannot be
        undone.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => { onConfirm(); onClose() }}
        >
          Delete
        </Button>
      </div>
    </Dialog>
  )
}

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ state }: { state: false | 'asc' | 'desc' }) {
  if (state === 'asc') return <ChevronUp size={12} className="shrink-0" />
  if (state === 'desc') return <ChevronDown size={12} className="shrink-0" />
  return <ChevronsUpDown size={12} className="shrink-0 opacity-40" />
}

// ─── Column helper ────────────────────────────────────────────────────────────

const col = createColumnHelper<Product>()

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleAvailability } =
    useInventoryStore()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  // Reset to page 0 when filters/category change
  const resetPage = () => setPagination((p) => ({ ...p, pageIndex: 0 }))

  // Filter by category client-side before handing to table
  const tableData = useMemo(
    () => (activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory)),
    [products, activeCategory]
  )

  const columns = useMemo(
    () => [
      col.display({
        id: 'product',
        header: 'Product',
        cell: ({ row: { original: p } }) => (
          <div className="flex items-center gap-3">
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Package size={16} className="text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-heading font-semibold text-foreground text-xs lg:text-sm truncate">
                {p.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                {p.description}
              </p>
            </div>
          </div>
        ),
        enableSorting: false,
      }),

      col.accessor('category', {
        header: 'Category',
        cell: (info) => (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {CATEGORY_LABELS[info.getValue()] ?? info.getValue()}
          </span>
        ),
        filterFn: 'equals',
      }),

      col.accessor('price', {
        header: 'Price',
        cell: (info) => (
          <span className="font-semibold text-foreground text-xs lg:text-sm">
            ${info.getValue().toFixed(2)}
          </span>
        ),
      }),

      col.accessor('cost', {
        header: 'Cost',
        cell: (info) => (
          <span className="text-xs lg:text-sm text-muted-foreground">
            ${info.getValue().toFixed(2)}
          </span>
        ),
      }),

      col.accessor(
        (row) => ((row.price - row.cost) / row.price) * 100,
        {
          id: 'margin',
          header: 'Margin',
          cell: (info) => {
            const m = info.getValue()
            return (
              <span
                className={cn(
                  'text-xs font-medium',
                  m >= 60 ? 'text-green-500' : m >= 40 ? 'text-yellow-500' : 'text-destructive'
                )}
              >
                {m.toFixed(1)}%
              </span>
            )
          },
        }
      ),

      col.accessor('available', {
        header: 'Status',
        cell: ({ row: { original: p } }) => (
          <button
            onClick={() => toggleAvailability(p.id)}
            className={cn(
              'text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors duration-150',
              p.available
                ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20'
                : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
            )}
          >
            {p.available ? 'Available' : 'Unavailable'}
          </button>
        ),
        sortingFn: (a, b) =>
          Number(a.original.available) - Number(b.original.available),
      }),

      col.display({
        id: 'actions',
        header: '',
        cell: ({ row: { original: p } }) => (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => setEditTarget(p)}
              title="Edit"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => setDeleteTarget(p)}
              title="Delete"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-150"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [toggleAvailability]
  )

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, columnFilters, globalFilter, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _colId, value: string) => {
      const q = value.toLowerCase()
      return (
        row.original.name.toLowerCase().includes(q) ||
        row.original.description.toLowerCase().includes(q)
      )
    },
  })

  const rows = table.getRowModel().rows

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalCount = products.length
  const availableCount = products.filter((p) => p.available).length
  const avgMargin =
    totalCount > 0
      ? products.reduce((s, p) => s + ((p.price - p.cost) / p.price) * 100, 0) / totalCount
      : 0

  const STATS = [
    { label: 'Total Products', value: totalCount, icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Available', value: availableCount, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Unavailable', value: totalCount - availableCount, icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
    { label: 'Avg Margin', value: `${avgMargin.toFixed(1)}%`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ]

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAdd = (form: FormState) =>
    addProduct({
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price: parseFloat(form.price),
      cost: parseFloat(form.cost),
      imageUrl: form.imageUrl.trim(),
      available: form.available,
    })

  const handleEdit = (form: FormState) => {
    if (!editTarget) return
    updateProduct(editTarget.id, {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price: parseFloat(form.price),
      cost: parseFloat(form.cost),
      imageUrl: form.imageUrl.trim(),
      available: form.available,
    })
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="px-4 lg:px-6 pt-4 lg:pt-6 pb-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-5 lg:mb-7">
            <div>
              <h1 className="font-heading font-bold text-foreground text-base lg:text-xl">
                Inventory
              </h1>
              <p className="text-muted-foreground text-xs lg:text-sm mt-0.5">
                Manage product availability and pricing
              </p>
            </div>
            <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1.5">
              <Plus size={14} />
              Add Product
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 mb-5 lg:mb-6">
            {STATS.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] lg:text-xs text-muted-foreground font-medium leading-snug">{label}</p>
                  <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center shrink-0', bg)}>
                    <Icon size={14} className={color} />
                  </div>
                </div>
                <p className="font-heading font-bold text-foreground text-lg lg:text-2xl">{value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search products…"
                value={globalFilter}
                onChange={(e) => { setGlobalFilter(e.target.value); resetPage() }}
                className="h-9 pl-8 text-xs lg:text-sm"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveCategory(tab.id); resetPage() }}
                  className={cn(
                    'h-9 px-3 rounded-xl text-xs font-medium transition-all duration-150 whitespace-nowrap',
                    activeCategory === tab.id
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {tab.emoji} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 lg:px-5 py-3 border-b border-border/60">
              <h2 className="font-heading font-semibold text-foreground text-xs lg:text-sm">Products</h2>
              <span className="text-[11px] text-muted-foreground">{rows.length} items</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id} className="border-b border-border/40">
                      {hg.headers.map((header, i) => {
                        const canSort = header.column.getCanSort()
                        const sorted = header.column.getIsSorted()
                        return (
                          <th
                            key={header.id}
                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                            className={cn(
                              'text-[11px] text-muted-foreground font-medium py-2.5 px-3 text-left select-none',
                              i === 0 && 'pl-4 lg:pl-5',
                              i === hg.headers.length - 1 && 'pr-4 lg:pr-5 text-right',
                              canSort && 'cursor-pointer hover:text-foreground transition-colors duration-150'
                            )}
                          >
                            <span className="inline-flex items-center gap-1">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {canSort && <SortIcon state={sorted} />}
                            </span>
                          </th>
                        )
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-border/40">
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="py-12 text-center text-sm text-muted-foreground">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/30 transition-colors duration-150">
                        {row.getVisibleCells().map((cell, i) => (
                          <td
                            key={cell.id}
                            className={cn(
                              'px-3 py-3',
                              i === 0 && 'pl-4 lg:pl-5',
                              i === row.getVisibleCells().length - 1 && 'pr-4 lg:pr-5'
                            )}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 lg:px-5 py-3 border-t border-border/60">
              <p className="text-[11px] text-muted-foreground">
                {table.getFilteredRowModel().rows.length === 0
                  ? '0 items'
                  : `${pagination.pageIndex * pagination.pageSize + 1}–${Math.min(
                      (pagination.pageIndex + 1) * pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )} of ${table.getFilteredRowModel().rows.length}`}
              </p>

              {table.getPageCount() > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from({ length: table.getPageCount() }, (_, i) => i).map((i) => (
                    <button
                      key={i}
                      onClick={() => table.setPageIndex(i)}
                      className={cn(
                        'w-7 h-7 rounded-lg text-[11px] font-medium transition-colors duration-150',
                        pagination.pageIndex === i
                          ? 'bg-primary/15 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}

              <select
                value={pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value))
                  resetPage()
                }}
                className="text-[11px] text-muted-foreground bg-transparent border-none outline-none cursor-pointer hover:text-foreground transition-colors duration-150"
              >
                {[5, 10, 20, 50].map((s) => (
                  <option key={s} value={s}>{s} / page</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </main>

      <ProductDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        title="Add Product"
      />

      <ProductDialog
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
        initial={editTarget ? productToForm(editTarget) : EMPTY_FORM}
        title="Edit Product"
      />

      <DeleteDialog
        open={deleteTarget !== null}
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteProduct(deleteTarget.id)}
      />
    </div>
  )
}
