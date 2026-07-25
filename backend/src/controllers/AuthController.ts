import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/AuthService'

const authService = new AuthService()

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, display_name } = req.body
      const result = await authService.register(email, password, display_name)
      res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const result = await authService.login(email, password)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body
      if (!refresh_token) {
        return res.status(400).json({
          error: {
            code: 'MISSING_REFRESH_TOKEN',
            message: 'Refresh token is required',
            details: null,
          },
        })
      }
      const result = await authService.refresh(refresh_token)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body
      if (refresh_token) {
        await authService.logout(refresh_token)
      }
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }
}