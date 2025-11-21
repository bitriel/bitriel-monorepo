import type { SignOptions } from 'jsonwebtoken';

const ensure = (value: string | undefined, key: string) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const jwtSecret = ensure(process.env.JWT_SECRET, 'JWT_SECRET');
const jwtExpiresIn = (process.env.JWT_EXPIRES_IN ?? '15m') as SignOptions['expiresIn'];

export const config = {
  server: {
    port: Number(process.env.PORT ?? 4000),
  },
  jwt: {
    secret: jwtSecret,
    expiresIn: jwtExpiresIn,
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/bitriel',
  },
  koompi: {
    clientId: ensure(process.env.KOOMPI_CLIENT_ID, 'KOOMPI_CLIENT_ID'),
    clientSecret: ensure(process.env.KOOMPI_CLIENT_SECRET, 'KOOMPI_CLIENT_SECRET'),
    redirectUri: process.env.KOOMPI_REDIRECT_URI || 'http://localhost:4000/api/oauth/callback',
    mobileRedirectUri: process.env.KOOMPI_MOBILE_REDIRECT_URI || 'http://localhost:4000/api/oauth/callback-mobile',
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
    callbackPath: process.env.FRONTEND_CALLBACK_PATH || '/oauth/callback',
  },
  mobile: {
    url: process.env.MOBILE_URL || 'http://localhost:5173',
    callbackPath: process.env.MOBILE_CALLBACK_PATH || '/oauth/callback',
  },
};

export type JwtConfig = typeof config.jwt;
