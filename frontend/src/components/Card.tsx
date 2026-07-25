import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
  padding?: boolean
}

export default function Card({ title, subtitle, children, className = '', padding = true }: CardProps) {
  return (
    <div className={`rounded-xl border border-gray-800 bg-dark-900 ${padding ? 'p-5' : ''} ${className}`}>
      {title && <h3 className="text-base font-semibold text-white mb-1">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-400 mb-3">{subtitle}</p>}
      {children}
    </div>
  )
}