import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// ----- Тип маркера -----
export interface MapMarker {
  id: string
  latitude: number
  longitude: number
  name: string
  type: 'country' | 'city'
}

// ----- Кастомная иконка -----
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// ----- Пропсы -----
interface TravelMapProps {
  markers?: MapMarker[]
  center?: [number, number]
  zoom?: number
  className?: string
}

export default function TravelMap({
  markers = [],
  center = [48.0, 10.0], // Европа по умолчанию
  zoom = 4,
  className = '',
}: TravelMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className={`h-full w-full rounded-xl ${className}`}
    >
      {/* Тёмные тайлы CartoDB */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.latitude, marker.longitude]}
          icon={markerIcon}
        >
          <Popup>
            <div className="text-sm">
              <span className="font-semibold">{marker.name}</span>
              <br />
              <span className="text-xs text-gray-400">
                {marker.type === 'country' ? 'Страна' : 'Город'}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}