import { PrismaClient } from '@prisma/client'
import { AppError } from '../shared/AppError'

const prisma = new PrismaClient()

export class VisitedCitiesService {
  // Получить все посещённые города пользователя, опционально отфильтрованные по стране
  async getUserCities(userId: string, countryCode?: string) {
    const where: any = { user_id: userId }
    if (countryCode) {
      where.country_code = countryCode
    }

    const cities = await prisma.visitedCity.findMany({
      where,
      include: {
        city: {
          select: {
            name: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    })

    return cities.map(vc => ({
      id: vc.id,
      city_id: vc.city_id,
      name: vc.city.name,
      country_code: vc.country_code,
      latitude: vc.city.latitude,
      longitude: vc.city.longitude,
      visit_date: vc.visit_date ? vc.visit_date.toISOString().split('T')[0] : null,
      note: vc.note,
      created_at: vc.created_at.toISOString(),
      updated_at: vc.updated_at.toISOString(),
    }))
  }

  // Добавить город в посещённые
  async addCity(userId: string, cityId: number, visitDate?: string | null, note?: string | null) {
    // Проверить существование города в справочнике
    const city = await prisma.cityReference.findUnique({ where: { id: cityId } })
    if (!city) {
      throw new AppError(422, 'INVALID_CITY_ID', 'Город с таким ID не найден в справочнике')
    }

    // Проверить, что пользователь добавил страну этого города
    const visitedCountry = await prisma.visitedCountry.findUnique({
      where: {
        user_id_country_code: {
          user_id: userId,
          country_code: city.country_code,
        },
      },
    })
    if (!visitedCountry) {
      throw new AppError(400, 'COUNTRY_NOT_ADDED', 'Сначала добавьте страну этого города в свой профиль', {
        required_country_code: city.country_code,
      })
    }

    // Проверить, что дата (если указана) не в будущем
    if (visitDate && new Date(visitDate) > new Date()) {
      throw new AppError(422, 'VISIT_DATE_IN_FUTURE', 'Дата визита не может быть в будущем')
    }

    // Проверить длину заметки
    if (note && note.length > 500) {
      throw new AppError(422, 'NOTE_TOO_LONG', 'Заметка не может превышать 500 символов')
    }

    // Проверить, что город ещё не добавлен
    const existing = await prisma.visitedCity.findUnique({
      where: {
        user_id_city_id: {
          user_id: userId,
          city_id: cityId,
        },
      },
    })
    if (existing) {
      throw new AppError(409, 'CITY_ALREADY_ADDED', 'Этот город уже в вашем списке')
    }

    const record = await prisma.visitedCity.create({
      data: {
        user_id: userId,
        city_id: cityId,
        country_code: city.country_code,
        visit_date: visitDate ? new Date(visitDate) : null,
        note: note || null,
      },
      include: {
        city: {
          select: {
            name: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    })

    return {
      id: record.id,
      city_id: record.city_id,
      name: record.city.name,
      country_code: record.country_code,
      latitude: record.city.latitude,
      longitude: record.city.longitude,
      visit_date: record.visit_date ? record.visit_date.toISOString().split('T')[0] : null,
      note: record.note,
      created_at: record.created_at.toISOString(),
      updated_at: record.updated_at.toISOString(),
    }
  }

  // Обновить заметку и/или дату визита
  async updateCity(userId: string, visitedCityId: string, updates: { visit_date?: string | null; note?: string | null }) {
    const record = await prisma.visitedCity.findUnique({ where: { id: visitedCityId } })
    if (!record) {
      throw new AppError(404, 'NOT_FOUND', 'Запись о посещённом городе не найдена')
    }
    if (record.user_id !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Доступ запрещён')
    }

    if (updates.visit_date && new Date(updates.visit_date) > new Date()) {
      throw new AppError(422, 'VISIT_DATE_IN_FUTURE', 'Дата визита не может быть в будущем')
    }

    if (updates.note && updates.note.length > 500) {
      throw new AppError(422, 'NOTE_TOO_LONG', 'Заметка не может превышать 500 символов')
    }

    const updated = await prisma.visitedCity.update({
      where: { id: visitedCityId },
      data: {
        ...(updates.visit_date !== undefined && { visit_date: updates.visit_date ? new Date(updates.visit_date) : null }),
        ...(updates.note !== undefined && { note: updates.note }),
      },
      include: {
        city: {
          select: {
            name: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    })

    return {
      id: updated.id,
      city_id: updated.city_id,
      name: updated.city.name,
      country_code: updated.country_code,
      latitude: updated.city.latitude,
      longitude: updated.city.longitude,
      visit_date: updated.visit_date ? updated.visit_date.toISOString().split('T')[0] : null,
      note: updated.note,
      created_at: updated.created_at.toISOString(),
      updated_at: updated.updated_at.toISOString(),
    }
  }

  // Удалить посещённый город
  async deleteCity(userId: string, visitedCityId: string) {
    const record = await prisma.visitedCity.findUnique({ where: { id: visitedCityId } })
    if (!record) {
      throw new AppError(404, 'NOT_FOUND', 'Запись не найдена')
    }
    if (record.user_id !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Доступ запрещён')
    }

    await prisma.visitedCity.delete({ where: { id: visitedCityId } })
    return { deleted_city_id: visitedCityId }
  }
}