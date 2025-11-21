# Koompi OAuth Integration Guide

Complete guide for integrating Koompi OAuth authentication in Backend, Web, and Mobile applications.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Backend Integration](#backend-integration)
4. [Mobile App Integration](#mobile-app-integration)
5. [Web App Integration](#web-app-integration)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This guide explains how to integrate Koompi OAuth 2.0 with PKCE (Proof Key for Code Exchange) authentication across your backend, mobile, and web applications.

### What is Koompi OAuth?

Koompi OAuth is a secure authentication provider that allows users to sign in with their Koompi account. It uses the OAuth 2.0 authorization code flow with PKCE for enhanced security.

### Authentication Flow

```
1. User clicks "Login" → App redirects to Koompi OAuth
2. User authenticates on Koompi → Koompi redirects back with auth code
3. Backend exchanges code for access token → Fetches user info
4. Backend creates/updates user → Generates JWT token
5. App receives JWT → Stores token and user data
```

---

## Architecture

### Component Overview

```
┌─────────────────┐
│  Mobile/Web App │
└────────┬────────┘
         │ 1. Initiate OAuth
         ▼
┌─────────────────┐
│  Backend API    │
└────────┬────────┘
         │ 2. Redirect to Koompi
         ▼
┌─────────────────┐
│  Koompi OAuth   │
└────────┬────────┘
         │ 3. User authenticates
         │ 4. Redirect with code
         ▼
┌─────────────────┐
│  Backend API    │
└────────┬────────┘
         │ 5. Exchange code
         │ 6. Fetch user info
         │ 7. Generate JWT
         ▼
┌─────────────────┐
│  Mobile/Web App │
└─────────────────┘
```

### Technology Stack

- **Backend**: Node.js + Express + TypeScript
- **Mobile**: React Native + Expo
- **OAuth Library**: `@koompi/oauth`
- **Database**: MongoDB (user storage)
- **Authentication**: JWT tokens

---

## Backend Integration

### 1. Installation

```bash
cd apps/backend
pnpm install @koompi/oauth jsonwebtoken mongoose
```

### 2. Environment Variables

Create `.env` file in `apps/backend/`:

```env
# Server Configuration
PORT=4000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bitriel

# Koompi OAuth Configuration
KOOMPI_CLIENT_ID=your-koompi-client-id
KOOMPI_CLIENT_SECRET=your-koompi-client-secret

# Web OAuth Redirect (for web apps)
KOOMPI_REDIRECT_URI=http://localhost:4000/api/oauth/callback

# Mobile OAuth Redirect (for mobile apps)
KOOMPI_MOBILE_REDIRECT_URI=http://localhost:4000/api/oauth/callback-mobile

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
FRONTEND_CALLBACK_PATH=/oauth/callback
```

**Production Environment (ngrok/deployed):**

```env
# For ngrok or production
KOOMPI_REDIRECT_URI=https://your-domain.com/api/oauth/callback
KOOMPI_MOBILE_REDIRECT_URI=https://your-domain.com/api/oauth/callback-mobile
FRONTEND_URL=https://your-frontend.com
```

### 3. Register OAuth App with Koompi

1. Go to Koompi OAuth Developer Portal
2. Create a new OAuth application
3. Set authorized redirect URIs:
   - `http://localhost:4000/api/oauth/callback` (web)
   - `http://localhost:4000/api/oauth/callback-mobile` (mobile)
   - `https://your-domain.com/api/oauth/callback` (production web)
   - `https://your-domain.com/api/oauth/callback-mobile` (production mobile)
4. Copy `CLIENT_ID` and `CLIENT_SECRET`

### 4. Project Structure

```
apps/backend/src/
├── controllers/
│   ├── oauthController.ts     # OAuth HTTP handlers
│   └── userController.ts      # User profile handlers
├── services/
│   ├── oauthService.ts        # OAuth business logic
│   └── userService.ts         # User business logic
├── models/
│   └── User.ts                # MongoDB user model
├── middleware/
│   └── auth.ts                # JWT authentication middleware
├── routes/
│   ├── oauthRoutes.ts         # OAuth endpoints
│   └── userRoutes.ts          # User endpoints
├── types/
│   └── oauth.ts               # OAuth TypeScript types
├── utils/
│   └── jwt.ts                 # JWT token utilities
└── config.ts                  # Environment configuration
```

### 5. Key Code Files

#### `src/services/oauthService.ts`

This service handles all OAuth business logic:

```typescript
import { KoompiAuth } from '@koompi/oauth';

export class OAuthService {
  // Create OAuth client for platform
  static createOAuthClient(isMobile: boolean): KoompiAuth {
    const redirectUri = isMobile
      ? config.koompi.mobileRedirectUri
      : config.koompi.redirectUri;

    return new KoompiAuth({
      clientId: config.koompi.clientId,
      clientSecret: config.koompi.clientSecret,
      redirectUri,
    });
  }

  // Exchange code for token and get user
  static async exchangeCodeAndGetUser(
    code: string,
    state: string,
    isMobile: boolean
  ) {
    // 1. Exchange authorization code for access token
    // 2. Fetch user info from Koompi
    // 3. Create/update user in database
    // 4. Generate JWT token
    // 5. Return user and token
  }
}
```

#### `src/controllers/oauthController.ts`

HTTP request handlers for OAuth endpoints:

```typescript
// GET /api/oauth/login?platform=mobile
export const login = async (req, res) => {
  const isMobile = req.query.platform === 'mobile';
  const authorizeUrl = await OAuthService.createAuthorizationUrl(isMobile);
  res.redirect(authorizeUrl);
};

// GET /api/oauth/callback (web)
// GET /api/oauth/callback-mobile (mobile)
export const callback = async (req, res) => {
  const { code, state } = req.query;
  const { user, token } = await OAuthService.exchangeCodeAndGetUser(...);
  res.redirect(`bitriel://oauth/callback?token=${token}`);
};
```

### 6. API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/oauth/login?platform=mobile` | GET | Initiates OAuth flow |
| `/api/oauth/callback` | GET | Web OAuth callback |
| `/api/oauth/callback-mobile` | GET | Mobile OAuth callback |
| `/api/auth/me` | GET | Get authenticated user profile |

### 7. Testing Backend

```bash
# Start backend
cd apps/backend
pnpm dev

# Test OAuth login (redirects to Koompi)
curl http://localhost:4000/api/oauth/login?platform=mobile

# Test user profile (requires valid JWT)
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Mobile App Integration

### 1. Installation

```bash
cd apps/mobile
pnpm install expo-web-browser expo-clipboard zustand
```

### 2. Environment Variables

Create `.env` file in `apps/mobile/`:

```env
# Backend API URL
EXPO_PUBLIC_BACKEND_URL=http://localhost:4000

# For testing with real device (use ngrok or local IP)
# EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:4000
# EXPO_PUBLIC_BACKEND_URL=https://your-ngrok-url.ngrok-free.app
```

### 3. Configure Deep Links

#### `app.json`

```json
{
  "expo": {
    "scheme": "bitriel",
    "ios": {
      "bundleIdentifier": "com.your.app",
      "infoPlist": {
        "CFBundleURLTypes": [
          {
            "CFBundleURLSchemes": ["bitriel"]
          }
        ]
      }
    },
    "android": {
      "package": "com.your.app",
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "bitriel"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### 4. Project Structure

```
apps/mobile/
├── hooks/
│   ├── useAuth.ts             # OAuth authentication hook
│   └── useUser.ts             # User data hooks
├── services/
│   └── backend/
│       └── user.ts            # User API service
├── store/
│   └── authStore.ts           # Zustand auth state
├── types/
│   └── auth.ts                # TypeScript types
└── app/
    ├── (auth)/
    │   └── welcome.tsx        # Login screen
    └── (wallet)/
        └── profile/
            └── index.tsx      # Profile screen
```

### 5. Key Components

#### `hooks/useAuth.ts`

Main authentication hook:

```typescript
export const useAuth = () => {
  const handleOAuthLogin = async () => {
    // 1. Open OAuth URL in browser
    const result = await WebBrowser.openAuthSessionAsync(
      `${BACKEND_URL}/api/oauth/login?platform=mobile`,
      'bitriel://oauth/callback'
    );

    // 2. Handle callback with token
    if (result.type === 'success') {
      const token = extractToken(result.url);
      authStore.setToken(token);

      // 3. Fetch user profile
      const user = await getUserProfile(token);
      authStore.setUser(user);

      // 4. Navigate to app
      router.replace('/(wallet)');
    }
  };

  return { handleOAuthLogin, handleLogout };
};
```

#### `store/authStore.ts`

Persistent authentication state using Zustand:

```typescript
export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      reset: () => set({ token: null, user: null }),
      isAuthenticated: () => !!get().token && !!get().user,
    }),
    {
      name: 'auth-storage',
      storage: SecureStoreAdapter, // Encrypted storage
    }
  )
);
```

### 6. Usage in Screens

#### Login Screen (`app/(auth)/welcome.tsx`)

```typescript
import { useAuth } from '@/hooks/useAuth';

export default function WelcomeScreen() {
  const { handleOAuthLogin, isLoading } = useAuth();

  return (
    <View>
      <Button
        onPress={handleOAuthLogin}
        disabled={isLoading}
      >
        <Text>Login with Koompi</Text>
      </Button>
    </View>
  );
}
```

#### Profile Screen (`app/(wallet)/profile/index.tsx`)

```typescript
import { useUser } from '@/hooks/useUser';

export default function ProfileScreen() {
  const user = useUser();

  return (
    <View>
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>
      <Text>{user?.walletAddress}</Text>
    </View>
  );
}
```

### 7. Development Best Practices

#### Using `__DEV__` for Development Logs

In React Native/Expo, use `__DEV__` instead of `process.env.NODE_ENV`:

```typescript
// ✅ Correct - React Native standard
if (__DEV__) {
  console.log('This only logs in development');
}

// ❌ Avoid - Not reliable in React Native
if (process.env.NODE_ENV === 'development') {
  console.log('May not work as expected');
}
```

**Why `__DEV__`?**
- Global constant defined by React Native
- `true` in dev builds, `false` in production
- Code is stripped by bundler in production
- More reliable across different build configurations
- Simple and straightforward - no utilities needed

### 8. Testing Mobile App

```bash
# Start Expo dev server
cd apps/mobile
pnpm start

# Run on device/simulator
pnpm android  # Android
pnpm ios      # iOS
```

**Testing Flow:**
1. Open app → tap "Login with Koompi"
2. Browser opens with Koompi login page
3. Enter credentials and authorize
4. Browser closes, app opens with user logged in
5. Check profile screen for user data

---

## Web App Integration

### 1. Installation

```bash
cd apps/web
pnpm install
```

### 2. Environment Variables

Create `.env` file in `apps/web/`:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:4000
```

### 3. OAuth Flow

```typescript
// Initiate OAuth
const login = () => {
  window.location.href = `${BACKEND_URL}/api/oauth/login?platform=web`;
};

// Handle callback
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  if (token) {
    localStorage.setItem('token', token);
    // Fetch user profile
    fetchUser(token);
  }
}, []);
```

---

## Testing

### End-to-End Testing Checklist

#### Backend Tests
- [ ] OAuth login redirects to Koompi
- [ ] OAuth callback creates/updates user
- [ ] JWT token generation works
- [ ] User profile endpoint returns data
- [ ] Authentication middleware validates tokens

#### Mobile Tests
- [ ] Login button opens OAuth browser
- [ ] OAuth callback returns to app
- [ ] Token stored securely
- [ ] User profile displays correctly
- [ ] Logout clears data

#### Integration Tests
- [ ] Complete OAuth flow works
- [ ] User data syncs between apps
- [ ] Token refresh works (if implemented)
- [ ] Error handling works correctly

### Manual Testing

1. **Start all services:**
```bash
# Terminal 1: Backend
cd apps/backend && pnpm dev

# Terminal 2: Mobile
cd apps/mobile && pnpm start
```

2. **Test OAuth flow:**
   - Tap login button
   - Verify Koompi page opens
   - Enter credentials
   - Verify redirect to app
   - Check user profile loads

3. **Test edge cases:**
   - Cancel OAuth flow
   - Invalid credentials
   - Network errors
   - Token expiration

---

## Troubleshooting

### Common Issues

#### 1. "Redirect URI mismatch" Error

**Problem:** Koompi OAuth rejects the redirect URI.

**Solution:**
- Verify redirect URIs in Koompi OAuth dashboard match exactly:
  - `http://localhost:4000/api/oauth/callback`
  - `http://localhost:4000/api/oauth/callback-mobile`
- Check `KOOMPI_REDIRECT_URI` in `.env`
- Ensure no trailing slashes

#### 2. Mobile App Not Opening After OAuth

**Problem:** Browser doesn't redirect back to app.

**Solution:**
- Verify `scheme: "bitriel"` in `app.json`
- Check deep link configuration in iOS/Android
- Rebuild app after changing `app.json`:
  ```bash
  pnpm android  # or pnpm ios
  ```

#### 3. "Invalid Token" Error

**Problem:** Backend rejects JWT token.

**Solution:**
- Check `JWT_SECRET` matches between token generation and validation
- Verify token hasn't expired (check `JWT_EXPIRES_IN`)
- Ensure Authorization header format: `Bearer <token>`

#### 4. User Data Not Loading

**Problem:** Profile screen shows no data.

**Solution:**
- Check `EXPO_PUBLIC_BACKEND_URL` is correct
- Verify backend is running
- Check network requests in dev tools
- Confirm JWT token is stored:
  ```typescript
  console.log(useAuthStore.getState().token);
  ```

#### 5. "CORS Error" in Web App

**Problem:** Browser blocks API requests.

**Solution:**
- Add CORS middleware in backend:
  ```typescript
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));
  ```

### Debug Logs

Enable detailed logging:

**Backend:**
```typescript
// src/services/oauthService.ts
console.log('[OAuth] Processing callback:', { code, state, isMobile });
```

**Mobile:**
```typescript
// hooks/useAuth.ts
console.log('[Auth] OAuth URL:', authUrl);
console.log('[Auth] Token received:', token);
```

---

## Security Best Practices

1. **Never commit secrets:**
   - Add `.env` to `.gitignore`
   - Use environment variables for all secrets

2. **Secure token storage:**
   - Use `expo-secure-store` on mobile
   - Use `httpOnly` cookies on web

3. **Validate tokens:**
   - Always verify JWT signatures
   - Check token expiration
   - Implement token refresh

4. **HTTPS in production:**
   - Always use HTTPS for OAuth redirects
   - Use SSL/TLS for backend APIs

5. **Error handling:**
   - Don't expose internal errors to users
   - Log errors securely
   - Handle edge cases gracefully

---

## Additional Resources

- [Koompi OAuth Documentation](https://oauth.koompi.org/docs)
- [OAuth 2.0 Spec](https://oauth.net/2/)
- [PKCE RFC](https://tools.ietf.org/html/rfc7636)
- [Expo Web Browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## Support

For issues or questions:
- Backend issues: Check `apps/backend/README.md`
- Mobile issues: Check `apps/mobile/README.md`
- OAuth provider issues: Contact Koompi support

---

**Last Updated:** 2025-01-21
**Version:** 1.0.0
