interface SegmentedOption {
  label: string
  value: string
}

interface SegmentedControlProps {
  options: SegmentedOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function SegmentedControl({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps) {
  return (
    <div
      className={`inline-flex rounded-radius-md bg-surface border border-subtle p-1 ${className}`}
    >
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-1.5 rounded-radius-sm text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? 'bg-surface-elevated text-white shadow-glow-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
