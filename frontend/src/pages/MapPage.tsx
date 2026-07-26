import TravelMap, { type MapMarker } from '@/components/TravelMap'
import { useMapMarkers } from '@/hooks/useMapMarkers'
import Loader from '@/components/Loader'

export default function MapPage() {
  const { data, isLoading } = useMapMarkers()

  if (isLoading) return <Loader text="Загрузка карты..." />

  const markers: MapMarker[] = []
  data?.countries.forEach((c) => {
    // Для стран используем примерные координаты центроидов (можно заменить реальными из API, если добавить)
    // Пока заглушка: показываем в центре Европы (условно). Но лучше добавить координаты в VisitedCountry.
    // Чтобы не усложнять, пропустим страны на карте, оставим только города.
  })
  data?.cities.forEach((city) => {
    markers.push({
      id: city.id,
      latitude: Number(city.latitude),
      longitude: Number(city.longitude),
      name: city.name,
      type: 'city',
    })
  })

  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <TravelMap markers={markers} />
    </div>
  )
}import TravelMap, { type MapMarker } from '@/components/TravelMap'
import { useMapMarkers } from '@/hooks/useMapMarkers'
import Loader from '@/components/Loader'

export default function MapPage() {
  const { data, isLoading } = useMapMarkers()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader text="Загрузка карты..." />
      </div>
    )
  }

  const markers: MapMarker[] = []
  data?.countries.forEach((c) => {
    markers.push({
      id: c.id,
      latitude: c.centroid_lat,
      longitude: c.centroid_lng,
      name: c.name_en,
      type: 'country',
    })
  })
  data?.cities.forEach((city) => {
    markers.push({
      id: city.id,
      latitude: Number(city.latitude),
      longitude: Number(city.longitude),
      name: city.name,
      type: 'city',
    })
  })

  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <TravelMap markers={markers} />
    </div>
  )
}