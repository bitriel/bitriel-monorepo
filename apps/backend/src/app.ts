import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import morgan from 'morgan'
import { config } from './config.js'
import { authenticate, type AuthenticatedRequest } from './middleware/authenticate.js'
import oauthRoutes from './routes/oauthRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/auth/token', (req, res) => {
  const { userId, roles = [] } = req.body as { userId?: string; roles?: string[] }

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' })
  }

  const token = jwt.sign({ sub: userId, roles }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })

  return res.json({ token, expiresIn: config.jwt.expiresIn })
})

app.get('/me', authenticate, (req, res) => {
  const { user } = req as AuthenticatedRequest

  return res.json({
    userId: user?.sub,
    claims: user,
  })
})

// OAuth routes
app.use('/api/oauth', oauthRoutes)

// User routes
app.use('/api/auth', userRoutes)

export default app
