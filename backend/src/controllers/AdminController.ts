import { Request, Response, NextFunction } from 'express'
import { AdminService } from '../services/AdminService'

const adminService = new AdminService()

export class AdminController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const result = await adminService.getUsers(page, limit)
      res.json(result)
    } catch (err) {
      next(err)
    }
  }
}