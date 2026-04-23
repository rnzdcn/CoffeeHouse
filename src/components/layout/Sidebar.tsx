import { useNavigate, useRouterState } from '@tanstack/react-router'
import {
  Coffee,
  Home,
  Sun,
  Moon,
  LogOut,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react"
import { useTheme } from '@/components/theme-provider'
import { useAuthStore } from '@/stores/useAuthStore'
import { cn } from '@/lib/utils'

type NavItem = {
  icon: React.ElementType
  label: string
  path: string
  roles?: string[]
}

const NAV_ITEMS: NavItem[] = [
  { icon: Home, label: 'POS', path: '/pos', roles: ['admin', 'cashier'] },
  { icon: ClipboardList, label: 'Kitchen', path: '/kitchen', roles: ['admin', 'kitchen'] },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', roles: ['admin'] },
  // { icon: Heart, label: 'Favorites', path: '#' },
  // { icon: MessageSquare, label: 'Feedback', path: '#' },
  // { icon: Settings, label: 'Settings', path: '#' },
]

export function Sidebar() {
  const navigate = useNavigate()
  const { location } = useRouterState()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuthStore()

  const handleNav = (path: string) => {
    if (path !== '#') navigate({ to: path as '/pos' | '/kitchen' | '/admin' })
  }

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  const filtered = NAV_ITEMS.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role))
  )

  return (
    <aside className="w-16 shrink-0 flex flex-col items-center py-5 gap-4 sidebar-grain border-r border-border/60 relative overflow-hidden">
      {/* Logo */}
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white shadow-md shadow-primary/30">
        <Coffee size={19} strokeWidth={2.2} />
      </div>

      <div className="w-6 h-px bg-border/60" />

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {filtered.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path
          return (
            <button
              key={label}
              onClick={() => handleNav(path)}
              title={label}
              disabled={path === '#'}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150',
                path === '#' && 'opacity-30 cursor-default',
                active
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
            </button>
          )
        })}
      </nav>

      {/* Bottom controls */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle theme"
          className="flex items-center justify-center w-10 h-10 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center justify-center w-10 h-10 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-150"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  )
}
