import { useEffect, useState, useRef } from 'react'
import { geoMercator, geoPath, type GeoProjection } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
// @ts-ignore
import worldTopo from 'world-atlas/countries-110m.json'

const UZBEKISTAN_ID = '860'

export default function AnimatedMapBackground() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [paths, setPaths] = useState<string[]>([])
  const [uzbekistanPath, setUzbekistanPath] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const topology = worldTopo as unknown as Topology
    const geoJson = feature(topology, topology.objects.countries as GeometryCollection)
    if (!geoJson || !geoJson.features) return

    const projection: GeoProjection = geoMercator()
      .fitSize([1200, 600], geoJson)

    // Смещение центра карты: сдвигаем вправо-вверх
    // fitSize центрует по bounding box всех стран, теперь добавим offset
    const currentTranslate = projection.translate()
    projection.translate([
      currentTranslate[0] + 80,   // сдвиг вправо
      currentTranslate[1] - 30    // сдвиг вверх (минус)
    ])

    // Увеличение масштаба на 15%
    const currentScale = projection.scale()
    projection.scale(currentScale * 1.15)

    const pathGenerator = geoPath(projection)

    const worldPaths: string[] = []
    let uzbekPath: string | null = null

    geoJson.features.forEach((f: any) => {
      const pathD = pathGenerator(f)
      if (pathD) {
        if (f.id === UZBEKISTAN_ID || f.properties?.name === 'Uzbekistan') {
          uzbekPath = pathD
        } else {
          worldPaths.push(pathD)
        }
      }
    })

    setPaths(worldPaths)
    setUzbekistanPath(uzbekPath)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const maxTranslate = 40
  const translateX = (mousePos.x - 0.5) * maxTranslate * 2
  const translateY = (mousePos.y - 0.5) * maxTranslate * 2
  const scale = 1 + (Math.abs(mousePos.x - 0.5) + Math.abs(mousePos.y - 0.5)) * 0.03
  const glassX = mousePos.x * 100
  const glassY = mousePos.y * 100

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <svg
        ref={svgRef}
        viewBox="0 0 1200 600"
        className="w-full h-full opacity-30"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="uzbekistanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="planeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g fill="none" stroke="url(#mapGradient)" strokeWidth="0.8" filter="url(#glow)" opacity="0.8">
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {uzbekistanPath && (
          <g filter="url(#glow)">
            <path
              d={uzbekistanPath}
              fill="url(#uzbekistanGradient)"
              fillOpacity="0.5"
              stroke="none"
            >
              <animate attributeName="fill-opacity" values="0.5;0.65;0.5" dur="3s" repeatCount="indefinite" />
            </path>
            <path
              d={uzbekistanPath}
              fill="none"
              stroke="url(#uzbekistanGradient)"
              strokeWidth="2.5"
              opacity="0.9"
            />
          </g>
        )}

        <g filter="url(#planeGlow)">
          <path d="M 0,0 L 8,-3 L 22,0 L 8,3 Z" fill="#60a5fa" opacity="0.9" transform="scale(0.8)">
            <animateMotion
              dur="14s"
              repeatCount="indefinite"
              path="M 500,200 Q 580,160 660,250 Q 590,280 500,200 Z"
              rotate="auto"
            />
          </path>
        </g>
        <g filter="url(#planeGlow)">
          <path d="M 0,0 L 6,-2.5 L 18,0 L 6,2.5 Z" fill="#93c5fd" opacity="0.85" transform="scale(0.7)">
            <animateMotion
              dur="18s"
              repeatCount="indefinite"
              path="M 750,230 Q 680,200 640,280 Q 700,260 750,230 Z"
              rotate="auto"
            />
          </path>
        </g>

        <circle cx="660" cy="250" r="3.5" fill="#60a5fa" opacity="1">
          <animate attributeName="r" values="3.5;5;3.5" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="645" cy="265" r="2.8" fill="#60a5fa" opacity="0.9">
          <animate attributeName="r" values="2.8;4;2.8" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="480" cy="155" r="2.8" fill="#93c5fd" opacity="0.75">
          <animate attributeName="r" values="2.8;4;2.8" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="280" cy="160" r="2.8" fill="#93c5fd" opacity="0.75">
          <animate attributeName="r" values="2.8;4;2.8" dur="2.1s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Лёгкое световое пятно (magnifying effect) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 180px at ${glassX}% ${glassY}%, rgba(96,165,250,0.15) 0%, transparent 70%)`,
          opacity: 0.8,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  )
}