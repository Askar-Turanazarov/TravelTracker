import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import pino from 'pino'
import { errorHandler } from './middlewares/errorHandler'
import { requestIdMiddleware } from './middlewares/requestId'
import { globalLimiter, authLimiter } from './middlewares/rateLimiter'
import authRoutes from './routes/authRoutes'
import referenceRoutes from './routes/referenceRoutes'
import visitedCountriesRoutes from './routes/visitedCountriesRoutes'
import visitedCitiesRoutes from './routes/visitedCitiesRoutes'
import dashboardRoutes from './routes/dashboardRoutes'
import adminRoutes from './routes/adminRoutes'
import userRoutes from './routes/userRoutes'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
})

const app = express()

// Безопасность
app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}))

// Лимиты и request-id
app.use(globalLimiter)
app.use(requestIdMiddleware)
app.use(express.json())

// Логирование с request-id
app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url, requestId: req.headers['x-request-id'] }, 'Request')
  next()
})

// Маршруты (rate-limit только для auth)
app.use('/api/v1/auth', authLimiter, authRoutes)
app.use('/api/v1/reference', referenceRoutes)
app.use('/api/v1/visited-countries', visitedCountriesRoutes)
app.use('/api/v1/visited-cities', visitedCitiesRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/users', userRoutes)

// Health-check с проверкой БД
app.get('/api/v1/health', async (_req, res) => {
  try {
    await prisma.$queryRawUnsafe('SELECT 1')
    res.json({ status: 'ok', db: 'connected' })
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' })
  }
})

app.use(errorHandler)

export default app