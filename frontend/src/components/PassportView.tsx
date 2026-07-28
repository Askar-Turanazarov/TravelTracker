import { useVisitedCountries } from '@/hooks/useVisitedCountries'
import { countryCodeToFlagEmoji } from '@/utils/flagEmoji'
import Loader from '@/components/Loader'
import ErrorMessage from '@/components/ErrorMessage'

export default function PassportView() {
  const { data: visited, isLoading, isError, refetch } = useVisitedCountries()
  const today = new Date().toISOString().slice(0, 10)

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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {visited.map((country) => {
        const addedDate = country.added_at.slice(0, 10)
        const isNew = addedDate === today
        return (
          <div
            key={country.id}
            className="relative rounded-radius-lg border border-subtle bg-surface-elevated p-4 flex flex-col items-center text-center"
          >
            {isNew && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-achievement" />
            )}
            <span className="text-3xl leading-none mb-2" role="img" aria-label={country.name_en}>
              {countryCodeToFlagEmoji(country.country_code)}
            </span>
            <span className="text-body font-medium text-white/85">{country.name_en}</span>
            <span className="text-secondary text-white/60 mt-0.5">{addedDate}</span>
          </div>
        )
      })}
    </div>
  )
}
