import { Router } from 'express'
import { VisitedCountriesController } from '../controllers/VisitedCountriesController'
import { authMiddleware } from '../middlewares/auth'
import { validate } from '../shared/validation'
import { z } from 'zod'

const controller = new VisitedCountriesController()

const addCountrySchema = z.object({
  country_code: z.string().length(2),
})

const router = Router()
router.use(authMiddleware)

router.get('/', controller.getUserCountries.bind(controller))
router.post('/', validate(addCountrySchema), controller.addCountry.bind(controller))
router.delete('/:id', controller.deleteCountry.bind(controller))

export default router