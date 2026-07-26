import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const TOTAL_COUNTRIES = 195

export class DashboardService {
  async getStats(userId: string) {
    // Количество стран
    const countryCount = await prisma.visitedCountry.count({
      where: { user_id: userId },
    })

    // Количество городов
    const cityCount = await prisma.visitedCity.count({
      where: { user_id: userId },
    })

    const worldPercentage = parseFloat(((countryCount / TOTAL_COUNTRIES) * 100).toFixed(2))

    // Разбивка по регионам
    const visitedCountries = await prisma.visitedCountry.findMany({
      where: { user_id: userId },
      include: {
        country: { select: { region: true } },
      },
    })

    const regionMap = new Map<string, number>()
    visitedCountries.forEach((vc) => {
      const region = vc.country.region
      regionMap.set(region, (regionMap.get(region) || 0) + 1)
    })
    const countriesByRegion = Array.from(regionMap.entries())
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count)

    // Последние 5 городов
    const latestVisits = await prisma.visitedCity.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 5,
      include: {
        city: { select: { name: true } },
      },
    })
    const latest_visits = latestVisits.map((v) => ({
      city_name: v.city.name,
      country_code: v.country_code,
      visit_date: v.visit_date ? v.visit_date.toISOString().split('T')[0] : null,
    }))

    return {
      total_countries_visited: countryCount,
      total_cities_visited: cityCount,
      world_percentage: worldPercentage,
      countries_by_region: countriesByRegion,
      latest_visits,
    }
  }
}