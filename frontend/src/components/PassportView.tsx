import { useMemo, useState, useId, useEffect } from 'react'
import { useVisitedCountries } from '@/hooks/useVisitedCountries'
import type { VisitedCountry } from '@/types'
import Stamp from '@/components/Stamp'
import Loader from '@/components/Loader'
import ErrorMessage from '@/components/ErrorMessage'

const ITEMS_PER_PAGE = 6

function BookPage({ countries, grainId, pageIdx, today }: {
  countries: VisitedCountry[]
  grainId: string
  pageIdx: number
  today: string
}) {
  return (
    <div className="relative overflow-hidden rounded-radius-md bg-surface-elevated p-4">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>
      <div className="grid grid-cols-2 gap-3">
        {countries.map((c, i) => (
          <Stamp key={c.id} country={c} stampId={`s-${pageIdx}-${i}`} isNew={c.added_at.slice(0, 10) === today} />
        ))}
      </div>
    </div>
  )
}

export default function PassportView() {
  const grainId = useId()
  const { data: visited, isLoading, isError, refetch } = useVisitedCountries()
  const today = new Date().toISOString().slice(0, 10)

  const pages = useMemo(() => {
    if (!visited) return []
    const chunks: VisitedCountry[][] = []
    for (let i = 0; i < visited.length; i += ITEMS_PER_PAGE) {
      chunks.push(visited.slice(i, i + ITEMS_PER_PAGE))
    }
    return chunks
  }, [visited])

  const [pageIdx, setPageIdx] = useState(0)
  const totalPages = pages.length

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = () => {
      if (mq.matches) {
        setPageIdx(prev => (prev % 2 === 0 ? prev : Math.max(0, prev - 1)))
      }
    }
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (isLoading) return <Loader text="Загружаем паспорт..." />
  if (isError) return <ErrorMessage message="Не удалось загрузить страны" onRetry={() => refetch()} />

  if (!visited || visited.length === 0) {
    return (
      <div className="rounded-radius-lg border border-subtle bg-surface-elevated p-10 text-center">
        <p className="text-body text-white/85">Паспорт пока пуст</p>
        <p className="text-secondary text-white/60 mt-1">Добавьте первую страну, чтобы начать коллекцию</p>
      </div>
    )
  }

  const maxDesktop = 2 * Math.floor((totalPages - 1) / 2)

  return (
    <>
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={grainId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise"/>
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.03 0"/>
          </filter>
        </defs>
      </svg>

      <style>{`
@keyframes stamp-slam {
  0%   { opacity: 0; transform: scale(1.6) rotate(calc(var(--rot) + 20deg)) translateY(-12px); }
  60%  { opacity: 1; transform: scale(0.95) rotate(calc(var(--rot) - 3deg)) translateY(2px); }
  80%  { transform: scale(1.03) rotate(var(--rot)) translateY(-1px); }
  100% { opacity: 1; transform: rotate(var(--rot)); }
}
@keyframes impact-pulse {
  0%   { transform: scale(0.6); opacity: 0.6; }
  100% { transform: scale(1.8); opacity: 0; }
}
.impact-pulse {
  animation: impact-pulse 500ms ease-out forwards;
  pointer-events: none;
}
      `}</style>

      {/* Desktop spread — two pages side by side */}
      <div className="hidden md:block">
        <div className="rounded-radius-lg border border-subtle shadow-floating bg-surface overflow-hidden">
          <div className="flex">
            <div className="flex-1 p-3">
              <BookPage countries={pages[pageIdx]} grainId={grainId} pageIdx={pageIdx} today={today} />
            </div>
            <div className="w-8 shrink-0 relative">
              <div className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-black/40 to-transparent" />
            </div>
            <div className="flex-1 p-3">
              {pages[pageIdx + 1] ? (
                <BookPage countries={pages[pageIdx + 1]} grainId={grainId} pageIdx={pageIdx + 1} today={today} />
              ) : (
                <div className="h-full rounded-radius-md border border-dashed border-subtle flex items-center justify-center min-h-[200px]">
                  <span className="text-secondary text-white/60">—</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-3">
          <button
            onClick={() => setPageIdx(i => Math.max(i - 2, 0))}
            disabled={pageIdx <= 0}
            className="text-white/60 hover:text-white disabled:text-white/20 disabled:cursor-not-allowed transition-colors text-lg"
          >
            ◀
          </button>
          <span className="text-secondary text-white/60">
            Разворот {Math.floor(pageIdx / 2) + 1} из {Math.ceil(totalPages / 2)}
          </span>
          <button
            onClick={() => setPageIdx(i => Math.min(i + 2, maxDesktop))}
            disabled={pageIdx >= maxDesktop}
            className="text-white/60 hover:text-white disabled:text-white/20 disabled:cursor-not-allowed transition-colors text-lg"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Mobile — single page */}
      <div className="md:hidden">
        <div className="rounded-radius-lg border border-subtle shadow-floating bg-surface overflow-hidden p-3">
          <BookPage countries={pages[pageIdx]} grainId={grainId} pageIdx={pageIdx} today={today} />
        </div>
        <div className="flex items-center justify-center gap-4 mt-3">
          <button
            onClick={() => setPageIdx(i => Math.max(i - 1, 0))}
            disabled={pageIdx <= 0}
            className="text-white/60 hover:text-white disabled:text-white/20 disabled:cursor-not-allowed transition-colors text-lg"
          >
            ◀
          </button>
          <span className="text-secondary text-white/60">
            Страница {pageIdx + 1} из {totalPages}
          </span>
          <button
            onClick={() => setPageIdx(i => Math.min(i + 1, totalPages - 1))}
            disabled={pageIdx >= totalPages - 1}
            className="text-white/60 hover:text-white disabled:text-white/20 disabled:cursor-not-allowed transition-colors text-lg"
          >
            ▶
          </button>
        </div>
      </div>
    </>
  )
}
