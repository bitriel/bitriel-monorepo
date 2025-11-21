import { useState, useCallback, useEffect } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { getUserProfile } from '@/services/backend/user';
import { OAuthCallbackParams } from '@/types/auth';

/**
 * Authentication Configuration
 */
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const REDIRECT_SCHEME = 'bitriel';
const AUTH_CONFIG = {
  loginEndpoint: `${BACKEND_URL}/api/oauth/login`,
  redirectUri: `${REDIRECT_SCHEME}://oauth/callback`,
};

/**
 * Authentication Hook
 * Provides OAuth login, logout, and authentication state management
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authStore = useAuthStore();

  /**
   * Setup deep link listener for Android OAuth callbacks
   */
  useEffect(() => {
    // Complete auth session for iOS
    WebBrowser.maybeCompleteAuthSession();

    // Android-specific deep link handling
    if (Platform.OS === 'android') {
      const subscription = Linking.addEventListener('url', async (event) => {
        const { url } = event;
        if (url.startsWith(`${REDIRECT_SCHEME}://oauth/callback`)) {
          setIsLoading(true);
          await handleOAuthResponse(url);
          setIsLoading(false);
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, []);

  /**
   * Parse OAuth callback URL and extract parameters
   */
  const parseCallbackUrl = (url: string): OAuthCallbackParams => {
    const urlObj = new URL(url);
    return {
      token: urlObj.searchParams.get('token') || undefined,
      error: urlObj.searchParams.get('error') || undefined,
    };
  };

  /**
   * Handle OAuth callback response
   */
  const handleOAuthResponse = useCallback(
    async (url: string): Promise<void> => {
      try {
        const { token, error: errorParam } = parseCallbackUrl(url);

        // Handle OAuth error
        if (errorParam) {
          const errorMessage = decodeURIComponent(errorParam);
          console.error('[Auth] OAuth error:', errorMessage);
          setError(errorMessage);
          Alert.alert('Authentication Error', errorMessage);
          return;
        }

        // Validate token
        if (!token) {
          throw new Error('No token received from authentication');
        }

        // Store token
        authStore.setToken(token);

        // Fetch user profile
        try {
          const userData = await getUserProfile(token);
          authStore.setUser(userData);
          console.log('[Auth] Authentication successful');

          // Navigate to wallet
          router.replace('/(wallet)');
        } catch (profileError) {
          console.error('[Auth] Failed to fetch user profile:', profileError);
          // Still navigate even if profile fetch fails
          // User data can be fetched on retry or next app launch
          router.replace('/(wallet)');
        }
      } catch (error) {
        console.error('[Auth] OAuth response error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to process authentication';
        setError(errorMessage);
        Alert.alert('Authentication Error', errorMessage);
      }
    },
    [authStore]
  );

  /**
   * Initiate OAuth login flow
   */
  const handleOAuthLogin = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    authStore.setAuthenticating(true);

    try {
      // Build auth URL with platform parameter
      const authUrl = `${AUTH_CONFIG.loginEndpoint}?platform=mobile`;

      console.log('[Auth] Opening OAuth URL:', authUrl);

      // Open OAuth browser session
      const result = await WebBrowser.openAuthSessionAsync(authUrl, AUTH_CONFIG.redirectUri, {
        createTask: false,
        // Android-specific options
        ...(Platform.OS === 'android' && {
          showInRecents: false,
          dismissButtonStyle: 'close',
        }),
      });

      // Handle OAuth result
      if (result.type === 'success' && result.url) {
        await handleOAuthResponse(result.url);
      } else if (result.type === 'cancel') {
        console.log('[Auth] User cancelled OAuth flow');
        // User cancelled - no error needed
      } else {
        console.log('[Auth] OAuth flow interrupted:', result.type);
        throw new Error('OAuth flow was interrupted');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      console.error('[Auth] Login error:', errorMessage);
      setError(errorMessage);
      Alert.alert('Authentication Error', errorMessage);
    } finally {
      setIsLoading(false);
      authStore.setAuthenticating(false);
    }
  }, [handleOAuthResponse, authStore]);

  /**
   * Handle user logout with confirmation
   */
  const handleLogout = useCallback(async (): Promise<void> => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            console.log('[Auth] Logging out user');
            authStore.reset();
            router.replace('/(auth)/welcome');
          } catch (error) {
            console.error('[Auth] Logout error:', error);
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  }, [authStore]);

  return {
    handleOAuthLogin,
    handleLogout,
    isLoading,
    error,
    isAuthenticated: authStore.isAuthenticated(),
  };
};
