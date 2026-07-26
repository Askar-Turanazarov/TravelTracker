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

  // Автоматическое добавление страны, затем города
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    if (!newCityId || !selectedCountryCode) return
    setAddError(null)

    try {
      // Пытаемся добавить страну
      try {
        await addCountryMutation.mutateAsync(selectedCountryCode)
      } catch (err: any) {
        // 409 – страна уже есть, это нормально
        if (err?.response?.status !== 409) throw err
      }

      // Добавляем город
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
        <p className="text-sm text-gray-500">Нет отмеченных городов</p>
      )}

      {visitedCities && visitedCities.length > 0 && (
        <ul className="space-y-2">
          {visitedCities.map((city) => (
            <li
              key={city.id}
              className="flex items-start justify-between rounded-lg border border-gray-800 bg-dark-900 px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-200">{city.name}</span>
                  <span className="text-xs text-gray-500">({city.country_code})</span>
                </div>
                {city.visit_date && (
                  <p className="text-xs text-gray-400 mt-0.5">📅 {city.visit_date}</p>
                )}
                {city.note && (
                  <p className="text-xs text-gray-500 mt-0.5 italic line-clamp-2">{city.note}</p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => openEdit(city)}
                  className="text-xs text-primary-400 hover:underline"
                >
                  Заметка
                </button>
                <button
                  onClick={() => setDeleteTarget({ id: city.id, name: city.name })}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
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