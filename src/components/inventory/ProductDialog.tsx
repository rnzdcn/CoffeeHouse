import { useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X } from 'lucide-react'
import { useCategoriesQuery } from '@/hooks/useCategories'
import type { Product } from '@/lib/mockData'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// ─── Schema ───────────────────────────────────────────────────────────────────

const positiveNumber = (label: string) =>
  z.string()
    .min(1, `${label} is required`)
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, `${label} must be greater than 0`)

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  price: positiveNumber('Price'),
  cost: positiveNumber('Cost'),
  imageUrl: z.string().min(1, 'Image is required'),
  available: z.boolean(),
})

export type FormState = z.infer<typeof schema>

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

// ─── Field error ──────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-[11px] text-destructive mt-1">{message}</p>
}

// ─── Image uploader ───────────────────────────────────────────────────────────

const ACCEPTED = ['image/png', 'image/jpeg']
const MAX_BYTES = 5 * 1024 * 1024

type ImageUploaderProps = {
  value: string
  onChange: (url: string) => void
  onFileChange: (file: File | null) => void
}

function ImageUploader({ value, onChange, onFileChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = (file: File) => {
    setError(null)
    if (!ACCEPTED.includes(file.type)) {
      setError('Only PNG and JPEG images are accepted.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('Image must be under 5 MB.')
      return
    }
    const preview = URL.createObjectURL(file)
    onChange(preview)
    onFileChange(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (value.startsWith('blob:')) URL.revokeObjectURL(value)
    onChange('')
    onFileChange(null)
    setError(null)
  }

  const isPending = value.startsWith('blob:')

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative h-32 rounded-xl border-2 border-dashed overflow-hidden cursor-pointer transition-all duration-150',
          value
            ? 'border-solid border-border'
            : isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
        )}
      >
        {value ? (
          <>
            <img src={value} alt="Product preview" className="w-full h-full object-contain bg-muted/40" />
            {isPending && (
              <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-center">
                <span className="text-white text-[10px] font-medium">Will upload on save</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors duration-150"
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground select-none px-4 text-center">
            <Upload
              size={20}
              className={cn('transition-transform duration-150', isDragging && 'scale-110 text-primary')}
            />
            <p className="text-xs leading-snug">
              <span className="font-medium text-foreground">Click or drag & drop</span> to upload
              <br />
              PNG or JPEG · max 5 MB
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) processFile(file)
          e.target.value = ''
        }}
      />

      {error && <p className="text-[11px] text-destructive mt-1.5">{error}</p>}
    </div>
  )
}

// ─── Dialog ───────────────────────────────────────────────────────────────────

type ProductDialogProps = {
  open: boolean
  onClose: () => void
  onSubmit: (form: FormState, file?: File) => void
  initial?: FormState
  title: string
}

export function ProductDialog({ open, onClose, onSubmit, initial = EMPTY_FORM, title }: ProductDialogProps) {
  const { data: apiCategories = [] } = useCategoriesQuery()
  const [imageFile, setImageFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormState>({
    resolver: zodResolver(schema),
    defaultValues: initial,
  })

  const imageUrl = watch('imageUrl')

  const onValid = (data: FormState) => {
    onSubmit(data, imageFile ?? undefined)
    onClose()
  }

  const roundField = (name: 'price' | 'cost') => (e: React.FocusEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    if (!isNaN(v)) setValue(name, v.toFixed(2), { shouldValidate: true })
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} className="max-w-md">
      <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-4" noValidate>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Name</Label>
            <Input
              {...register('name')}
              placeholder="Espresso"
              autoFocus
              className="h-9 text-sm"
            />
            <FieldError message={errors.name?.message} />
          </div>

          <div>
            <Label>Category</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="data-[size=default]:h-9 w-full rounded-xl bg-muted/40 border-border text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary/60">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiCategories.map((c) => (
                      <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.category?.message} />
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <textarea
            {...register('description')}
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
            <Label>Price (₱)</Label>
            <Input
              {...register('price')}
              type="number"
              step="0.01"
              onWheel={(e) => e.currentTarget.blur()}
              onBlur={roundField('price')}
              placeholder="0.00"
              className="h-9 text-sm"
            />
            <FieldError message={errors.price?.message} />
          </div>
          <div>
            <Label>Cost (₱)</Label>
            <Input
              {...register('cost')}
              type="number"
              step="0.01"
              onWheel={(e) => e.currentTarget.blur()}
              onBlur={roundField('cost')}
              placeholder="0.00"
              className="h-9 text-sm"
            />
            <FieldError message={errors.cost?.message} />
          </div>
        </div>

        <div>
          <Label>Image</Label>
          <ImageUploader
            value={imageUrl ?? ''}
            onChange={(url) => setValue('imageUrl', url, { shouldValidate: true })}
            onFileChange={setImageFile}
          />
          <FieldError message={errors.imageUrl?.message} />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register('available')}
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
