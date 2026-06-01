import { Outlet } from '@tanstack/react-router'
import { SessionExpiredDialog } from '@/components/layout/SessionExpiredDialog'
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <SessionExpiredDialog />
      <Toaster position="bottom-right" richColors />
    </>
  )
}
