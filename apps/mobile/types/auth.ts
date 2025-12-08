/**
 * Authentication Types
 * Shared TypeScript interfaces for authentication
 */

export interface User {
  id: string;
  userId?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  profile?: string;
  phone?: string;
  telegramId?: number;
  walletAddress?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface OAuthCallbackParams {
  token?: string;
  error?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticating: boolean;
  isAuthenticated: boolean;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

export interface APIError {
  error: string;
  message?: string;
}

export interface GetProfileResponse {
  user: User;
}
