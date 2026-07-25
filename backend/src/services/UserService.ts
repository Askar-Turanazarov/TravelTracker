import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { AppError } from '../shared/AppError'

const prisma = new PrismaClient()

export class UserService {
  async deleteAccount(userId: string, password: string) {
    // Найти пользователя
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Пользователь не найден')
    }

    // Проверить пароль
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      throw new AppError(401, 'INVALID_PASSWORD', 'Неверный пароль')
    }

    // Каскадное удаление (все связанные записи удалятся благодаря ON DELETE CASCADE)
    await prisma.user.delete({ where: { id: userId } })
  }
}