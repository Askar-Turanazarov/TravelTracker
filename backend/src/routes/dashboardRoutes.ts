import { Router } from 'express'
import { DashboardController } from '../controllers/DashboardController'
import { authMiddleware } from '../middlewares/auth'

const controller = new DashboardController()
const router = Router()

router.use(authMiddleware)
router.get('/stats', controller.getStats.bind(controller))

export default router