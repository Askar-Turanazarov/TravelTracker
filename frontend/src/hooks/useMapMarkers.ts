import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import type { VisitedCity } from '@/types'

interface CountryWithCoords {
  id: string
  country_code: string
  name_en: string
  centroid_lat: number
  centroid_lng: number
  added_at: string
}

async function fetchMapData(): Promise<{
  countries: CountryWithCoords[]
  cities: VisitedCity[]
}> {
  const [countriesRes, citiesRes] = await Promise.all([
    api.get<{ countries: CountryWithCoords[] }>('/visited-countries'),
    api.get<{ cities: VisitedCity[] }>('/visited-cities'),
  ])
  return {
    countries: countriesRes.data.countries,
    cities: citiesRes.data.cities,
  }
}

export function useMapMarkers() {
  return useQuery({
    queryKey: ['map-markers'],
    queryFn: fetchMapData,
    staleTime: 2 * 60 * 1000,
  })
}