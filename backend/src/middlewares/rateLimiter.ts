import { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // 5 запросов с одного IP
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Слишком много запросов. Пожалуйста, попробуйте позже.',
      details: null,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
})