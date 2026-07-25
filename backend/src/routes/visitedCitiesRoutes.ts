import { Router } from 'express'
import { VisitedCitiesController } from '../controllers/VisitedCitiesController'
import { authMiddleware } from '../middlewares/auth'
import { validate } from '../shared/validation'
import { z } from 'zod'

const controller = new VisitedCitiesController()

const addCitySchema = z.object({
  city_id: z.number().int().positive(),
  visit_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  note: z.string().max(500).nullable().optional(),
})

const updateCitySchema = z.object({
  visit_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  note: z.string().max(500).nullable().optional(),
})

const router = Router()
router.use(authMiddleware)

router.get('/', controller.getUserCities.bind(controller))
router.post('/', validate(addCitySchema), controller.addCity.bind(controller))
router.patch('/:id', validate(updateCitySchema), controller.updateCity.bind(controller))
router.delete('/:id', controller.deleteCity.bind(controller))

export default router