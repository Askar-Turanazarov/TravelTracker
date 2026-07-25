import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TOTAL_COUNTRIES = 195

export class DashboardService {
  async getStats(userId: string) {
    // Запрос количества стран и городов
    const [countryCount, cityCount] = await Promise.all([
      prisma.visitedCountry.count({ where: { user_id: userId } }),
      prisma.visitedCity.count({ where: { user_id: userId } }),
    ])

    const worldPercentage = parseFloat(((countryCount / TOTAL_COUNTRIES) * 100).toFixed(2))

    // Разбивка по регионам
    const regionBreakdown = await prisma.$queryRawUnsafe<Array<{ region: string; count: bigint }>>(
      `SELECT cr.region, COUNT(DISTINCT vc.country_code)::bigint AS count
       FROM visited_countries vc
       JOIN countries_reference cr ON cr.code = vc.country_code
       WHERE vc.user_id = $1
       GROUP BY cr.region
       ORDER BY count DESC`,
      userId
    )

    const countriesByRegion = regionBreakdown.map((r) => ({
      region: r.region,
      count: Number(r.count),
    }))

    // Последние 5 визитов
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