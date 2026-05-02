import { createRouter, createRoute, createRootRoute, redirect } from '@tanstack/react-router'
import RootLayout from './routes/__root'
import LoginPage from './routes/login'
import PosPage from './routes/pos'
import KitchenPage from './routes/kitchen'
import AdminPage from './routes/admin'
import InventoryPage from './routes/inventory'
import { useAuthStore } from './stores/useAuthStore'

const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState()
    if (!isAuthenticated) throw redirect({ to: '/login' })
    if (user?.role === 'kitchen') throw redirect({ to: '/kitchen' })
    throw redirect({ to: '/pos' })
  },
  component: () => null,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState()
    if (isAuthenticated) {
      if (user?.role === 'kitchen') throw redirect({ to: '/kitchen' })
      throw redirect({ to: '/pos' })
    }
  },
  component: LoginPage,
})

const posRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pos',
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState()
    if (!isAuthenticated) throw redirect({ to: '/login' })
    if (user?.role === 'kitchen') throw redirect({ to: '/kitchen' })
  },
  component: PosPage,
})

const kitchenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kitchen',
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState()
    if (!isAuthenticated) throw redirect({ to: '/login' })
    if (user?.role === 'cashier') throw redirect({ to: '/pos' })
  },
  component: KitchenPage,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState()
    if (!isAuthenticated) throw redirect({ to: '/login' })
    if (user?.role !== 'admin') throw redirect({ to: '/pos' })
  },
  component: AdminPage,
})

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory',
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState()
    if (!isAuthenticated) throw redirect({ to: '/login' })
    if (user?.role !== 'admin') throw redirect({ to: '/pos' })
  },
  component: InventoryPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  posRoute,
  kitchenRoute,
  adminRoute,
  inventoryRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
