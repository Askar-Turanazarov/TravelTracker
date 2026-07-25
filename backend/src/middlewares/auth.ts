import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../shared/AppError'

// Расширяем тип Request, чтобы добавить поле user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        role: string
      }
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Access token is missing'))
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      sub: string
      role: string
      iat: number
      exp: number
    }
    req.user = { userId: payload.sub, role: payload.role }
    next()
  } catch (err) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Invalid or expired access token'))
  }
}