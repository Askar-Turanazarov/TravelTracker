import { Router } from 'express'
import { ReferenceController } from '../controllers/ReferenceController'

const referenceController = new ReferenceController()

const router = Router()

router.get('/countries', referenceController.getCountries.bind(referenceController))
router.get('/cities', referenceController.getCities.bind(referenceController))

export default router