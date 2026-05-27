import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY })
      toast.success('Category created')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useUpdateCategoryMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Omit<ApiCategory, 'id'>>) =>
      api.patch<ApiCategory>(`/categories/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY })
      toast.success('Category updated')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useDeleteCategoryMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/categories/${id}`),
    onSuccess: (_, id) => {
      qc.setQueryData<ApiCategory[]>(KEY, (prev) => prev?.filter((c) => c.id !== id) ?? [])
      qc.invalidateQueries({ queryKey: KEY })
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Category deleted')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
