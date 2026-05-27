import { useNavigate } from '@tanstack/react-router'
import { ShieldAlert } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@/components/ui/button'

export function SessionExpiredDialog() {
  const isSessionExpired = useAuthStore((s) => s.isSessionExpired)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  if (!isSessionExpired) return null

  const handleLogin = () => {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-sm mx-4 bg-card rounded-2xl shadow-2xl border border-border p-6 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-destructive/10 mx-auto mb-4">
          <ShieldAlert size={22} className="text-destructive" />
        </div>
        <h3 className="font-heading text-base font-semibold text-foreground mb-1">
          Session Expired
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Your session has expired. Please log in again to continue using CoffeeHouse.
        </p>
        <Button className="w-full" onClick={handleLogin}>
          Log in again
        </Button>
      </div>
    </div>
  )
}
