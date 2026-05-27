import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type DeleteDialogProps = {
  open: boolean
  name: string | null
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

export function DeleteDialog({ open, name, onClose, onConfirm, isPending }: DeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="Delete">
      <p className="text-sm text-muted-foreground mb-5">
        Are you sure you want to delete{' '}
        <span className="font-semibold text-foreground">{name}</span>? This cannot be undone.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          disabled={isPending}
          onClick={() => { onConfirm(); onClose() }}
        >
          {isPending ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
    </Dialog>
  )
}
