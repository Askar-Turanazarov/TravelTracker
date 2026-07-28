import { useState } from 'react'
import { useVisitedCountries, useAddVisitedCountry, useDeleteVisitedCountry } from '@/hooks/useVisitedCountries'
import { useCountries } from '@/hooks/useReferenceData'
import Modal from '@/components/Modal'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import ErrorMessage from '@/components/ErrorMessage'
import { countryCodeToFlagEmoji } from '@/utils/flagEmoji'

export default function CountriesManager() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCountryCode, setSelectedCountryCode] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  // Запросы
  const { data: visited, isLoading, isError, refetch } = useVisitedCountries()
  const { data: allCountries } = useCountries()
  const addMutation = useAddVisitedCountry()
  const deleteMutation = useDeleteVisitedCountry()

  // Добавление
  const handleAdd = () => {
    if (!selectedCountryCode) return
    addMutation.mutate(selectedCountryCode, {
      onSuccess: () => {
        setSelectedCountryCode('')
        setShowAddModal(false)
      },
    })
  }

  // Удаление
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  // Список кодов уже добавленных стран, чтобы исключить их из выпадающего списка
  const addedCodes = new Set(visited?.map((c) => c.country_code) ?? [])
  const availableCountries = (allCountries ?? []).filter((c) => !addedCodes.has(c.code))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Мои страны</h2>
        <Button size="sm" onClick={() => setShowAddModal(true)} disabled={addMutation.isPending}>
          + Добавить страну
        </Button>
      </div>

      {isLoading && <Loader size="sm" />}
      {isError && (
        <ErrorMessage message="Не удалось загрузить список стран" onRetry={() => refetch()} />
      )}

      {visited && visited.length === 0 && !isLoading && (
        <div className="rounded-radius-lg border border-subtle bg-surface p-10 text-center">
          <p className="text-body text-white/85">Пока не добавлено ни одной страны</p>
          <Button size="sm" className="mt-3" onClick={() => setShowAddModal(true)}>
            Добавить первую
          </Button>
        </div>
      )}

      {visited && visited.length > 0 && (
        <div className="rounded-radius-lg border border-subtle bg-surface-elevated divide-y divide-subtle">
          {visited.map((c) => (
            <div
              key={c.id}
              className="group flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-base leading-none" role="img" aria-label={c.name_en}>
                  {countryCodeToFlagEmoji(c.country_code)}
                </span>
                <span className="text-body font-medium text-white/85">{c.name_en}</span>
              </div>
              <button
                onClick={() => setDeleteTarget({ id: c.id, name: c.name_en })}
                className="text-sm text-red-400 hover:text-red-300 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Модалка добавления */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Добавить страну">
        <div className="space-y-3">
          {availableCountries.length === 0 ? (
            <p className="text-sm text-gray-400">Все страны уже добавлены</p>
          ) : (
            <select
              className="w-full rounded-lg border border-gray-700 bg-dark-800 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
            >
              <option value="">— Выберите страну —</option>
              {availableCountries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name_en}
                </option>
              ))}
            </select>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>
              Отмена
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!selectedCountryCode || addMutation.isPending}
              loading={addMutation.isPending}
            >
              Добавить
            </Button>
          </div>
          {addMutation.isError && (
            <ErrorMessage message={(addMutation.error as any)?.response?.data?.error?.message || 'Ошибка'} />
          )}
        </div>
      </Modal>

      {/* Модалка подтверждения удаления */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Удалить страну?"
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-300">
            Вы уверены, что хотите удалить <strong>{deleteTarget?.name}</strong> из списка посещённых?
            Все города, отмеченные для этой страны, также будут удалены.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)}>
              Отмена
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
              loading={deleteMutation.isPending}
            >
              Удалить
            </Button>
          </div>
          {deleteMutation.isError && (
            <ErrorMessage message={(deleteMutation.error as any)?.response?.data?.error?.message || 'Ошибка'} />
          )}
        </div>
      </Modal>
    </div>
  )
}