# Bitriel Backend API

Node.js + Express + TypeScript backend API for Bitriel digital wallet application with Koompi OAuth integration.

## Features

- 🔐 Koompi OAuth 2.0 + PKCE authentication
- 🎫 JWT token-based authorization
- 👤 User profile management
- 🗄️ MongoDB database integration
- 📱 Separate endpoints for web and mobile platforms
- 🛡️ TypeScript for type safety
- 🏗️ Clean architecture with service layer

## Prerequisites

- Node.js 18+ and pnpm 9+
- MongoDB 5+ (local or cloud)
- Koompi OAuth credentials (client ID & secret)

## Quick Start

### 1. Install Dependencies

```bash
cd apps/backend
pnpm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=4000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# MongoDB
MONGODB_URI=mongodb://localhost:27017/bitriel

# Koompi OAuth
KOOMPI_CLIENT_ID=your-koompi-client-id
KOOMPI_CLIENT_SECRET=your-koompi-client-secret
KOOMPI_REDIRECT_URI=http://localhost:4000/api/oauth/callback
KOOMPI_MOBILE_REDIRECT_URI=http://localhost:4000/api/oauth/callback-mobile

# Frontend
FRONTEND_URL=http://localhost:3000
FRONTEND_CALLBACK_PATH=/oauth/callback
```

### 3. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

### 4. Run Development Server

```bash
pnpm dev
```

Server will start at `http://localhost:4000`

## API Endpoints

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/oauth/login` | GET | Initiates OAuth flow (query: `?platform=mobile\|web`) |
| `/api/oauth/callback` | GET | Web OAuth callback |
| `/api/oauth/callback-mobile` | GET | Mobile OAuth callback |
| `/api/auth/me` | GET | Get authenticated user profile (requires JWT) |

### Testing Endpoints

```bash
# Test OAuth login (redirects to Koompi)
curl http://localhost:4000/api/oauth/login?platform=mobile

# Test user profile (requires valid JWT)
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
apps/backend/src/
├── controllers/        # HTTP request handlers
│   ├── oauthController.ts
│   └── userController.ts
├── services/          # Business logic layer
│   ├── oauthService.ts
│   └── userService.ts
├── models/            # MongoDB schemas
│   └── User.ts
├── middleware/        # Express middleware
│   └── auth.ts
├── routes/            # API route definitions
│   ├── oauthRoutes.ts
│   └── userRoutes.ts
├── types/             # TypeScript types
│   └── oauth.ts
├── utils/             # Utility functions
│   └── jwt.ts
├── config.ts          # Environment config
└── index.ts           # App entry point
```

## Development

### Available Scripts

```bash
pnpm dev          # Start development server with hot reload
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Documentation

- **Full OAuth Integration Guide:** See [KOOMPI_OAUTH_INTEGRATION.md](../../docs/KOOMPI_OAUTH_INTEGRATION.md)
- **API Documentation:** See [API Endpoints](#api-endpoints) above

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB is running: `docker ps`
   - Verify `MONGODB_URI` in `.env`

2. **OAuth Redirect Mismatch**
   - Verify redirect URIs in Koompi OAuth dashboard
   - Ensure exact match with `.env` values

3. **Invalid JWT Token**
   - Check `JWT_SECRET` is set
   - Verify token format: `Bearer <token>`

## Security

- ✅ Never commit `.env` files
- ✅ Use strong JWT secrets (32+ characters)
- ✅ Enable HTTPS in production
- ✅ Validate all user inputs

## Support

For detailed integration guide and troubleshooting:
- See [docs/KOOMPI_OAUTH_INTEGRATION.md](../../docs/KOOMPI_OAUTH_INTEGRATION.md)

---

**Last Updated:** 2025-01-21
