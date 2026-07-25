import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import type { AdminUser, PaginationMeta } from '@/types'

interface AdminUsersResponse {
  users: AdminUser[]
  pagination: PaginationMeta
}

async function fetchAdminUsers(page: number, limit: number): Promise<AdminUsersResponse> {
  const { data } = await api.get<AdminUsersResponse>('/admin/users', {
    params: { page, limit },
  })
  return data
}

export function useAdminUsers(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['admin-users', page, limit],
    queryFn: () => fetchAdminUsers(page, limit),
    staleTime: 60 * 1000, // 1 минута
  })
}