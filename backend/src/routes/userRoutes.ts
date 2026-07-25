import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { authMiddleware } from '../middlewares/auth'
import { validate } from '../shared/validation'
import { z } from 'zod'

const controller = new UserController()
const router = Router()

router.use(authMiddleware)

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Пароль обязателен'),
})

router.delete('/me', validate(deleteAccountSchema), controller.deleteAccount.bind(controller))

export default router