import { ZodSchema } from 'zod'
import { Request, Response, NextFunction } from 'express'
import { AppError } from './AppError'

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }))
      return next(new AppError(400, 'VALIDATION_ERROR', 'Validation failed', errors))
    }
    req.body = result.data
    next()
  }
}