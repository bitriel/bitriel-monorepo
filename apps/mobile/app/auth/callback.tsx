import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { OAuthService } from "~/lib/services/oauthService";
import { MultiOAuthService } from "~/lib/services/multiOAuthService";

export default function AuthCallback() {
    const params = useLocalSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                console.log("🔗 Auth callback route triggered with params:", params);

                // Check if we have required auth data
                if (!params.data) {
                    console.log("⚠️ No auth data parameter found, redirecting to welcome");
                    router.replace("/welcome");
                    return;
                }

                // Reconstruct the full callback URL
                const queryString = Object.entries(params)
                    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
                    .join("&");

                const callbackUrl = `bitrielwallet://auth/callback?${queryString}`;
                console.log("📞 Processing callback URL:", callbackUrl);

                // Try both auth services to handle the callback
                const oauthService = OAuthService.getInstance();
                const multiOAuthService = MultiOAuthService.getInstance();

                // Handle with regular OAuth service first
                const authResult = await oauthService.handleDeepLink(callbackUrl);
                if (authResult && authResult.success) {
                    console.log("✅ Regular OAuth service handled the callback successfully");
                    // Small delay to ensure state is updated
                    setTimeout(() => {
                        router.replace("/(auth)/home/(tabs)/wallet");
                    }, 500);
                    return;
                }

                // Try multi-auth service if regular auth didn't handle it
                const multiAuthResult = await multiOAuthService.handleDeepLink(callbackUrl);
                if (multiAuthResult && multiAuthResult.success) {
                    console.log("✅ Multi OAuth service handled the callback successfully");
                    // Small delay to ensure state is updated
                    setTimeout(() => {
                        router.replace("/(auth)/home/(tabs)/wallet");
                    }, 500);
                    return;
                }

                // If neither service handled it successfully, redirect to welcome screen
                console.log("⚠️ Auth callback was not handled successfully");
                router.replace("/welcome");
            } catch (error) {
                console.error("❌ Error handling auth callback:", error);
                router.replace("/welcome");
            }
        };

        // Add a small delay to ensure the route is fully loaded
        const timeoutId = setTimeout(() => {
            handleCallback();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [params]);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffff",
                paddingHorizontal: 20,
            }}
        >
            <ActivityIndicator size="large" color="#007AFF" />
            <Text
                style={{
                    marginTop: 16,
                    fontSize: 16,
                    fontFamily: "SpaceGrotesk-Medium",
                    color: "#666",
                    textAlign: "center",
                }}
            >
                Completing authentication...
            </Text>
            <Text
                style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontFamily: "SpaceGrotesk-Regular",
                    color: "#999",
                    textAlign: "center",
                }}
            >
                Please wait while we securely sign you in
            </Text>
        </View>
    );
}
