interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

const sizeMap = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
}

export default function Loader({ size = 'md', text, className = '' }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeMap[size]} animate-spin rounded-full border-primary-500 border-t-transparent`}
      />
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  )
}