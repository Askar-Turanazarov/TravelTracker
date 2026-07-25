import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import type { VisitedCity, AddVisitedCityPayload, UpdateVisitedCityPayload } from '@/types'

// ================== Получение списка ==================
async function fetchVisitedCities(country_code?: string): Promise<VisitedCity[]> {
  const params = country_code ? { country_code } : {}
  const { data } = await api.get<{ cities: VisitedCity[] }>('/visited-cities', { params })
  return data.cities
}

export function useVisitedCities(country_code?: string) {
  return useQuery({
    queryKey: ['visited-cities', country_code],
    queryFn: () => fetchVisitedCities(country_code),
    staleTime: 2 * 60 * 1000,
  })
}

// ================== Добавление города ==================
async function addVisitedCity(payload: AddVisitedCityPayload): Promise<VisitedCity> {
  const { data } = await api.post<VisitedCity>('/visited-cities', payload)
  return data
}

export function useAddVisitedCity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addVisitedCity,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['visited-cities'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// ================== Обновление (PATCH) ==================
async function updateVisitedCity({
  id,
  payload,
}: {
  id: string
  payload: UpdateVisitedCityPayload
}): Promise<VisitedCity> {
  const { data } = await api.patch<VisitedCity>(`/visited-cities/${id}`, payload)
  return data
}

export function useUpdateVisitedCity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateVisitedCity,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['visited-cities'] })
    },
  })
}

// ================== Удаление города ==================
async function deleteVisitedCity(id: string): Promise<{ deleted_city_id: string }> {
  const { data } = await api.delete<{ deleted_city_id: string }>(`/visited-cities/${id}`)
  return data
}

export function useDeleteVisitedCity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteVisitedCity,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['visited-cities'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}