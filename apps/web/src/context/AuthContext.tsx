import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/auth';
import { api } from '../lib/api';
import { storage } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  setAuthToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = storage.getToken();

      if (savedToken) {
        try {
          const response = await api.getUserProfile(savedToken);
          setUser(response.user);
          setToken(savedToken);
        } catch (error) {
          console.error('Failed to load user:', error);
          storage.removeToken();
        }
      }

      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = () => {
    window.location.href = api.getOAuthLoginUrl();
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    storage.removeToken();
  };

  const setAuthToken = async (newToken: string) => {
    try {
      storage.setToken(newToken);
      const response = await api.getUserProfile(newToken);
      setUser(response.user);
      setToken(newToken);
    } catch (error) {
      console.error('Failed to set auth token:', error);
      storage.removeToken();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    setAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
