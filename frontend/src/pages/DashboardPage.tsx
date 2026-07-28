import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import StatRing from '@/components/StatRing'
import CountriesManager from '@/components/CountriesManager'
import CitiesManager from '@/components/CitiesManager'
import SegmentedControl from '@/components/SegmentedControl'
import PassportView from '@/components/PassportView'
import Loader from '@/components/Loader'
import ErrorMessage from '@/components/ErrorMessage'

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardStats()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'passport'>('overview')

  const textGoal = useMemo(() => {
    if (!data) return null
    if (data.total_countries_visited === 0) {
      return <p className="text-center text-secondary text-white/60">Добавьте первую страну</p>
    }
    if (data.total_countries_visited >= 195) {
      return <p className="text-center text-secondary text-white/60">Вы посетили все страны мира!</p>
    }
    const rawMilestone = Math.ceil(data.world_percentage / 10) * 10
    const nextMilestone =
      rawMilestone === data.world_percentage
        ? data.world_percentage + 10
        : rawMilestone
    const countriesNeeded =
      Math.ceil((nextMilestone / 100) * 195) - data.total_countries_visited
    return (
      <p className="text-center text-secondary text-white/60">
        Ещё {countriesNeeded} стран — и будет {nextMilestone}% мира
      </p>
    )
  }, [data])

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Мой дневник путешествий</h1>
        <button
          onClick={() => navigate('/map')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl
                     shadow-lg shadow-primary-700/30 hover:shadow-primary-700/50 hover:scale-105 transition-all duration-300"
        >
          <span>🗺️</span> Открыть карту
        </button>
      </div>

      <SegmentedControl
        options={[
          { label: 'Обзор', value: 'overview' },
          { label: 'Паспорт', value: 'passport' },
        ]}
        value={activeTab}
        onChange={(v) => setActiveTab(v as 'overview' | 'passport')}
      />

      {isLoading && <Loader text="Загружаем статистику..." />}
      {isError && <ErrorMessage message="Не удалось загрузить статистику" onRetry={() => refetch()} />}

      {data && activeTab === 'overview' && (
        <>
          {/* Кольца статистики */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <StatRing
              value={data.total_countries_visited}
              total={195}
              label="Стран"
              color="#3b82f6"
            />
            <StatRing
              value={data.total_cities_visited}
              total={100}
              label="Городов"
              color="#3b82f6"
            />
            <StatRing
              value={data.world_percentage}
              total={100}
              label="Планеты"
              color="#F5B942"
              decimals={2}
            />
          </div>

          {/* Мотивационная строка */}
          {textGoal}

          {/* Регионы и последние визиты */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-dark-900/80 backdrop-blur-sm p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🌎</span> По регионам
              </h2>
              {data.countries_by_region.length > 0 ? (
                <div className="space-y-3">
                  {data.countries_by_region.map((reg) => (
                    <div key={reg.region} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{reg.region}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-dark-700 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                            style={{ width: `${(reg.count / data.total_countries_visited) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-white w-6 text-right">{reg.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Добавьте страны, чтобы увидеть статистику по регионам</p>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-dark-900/80 backdrop-blur-sm p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>📌</span> Последние города
              </h2>
              {data.latest_visits.length > 0 ? (
                <div className="space-y-3">
                  {data.latest_visits.map((v, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                      <div>
                        <span className="text-sm font-medium text-gray-200">{v.city_name}</span>
                        <span className="text-xs text-gray-500 ml-2">{v.country_code}</span>
                      </div>
                      <span className="text-xs text-gray-400">{v.visit_date || '—'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Пока нет отмеченных городов</p>
              )}
            </div>
          </div>

          {/* Управление странами и городами */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CountriesManager />
            <CitiesManager />
          </div>
        </>
      )}

      {activeTab === 'passport' && <PassportView />}

      {!data && !isLoading && !isError && activeTab === 'overview' && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-xl mb-4">🌍 Начните своё путешествие!</p>
          <p>Добавьте первые страны и города, чтобы увидеть статистику.</p>
        </div>
      )}
    </div>
  )
}