import React, { createContext, useContext, useEffect } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

interface AuthContextType {
  signIn: () => void;
  signOut: () => void;
  user: any;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  signIn: () => {},
  signOut: () => {},
  user: null,
  isLoading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authStore = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const isAuthenticated = authStore.isAuthenticated();
  const isAuthenticating = authStore.isAuthenticating;

  useEffect(() => {
    // Don't navigate if router not ready or no segments yet
    if (!navigationState?.key || !segments.length) return;

    // Don't navigate while authenticating
    if (isAuthenticating) return;

    const inAuthGroup = segments[0] === '(auth)';

    // Use setTimeout to ensure navigation happens after render
    const timeoutId = setTimeout(() => {
      if (!isAuthenticated && !inAuthGroup) {
        // Redirect to the sign-in page
        router.replace('/(auth)/welcome');
      } else if (isAuthenticated && inAuthGroup) {
        // Redirect away from the sign-in page
        router.replace('/(wallet)/(tabs)');
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, segments, isAuthenticating, navigationState?.key]);

  const signIn = () => {
    // OAuth login is handled by useAuth hook
    // This is kept for compatibility
    console.warn('Use handleOAuthLogin from useAuth hook instead');
  };

  const signOut = () => {
    authStore.reset();
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user: authStore.user,
        isLoading: isAuthenticating,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
