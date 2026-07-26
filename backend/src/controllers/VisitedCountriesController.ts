import { Request, Response, NextFunction } from 'express'
import { VisitedCountriesService } from '../services/VisitedCountriesService'

const visitedCountriesService = new VisitedCountriesService()

export class VisitedCountriesController {
  async getUserCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const countries = await visitedCountriesService.getUserCountries(req.user!.userId)
      const result = countries.map((vc) => ({
        id: vc.id,
        country_code: vc.country_code,
        name_en: vc.country.name_en,
        centroid_lat: vc.country.centroid_lat,
        centroid_lng: vc.country.centroid_lng,
        added_at: vc.added_at.toISOString(),
      }))
      res.json({ countries: result })
    } catch (err) {
      next(err)
    }
  }

  async addCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const { country_code } = req.body
      const record = await visitedCountriesService.addCountry(req.user!.userId, country_code)
      res.status(201).json({
        id: record.id,
        country_code: record.country_code,
        name_en: record.country.name_en,
        centroid_lat: record.country.centroid_lat,
        centroid_lng: record.country.centroid_lng,
        added_at: record.added_at.toISOString(),
      })
    } catch (err) {
      next(err)
    }
  }

  async deleteCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const result = await visitedCountriesService.deleteCountry(req.user!.userId, id)
      res.json(result)
    } catch (err) {
      next(err)
    }
  }
}