import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
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
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  useInventoryQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '@/hooks/useInventory'
import { useCategoriesQuery } from '@/hooks/useCategories'
import type { Product } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { ProductDialog, EMPTY_FORM, productToForm, type FormState } from './ProductDialog'
import { DeleteDialog } from './DeleteDialog'

function SortIcon({ state }: { state: false | 'asc' | 'desc' }) {
  if (state === 'asc') return <ChevronUp size={12} className="shrink-0" />
  if (state === 'desc') return <ChevronDown size={12} className="shrink-0" />
  return <ChevronsUpDown size={12} className="shrink-0 opacity-40" />
}

const col = createColumnHelper<Product>()

export function ProductsSection() {
  const qc = useQueryClient()
  const { data: products = [], isLoading } = useInventoryQuery()
  const { data: filterCategories = [] } = useCategoriesQuery()
  const createMutation = useCreateProductMutation()
  const updateMutation = useUpdateProductMutation()
  const deleteMutation = useDeleteProductMutation()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const resetPage = () => setPagination((p) => ({ ...p, pageIndex: 0 }))

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
            {filterCategories.find((c) => c.slug === info.getValue())?.name ?? info.getValue()}
          </span>
        ),
      }),

      col.accessor('price', {
        header: 'Price',
        cell: (info) => (
          <span className="font-semibold text-foreground text-xs lg:text-sm">
            ₱{info.getValue().toFixed(2)}
          </span>
        ),
      }),

      col.accessor('cost', {
        header: 'Cost',
        cell: (info) => (
          <span className="text-xs lg:text-sm text-muted-foreground">
            ₱{info.getValue().toFixed(2)}
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
              <span className={cn('text-xs font-medium', m >= 60 ? 'text-green-500' : m >= 40 ? 'text-yellow-500' : 'text-destructive')}>
                {m.toFixed(1)}%
              </span>
            )
          },
        }
      ),

      col.accessor('available', {
        header: 'Status',
        cell: ({ row: { original: p } }) => (
          <span
            className={cn(
              'text-[11px] font-medium px-2.5 py-1 rounded-full border',
              p.available
                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                : 'bg-muted text-muted-foreground border-border'
            )}
          >
            {p.available ? 'Available' : 'Unavailable'}
          </span>
        ),
        sortingFn: (a, b) => Number(a.original.available) - Number(b.original.available),
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
    [filterCategories]
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

  const buildPayload = (form: FormState) => ({
    name: form.name.trim(),
    description: form.description?.trim() ?? '',
    category: form.category,
    price: parseFloat(form.price),
    cost: parseFloat(form.cost),
    imageUrl: form.imageUrl.startsWith('blob:') ? '' : form.imageUrl.trim(),
    available: form.available,
  })

  const buildFormData = (payload: ReturnType<typeof buildPayload>, file: File) => {
    const fd = new FormData()
    Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v)))
    fd.append('image', file)
    return fd
  }

  const handleAdd = (form: FormState, file?: File) => {
    const payload = buildPayload(form)
    if (file) {
      api.post('/products', buildFormData(payload, file))
        .then(() => {
          qc.invalidateQueries({ queryKey: ['products'] })
          toast.success('Product created')
        })
        .catch((err: Error) => toast.error(err.message))
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleEdit = (form: FormState, file?: File) => {
    if (!editTarget) return
    const payload = buildPayload(form)
    if (file) {
      api.patch(`/products/${editTarget.id}`, buildFormData(payload, file))
        .then(() => {
          qc.invalidateQueries({ queryKey: ['products'] })
          toast.success('Product updated')
        })
        .catch((err: Error) => toast.error(err.message))
    } else {
      updateMutation.mutate({ id: editTarget.id, ...payload })
    }
  }

  return (
    <>
      {/* Stats */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 mb-5 lg:mb-6">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card rounded-2xl border border-border p-3.5 lg:p-4 flex flex-col gap-2.5 lg:gap-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] lg:text-xs text-muted-foreground font-medium leading-snug">{label}</p>
              <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center shrink-0', bg)}>
                <Icon size={14} className={color} />
              </div>
            </div>
            {isLoading ? (
              <div className="h-7 w-16 bg-muted rounded-xl animate-pulse" />
            ) : (
              <p className="font-heading font-bold text-foreground text-base lg:text-2xl truncate">{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative w-full sm:w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search products…"
            value={globalFilter}
            onChange={(e) => { setGlobalFilter(e.target.value); resetPage() }}
            className="h-9 pl-8 text-xs lg:text-sm"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All', emoji: '🍽️' },
            ...filterCategories.map((c) => ({ id: c.slug, label: c.name, emoji: c.emoji })),
          ].map((tab) => (
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
          <div>
            <h2 className="font-heading font-semibold text-foreground text-xs lg:text-sm">Products</h2>
            <span className="text-[11px] text-muted-foreground">{rows.length} items</span>
          </div>
          <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1.5">
            <Plus size={14} />
            Add Product
          </Button>
        </div>

        {/* Mobile: card list */}
        <div className="lg:hidden divide-y divide-border/40">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-12 h-12 rounded-xl bg-muted animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-muted rounded-lg animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded-lg animate-pulse w-1/2" />
                </div>
              </div>
            ))
          ) : rows.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No products found</div>
          ) : (
            rows.map((row) => {
              const p = row.original
              const margin = ((p.price - p.cost) / p.price) * 100
              return (
                <div key={row.id} className="flex items-center gap-3 px-4 py-3">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Package size={18} className="text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-heading font-semibold text-sm text-foreground truncate">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-medium px-1.5 py-px rounded-full bg-muted text-muted-foreground whitespace-nowrap">
                        {filterCategories.find((c) => c.slug === p.category)?.name ?? p.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs font-semibold text-foreground">₱{p.price.toFixed(2)}</span>
                      <span className={cn('text-[11px] font-medium', margin >= 60 ? 'text-green-500' : margin >= 40 ? 'text-yellow-500' : 'text-destructive')}>
                        {margin.toFixed(1)}%
                      </span>
                      <span className={cn(
                        'text-[10px] font-medium px-1.5 py-px rounded-full border',
                        p.available
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : 'bg-muted text-muted-foreground border-border'
                      )}>
                        {p.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => setEditTarget(p)}
                      title="Edit"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      title="Delete"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-150"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Desktop: table */}
        <div className="hidden lg:block overflow-x-auto">
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
                          i === 0 && 'pl-5',
                          i === hg.headers.length - 1 && 'pr-5 text-right',
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((_, j) => (
                      <td key={j} className="px-3 py-4">
                        <div className="h-4 bg-muted rounded-lg animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
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
                          i === 0 && 'pl-5',
                          i === row.getVisibleCells().length - 1 && 'pr-5'
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
            onChange={(e) => { table.setPageSize(Number(e.target.value)); resetPage() }}
            className="text-[11px] text-muted-foreground bg-transparent border-none outline-none cursor-pointer hover:text-foreground transition-colors duration-150"
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>{s} / page</option>
            ))}
          </select>
        </div>
      </div>

      <ProductDialog
        key={addOpen ? 'add-open' : 'add-closed'}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        title="Add Product"
      />

      <ProductDialog
        key={editTarget?.id ?? 'edit-closed'}
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
        initial={editTarget ? productToForm(editTarget) : EMPTY_FORM}
        title="Edit Product"
      />

      <DeleteDialog
        open={deleteTarget !== null}
        name={deleteTarget?.name ?? null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
