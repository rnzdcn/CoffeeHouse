import { Coffee } from 'lucide-react'
import { Outlet } from '@tanstack/react-router'
import { SessionExpiredDialog } from '@/components/layout/SessionExpiredDialog'
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout() {
  return (
    <>
      <div className="md:hidden fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-primary/30 mb-6">
          <Coffee size={32} className="text-white" />
        </div>
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">Screen Too Small</h2>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
          CoffeeHouse POS is designed for tablets and larger screens. Please use a device with a screen width of at least 768px.
        </p>
      </div>
      <Outlet />
      <SessionExpiredDialog />
      <Toaster position="bottom-right" richColors />
    </>
  )
}
