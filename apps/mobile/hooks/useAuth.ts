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

// OAuth configuration - mobile app builds the authorization URL directly
const AUTH_CONFIG = {
  // Koompi OAuth hosted authorize endpoint
  oauthUrl: 'https://oauth.koompi.org/v1/oauth',
  // Client ID (public, safe to include in mobile app)
  clientId: process.env.EXPO_PUBLIC_KOOMPI_CLIENT_ID || 'pk_683db8cd-855b-45f9-a86a-1e207c3efe67',
  // Backend callback URL (where OAuth server sends the authorization code)
  backendRedirectUri: `${BACKEND_URL}/api/oauth/callback-mobile`,
  // Mobile deep link (where backend redirects after processing)
  mobileRedirectUri: `${REDIRECT_SCHEME}://oauth/callback`,
  // Scopes to request
  scope: 'profile.basic profile.contact wallet.read',
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
   * Build OAuth authorization URL
   * Mobile app builds the URL directly following OAuth 2.0 spec
   */
  const buildAuthUrl = (): string => {
    const params = new URLSearchParams({
      client_id: AUTH_CONFIG.clientId,
      redirect_uri: AUTH_CONFIG.backendRedirectUri,
      response_type: 'code',
      scope: AUTH_CONFIG.scope,
    });

    return `${AUTH_CONFIG.oauthUrl}?${params.toString()}`;
  };

  /**
   * Initiate OAuth login flow
   *
   * Standard OAuth 2.0 Authorization Code flow:
   * 1. Build authorization URL with client_id, redirect_uri, scope
   * 2. Open browser to OAuth server
   * 3. User authenticates and authorizes
   * 4. OAuth server redirects to backend with code
   * 5. Backend exchanges code for token (using client_secret)
   * 6. Backend redirects to mobile deep link with JWT
   * 7. Mobile receives JWT and completes login
   */
  const handleOAuthLogin = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    authStore.setAuthenticating(true);

    try {
      // Build OAuth authorization URL
      const authUrl = buildAuthUrl();

      console.log('[Auth] Opening OAuth URL:', authUrl);
      console.log('[Auth] Backend will receive code at:', AUTH_CONFIG.backendRedirectUri);
      console.log('[Auth] Mobile will receive token at:', AUTH_CONFIG.mobileRedirectUri);

      // Open OAuth browser session
      // The OAuth server will redirect to backend, then backend redirects to mobile deep link
      const result = await WebBrowser.openAuthSessionAsync(authUrl, AUTH_CONFIG.mobileRedirectUri, {
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
