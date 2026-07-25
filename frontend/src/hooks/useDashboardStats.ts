import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import type { DashboardStats } from '@/types'

async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>('/dashboard/stats')
  return data
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 минуты
  })
}