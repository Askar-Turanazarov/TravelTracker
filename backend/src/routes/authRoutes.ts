import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { validate } from '../shared/validation'
import { registerSchema, loginSchema } from '../shared/authValidation'

const authController = new AuthController()

const router = Router()

router.post('/register', validate(registerSchema), authController.register.bind(authController))
router.post('/login', validate(loginSchema), authController.login.bind(authController))
router.post('/refresh', authController.refresh.bind(authController))
router.post('/logout', authController.logout.bind(authController))

export default router