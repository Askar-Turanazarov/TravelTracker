import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import Card from '@/components/Card'
import Loader from '@/components/Loader'
import ErrorMessage from '@/components/ErrorMessage'
import Button from '@/components/Button'

export default function AdminPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const limit = 20

  // Если не админ — редирект на дашборд
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const { data, isLoading, isError, refetch } = useAdminUsers(page, limit)

  const totalPages = data?.pagination.total_pages ?? 1

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Админ-панель</h1>

      {isLoading && <Loader text="Загрузка пользователей..." />}

      {isError && (
        <ErrorMessage
          message="Не удалось загрузить список пользователей"
          onRetry={() => refetch()}
        />
      )}

      {data && (
        <>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase border-b border-gray-800">
                  <tr>
                    <th className="py-3 px-4">Имя</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Стран</th>
                    <th className="py-3 px-4">Городов</th>
                    <th className="py-3 px-4">Дата регистрации</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-800/50 hover:bg-dark-800/50">
                      <td className="py-3 px-4 text-gray-200 font-medium">{u.display_name}</td>
                      <td className="py-3 px-4 text-gray-400">{u.email}</td>
                      <td className="py-3 px-4 text-primary-400">{u.countries_count}</td>
                      <td className="py-3 px-4 text-primary-400">{u.cities_count}</td>
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(u.created_at).toLocaleDateString('ru-RU')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Пагинация */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Всего: {data.pagination.total} пользователей
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Назад
              </Button>
              <span className="text-sm text-gray-300 px-2">
                {page} / {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Вперёд →
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}