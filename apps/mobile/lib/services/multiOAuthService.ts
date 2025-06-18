import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { OAuthService, User, AuthResult } from "./oauthService";
import { useMultiAccountStore, AuthenticatedAccount } from "../../src/store/multiAccountStore";
import { API_CONFIG, getApiUrl, getAuthUrl, getRedirectUri } from "../config/api";

// For warming up the browser for better UX
WebBrowser.maybeCompleteAuthSession();

// Configuration
const REDIRECT_URI = AuthSession.makeRedirectUri({
    scheme: API_CONFIG.APP.URL_SCHEME,
    path: API_CONFIG.APP.REDIRECT_PATH,
});

export interface MultiAuthResult extends AuthResult {
    account?: AuthenticatedAccount;
    isNewAccount?: boolean;
}

export class MultiOAuthService {
    private static instance: MultiOAuthService;
    private oauthService: OAuthService;

    constructor() {
        this.oauthService = OAuthService.getInstance();
    }

    public static getInstance(): MultiOAuthService {
        if (!MultiOAuthService.instance) {
            MultiOAuthService.instance = new MultiOAuthService();
        }
        return MultiOAuthService.instance;
    }

    /**
     * Initialize OAuth authentication for multiple accounts
     */
    async authenticateNewAccount(): Promise<MultiAuthResult> {
        try {
            console.log("🔐 Starting new account OAuth authentication...");
            console.log("📱 Redirect URI:", REDIRECT_URI);

            // Build the authorization URL with mobile schema
            const authUrl = getAuthUrl(API_CONFIG.APP.URL_SCHEME);

            console.log("🌐 Auth URL:", authUrl);

            // Start the OAuth flow
            const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);

            console.log("📨 Auth result:", result);

            if (result.type === "success" && result.url) {
                return await this.handleMultiAuthSuccess(result.url);
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
     * Handle successful OAuth callback for multi-account
     */
    private async handleMultiAuthSuccess(callbackUrl: string): Promise<MultiAuthResult> {
        try {
            console.log("✅ Processing successful OAuth callback for multi-account:", callbackUrl);

            // Parse the callback URL
            const url = new URL(callbackUrl);
            const encodedData = url.searchParams.get("data");

            if (!encodedData) {
                throw new Error("No authentication data received");
            }

            // Decode the base64url data
            const authData = this.decodeAuthData(encodedData);

            if (!authData.success || !authData.data) {
                return authData;
            }

            // Add account to multi-account store
            const { addAccount } = useMultiAccountStore.getState();
            const account = await addAccount(authData.data.user, authData.data.accessToken);

            console.log("💾 Account added to multi-account store successfully");

            return {
                ...authData,
                account,
                isNewAccount: true,
            };
        } catch (error) {
            console.error("❌ Error processing OAuth callback for multi-account:", error);
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
     * Get active account info
     */
    getActiveAccount(): AuthenticatedAccount | null {
        const { activeAccount } = useMultiAccountStore.getState();
        return activeAccount;
    }

    /**
     * Get all accounts
     */
    getAllAccounts(): AuthenticatedAccount[] {
        const { accounts } = useMultiAccountStore.getState();
        return accounts;
    }

    /**
     * Switch to a different account
     */
    async switchAccount(accountId: string): Promise<boolean> {
        try {
            const { setActiveAccount } = useMultiAccountStore.getState();
            await setActiveAccount(accountId);
            return true;
        } catch (error) {
            console.error("❌ Failed to switch account:", error);
            return false;
        }
    }

    /**
     * Remove an account
     */
    async removeAccount(accountId: string): Promise<boolean> {
        try {
            const { removeAccount } = useMultiAccountStore.getState();
            await removeAccount(accountId);
            return true;
        } catch (error) {
            console.error("❌ Failed to remove account:", error);
            return false;
        }
    }

    /**
     * Check if user is authenticated (has any active account)
     */
    async isAuthenticated(): Promise<boolean> {
        const { loadAccounts, activeAccount } = useMultiAccountStore.getState();
        await loadAccounts();
        return !!activeAccount;
    }

    /**
     * Get user profile from API using active account token
     */
    async getUserProfile(accountId?: string): Promise<User | null> {
        try {
            const { accounts, activeAccount } = useMultiAccountStore.getState();

            // Use specific account or active account
            const targetAccount = accountId ? accounts.find(a => a.id === accountId) : activeAccount;

            if (!targetAccount) {
                throw new Error("No account available or specified");
            }

            const response = await fetch(getApiUrl(API_CONFIG.USER.PROFILE), {
                headers: {
                    access_token: targetAccount.accessToken,
                },
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const userData = await response.json();

            // Update account with fresh user data
            const { updateAccount } = useMultiAccountStore.getState();
            await updateAccount(targetAccount.id, { user: userData });

            return userData;
        } catch (error) {
            console.error("❌ Failed to fetch user profile:", error);
            return null;
        }
    }

    /**
     * Refresh token for a specific account
     */
    async refreshAccountToken(accountId: string): Promise<boolean> {
        try {
            // This would typically involve making a refresh token request
            // For now, we'll just validate the existing token
            const profile = await this.getUserProfile(accountId);
            return !!profile;
        } catch (error) {
            console.error("❌ Failed to refresh account token:", error);
            return false;
        }
    }

    /**
     * Logout from a specific account
     */
    async logoutAccount(accountId: string): Promise<void> {
        try {
            await this.removeAccount(accountId);
            console.log("🚪 Account logged out successfully:", accountId);
        } catch (error) {
            console.error("❌ Failed to logout account:", error);
            throw error;
        }
    }

    /**
     * Logout from all accounts
     */
    async logoutAllAccounts(): Promise<void> {
        try {
            const { clearAccounts } = useMultiAccountStore.getState();
            await clearAccounts();
            console.log("🚪 All accounts logged out successfully");
        } catch (error) {
            console.error("❌ Failed to logout all accounts:", error);
            throw error;
        }
    }

    /**
     * Handle deep link authentication for multi-account
     */
    async handleDeepLink(url: string): Promise<MultiAuthResult | null> {
        try {
            console.log("🔗 Handling deep link for multi-account:", url);

            if (url.startsWith(`${API_CONFIG.APP.URL_SCHEME}://auth/callback`)) {
                return await this.handleMultiAuthSuccess(url);
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
     * Get authentication status for multi-account system
     */
    async getMultiAuthStatus(): Promise<{
        isAuthenticated: boolean;
        activeAccount: AuthenticatedAccount | null;
        totalAccounts: number;
        accounts: AuthenticatedAccount[];
    }> {
        const { loadAccounts, accounts, activeAccount } = useMultiAccountStore.getState();
        await loadAccounts();

        return {
            isAuthenticated: !!activeAccount,
            activeAccount,
            totalAccounts: accounts.length,
            accounts,
        };
    }

    /**
     * Initialize multi-account system
     */
    async initialize(): Promise<void> {
        try {
            const { loadAccounts } = useMultiAccountStore.getState();
            await loadAccounts();
            console.log("✅ Multi-account system initialized");
        } catch (error) {
            console.error("❌ Failed to initialize multi-account system:", error);
            throw error;
        }
    }
}
