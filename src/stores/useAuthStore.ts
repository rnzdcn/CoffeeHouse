import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'admin' | 'cashier' | 'kitchen'

export type User = {
  name: string
  email: string
  role: Role
  avatar: string
}

type AuthStore = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@cafe.com': {
    password: 'admin123',
    user: {
      name: 'Alex Rivera',
      email: 'admin@cafe.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    },
  },
  'cashier@cafe.com': {
    password: 'cashier123',
    user: {
      name: 'Maria Santos',
      email: 'cashier@cafe.com',
      role: 'cashier',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    },
  },
  'kitchen@cafe.com': {
    password: 'kitchen123',
    user: {
      name: 'James Cook',
      email: 'kitchen@cafe.com',
      role: 'kitchen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    },
  },
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, password) => {
        const entry = MOCK_USERS[email.trim().toLowerCase()]
        if (entry && entry.password === password) {
          set({ user: entry.user, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    { name: 'coffeehouse-auth' }
  )
)
