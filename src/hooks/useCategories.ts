import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ApiCategory } from '@/lib/types'

const KEY = ['categories']

export function useCategoriesQuery() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api.get<ApiCategory[]>('/categories'),
  })
}

export function useCreateCategoryMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<ApiCategory, 'id'>) => api.post<ApiCategory>('/categories', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useUpdateCategoryMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Omit<ApiCategory, 'id'>>) =>
      api.patch<ApiCategory>(`/categories/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteCategoryMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY })
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
