import { useEffect, useState } from 'react'
import { GlobeAltIcon, MapPinIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { geoMercator, geoPath, type GeoProjection } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
// @ts-ignore
import worldTopo from 'world-atlas/countries-110m.json'

// ---------- Вспомогательные функции ----------
const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const shuffleArray = <T,>(arr: T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ---------- Хук плавного счётчика ----------
function useCountUp(target: number, duration = 1500, startDelay = 0) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target <= 0) return
    const startTime = performance.now() + startDelay
    let raf: number
    const step = (now: number) => {
      const elapsed = now - startTime
      if (elapsed < 0) {
        raf = requestAnimationFrame(step)
        return
      }
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, startDelay])
  return count
}

// ---------- Реальные города с координатами ----------
const CITY_POOL = [
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'New York', lat: 40.7128, lon: -74.006 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'Bangkok', lat: 13.7563, lon: 100.5018 },
  { name: 'Istanbul', lat: 41.0082, lon: 28.9784 },
  { name: 'Barcelona', lat: 41.3874, lon: 2.1686 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729 },
  { name: 'Cape Town', lat: -33.9249, lon: 18.4241 },
  { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816 },
  { name: 'Moscow', lat: 55.7558, lon: 37.6173 },
  { name: 'Toronto', lat: 43.6532, lon: -79.3832 },
  { name: 'Seoul', lat: 37.5665, lon: 126.978 },
]

// ---------- Демо-данные ----------
function generateDemoData() {
  const topology = worldTopo as unknown as Topology
  const geoJson = feature(topology, topology.objects.countries as GeometryCollection)
  const allCountries =
    geoJson?.features
      ?.map((f: any) => ({
        id: f.id || f.properties?.name || '',
        name: f.properties?.name || '',
        region: f.properties?.region || f.properties?.continent || '',
      }))
      .filter((c: any) => c.name) || []

  const selectedCountryCount = randomBetween(8, 25)
  const shuffledCountries = shuffleArray(allCountries)
  const visitedCountries = shuffledCountries.slice(0, selectedCountryCount)

  const visitedCityCount = randomBetween(8, 20)
  const shuffledCities = shuffleArray(CITY_POOL)
  const visitedCities = shuffledCities.slice(0, visitedCityCount).map((city, idx) => ({
    ...city,
    id: `city-${idx}`,
    year: randomBetween(2018, 2026),
  }))

  return { countries: visitedCountries, cities: visitedCities }
}

// ---------- Мини-карта ----------
function MiniMap({ data }: { data: ReturnType<typeof generateDemoData> }) {
  const [hovered, setHovered] = useState<string | null>(null)

  const topology = worldTopo as unknown as Topology
  const geoJson = feature(topology, topology.objects.countries as GeometryCollection)
  const projection: GeoProjection = geoMercator().fitSize([600, 350], geoJson as any)
  const pathGen = geoPath(projection)

  const visitedIds = new Set(data.countries.map((c) => c.id))

  return (
    <div className="relative w-full h-[350px] rounded-2xl border border-white/10 bg-dark-900/80 backdrop-blur-sm overflow-hidden shadow-lg shadow-primary-500/10">
      <svg viewBox="0 0 600 350" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="visitedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
          </linearGradient>
          <filter id="cityGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Все страны (слабый контур) */}
        <g fill="none" stroke="#334155" strokeWidth="0.5">
          {geoJson?.features?.map((f: any) => (
            <path key={f.id || f.properties?.name} d={pathGen(f) || ''} />
          ))}
        </g>

        {/* Посещённые страны */}
        <g fill="url(#visitedGrad)" stroke="#60a5fa" strokeWidth="0.8" opacity="0.9">
          {geoJson?.features
            ?.filter((f: any) => visitedIds.has(f.id || f.properties?.name))
            .map((f: any) => (
              <path
                key={f.id || f.properties?.name}
                d={pathGen(f) || ''}
                onMouseEnter={() => setHovered(f.properties?.name || '')}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer transition-all duration-200"
              />
            ))}
        </g>

        {/* Города */}
        <g fill="#fbbf24" stroke="#fbbf24" strokeWidth="1" filter="url(#cityGlow)">
          {data.cities.map((city) => {
            const point = projection([city.lon, city.lat])
            if (!point) return null
            return <circle key={city.id} cx={point[0]} cy={point[1]} r={3.5} />
          })}
        </g>
      </svg>

      {hovered && (
        <div className="absolute bottom-3 left-3 bg-dark-900/90 text-white text-xs px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
          {hovered}
        </div>
      )}
    </div>
  )
}

