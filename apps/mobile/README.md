# Bitriel Mobile App

React Native mobile application built with Expo for Bitriel digital wallet.

## Features

- 🔐 Koompi OAuth authentication with deep linking
- 👤 User profile management
- 💳 Wallet functionality
- 🎨 NativeWind styling (Tailwind CSS for React Native)
- 🌗 Dark mode support
- 📱 iOS and Android support
- 🔒 Secure token storage with expo-secure-store

## Prerequisites

- Node.js 18+ and pnpm 9+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Physical device for testing (optional)

## Quick Start

### 1. Install Dependencies

```bash
cd apps/mobile
pnpm install
```

### 2. Environment Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Backend API URL
EXPO_PUBLIC_BACKEND_URL=http://localhost:4000

# For testing on physical device (use your machine's local IP)
# EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:4000

# For testing with ngrok
# EXPO_PUBLIC_BACKEND_URL=https://your-ngrok-url.ngrok-free.app
```

### 3. Start Development Server

```bash
pnpm start
```

### 4. Run on Device/Simulator

```bash
pnpm android  # Android
pnpm ios      # iOS
pnpm web      # Web (limited functionality)
```

## Project Structure

```
apps/mobile/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication flow
│   │   └── welcome.tsx    # Login screen
│   └── (wallet)/          # Main app screens
│       ├── index.tsx      # Wallet home
│       └── profile/       # User profile
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   └── useUser.ts        # User data hooks
├── services/             # API services
│   └── backend/
│       └── user.ts       # User API calls
├── store/                # State management (Zustand)
│   └── authStore.ts      # Authentication state
├── types/                # TypeScript type definitions
│   └── auth.ts           # Auth-related types
├── utils/                # Utility functions
│   └── dev.ts            # Development helpers
├── lib/                  # Third-party integrations
├── theme/                # Theming configuration
└── app.json              # Expo configuration
```

## Development Best Practices

### Using `__DEV__` for Development Logs

In React Native/Expo, always use `__DEV__` instead of `process.env.NODE_ENV`:

```typescript
// ✅ Correct - React Native standard
if (__DEV__) {
  console.log('[Component] Debug message');
}

// ❌ Avoid - Not reliable in React Native
if (process.env.NODE_ENV === 'development') {
  console.log('May not work correctly');
}
```

**Why `__DEV__`?**

- Global constant automatically defined by React Native
- `true` in development builds, `false` in production
- Production code is automatically stripped by bundler
- More reliable across different build configurations
- Zero performance impact in production
- Simple and straightforward - no utilities needed

### Logging Conventions

Use prefixed logs for easy filtering:

```typescript
console.log('[AuthStore] Setting token');
console.log('[Auth] OAuth flow started');
console.error('[UserService] Profile fetch failed');
```

## Key Features

### Authentication Flow

1. **Login Screen** (`app/(auth)/welcome.tsx`)

   - Koompi OAuth integration
   - Deep link handling
   - Loading states

2. **OAuth Hook** (`hooks/useAuth.ts`)

   - `handleOAuthLogin()` - Initiates OAuth flow
   - `handleLogout()` - Logs out user
   - `isAuthenticated` - Auth status

3. **Auth Store** (`store/authStore.ts`)
   - Zustand state management
   - Persistent secure storage
   - Token and user data

### Profile Screen

**Location:** `app/(wallet)/profile/index.tsx`

**Features:**

- Display user information (name, email, phone, wallet address)
- Profile picture with fallback
- Copy-to-clipboard for all fields
- Visual feedback on copy
- Logout functionality

**Usage:**

```typescript
import { useUser, useUserDisplayName } from '@/hooks/useUser';

function MyComponent() {
  const user = useUser();
  const displayName = useUserDisplayName();

  return <Text>{displayName}</Text>;
}
```

### Available Hooks

#### `useAuth()`

```typescript
const { handleOAuthLogin, handleLogout, isLoading, error, isAuthenticated } = useAuth();
```

#### `useUser()`

```typescript
const user = useUser(); // Get current user or null
const displayName = useUserDisplayName(); // Get formatted name
const fullName = useUserFullName(); // Get first + last name
const hasWallet = useHasWallet(); // Check wallet existence
const hasEmail = useHasEmail(); // Check email existence
const hasPhone = useHasPhone(); // Check phone existence
```

## Environment Variables

| Variable                  | Description     | Example                 |
| ------------------------- | --------------- | ----------------------- |
| `EXPO_PUBLIC_BACKEND_URL` | Backend API URL | `http://localhost:4000` |

