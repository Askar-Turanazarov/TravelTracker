import { PrismaClient } from '@prisma/client'
import { AppError } from '../shared/AppError'

const prisma = new PrismaClient()

export class VisitedCountriesService {
  // Получить все посещённые страны пользователя
  async getUserCountries(userId: string) {
    return prisma.visitedCountry.findMany({
      where: { user_id: userId },
      include: {
        country: {
          select: { name_en: true },
        },
      },
      orderBy: { added_at: 'asc' },
    })
  }

  // Добавить страну в посещённые
  async addCountry(userId: string, countryCode: string) {
    // Проверить, что страна существует в справочнике
    const country = await prisma.countryReference.findUnique({
      where: { code: countryCode },
    })
    if (!country) {
      throw new AppError(422, 'INVALID_COUNTRY_CODE', 'Страна с таким кодом не найдена')
    }

    // Проверить, не добавлена ли уже
    const existing = await prisma.visitedCountry.findUnique({
      where: {
        user_id_country_code: { user_id: userId, country_code: countryCode },
      },
    })
    if (existing) {
      throw new AppError(409, 'COUNTRY_ALREADY_ADDED', 'Эта страна уже в вашем списке')
    }

    const record = await prisma.visitedCountry.create({
      data: {
        user_id: userId,
        country_code: countryCode,
      },
      include: {
        country: {
          select: { name_en: true },
        },
      },
    })

    return record
  }

  // Удалить страну из посещённых (с каскадным удалением городов этой страны у пользователя)
  async deleteCountry(userId: string, visitedCountryId: string) {
    // Найти запись и проверить владение
    const record = await prisma.visitedCountry.findUnique({
      where: { id: visitedCountryId },
    })
    if (!record) {
      throw new AppError(404, 'NOT_FOUND', 'Запись не найдена')
    }
    if (record.user_id !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Доступ запрещён')
    }

    // Выполнить каскадное удаление городов в транзакции
    const [deletedCities] = await prisma.$transaction([
      prisma.visitedCity.deleteMany({
        where: {
          user_id: userId,
          country_code: record.country_code,
        },
      }),
      prisma.visitedCountry.delete({
        where: { id: visitedCountryId },
      }),
    ])

    return {
      deleted_country_id: visitedCountryId,
      cascaded_cities_deleted: deletedCities.count,
    }
  }
}