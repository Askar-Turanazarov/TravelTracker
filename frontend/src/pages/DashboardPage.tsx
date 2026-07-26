import { useNavigate } from 'react-router-dom'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import CountriesManager from '@/components/CountriesManager'
import CitiesManager from '@/components/CitiesManager'
import Card from '@/components/Card'
import Loader from '@/components/Loader'
import ErrorMessage from '@/components/ErrorMessage'

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardStats()
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Мой тревел-дашборд</h1>

      {isLoading && <Loader text="Загрузка статистики..." />}
      {isError && <ErrorMessage message="Не удалось загрузить статистику" onRetry={() => refetch()} />}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🌍</span>
                <div>
                  <div className="text-2xl font-bold text-white">{data.total_countries_visited}</div>
                  <div className="text-sm text-gray-400">стран</div>
                </div>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (data.total_countries_visited / 195) * 100)}%` }}
                />
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🏙️</span>
                <div>
                  <div className="text-2xl font-bold text-white">{data.total_cities_visited}</div>
                  <div className="text-sm text-gray-400">городов</div>
                </div>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (data.total_cities_visited / 100) * 100)}%` }}
                />
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">✈️</span>
                <div>
                  <div className="text-2xl font-bold text-white">{data.world_percentage}%</div>
                  <div className="text-sm text-gray-400">планеты</div>
                </div>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${data.world_percentage}%` }}
                />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="По регионам">
              {data.countries_by_region.length > 0 ? (
                <div className="space-y-2">
                  {data.countries_by_region.map((reg) => (
                    <div key={reg.region} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{reg.region}</span>
                      <span className="font-medium text-white">{reg.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Добавьте страны, чтобы увидеть статистику</p>
              )}
            </Card>
            <Card title="Последние города">
              {data.latest_visits.length > 0 ? (
                <div className="space-y-2">
                  {data.latest_visits.map((v, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-200">
                        {v.city_name}{' '}
                        <span className="text-xs text-gray-500">({v.country_code})</span>
                      </span>
                      <span className="text-gray-400">{v.visit_date || '—'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Нет посещённых городов</p>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CountriesManager />
            <CitiesManager />
          </div>
        </>
      )}

      {!data && !isLoading && !isError && (
        <p className="text-gray-400">Добавьте свои первые страны и города, чтобы увидеть статистику!</p>
      )}
    </div>
  )
}