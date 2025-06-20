import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import * as Linking from "expo-linking";
import { MultiOAuthService, MultiAuthResult } from "../services/multiOAuthService";
import { useMultiAccountStore, AuthenticatedAccount } from "../../src/store/multiAccountStore";
import { User } from "../services/oauthService";
import { API_CONFIG } from "../config/api";

interface MultiAuthState {
    isAuthenticated: boolean;
    activeAccount: AuthenticatedAccount | null;
    accounts: AuthenticatedAccount[];
    totalAccounts: number;
    isLoading: boolean;
    error: string | null;
}

export function useMultiAuth() {
    const [authState, setAuthState] = useState<MultiAuthState>({
        isAuthenticated: false,
        activeAccount: null,
        accounts: [],
        totalAccounts: 0,
        isLoading: true,
        error: null,
    });

    const multiOAuthService = MultiOAuthService.getInstance();
    const {
        accounts,
        activeAccount,
        isLoading: storeLoading,
        loadAccounts,
        setActiveAccount,
        removeAccount,
    } = useMultiAccountStore();

    // Sync state with store
    useEffect(() => {
        setAuthState(prev => ({
            ...prev,
            isAuthenticated: !!activeAccount,
            activeAccount,
            accounts,
            totalAccounts: accounts.length,
            isLoading: storeLoading,
        }));
    }, [activeAccount, accounts, storeLoading]);

    // Initialize multi-account system
    useEffect(() => {
        let isMounted = true;

        const initializeMultiAuth = async () => {
            try {
                if (isMounted) {
                    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
                }

                await multiOAuthService.initialize();

                if (isMounted) {
                    // Loading state will be updated by the store sync effect
                    console.log("✅ Multi-auth initialized successfully");
                }
            } catch (error) {
                console.error("❌ Failed to initialize multi-auth:", error);
                if (isMounted) {
                    setAuthState(prev => ({
                        ...prev,
                        error: "Failed to initialize authentication system",
                        isLoading: false,
                    }));
                }
            }
        };

        initializeMultiAuth();

        return () => {
            isMounted = false;
        };
    }, []);

    // Note: Deep link handling for auth callbacks is now handled by the dedicated /auth/callback route
    // This prevents conflicts and provides a better user experience

    const handleAuthResult = (result: MultiAuthResult) => {
        if (result.success && result.account) {
            setAuthState(prev => ({
                ...prev,
                error: null,
            }));

            // Show success message
            const userName = result.account.user.fullname || result.account.user.email || "User";
            if (result.warning) {
                Alert.alert("Authentication Successful", `Welcome back, ${userName}! Note: ${result.warning}`, [
                    { text: "OK" },
                ]);
            } else if (result.isNewAccount) {
                Alert.alert("Account Added", `Successfully added account for ${userName}!`, [{ text: "OK" }]);
            } else {
                Alert.alert("Authentication Successful", `Welcome back, ${userName}!`, [{ text: "OK" }]);
            }
        } else {
            setAuthState(prev => ({
                ...prev,
                error: result.error || "Authentication failed",
            }));

            // Show error message
            Alert.alert("Authentication Failed", result.error || "Unable to complete authentication", [{ text: "OK" }]);
        }
    };

    const signInNewAccount = useCallback(async (): Promise<boolean> => {
        try {
            setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

            console.log("🔐 Starting OAuth sign in for new account...");
            const result = await multiOAuthService.authenticateNewAccount();

            handleAuthResult(result);
            return result.success;
        } catch (error) {
            console.error("❌ Sign in error:", error);
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: "Failed to start authentication",
            }));

            Alert.alert("Authentication Error", "Failed to start authentication. Please try again.", [{ text: "OK" }]);
            return false;
        }
    }, []);

    const switchAccount = useCallback(
        async (accountId: string): Promise<boolean> => {
            try {
                // Don't set loading state here, let the store handle it
                setAuthState(prev => ({ ...prev, error: null }));

                const success = await multiOAuthService.switchAccount(accountId);

                if (success) {
                    const targetAccount = accounts.find(a => a.id === accountId);
                    console.log("✅ Switched to account:", targetAccount?.user.fullname || targetAccount?.user.email);
                }

                return success;
            } catch (error) {
                console.error("❌ Switch account error:", error);
                setAuthState(prev => ({
                    ...prev,
                    error: "Failed to switch account",
                }));
                return false;
            }
        },
        [accounts]
    );

    const removeAccountById = useCallback(async (accountId: string): Promise<boolean> => {
        try {
            // Don't set loading state here, let the store handle it
            setAuthState(prev => ({ ...prev, error: null }));

            const success = await multiOAuthService.removeAccount(accountId);

            if (success) {
                console.log("✅ Account removed successfully");
            }

            return success;
        } catch (error) {
            console.error("❌ Remove account error:", error);
            setAuthState(prev => ({
                ...prev,
                error: "Failed to remove account",
            }));
            return false;
        }
    }, []);

    const signOutAccount = useCallback(
        async (accountId?: string): Promise<void> => {
            try {
                setAuthState(prev => ({ ...prev, isLoading: true }));

                if (accountId) {
                    await multiOAuthService.logoutAccount(accountId);
                    console.log("🚪 Account signed out successfully");
                } else if (activeAccount) {
                    await multiOAuthService.logoutAccount(activeAccount.id);
                    console.log("🚪 Active account signed out successfully");
                }
            } catch (error) {
                console.error("❌ Sign out error:", error);
                Alert.alert("Sign Out Error", "Failed to sign out. Please try again.", [{ text: "OK" }]);
            }
        },
        [activeAccount]
    );

    const signOutAllAccounts = useCallback(async (): Promise<void> => {
        try {
            setAuthState(prev => ({ ...prev, isLoading: true }));

            await multiOAuthService.logoutAllAccounts();

            setAuthState({
                isAuthenticated: false,
                activeAccount: null,
                accounts: [],
                totalAccounts: 0,
                isLoading: false,
                error: null,
            });

            console.log("🚪 All accounts signed out successfully");
        } catch (error) {
            console.error("❌ Sign out all error:", error);
            setAuthState(prev => ({ ...prev, isLoading: false }));
            Alert.alert("Sign Out Error", "Failed to sign out from all accounts. Please try again.", [{ text: "OK" }]);
        }
    }, []);

    const refreshUserProfile = useCallback(async (accountId?: string): Promise<void> => {
        try {
            const userProfile = await multiOAuthService.getUserProfile(accountId);
            if (userProfile) {
                console.log("✅ User profile refreshed");
            }
        } catch (error) {
            console.error("❌ Failed to refresh user profile:", error);
        }
    }, []);

    const getAccountById = useCallback(
        (accountId: string): AuthenticatedAccount | null => {
            return accounts.find(a => a.id === accountId) || null;
        },
        [accounts]
    );

    const getAccountByUserId = useCallback(
        (userId: string): AuthenticatedAccount | null => {
            return accounts.find(a => a.user._id === userId) || null;
        },
        [accounts]
    );

    const refreshAccountToken = useCallback(async (accountId: string): Promise<boolean> => {
        try {
            return await multiOAuthService.refreshAccountToken(accountId);
        } catch (error) {
            console.error("❌ Failed to refresh account token:", error);
            return false;
        }
    }, []);

    const clearError = useCallback(() => {
        setAuthState(prev => ({ ...prev, error: null }));
    }, []);

    const checkAuthStatus = useCallback(async () => {
        try {
            const status = await multiOAuthService.getMultiAuthStatus();
            setAuthState(prev => ({
                ...prev,
                isAuthenticated: status.isAuthenticated,
                activeAccount: status.activeAccount,
                accounts: status.accounts,
                totalAccounts: status.totalAccounts,
                error: null,
            }));
        } catch (error) {
            console.error("❌ Failed to check auth status:", error);
            setAuthState(prev => ({
                ...prev,
                error: "Failed to check authentication status",
            }));
        }
    }, []);

    return {
        // State
        isAuthenticated: authState.isAuthenticated,
        activeAccount: authState.activeAccount,
        accounts: authState.accounts,
        totalAccounts: authState.totalAccounts,
        isLoading: authState.isLoading,
        error: authState.error,

        // Active account user (for backward compatibility)
        user: authState.activeAccount?.user || null,

        // Actions
        signInNewAccount,
        switchAccount,
        removeAccount: removeAccountById,
        signOutAccount,
        signOutAllAccounts,
        refreshUserProfile,
        refreshAccountToken,
        clearError,
        checkAuthStatus,

        // Helpers
        getAccountById,
        getAccountByUserId,
    };
}
