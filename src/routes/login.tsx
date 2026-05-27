import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Coffee, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuthStore, type User } from '@/stores/useAuthStore'
import { publicPost } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type LoginResponse = {
  accessToken: string
  refreshToken: string
  user: User
}

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  const { mutate: login, isPending, error } = useMutation({
    mutationFn: (creds: { email: string; password: string }) =>
      publicPost<LoginResponse>('/auth/login', creds),
    onSuccess: ({ accessToken, refreshToken, user }) => {
      setAuth(user, accessToken, refreshToken)
      navigate({ to: user.role === 'kitchen' ? '/kitchen' : '/pos' })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <div className="min-h-dvh flex bg-background">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-[#1A1A1C] dark:bg-[#111113]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/5" />
        <div className="absolute inset-0 sidebar-grain" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center relative z-10">
            <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/90 shadow-2xl shadow-primary/40 mx-auto mb-8">
              <Coffee size={40} className="text-white" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-white mb-3 tracking-tight">
              CoffeeHouse
            </h1>
            <p className="text-white/50 font-sans text-base">Premium Point of Sale System</p>
            <div className="flex items-center gap-3 mt-10 justify-center">
              {['☕', '🥛', '🧋', '🍦', '🍰'].map((emoji, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg border border-white/10"
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-white/30 text-xs italic font-sans">
            "Good coffee is a pleasure. Good friends are a treasure."
          </p>
        </div>
      </div>

      {/* Login form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[440px] shrink-0 px-8 py-12">
        <div className="lg:hidden flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/30 mb-8">
          <Coffee size={28} className="text-white" />
        </div>

        <div className="w-full max-w-sm">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-1 text-center lg:text-left">
            Welcome back
          </h2>
          <p className="text-muted-foreground text-sm mb-8 text-center lg:text-left">
            Sign in to your POS account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@cafe.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2.5">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={cn(
                'w-full py-3 rounded-xl font-heading font-semibold text-sm mt-2',
                'bg-gradient-to-r from-primary to-primary/80 text-white',
                'shadow-md shadow-primary/25 hover:shadow-primary/40',
                'hover:from-primary/90 hover:to-primary/70 active:scale-[0.98]',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'transition-all duration-150'
              )}
            >
              {isPending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
