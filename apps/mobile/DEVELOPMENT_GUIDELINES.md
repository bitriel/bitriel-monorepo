# Mobile App Development Guidelines

Quick reference for React Native/Expo development best practices.

## Development Mode Detection

### ✅ Use `__DEV__` (React Native Standard)

```typescript
if (__DEV__) {
  console.log('This only runs in development');
}
```

### ❌ Avoid `process.env.NODE_ENV`

```typescript
// Don't use this in React Native
if (process.env.NODE_ENV === 'development') {
  console.log('May not work reliably');
}
```

## Why `__DEV__`?

| Feature | `__DEV__` | `process.env.NODE_ENV` |
|---------|-----------|------------------------|
| **Type** | Global constant | Environment variable |
| **Availability** | Automatic in RN | Requires configuration |
| **Production** | Stripped by bundler | May not be stripped |
| **Reliability** | ✅ Always works | ⚠️ Configuration dependent |
| **Performance** | ✅ Zero overhead | ⚠️ Runtime check |

## Simple Pattern

Just use `if (__DEV__)` directly - no utilities needed:

```typescript
// Simple and clear
if (__DEV__) {
  console.log('[Component] Rendered', props);
}

if (__DEV__) {
  console.error('[API] Failed', error);
}

if (__DEV__) {
  console.warn('[Hook] Deprecated');
}
```

## Logging Best Practices

### 1. Use Prefixes

```typescript
console.log('[AuthStore] Setting token');
console.log('[OAuth] Starting flow');
console.error('[API] Request failed');
```

**Benefits:**
- Easy to filter logs
- Quick identification of source
- Better debugging

### 2. Conditional Logging

```typescript
// ✅ Good - Only in development
if (__DEV__) {
  console.log('[Debug]', data);
}

// ❌ Bad - Always logs
console.log('[Debug]', data);
```

### 3. Structured Logging

```typescript
// ✅ Good - Clear and structured
if (__DEV__) {
  console.log('[Auth] User logged in:', {
    userId: user.id,
    username: user.username,
  });
}

// ❌ Bad - Unclear
console.log('user', user);
```

## Environment Variables

### Expo Public Variables

Only variables prefixed with `EXPO_PUBLIC_` are accessible:

```typescript
// ✅ Accessible
const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

// ❌ Not accessible (returns undefined)
const secret = process.env.API_SECRET;
```

### .env File

```env
# ✅ Will be available
EXPO_PUBLIC_BACKEND_URL=http://localhost:4000

# ❌ Will NOT be available
API_SECRET=secret-key
```

## TypeScript Types

### Global Types

`__DEV__` is globally available, but you can add a declaration if needed:

```typescript
// global.d.ts (usually not needed)
declare const __DEV__: boolean;
```

## Code Examples

### Store with Dev Logging

```typescript
export const useStore = create((set) => ({
  data: null,
  setData: (data) => {
    if (__DEV__) {
      console.log('[Store] Setting data:', data);
    }
    set({ data });
  },
}));
```

### Component with Dev Logging

```typescript
export function MyComponent() {
  useEffect(() => {
    if (__DEV__) {
      console.log('[MyComponent] Mounted');
    }

    return () => {
      if (__DEV__) {
        console.log('[MyComponent] Unmounted');
      }
    };
  }, []);

  return <View>...</View>;
}
```

### API Service with Dev Logging

```typescript
export const fetchData = async () => {
  if (__DEV__) {
    console.log('[API] Fetching data...');
  }

  try {
    const response = await fetch(url);

    if (__DEV__) {
      console.log('[API] Response:', response.status);
    }

    return await response.json();
  } catch (error) {
    if (__DEV__) {
      console.error('[API] Error:', error);
    }
    throw error;
  }
};
```

## Performance Tips

### 1. Heavy Debugging Code

Wrap expensive debug operations:

```typescript
if (__DEV__) {
  // This is stripped in production
  console.log('[Debug] Large object:', JSON.stringify(data, null, 2));
  console.trace('[Debug] Stack trace');
}
```

### 2. Development Tools

Initialize dev tools conditionally:

```typescript
if (__DEV__) {
  // Reactotron, Flipper, etc.
  import('./ReactotronConfig').then(() => {
    console.log('Reactotron configured');
  });
}
```

## Production Builds

### What Gets Removed

The bundler automatically removes:
- `if (__DEV__)` blocks and their contents
- Dead code after `__DEV__` checks
- Development-only imports inside `__DEV__` blocks

```typescript
// Development build
if (__DEV__) {
  console.log('Debug'); // Included
}

// Production build
// (completely removed from bundle)
```

### Verification

Check production bundle doesn't contain debug code:

```bash
# Build for production
eas build --profile production --platform android

# Install and test - no debug logs should appear
```

## Common Patterns

### Lazy Imports

```typescript
if (__DEV__) {
  import('./DevTools').then(module => {
    module.setup();
  });
}
```

### Feature Flags

```typescript
const ENABLE_DEBUG_UI = __DEV__;

function App() {
  return (
    <>
      <MainApp />
      {ENABLE_DEBUG_UI && <DebugPanel />}
    </>
  );
}
```

### API Mocking

```typescript
const API_URL = __DEV__
  ? 'http://localhost:4000'
  : 'https://api.production.com';
```

## Quick Reference

```typescript
// ✅ Development check - Simple and clear
if (__DEV__) {
  console.log('Debug message');
}

// ✅ Environment variables
process.env.EXPO_PUBLIC_*

// ❌ Don't use in React Native
if (process.env.NODE_ENV === 'development') { }

// ❌ Not accessible
process.env.NON_PUBLIC_VAR
```

## Related Documentation

- [Main OAuth Integration Guide](../../docs/KOOMPI_OAUTH_INTEGRATION.md)
- [Mobile README](./README.md)
- [React Native Debugging](https://reactnative.dev/docs/debugging)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

---

**Last Updated:** 2025-01-21
