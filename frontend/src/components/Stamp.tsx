import { useState } from 'react'
import type { VisitedCountry } from '@/types'
import { countryCodeToFlagEmoji } from '@/utils/flagEmoji'

function pickArchetype(code: string): 'round' | 'oval' | 'rect' {
  const sum = code.charCodeAt(0) + code.charCodeAt(1)
  const n = sum % 3
  return n === 0 ? 'round' : n === 1 ? 'oval' : 'rect'
}

function rotation(code: string): number {
  return ((code.charCodeAt(0) + code.charCodeAt(1)) % 13) - 6
}

const CX = 65
const CY = 90

interface ArchetypeProps {
  country: Pick<VisitedCountry, 'country_code' | 'name_en' | 'added_at'>
  inkColor: string
  stampId: string
}

function RoundStamp({ country, inkColor, stampId }: ArchetypeProps) {
  const flag = countryCodeToFlagEmoji(country.country_code)
  const date = country.added_at.slice(0, 10)
  const arcId = `arc-${stampId}`

  const ink = (
    <>
      <circle cx={CX} cy={CY} r="58" fill="none" stroke={inkColor} strokeWidth="2" />
      <circle cx={CX} cy={CY} r="50" fill="none" stroke={inkColor} strokeWidth="1" strokeDasharray="3 3" />
      <text fontSize="10" fill={inkColor} fontWeight="600" letterSpacing="1">
        <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
          {country.name_en}
        </textPath>
      </text>
      <text x={CX} y={CY + 42} textAnchor="middle" fontSize="9" fill={inkColor}>★</text>
      <text x={CX} y={CY + 54} textAnchor="middle" fontSize="7" fill={inkColor}>{date}</text>
    </>
  )

  return (
    <svg viewBox="0 0 130 180" className="w-full h-full">
      <path id={arcId} d={`M ${CX - 48} ${CY} A 48 48 0 0 1 ${CX + 48} ${CY}`} fill="none" />
      <text x={CX} y={CY + 6} textAnchor="middle" fontSize="24">{flag}</text>
      <g opacity="0.25" transform={`translate(1.5, 1.5) rotate(1.2, ${CX}, ${CY})`}>
        {ink}
      </g>
      <g>{ink}</g>
    </svg>
  )
}

function OvalStamp({ country, inkColor }: ArchetypeProps) {
  const flag = countryCodeToFlagEmoji(country.country_code)
  const date = country.added_at.slice(0, 10)

  const ink = (
    <>
      <ellipse cx={CX} cy={CY} rx="58" ry="74" fill="none" stroke={inkColor} strokeWidth="2" />
      <ellipse cx={CX} cy={CY} rx="50" ry="66" fill="none" stroke={inkColor} strokeWidth="1" strokeDasharray="3 3" />
      <text x={CX} y={CY + 34} textAnchor="middle" fontSize="9" fill={inkColor} fontWeight="600" letterSpacing="2">
        {country.name_en}
      </text>
      <text x={CX} y={CY + 48} textAnchor="middle" fontSize="9" fill={inkColor}>★</text>
      <text x={CX} y={CY + 60} textAnchor="middle" fontSize="7" fill={inkColor}>{date}</text>
    </>
  )

  return (
    <svg viewBox="0 0 130 180" className="w-full h-full">
      <text x={CX} y={CY + 6} textAnchor="middle" fontSize="24">{flag}</text>
      <g opacity="0.25" transform={`translate(1.5, 1.5) rotate(1.2, ${CX}, ${CY})`}>
        {ink}
      </g>
      <g>{ink}</g>
    </svg>
  )
}

function RectStamp({ country, inkColor }: ArchetypeProps) {
  const flag = countryCodeToFlagEmoji(country.country_code)
  const date = country.added_at.slice(0, 10)

  const ink = (
    <>
      <rect x="5" y="8" width="120" height="164" rx="12" fill="none" stroke={inkColor} strokeWidth="2" />
      <rect x="11" y="14" width="108" height="152" rx="8" fill="none" stroke={inkColor} strokeWidth="1" strokeDasharray="3 3" />
      <polyline points="17,19 17,28 26,28" fill="none" stroke={inkColor} strokeWidth="1.5" />
      <polyline points="113,19 113,28 104,28" fill="none" stroke={inkColor} strokeWidth="1.5" />
      <polyline points="17,161 17,152 26,152" fill="none" stroke={inkColor} strokeWidth="1.5" />
      <polyline points="113,161 113,152 104,152" fill="none" stroke={inkColor} strokeWidth="1.5" />
      <text x={CX} y={CY + 12} textAnchor="middle" fontSize="11" fill={inkColor} fontWeight="700">
        {country.name_en}
      </text>
      <text x={CX} y={CY + 30} textAnchor="middle" fontSize="9" fill={inkColor}>★</text>
      <text x={CX} y={CY + 42} textAnchor="middle" fontSize="7" fill={inkColor}>{date}</text>
    </>
  )

  return (
    <svg viewBox="0 0 130 180" className="w-full h-full">
      <text x={CX} y={CY + 6} textAnchor="middle" fontSize="24">{flag}</text>
      <g opacity="0.25" transform={`translate(1.5, 1.5) rotate(1.2, ${CX}, ${CY})`}>
        {ink}
      </g>
      <g>{ink}</g>
    </svg>
  )
}

interface StampProps {
  country: VisitedCountry
  stampId: string
  isNew: boolean
}

export default function Stamp({ country, stampId, isNew }: StampProps) {
  const archetype = pickArchetype(country.country_code)
  const rot = rotation(country.country_code)
  const inkColor = isNew ? '#F5B942' : '#3b82f6'
  const [slamDone, setSlamDone] = useState(!isNew)

  const archetypeProps = { country, inkColor, stampId }

  return (
    <div className="group relative" style={{ '--rot': `${rot}deg` } as React.CSSProperties}>
      {isNew && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-[#F5B942] impact-pulse" />
        </div>
      )}
      <div
        className="relative transition-all duration-200 [transform:rotate(var(--rot))] group-hover:[transform:rotate(0deg)_scale(1.08)]"
        style={isNew && !slamDone ? { animation: 'stamp-slam 600ms ease-out forwards' } : undefined}
        onAnimationEnd={() => setSlamDone(true)}
      >
        {archetype === 'round' && <RoundStamp {...archetypeProps} />}
        {archetype === 'oval' && <OvalStamp {...archetypeProps} />}
        {archetype === 'rect' && <RectStamp {...archetypeProps} />}
      </div>
    </div>
  )
}
