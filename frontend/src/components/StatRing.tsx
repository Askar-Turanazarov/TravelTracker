import { useState, useEffect, useMemo } from 'react'

function useCountUp(target: number, duration = 800, decimals = 0): number {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (target === 0) {
      setDisplayed(0)
      return
    }
    const start = performance.now()
    let raf: number

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(
        Math.round(eased * target * 10 ** decimals) / 10 ** decimals,
      )
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, decimals])

  return displayed
}

const CIRCUMFERENCE = 2 * Math.PI * 50

interface StatRingProps {
  value: number
  total: number
  label: string
  color: string
  decimals?: number
}

export default function StatRing({
  value,
  total,
  label,
  color,
  decimals = 0,
}: StatRingProps) {
  const animated = useCountUp(value, 800, decimals)
  const progress = total > 0 ? value / total : 0
  const offset = CIRCUMFERENCE * (1 - progress)

  const displayValue = useMemo(() => {
    if (decimals > 0) return `${animated.toFixed(decimals)}%`
    return String(animated)
  }, [animated, decimals])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg viewBox="0 0 120 120" className="w-32 h-32">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-1000 ease-out"
            transform="rotate(-90 60 60)"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-display text-white/95">
            {displayValue}
          </span>
          <span className="text-caption text-white/45">
            из {total}
          </span>
        </div>
      </div>

      <span className="text-body text-white/85">{label}</span>
    </div>
  )
}
