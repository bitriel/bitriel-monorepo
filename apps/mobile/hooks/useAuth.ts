import { useState, useCallback, useEffect } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { getUserProfile } from '@/services/backend/user';
import { OAuthCallbackParams } from '@/types/auth';

/**
 * Authentication Configuration
 * Following standard OAuth 2.0 Authorization Code flow
 */
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const REDIRECT_SCHEME = 'bitriel';



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
          router.replace('/(wallet)/(tabs)');
        } catch (profileError) {
          console.error('[Auth] Failed to fetch user profile:', profileError);
          // Still navigate even if profile fetch fails
          // User data can be fetched on retry or next app launch
          router.replace('/(wallet)/(tabs)');
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
   *
   * Standard OAuth 2.0 Authorization Code flow:
   * 1. Fetch OAuth config from backend (client_id, redirect_uri, etc.)
   * 2. Build authorization URL
   * 3. Open browser to OAuth server
   * 4. User authenticates and authorizes
   * 5. OAuth server redirects to backend with code
   * 6. Backend exchanges code for token (using client_secret)
   * 7. Backend redirects to mobile deep link with JWT
   * 8. Mobile receives JWT and completes login
   */
  const handleOAuthLogin = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    authStore.setAuthenticating(true);

    try {
      // Fetch OAuth config from backend
      const configResponse = await fetch(`${BACKEND_URL}/api/oauth/login?platform=mobile`);
      if (!configResponse.ok) {
        throw new Error('Failed to fetch OAuth configuration');
      }
      
      const config = await configResponse.json();
      
      // Build OAuth authorization URL
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: config.scope,
      });

      const authUrl = `${config.authUrl}?${params.toString()}`;
      const mobileRedirectUri = `${REDIRECT_SCHEME}://oauth/callback`;

      console.log('[Auth] Opening OAuth URL:', authUrl);
      console.log('[Auth] Backend will receive code at:', config.redirectUri);
      console.log('[Auth] Mobile will receive token at:', mobileRedirectUri);

      // Open OAuth browser session
      // The OAuth server will redirect to backend, then backend redirects to mobile deep link
      const result = await WebBrowser.openAuthSessionAsync(authUrl, mobileRedirectUri, {
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
