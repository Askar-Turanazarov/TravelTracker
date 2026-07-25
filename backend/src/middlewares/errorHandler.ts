import { Request, Response, NextFunction } from 'express'
import { AppError } from '../shared/AppError'
import pino from 'pino'

const logger = pino()

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    })
  }

  logger.error(err)
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal Server Error',
      details: null,
    },
  })
}