// ---------- Прогресс-бар ----------
function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const width = Math.round((value / max) * 100)
  return (
    <div className="w-full mt-2">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span>
          {value} из {max}
        </span>
      </div>
      <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

// ---------- Основной компонент ----------
export default function DemoStats() {
  const [data] = useState(() => generateDemoData())

  const totalCountries = data.countries.length
  const totalCities = data.cities.length
  const worldPercentage = +((totalCountries / 195) * 100).toFixed(1)

  const animatedCountries = useCountUp(totalCountries, 1500, 200)
  const animatedCities = useCountUp(totalCities, 1500, 600)
  const animatedPercentage = useCountUp(worldPercentage * 10, 1500, 1000) // умножаем на 10 для плавности десятых

  // Агрегация по регионам
  const regionCounts: Record<string, number> = {}
  data.countries.forEach((c) => {
    regionCounts[c.region] = (regionCounts[c.region] || 0) + 1
  })
  const regionEntries = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])

  // Агрегация по годам
  const yearCounts: Record<number, number> = {}
  data.cities.forEach((c) => {
    yearCounts[c.year] = (yearCounts[c.year] || 0) + 1
  })
  const yearEntries = Object.entries(yearCounts).sort((a, b) => +a[0] - +b[0])
  const maxYearVisits = Math.max(...yearEntries.map(([, count]) => count), 1)

  return (
    <section className="mt-24 sm:mt-32 opacity-0 animate-fade-in-up animate-delay-300 space-y-8">
      {/* Заголовок */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">
          Представьте свой тревел-профиль
        </h2>
        <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
          Вот так будет выглядеть ваша статистика после нескольких путешествий. Данные случайны —
          обновите страницу для новых цифр.
        </p>
      </div>

      {/* Карточки метрик */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[ 
          { icon: GlobeAltIcon, value: animatedCountries, label: 'стран', total: 195, current: totalCountries },
          { icon: MapPinIcon, value: animatedCities, label: 'городов', total: 200, current: totalCities },
          { icon: ChartBarIcon, value: `${(animatedPercentage / 10).toFixed(1)}%`, label: 'планеты', total: 100, current: Math.round(worldPercentage) },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border border-white/10 bg-dark-900/60 backdrop-blur-sm shadow-lg shadow-primary-500/5 hover:shadow-primary-500/20 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <item.icon className="h-8 w-8 text-primary-400 mb-3" />
              <div className="text-5xl font-bold text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                {item.value}
              </div>
              <div className="text-sm text-gray-400 mt-1">{item.label}</div>
              <ProgressBar value={item.current} max={item.total} label="" />
            </div>
          </div>
        ))}
      </div>

      {/* Мини-карта и графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MiniMap data={data} />

        <div className="space-y-5">
          {/* График регионов */}
          <div className="p-5 rounded-2xl border border-white/10 bg-dark-900/60 backdrop-blur-sm shadow-lg shadow-primary-500/5">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">По регионам</h3>
            <div className="space-y-2.5">
              {regionEntries.map(([region, count]) => (
                <div key={region} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-28 truncate">{region}</span>
                  <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-700"
                      style={{ width: `${(count / totalCountries) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-300 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* График по годам */}
          <div className="p-5 rounded-2xl border border-white/10 bg-dark-900/60 backdrop-blur-sm shadow-lg shadow-primary-500/5">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Посещения по годам</h3>
            <div className="flex items-end gap-2 h-32">
              {yearEntries.map(([year, count]) => (
                <div key={year} className="flex flex-col items-center flex-1">
                  <span className="text-xs text-gray-400 mb-1">{count}</span>
                  <div
                    className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md transition-all duration-700"
                    style={{ height: `${Math.max(8, (count / maxYearVisits) * 100)}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-1">{year}</span>
                </div>
              ))}
              {yearEntries.length === 0 && <p className="text-gray-500 text-sm">Нет данных</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}