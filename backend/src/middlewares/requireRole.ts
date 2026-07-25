import { Request, Response, NextFunction } from 'express'
import { AppError } from '../shared/AppError'

export function requireRole(role: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return next(new AppError(403, 'FORBIDDEN', 'You do not have permission to access this resource'))
    }
    next()
  }
}