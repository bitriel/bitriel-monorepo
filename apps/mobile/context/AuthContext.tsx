import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextType {
  signIn: () => void;
  signOut: () => void;
  user: string | null;
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
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const rootSegment = useSegments()[0];
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for stored auth token
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!user && rootSegment !== '(auth)') {
      // Redirect to the sign-in page.
      router.replace('/(auth)/welcome');
    } else if (user && rootSegment === '(auth)') {
      // Redirect away from the sign-in page.
      router.replace('/(wallet)');
    }
  }, [user, rootSegment, isLoading]);

  const signIn = () => {
    setUser('user');
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
