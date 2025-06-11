import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// For warming up the browser for better UX
WebBrowser.maybeCompleteAuthSession();

import { API_CONFIG, getApiUrl, getAuthUrl, getRedirectUri } from "../config/api";

// Configuration
const REDIRECT_URI = AuthSession.makeRedirectUri({
    scheme: API_CONFIG.APP.URL_SCHEME,
    path: API_CONFIG.APP.REDIRECT_PATH,
});

// Types
export interface User {
    _id: string;
    fullname?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    profile?: string;
    telegram_id?: string | number;
    wallet_address?: string;
}

export interface AuthResult {
    success: boolean;
    data?: {
        user: User;
        accessToken: string;
    };
    message?: string;
    error?: string;
    warning?: string;
}

// Storage keys
const STORAGE_KEYS = {
    ACCESS_TOKEN: "oauth_access_token",
    USER_DATA: "user_data",
    AUTH_STATE: "auth_state",
} as const;

export class OAuthService {
    private static instance: OAuthService;

    public static getInstance(): OAuthService {
        if (!OAuthService.instance) {
            OAuthService.instance = new OAuthService();
        }
        return OAuthService.instance;
    }

    /**
     * Initialize OAuth authentication
     */
    async authenticate(): Promise<AuthResult> {
        try {
            console.log("🔐 Starting OAuth authentication...");
            console.log("📱 Redirect URI:", REDIRECT_URI);

            // Build the authorization URL with mobile schema
            const authUrl = getAuthUrl(API_CONFIG.APP.URL_SCHEME);

            console.log("🌐 Auth URL:", authUrl);

            // Start the OAuth flow
            const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);

            console.log("📨 Auth result:", result);

            if (result.type === "success" && result.url) {
                return await this.handleAuthSuccess(result.url);
            } else if (result.type === "cancel") {
                console.log("🚫 User cancelled OAuth");
                return {
                    success: false,
                    error: "Authentication cancelled by user",
                };
            } else {
                console.log("⚠️ OAuth failed or dismissed");
                return {
                    success: false,
                    error: "Authentication failed or was dismissed",
                };
            }
        } catch (error) {
            console.error("❌ OAuth authentication error:", error);
            return {
                success: false,
                error: "Authentication failed",
            };
        }
    }

    /**
     * Handle successful OAuth callback
     */
    private async handleAuthSuccess(callbackUrl: string): Promise<AuthResult> {
        try {
            console.log("✅ Processing successful OAuth callback:", callbackUrl);

            // Parse the callback URL
            const url = new URL(callbackUrl);
            const encodedData = url.searchParams.get("data");

            if (!encodedData) {
                throw new Error("No authentication data received");
            }

            // Decode the base64url data
            const authData = this.decodeAuthData(encodedData);

            if (!authData.success) {
                return authData;
            }

            // Store authentication data securely
            await this.storeAuthData(authData);

            console.log("💾 Authentication data stored successfully");
            return authData;
        } catch (error) {
            console.error("❌ Error processing OAuth callback:", error);
            return {
                success: false,
                error: "Failed to process authentication data",
            };
        }
    }

    /**
     * Decode base64url encoded authentication data
     */
    private decodeAuthData(encodedData: string): AuthResult {
        try {
            // Convert base64url to standard base64
            const base64 = encodedData.replace(/-/g, "+").replace(/_/g, "/");

            // Add padding if needed
            const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

            // Decode and parse
            const jsonString = atob(paddedBase64);
            const authData: AuthResult = JSON.parse(jsonString);

            console.log("🔓 Decoded auth data:", {
                success: authData.success,
                hasUser: !!authData.data?.user,
                hasToken: !!authData.data?.accessToken,
                message: authData.message,
                error: authData.error,
                warning: authData.warning,
            });

            return authData;
        } catch (error) {
            console.error("❌ Failed to decode auth data:", error);
            return {
                success: false,
                error: "Failed to decode authentication data",
            };
        }
    }

    /**
     * Store authentication data securely
     */
    private async storeAuthData(authData: AuthResult): Promise<void> {
        if (!authData.success || !authData.data) {
            throw new Error("Invalid authentication data");
        }

        const { user, accessToken } = authData.data;

        // Store access token
        await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

        // Store user data
        await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

        console.log("💾 Stored user data for:", user.fullname || user.email || user._id);
    }

    /**
     * Get stored access token
     */
    async getAccessToken(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
        } catch (error) {
            console.error("❌ Failed to get access token:", error);
            return null;
        }
    }

    /**
     * Get stored user data
     */
    async getUserData(): Promise<User | null> {
        try {
            const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error("❌ Failed to get user data:", error);
            return null;
        }
    }

    /**
     * Check if user is authenticated
     */
    async isAuthenticated(): Promise<boolean> {
        const token = await this.getAccessToken();
        const user = await this.getUserData();
        return !!(token && user);
    }

    /**
     * Get user profile from API
     */
    async getUserProfile(): Promise<User | null> {
        try {
            const token = await this.getAccessToken();
            if (!token) {
                throw new Error("No access token available");
            }

            const response = await fetch(getApiUrl(API_CONFIG.USER.PROFILE), {
                headers: {
                    access_token: token,
                },
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error("❌ Failed to fetch user profile:", error);
            return null;
        }
    }

    /**
     * Logout and clear stored data
     */
    async logout(): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_STATE);

            console.log("🚪 User logged out successfully");
        } catch (error) {
            console.error("❌ Failed to logout:", error);
            throw error;
        }
    }

    /**
     * Handle deep link authentication (for direct URL handling)
     */
    async handleDeepLink(url: string): Promise<AuthResult | null> {
        try {
            console.log("🔗 Handling deep link:", url);

            if (url.startsWith(`${API_CONFIG.APP.URL_SCHEME}://auth/callback`)) {
                return await this.handleAuthSuccess(url);
            }

            return null;
        } catch (error) {
            console.error("❌ Failed to handle deep link:", error);
            return {
                success: false,
                error: "Failed to process authentication link",
            };
        }
    }

    /**
     * Get authentication status with user info
     */
    async getAuthStatus(): Promise<{
        isAuthenticated: boolean;
        user: User | null;
        token: string | null;
    }> {
        const token = await this.getAccessToken();
        const user = await this.getUserData();

        return {
            isAuthenticated: !!(token && user),
            user,
            token,
        };
    }
}
