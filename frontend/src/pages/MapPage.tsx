import TravelMap from '@/components/TravelMap'
import type { MapMarker } from '@/components/TravelMap'

// Временные тестовые маркеры — позже будут загружаться из API
const testMarkers: MapMarker[] = [
  { id: '1', latitude: 48.8566, longitude: 2.3522, name: 'Paris', type: 'city' },
  { id: '2', latitude: 51.5074, longitude: -0.1278, name: 'London', type: 'city' },
  { id: '3', latitude: 52.52, longitude: 13.405, name: 'Berlin', type: 'city' },
]

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <TravelMap markers={testMarkers} className="h-full w-full" />
    </div>
  )
}