import { Router } from 'express'
import { AdminController } from '../controllers/AdminController'
import { authMiddleware } from '../middlewares/auth'
import { requireRole } from '../middlewares/requireRole'

const controller = new AdminController()
const router = Router()

router.use(authMiddleware)
router.use(requireRole('admin'))

router.get('/users', controller.getUsers.bind(controller))

export default router