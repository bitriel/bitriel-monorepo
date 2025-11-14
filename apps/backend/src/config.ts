import type { SignOptions } from 'jsonwebtoken'

const ensure = (value: string | undefined, key: string) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

const jwtSecret = ensure(process.env.JWT_SECRET, 'JWT_SECRET')
const jwtExpiresIn = (process.env.JWT_EXPIRES_IN ?? '15m') as SignOptions['expiresIn']

export const config = {
  server: {
    port: Number(process.env.PORT ?? 4000),
  },
  jwt: {
    secret: jwtSecret,
    expiresIn: jwtExpiresIn,
  },
}

export type JwtConfig = typeof config.jwt
