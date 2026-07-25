import { Request, Response, NextFunction } from 'express'
import { VisitedCitiesService } from '../services/VisitedCitiesService'

const visitedCitiesService = new VisitedCitiesService()

export class VisitedCitiesController {
  async getUserCities(req: Request, res: Response, next: NextFunction) {
    try {
      const countryCode = req.query.country_code as string | undefined
      const cities = await visitedCitiesService.getUserCities(req.user!.userId, countryCode)
      res.json({ cities })
    } catch (err) {
      next(err)
    }
  }

  async addCity(req: Request, res: Response, next: NextFunction) {
    try {
      const { city_id, visit_date, note } = req.body
      const result = await visitedCitiesService.addCity(req.user!.userId, city_id, visit_date, note)
      res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  }

  async updateCity(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { visit_date, note } = req.body
      const result = await visitedCitiesService.updateCity(req.user!.userId, id, { visit_date, note })
      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  async deleteCity(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const result = await visitedCitiesService.deleteCity(req.user!.userId, id)
      res.json(result)
    } catch (err) {
      next(err)
    }
  }
}