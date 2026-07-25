import { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/UserService'

const userService = new UserService()

export class UserController {
  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { password } = req.body
      await userService.deleteAccount(req.user!.userId, password)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }
}