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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Дашборд</h1>

      {isLoading && <Loader text="Загрузка статистики..." />}

      {isError && (
        <ErrorMessage
          message="Не удалось загрузить статистику"
          onRetry={() => refetch()}
        />
      )}

      {data && (
        <>
          {/* Счётчики */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <div className="text-3xl font-bold text-primary-400">
                {data.total_countries_visited}
              </div>
              <div className="text-sm text-gray-400 mt-1">Посещённых стран</div>
            </Card>
            <Card>
              <div className="text-3xl font-bold text-primary-400">
                {data.total_cities_visited}
              </div>
              <div className="text-sm text-gray-400 mt-1">Посещённых городов</div>
            </Card>
            <Card>
              <div className="text-3xl font-bold text-primary-400">
                {data.world_percentage}%
              </div>
              <div className="text-sm text-gray-400 mt-1">Планеты охвачено</div>
            </Card>
          </div>

          {/* Разбивка по регионам */}
          <Card title="По регионам">
            {data.countries_by_region.length > 0 ? (
              <div className="space-y-2">
                {data.countries_by_region.map((region) => (
                  <div
                    key={region.region}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-300">{region.region}</span>
                    <span className="text-sm font-medium text-white">{region.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Нет данных</p>
            )}
          </Card>

          {/* Последние посещения */}
          <Card title="Последние посещения">
            {data.latest_visits.length > 0 ? (
              <div className="space-y-3">
                {data.latest_visits.map((visit, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-white">
                        {visit.city_name}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {visit.country_code}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {visit.visit_date || '—'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Пока нет отмеченных городов</p>
            )}
          </Card>

          {/* Управление странами и городами */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CountriesManager />
            <CitiesManager />
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate('/map')}
              className="w-full rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 transition-colors"
            >
              Открыть карту
            </button>
          </div>
        </>
      )}
    </div>
  )
}