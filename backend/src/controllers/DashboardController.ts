import { Request, Response, NextFunction } from 'express'
import { DashboardService } from '../services/DashboardService'

const dashboardService = new DashboardService()

export class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await dashboardService.getStats(req.user!.userId)
      res.json(stats)
    } catch (err) {
      next(err)
    }
  }
}