interface ErrorMessageProps {
  message?: string | null
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  if (!message) return null

  return (
    <div className="rounded-lg border border-red-700/60 bg-red-900/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-red-400">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-red-300 underline hover:text-red-200 whitespace-nowrap"
          >
            Повторить
          </button>
        )}
      </div>
    </div>
  )
}