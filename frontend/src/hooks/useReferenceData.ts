import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import type { CountryReference, CityReference } from '@/types'

// ======================= Страны =======================
async function fetchCountries(region?: string): Promise<CountryReference[]> {
  const params = region ? { region } : {}
  const { data } = await api.get<{ countries: CountryReference[] }>('/reference/countries', { params })
  return data.countries
}

export function useCountries(region?: string) {
  return useQuery({
    queryKey: ['countries', region],
    queryFn: () => fetchCountries(region),
    staleTime: 24 * 60 * 60 * 1000, // кэш на сутки – справочник статичен
  })
}

// ======================= Города =======================
async function fetchCities(countryCode: string): Promise<CityReference[]> {
  const { data } = await api.get<{ cities: CityReference[] }>('/reference/cities', {
    params: { country_code: countryCode },
  })
  return data.cities
}

export function useCities(countryCode: string | null) {
  return useQuery({
    queryKey: ['cities', countryCode],
    queryFn: () => fetchCities(countryCode!),
    enabled: !!countryCode, // запрос только когда выбран код страны
    staleTime: 24 * 60 * 60 * 1000,
  })
}