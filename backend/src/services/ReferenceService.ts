import { AppError } from '../shared/AppError'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ReferenceService {
  // Получить все страны, опционально фильтр по региону
  async getCountries(region?: string) {
    const where = region ? { region } : {}
    return prisma.countryReference.findMany({
      where,
      select: {
        code: true,
        name_en: true,
        name_ru: true,
        region: true,
      },
      orderBy: { name_en: 'asc' },
    })
  }

  // Получить города для указанной страны
  async getCities(countryCode: string) {
    // Проверяем, существует ли страна
    const country = await prisma.countryReference.findUnique({
      where: { code: countryCode },
    })
    if (!country) {
      throw new AppError(422, 'INVALID_COUNTRY_CODE', 'Указанный код страны не найден в справочнике')
    }

    return prisma.cityReference.findMany({
      where: { country_code: countryCode },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
      },
      orderBy: { name: 'asc' },
    })
  }
}