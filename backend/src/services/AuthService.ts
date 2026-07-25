import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { generateAccessToken, generateRefreshToken } from '../shared/tokenUtils'
import { AppError } from '../shared/AppError'

const prisma = new PrismaClient()

export class AuthService {
  // Регистрация нового пользователя
  async register(email: string, password: string, display_name: string) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'Пользователь с таким email уже существует')
    }

    const password_hash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        display_name,
        role: 'traveler',
      },
    })

    const access_token = generateAccessToken(user.id, user.role)
    const refresh_token = generateRefreshToken(user.id, user.role)

    // Хэшируем refresh-токен для хранения в БД
    const token_hash = crypto.createHash('sha256').update(refresh_token).digest('hex')

    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token_hash,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
      },
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        role: user.role,
      },
      tokens: {
        access_token,
        refresh_token,
        expires_in: 900,
      },
    }
  }

  // Вход по email и паролю
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Неверный email или пароль')
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Неверный email или пароль')
    }

    const access_token = generateAccessToken(user.id, user.role)
    const refresh_token = generateRefreshToken(user.id, user.role)

    const token_hash = crypto.createHash('sha256').update(refresh_token).digest('hex')

    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token_hash,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        role: user.role,
      },
      tokens: {
        access_token,
        refresh_token,
        expires_in: 900,
      },
    }
  }

  // Обновление токенов (refresh token rotation)
  async refresh(refreshToken: string) {
    const token_hash = crypto.createHash('sha256').update(refreshToken).digest('hex')

    // Ищем неотозванный токен с таким хэшем
    const tokenRecord = await prisma.refreshToken.findFirst({
      where: {
        token_hash,
        revoked: false,
      },
    })

    if (!tokenRecord) {
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token not found or already revoked')
    }

    // Проверяем срок действия
    if (new Date() > tokenRecord.expires_at) {
      // Токен истёк, помечаем отозванным
      await prisma.refreshToken.update({
        where: { token_id: tokenRecord.token_id },
        data: { revoked: true },
      })
      throw new AppError(401, 'EXPIRED_REFRESH_TOKEN', 'Refresh token expired')
    }

    // Отзываем старый токен
    await prisma.refreshToken.update({
      where: { token_id: tokenRecord.token_id },
      data: { revoked: true },
    })

    // Выпускаем новые токены
    const user = await prisma.user.findUnique({ where: { id: tokenRecord.user_id } })
    if (!user) {
      throw new AppError(401, 'USER_NOT_FOUND', 'User not found')
    }

    const access_token = generateAccessToken(user.id, user.role)
    const new_refresh_token = generateRefreshToken(user.id, user.role)
    const new_token_hash = crypto.createHash('sha256').update(new_refresh_token).digest('hex')

    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token_hash: new_token_hash,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return {
      access_token,
      refresh_token: new_refresh_token,
      expires_in: 900,
    }
  }

  // Выход (отзыв refresh-токена)
  async logout(refreshToken: string) {
    const token_hash = crypto.createHash('sha256').update(refreshToken).digest('hex')

    const tokenRecord = await prisma.refreshToken.findFirst({
      where: {
        token_hash,
        revoked: false,
      },
    })

    if (tokenRecord) {
      await prisma.refreshToken.update({
        where: { token_id: tokenRecord.token_id },
        data: { revoked: true },
      })
    }
  }
}