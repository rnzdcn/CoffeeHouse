import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { DashboardStats, HourlySale, TopItem } from '@/lib/types'

export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => api.get<DashboardStats>('/dashboard/stats'),
    refetchInterval: 60_000,
  })
}

export function useHourlySalesQuery() {
  return useQuery({
    queryKey: ['dashboard', 'hourly-sales'],
    queryFn: () => api.get<HourlySale[]>('/dashboard/hourly-sales'),
    refetchInterval: 60_000,
  })
}

export function useTopItemsQuery() {
  return useQuery({
    queryKey: ['dashboard', 'top-items'],
    queryFn: () => api.get<TopItem[]>('/dashboard/top-items'),
    refetchInterval: 60_000,
  })
}
