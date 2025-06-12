import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { Cloud, Key, Shield, Plus } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { useAuth } from "~/lib/hooks/useAuth";

export default function AuthMethodSelectionScreen() {
    const { flowType } = useLocalSearchParams<{ flowType: string }>();
    const [actualFlowType, setActualFlowType] = useState<string>("createWallet");
    const { signIn, isLoading, error, isAuthenticated } = useAuth();

    useEffect(() => {
        if (flowType) {
            setActualFlowType(flowType);
        }
    }, [flowType]);

    // Handle authentication success - redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            console.log("✅ User is already authenticated, redirecting to wallet...");
            router.replace({
                pathname: "/(auth)/home/(tabs)/wallet",
                params: {
                    isDualWallet: "true",
                },
            });
        }
    }, [isAuthenticated, isLoading]);

    const isCreateWallet = actualFlowType === "createWallet";

    const handleCustodialAuth = useCallback(async () => {
        try {
            console.log("🔐 Starting custodial authentication...");

            const success = await signIn();

            if (success) {
                console.log("✅ Authentication successful, navigating to wallet...");

                // After successful authentication, navigate directly to wallet
                router.replace({
                    pathname: "/(auth)/home/(tabs)/wallet",
                    params: {
                        isDualWallet: "true",
                    },
                });
            } else {
                console.log("❌ Authentication failed");
                // Error is handled by the useAuth hook
            }
        } catch (error) {
            console.error("❌ Custodial auth error:", error);
        }
    }, [signIn]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-row justify-between items-center px-6 py-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-lg font-bold text-gray-800">Back</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="flex-1 px-6 pt-8">
                <View className="mb-12">
                    <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">
                        {isCreateWallet ? "Choose How to Create Your Wallet" : "Choose How to Restore Your Wallet"}
                    </Text>
                    <Text className="text-lg text-gray-600 text-center leading-6">
                        {isCreateWallet
                            ? "Select your preferred method to create and secure your wallet"
                            : "Select your preferred method to restore your wallet backup"}
                    </Text>
                </View>

                {/* Authentication Options */}
                <View className="gap-4">
                    {/* Digital ID Option */}
                    <TouchableOpacity
                        className={`${
                            isLoading ? "bg-blue-400" : "bg-white"
                        } rounded-2xl p-6 shadow-sm border border-gray-100 active:bg-gray-50`}
                        activeOpacity={0.7}
                        onPress={handleCustodialAuth}
                        disabled={isLoading}
                    >
                        <View className="flex-row items-start">
                            <View className="bg-blue-50 rounded-full p-3 mr-4">
                                {isLoading ? (
                                    <ActivityIndicator color="#2563EB" size="small" />
                                ) : (
                                    <Cloud size={24} color="#2563EB" />
                                )}
                            </View>
                            <View className="flex-1">
                                <Text
                                    className={`text-xl font-semibold ${isLoading ? "text-white" : "text-gray-900"} mb-2`}
                                >
                                    {isLoading ? "Authenticating..." : "Digital ID"}
                                </Text>
                                <Text
                                    className={`text-base ${isLoading ? "text-blue-100" : "text-gray-600"} leading-5`}
                                >
                                    {isLoading
                                        ? "Please wait while we authenticate your Digital ID..."
                                        : isCreateWallet
                                          ? "Create using your Single Sign-On (SSO) with cloud backup"
                                          : "Restore using your registered Single Sign-On (SSO)"}
                                </Text>
                            </View>
                            {/* {isLoading && (
                                <View className="ml-2">
                                    <Ionicons name="logo-apple" size={24} color="#fff" />
                                </View>
                            )} */}
                        </View>
                    </TouchableOpacity>

                    {isCreateWallet ? (
                        // Recovery Phrase Creation Option (only for create)
                        <TouchableOpacity
                            // className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 active:bg-gray-50"
                            className={`${
                                isLoading ? "opacity-50 bg-white" : "bg-white"
                            } rounded-2xl p-6 shadow-sm border border-gray-100 active:bg-gray-50`}
                            activeOpacity={0.7}
                            onPress={() => router.push({ pathname: "/(public)/mnemonic/create" })}
                            disabled={isLoading}
                        >
                            <View className="flex-row items-start">
                                <View className="bg-green-50 rounded-full p-3 mr-4">
                                    <Plus size={24} color="#059669" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xl font-semibold text-gray-900 mb-2">Recovery Phrase</Text>
                                    <Text className="text-base text-gray-600 leading-5">
                                        Create a new wallet with a 12-word recovery phrase
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        // Recovery Phrase Import Option (only for restore)
                        <TouchableOpacity
                            className={`${
                                isLoading ? "opacity-50 bg-white" : "bg-white"
                            } rounded-2xl p-6 shadow-sm border border-gray-100 active:bg-gray-50`}
                            activeOpacity={0.7}
                            onPress={() => router.push({ pathname: "/(public)/mnemonic/import" })}
                            disabled={isLoading}
                        >
                            <View className="flex-row items-start">
                                <View className="bg-purple-50 rounded-full p-3 mr-4">
                                    <Key size={24} color="#7C3AED" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xl font-semibold text-gray-900 mb-2">Recovery Phrase</Text>
                                    <Text className="text-base text-gray-600 leading-5">
                                        Enter your 12-word recovery phrase to restore your wallet
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Error Display */}
                {error && (
                    <View className="mt-4 bg-red-50 rounded-2xl p-4">
                        <Text className="text-sm text-red-800 text-center">{error}</Text>
                    </View>
                )}

                {/* Security Note */}
                <View className="mt-8 bg-blue-50 rounded-2xl p-4">
                    <View className="flex-row items-start">
                        <View className="bg-blue-100 rounded-full p-2 mr-3">
                            <Shield size={20} color="#2563EB" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-semibold text-blue-900 mb-1">Security First</Text>
                            <Text className="text-sm text-blue-800 leading-5">
                                Your passcode has been set up to secure your wallet. All authentication methods provide
                                the same level of security for your assets.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
