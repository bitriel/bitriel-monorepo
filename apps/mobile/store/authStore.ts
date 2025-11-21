import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SecureStoreAdapter } from '@/lib/secureStore';
import { User } from '@/types/auth';

/**
 * Authentication State Store
 *
 * Uses Zustand for state management with persistence to secure storage.
 * Development logs use __DEV__ (React Native standard) instead of process.env.NODE_ENV
 */

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticating: boolean;

  // Actions
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setAuthenticating: (isAuthenticating: boolean) => void;
  reset: () => void;

  // Selectors
  isAuthenticated: () => boolean;
  getAuthHeader: () => { Authorization: string } | null;
}

// Initial state
const initialState = {
  token: null,
  user: null,
  isAuthenticating: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setToken: (token) => {
        if (__DEV__) {
          console.log('[AuthStore] Setting token:', token ? '***' + token.slice(-10) : 'null');
        }
        set({ token });
      },

      setUser: (user) => {
        if (__DEV__) {
          console.log('[AuthStore] Setting user:', user?.id || user?.userId || 'null');
        }
        set({ user });
      },

      setAuthenticating: (isAuthenticating) => {
        if (__DEV__) {
          console.log('[AuthStore] Authenticating:', isAuthenticating);
        }
        set({ isAuthenticating });
      },

      reset: () => {
        if (__DEV__) {
          console.log('[AuthStore] Resetting auth state');
        }
        set(initialState);
      },

      isAuthenticated: () => {
        const { token, user } = get();
        return !!token && !!user;
      },

      getAuthHeader: () => {
        const token = get().token;
        return token ? { Authorization: `Bearer ${token}` } : null;
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: async (name) => {
          try {
            const value = await SecureStoreAdapter.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.error('[AuthStore] Error retrieving from secure store:', error);
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            await SecureStoreAdapter.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('[AuthStore] Error saving to secure store:', error);
          }
        },
        removeItem: async (name) => {
          try {
            await SecureStoreAdapter.removeItem(name);
          } catch (error) {
            console.error('[AuthStore] Error removing from secure store:', error);
          }
        },
      },
      // Exclude isAuthenticating from persistence - it's transient UI state
      partialize: (state) => {
        const { isAuthenticating, ...persistedState } = state;
        return persistedState as AuthState;
      },
      onRehydrateStorage: () => (state) => {
        // Always reset isAuthenticating to false on app startup
        if (state) {
          if (__DEV__) {
            console.log('[AuthStore] Hydration complete - resetting isAuthenticating');
          }
          state.isAuthenticating = false;
        }
      },
    }
  )
);

// Export User type for convenience
export type { User };
