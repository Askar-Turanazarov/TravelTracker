import { Request, Response, NextFunction } from 'express'
import { ReferenceService } from '../services/ReferenceService'

const referenceService = new ReferenceService()

export class ReferenceController {
  async getCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const region = req.query.region as string | undefined
      const countries = await referenceService.getCountries(region)
      res.json({ countries })
    } catch (err) {
      next(err)
    }
  }

  async getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const countryCode = req.query.country_code as string
      if (!countryCode) {
        return res.status(400).json({
          error: {
            code: 'MISSING_PARAMETER',
            message: 'Параметр country_code обязателен',
            details: null,
          },
        })
      }
      const cities = await referenceService.getCities(countryCode)
      res.json({ cities })
    } catch (err) {
      next(err)
    }
  }
}