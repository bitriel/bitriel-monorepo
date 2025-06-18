import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import * as Linking from "expo-linking";
import { OAuthService, AuthResult, User } from "../services/oauthService";
import { API_CONFIG } from "../config/api";

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        isLoading: true,
        error: null,
    });

    const oauthService = OAuthService.getInstance();

    // Initialize authentication state
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Note: Deep link handling for auth callbacks is now handled by the dedicated /auth/callback route
    // This prevents conflicts and provides a better user experience

    const checkAuthStatus = async () => {
        try {
            setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

            const authStatus = await oauthService.getAuthStatus();

            setAuthState({
                isAuthenticated: authStatus.isAuthenticated,
                user: authStatus.user,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            console.error("❌ Failed to check auth status:", error);
            setAuthState({
                isAuthenticated: false,
                user: null,
                isLoading: false,
                error: "Failed to check authentication status",
            });
        }
    };

    const handleAuthResult = (result: AuthResult) => {
        if (result.success && result.data) {
            setAuthState({
                isAuthenticated: true,
                user: result.data.user,
                isLoading: false,
                error: null,
            });

            // Show success message
            if (result.warning) {
                Alert.alert("Authentication Successful", `Welcome back! Note: ${result.warning}`, [{ text: "OK" }]);
            } else {
                Alert.alert(
                    "Authentication Successful",
                    `Welcome back, ${result.data.user.fullname || result.data.user.email || "User"}!`,
                    [{ text: "OK" }]
                );
            }
        } else {
            setAuthState(prev => ({
                ...prev,
                isAuthenticated: false,
                user: null,
                isLoading: false,
                error: result.error || "Authentication failed",
            }));

            // Show error message
            Alert.alert("Authentication Failed", result.error || "Unable to complete authentication", [{ text: "OK" }]);
        }
    };

    const signIn = useCallback(async (): Promise<boolean> => {
        try {
            setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

            console.log("🔐 Starting OAuth sign in...");
            const result = await oauthService.authenticate();

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

    const signOut = useCallback(async (): Promise<void> => {
        try {
            setAuthState(prev => ({ ...prev, isLoading: true }));

            await oauthService.logout();

            setAuthState({
                isAuthenticated: false,
                user: null,
                isLoading: false,
                error: null,
            });

            console.log("🚪 User signed out successfully");
        } catch (error) {
            console.error("❌ Sign out error:", error);
            setAuthState(prev => ({ ...prev, isLoading: false }));

            Alert.alert("Sign Out Error", "Failed to sign out. Please try again.", [{ text: "OK" }]);
        }
    }, []);

    const refreshUserProfile = useCallback(async (): Promise<void> => {
        try {
            const userProfile = await oauthService.getUserProfile();
            if (userProfile) {
                setAuthState(prev => ({ ...prev, user: userProfile }));
            }
        } catch (error) {
            console.error("❌ Failed to refresh user profile:", error);
        }
    }, []);

    const clearError = useCallback(() => {
        setAuthState(prev => ({ ...prev, error: null }));
    }, []);

    return {
        // State
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        isLoading: authState.isLoading,
        error: authState.error,

        // Actions
        signIn,
        signOut,
        refreshUserProfile,
        clearError,
        checkAuthStatus,
    };
}
