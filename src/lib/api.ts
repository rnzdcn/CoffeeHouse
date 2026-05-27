import { useAuthStore } from '@/stores/useAuthStore'

// Empty string = same origin (Vite proxy in dev). Full URL for production.
const BASE_URL: string = import.meta.env.VITE_API_URL || ''

// TypeORM returns DECIMAL columns as strings, and relations as nested objects.
export function normalizeProduct<T extends { price: unknown; cost: unknown; category: unknown; imageUrl?: unknown }>(p: T): T {
  const category =
    p.category !== null && typeof p.category === 'object'
      ? (p.category as { slug: string }).slug
      : p.category

  // Relative paths (e.g. /uploads/...) need the API origin prepended
  const imageUrl =
    typeof p.imageUrl === 'string' && p.imageUrl.startsWith('/')
      ? `${BASE_URL}${p.imageUrl}`
      : p.imageUrl

  return { ...p, price: Number(p.price), cost: Number(p.cost), category, imageUrl }
}

type RawOrderItem = {
  id: string
  productId: string
  product?: { name: string }
  name?: string
  qty: number
  unitPrice?: unknown
  subtotal?: unknown
  note?: string | null
  notes?: string | null
  sugar?: string
  ice?: string
}

type RawOrder = {
  id: string
  orderNumber?: string
  status: string
  total: unknown
  createdAt: string
  updatedAt: string
  items: RawOrderItem[]
}

export function normalizeOrder(o: RawOrder) {
  return {
    id: o.id,
    orderNumber: o.orderNumber ?? `#${o.id.slice(0, 6).toUpperCase()}`,
    status: o.status,
    total: Number(o.total),
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    items: o.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      name: i.product?.name ?? i.name ?? '',
      qty: i.qty,
      unitPrice: i.unitPrice != null
        ? Number(i.unitPrice)
        : i.subtotal != null ? Number(i.subtotal) / i.qty : 0,
      notes: i.notes ?? i.note ?? undefined,
      sugar: i.sugar,
      ice: i.ice,
    })),
  }
}

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const { accessToken, refreshToken, setTokens } = useAuthStore.getState()

  const isFormData = init.body instanceof FormData
  const headers: Record<string, string> = {
    // Let the browser set Content-Type automatically for FormData (includes boundary)
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(init.headers as Record<string, string>),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers })

  if (res.status === 401 && retry && refreshToken) {
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (refreshRes.ok) {
      const { accessToken: newAccess, refreshToken: newRefresh } = await refreshRes.json()
      setTokens(newAccess, newRefresh)
      return request<T>(path, init, false)
    }

    // Refresh token is expired — show the session-expired dialog instead of hard-redirecting
    useAuthStore.getState().setSessionExpired()
    throw new Error('session_expired')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? `Request failed: ${res.status}`)
  }

  if (res.status === 204) return null as T
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

export async function publicPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new Error(errBody.message ?? `Request failed: ${res.status}`)
  }
  return res.json()
}
