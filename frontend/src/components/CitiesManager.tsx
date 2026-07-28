import { useState, type FormEvent } from 'react'
import {
  useVisitedCities,
  useAddVisitedCity,
  useUpdateVisitedCity,
  useDeleteVisitedCity,
} from '@/hooks/useVisitedCities'
import { useAddVisitedCountry } from '@/hooks/useVisitedCountries'
import { useCountries, useCities } from '@/hooks/useReferenceData'
import Modal from '@/components/Modal'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import ErrorMessage from '@/components/ErrorMessage'
import FormField from '@/components/FormField'
import Input from '@/components/Input'
import { countryCodeToFlagEmoji } from '@/utils/flagEmoji'

export default function CitiesManager() {
  const [selectedCountryCode, setSelectedCountryCode] = useState('')
  const { data: countries } = useCountries()
  const { data: referenceCities } = useCities(selectedCountryCode || null)
  const { data: visitedCities, isLoading, isError, refetch } = useVisitedCities(selectedCountryCode || undefined)
  const addCityMutation = useAddVisitedCity()
  const addCountryMutation = useAddVisitedCountry()
  const updateMutation = useUpdateVisitedCity()
  const deleteMutation = useDeleteVisitedCity()

  const [showAddModal, setShowAddModal] = useState(false)
  const [newCityId, setNewCityId] = useState<number | null>(null)
  const [newVisitDate, setNewVisitDate] = useState('')
  const [newNote, setNewNote] = useState('')
  const [addError, setAddError] = useState<string | null>(null)

  const [editNoteId, setEditNoteId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState('')
  const [editVisitDate, setEditVisitDate] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    if (!newCityId || !selectedCountryCode) return
    setAddError(null)

    try {
      // Автоматически добавляем страну (409 — уже есть, продолжаем)
      try {
        await addCountryMutation.mutateAsync(selectedCountryCode)
      } catch (err: any) {
        if (err?.response?.status !== 409) throw err
      }

      await addCityMutation.mutateAsync({
        city_id: newCityId,
        visit_date: newVisitDate || null,
        note: newNote || null,
      })
      setNewCityId(null)
      setNewVisitDate('')
      setNewNote('')
      setShowAddModal(false)
    } catch (err: any) {
      setAddError(err?.response?.data?.error?.message || 'Ошибка добавления города')
    }
  }

  const openEdit = (city: { id: string; note: string | null; visit_date: string | null }) => {
    setEditNoteId(city.id)
    setEditNote(city.note || '')
    setEditVisitDate(city.visit_date || '')
  }

  const handleUpdate = async () => {
    if (!editNoteId) return
    try {
      await updateMutation.mutateAsync({
        id: editNoteId,
        payload: {
          note: editNote || null,
          visit_date: editVisitDate || null,
        },
      })
      setEditNoteId(null)
    } catch (err: any) {
      // ошибка обрабатывается мутацией
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
    } catch (err: any) {
      // ошибка мутации
    }
  }

  const addedCityIds = new Set(visitedCities?.map((c) => c.city_id) ?? [])
  const availableCities = (referenceCities ?? []).filter((c) => !addedCityIds.has(c.id))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Мои города</h2>
        <div className="flex items-center gap-2">
          <select
            className="rounded-lg border border-gray-700 bg-dark-800 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            value={selectedCountryCode}
            onChange={(e) => setSelectedCountryCode(e.target.value)}
          >
            <option value="">— Все страны —</option>
            {countries?.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name_en}
              </option>
            ))}
          </select>
          <Button size="sm" onClick={() => setShowAddModal(true)} disabled={!selectedCountryCode}>
            + Город
          </Button>
        </div>
      </div>

      {isLoading && <Loader size="sm" />}
      {isError && <ErrorMessage message="Не удалось загрузить города" onRetry={() => refetch()} />}
      {visitedCities && visitedCities.length === 0 && (
        <div className="rounded-radius-lg border border-subtle bg-surface p-10 text-center">
          <p className="text-body text-white/85">Нет отмеченных городов</p>
          <Button size="sm" className="mt-3" onClick={() => setShowAddModal(true)}>
            Добавить первый
          </Button>
        </div>
      )}

      {visitedCities && visitedCities.length > 0 && (
        <div className="rounded-radius-lg border border-subtle bg-surface-elevated divide-y divide-subtle">
          {visitedCities.map((city) => (
            <div
              key={city.id}
              className="group flex items-start justify-between px-4 py-3 hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-base leading-none mt-0.5" role="img" aria-label={city.country_code}>
                  {countryCodeToFlagEmoji(city.country_code)}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-body font-medium text-white/85">{city.name}</span>
                    <span className="text-secondary text-white/60">({city.country_code})</span>
                  </div>
                  {city.visit_date && (
                    <p className="text-secondary text-white/60 mt-0.5">📅 {city.visit_date}</p>
                  )}
                  {city.note && (
                    <p className="text-secondary text-white/60 mt-0.5 italic line-clamp-2">{city.note}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => openEdit(city)}
                  className="text-xs text-primary-400 hover:underline opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                >
                  Заметка
                </button>
                <button
                  onClick={() => setDeleteTarget({ id: city.id, name: city.name })}
                  className="text-xs text-red-400 hover:text-red-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модалка добавления города */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Добавить город">
        <form onSubmit={handleAdd} className="space-y-3">
          {addError && <ErrorMessage message={addError} />}
          <FormField label="Город" required>
            <select
              className="w-full rounded-lg border border-gray-700 bg-dark-800 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              value={newCityId ?? ''}
              onChange={(e) => setNewCityId(Number(e.target.value) || null)}
            >
              <option value="">— Выберите город —</option>
              {availableCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Дата визита">
            <Input
              type="date"
              value={newVisitDate}
              onChange={(e) => setNewVisitDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </FormField>
          <FormField label="Заметка">
            <Input
              type="text"
              placeholder="Что запомнилось..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              maxLength={500}
            />
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>
              Отмена
            </Button>
            <Button
              type="submit"
              size="sm"
              loading={addCityMutation.isPending || addCountryMutation.isPending}
              disabled={!newCityId}
            >
              Добавить
            </Button>
          </div>
        </form>
      </Modal>

      {/* Модалка редактирования заметки */}
      <Modal open={!!editNoteId} onClose={() => setEditNoteId(null)} title="Редактировать заметку">
        <div className="space-y-3">
          <FormField label="Дата визита">
            <Input
              type="date"
              value={editVisitDate}
              onChange={(e) => setEditVisitDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </FormField>
          <FormField label="Заметка">
            <Input
              type="text"
              placeholder="Ваши впечатления..."
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              maxLength={500}
            />
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setEditNoteId(null)}>
              Отмена
            </Button>
            <Button size="sm" onClick={handleUpdate} loading={updateMutation.isPending}>
              Сохранить
            </Button>
          </div>
        </div>
      </Modal>

      {/* Модалка подтверждения удаления */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Удалить город?">
        <div className="space-y-3">
          <p className="text-sm text-gray-300">
            Удалить <strong>{deleteTarget?.name}</strong> из посещённых городов?
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
        </div>
      </Modal>
    </div>
  )
}