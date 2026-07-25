import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class AdminService {
  async getUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          _count: {
            select: {
              visited_countries: true,
              visited_cities: true,
            },
          },
        },
      }),
      prisma.user.count(),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        display_name: u.display_name,
        countries_count: u._count.visited_countries,
        cities_count: u._count.visited_cities,
        created_at: u.created_at.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
      },
    }
  }
}