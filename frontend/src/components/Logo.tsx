import { Link } from 'react-router-dom'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

interface LogoProps {
  size?: 'sm' | 'md'
}

export default function Logo({ size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'
  const textSize = size === 'sm' ? 'text-lg' : 'text-xl'

  return (
    <Link to="/" className="flex items-center gap-2 group">
      <GlobeAltIcon
        className={`${iconSize} text-primary-400 group-hover:text-primary-300 transition-colors duration-300`}
      />
      <span
        className={`${textSize} font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent tracking-tight`}
      >
        TravelTracker
      </span>
    </Link>
  )
}