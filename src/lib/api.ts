import { useAuthStore } from '@/stores/useAuthStore'

// Empty string = same origin (Vite proxy in dev). Full URL for production.
const BASE_URL: string = import.meta.env.VITE_API_URL || ''

// TypeORM returns DECIMAL columns as strings — coerce them to numbers.
export function normalizeProduct<T extends { price: unknown; cost: unknown }>(p: T): T {
  return { ...p, price: Number(p.price), cost: Number(p.cost) }
}

export function normalizeOrder<T extends { total: unknown; items: { unitPrice: unknown }[] }>(o: T): T {
  return {
    ...o,
    total: Number(o.total),
    items: o.items.map((i) => ({ ...i, unitPrice: Number(i.unitPrice) })),
  }
}

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const { accessToken, refreshToken, setTokens, logout } = useAuthStore.getState()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
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

    logout()
    throw new Error('Session expired. Please log in again.')
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
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
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
