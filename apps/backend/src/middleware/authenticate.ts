import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export type AuthenticatedRequest = Request & {
  user?: jwt.JwtPayload & { sub?: string }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' })
  }

  const token = header.slice(7)

  try {
    const payload = jwt.verify(token, config.jwt.secret)
    ;(req as AuthenticatedRequest).user =
      typeof payload === 'string' ? { sub: payload } : (payload as jwt.JwtPayload & { sub?: string })
    return next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
