import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import type { VisitedCountry } from '@/types'

// ================== Запрос списка ==================
async function fetchVisitedCountries(): Promise<VisitedCountry[]> {
  const { data } = await api.get<{ countries: VisitedCountry[] }>('/visited-countries')
  return data.countries
}

export function useVisitedCountries() {
  return useQuery({
    queryKey: ['visited-countries'],
    queryFn: fetchVisitedCountries,
    staleTime: 2 * 60 * 1000,
  })
}

// ================== Добавление страны ==================
async function addCountry(country_code: string): Promise<VisitedCountry> {
  const { data } = await api.post<VisitedCountry>('/visited-countries', { country_code })
  return data
}

export function useAddVisitedCountry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addCountry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['visited-countries'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// ================== Удаление страны (с каскадом городов) ==================
async function deleteCountry(id: string): Promise<{ cascaded_cities_deleted: number }> {
  const { data } = await api.delete<{ cascaded_cities_deleted: number }>(`/visited-countries/${id}`)
  return data
}

export function useDeleteVisitedCountry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteCountry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['visited-countries'] })
      qc.invalidateQueries({ queryKey: ['visited-cities'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}