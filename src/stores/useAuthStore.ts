import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'admin' | 'cashier' | 'kitchen'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
}

type AuthStore = {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isSessionExpired: boolean
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setSessionExpired: () => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isSessionExpired: false,
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true, isSessionExpired: false }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      setSessionExpired: () =>
        set({ isSessionExpired: true }),
      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isSessionExpired: false }),
    }),
    {
      name: 'coffeehouse-auth-v2',
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
)