**Note:** Only variables prefixed with `EXPO_PUBLIC_` are accessible in the app.

## Deep Links

The app responds to deep links using the `bitriel://` scheme:

- `bitriel://oauth/callback?token=...` - OAuth callback
- `bitriel://oauth/callback?error=...` - OAuth error

**Configuration:** See `app.json` for iOS and Android intent filters.

## Building

### Development Build

```bash
# Android
eas build --profile development --platform android

# iOS
eas build --profile development --platform ios
```

### Production Build

```bash
# Android
eas build --profile production --platform android

# iOS
eas build --profile production --platform ios
```

## Testing

### Manual Testing

1. **Start development server:**

```bash
pnpm start
```

2. **Test OAuth flow:**

   - Tap "Login with Koompi"
   - Verify browser opens
   - Complete authentication
   - Verify redirect to app
   - Check profile screen

3. **Test profile features:**
   - View user information
   - Test copy-to-clipboard
   - Test logout

### Testing on Physical Device

#### Android (via USB)

```bash
# Enable USB debugging on device
# Connect via USB
pnpm android
```

#### iOS (via USB)

```bash
# Device must be registered with Apple Developer
pnpm ios --device
```

#### Over Network (Both Platforms)

1. Ensure device and computer on same network
2. Scan QR code shown by `pnpm start`
3. Install Expo Go app first (for development builds)

### Testing with ngrok

For testing OAuth on real devices:

```bash
# Start ngrok
ngrok http 4000

# Update mobile .env
EXPO_PUBLIC_BACKEND_URL=https://abc123.ngrok-free.app

# Update backend to allow this URL
# Restart both services
```

## Troubleshooting

### Common Issues

#### 1. "Cannot connect to backend"

**Solution:**

- Verify `EXPO_PUBLIC_BACKEND_URL` in `.env`
- Check backend is running: `curl http://localhost:4000/health`
- For physical devices, use local IP instead of `localhost`

#### 2. "Deep link not working"

**Solution:**

- Verify `scheme: "bitriel"` in `app.json`
- Rebuild app after changing `app.json`:
  ```bash
  pnpm android  # or pnpm ios
  ```
- Check intent filters are configured correctly

#### 3. "Token storage failed"

**Solution:**

- Verify expo-secure-store is installed
- Clear app data and reinstall
- Check device has sufficient storage

#### 4. "**DEV** is not defined"

**Solution:**

- This should never happen in React Native
- If it does, add TypeScript declaration:
  ```typescript
  // global.d.ts
  declare const __DEV__: boolean;
  ```

### Debug Mode

Enable detailed logging:

```typescript
// In any file
if (__DEV__) {
  console.log('Debug info:', data);
}
```

View logs:

```bash
# React Native logs
npx react-native log-android  # Android
npx react-native log-ios      # iOS

# Or use Expo CLI
pnpm start
# Then press 'j' to open debugger
```

## Performance

### Production Optimizations

- `__DEV__` checks are stripped in production builds
- Unnecessary console logs removed
- Bundle size optimized by Metro bundler
- Hermes engine enabled for faster startup

## Security

- ✅ Tokens stored in expo-secure-store (encrypted)
- ✅ HTTPS enforced for API calls in production
- ✅ Deep link validation
- ✅ No sensitive data in logs (production)
- ✅ OAuth state parameter validated

## Scripts

```bash
pnpm start        # Start Expo dev server
pnpm android      # Run on Android
pnpm ios          # Run on iOS
pnpm web          # Run on web
pnpm lint         # Run ESLint
pnpm test         # Run tests (if configured)
```

## Documentation

- **OAuth Integration Guide:** [docs/KOOMPI_OAUTH_INTEGRATION.md](../../docs/KOOMPI_OAUTH_INTEGRATION.md)
- **Expo Documentation:** https://docs.expo.dev
- **NativeWind:** https://www.nativewind.dev
- **Expo Router:** https://expo.github.io/router

## Support

For issues or questions:

1. Check [KOOMPI_OAUTH_INTEGRATION.md](../../docs/KOOMPI_OAUTH_INTEGRATION.md)
2. Review [Troubleshooting](#troubleshooting) section
3. Check Expo documentation
4. Open an issue on GitHub

---

**Last Updated:** 2025-01-21
**Expo SDK:** 54
**React Native:** 0.81.4
