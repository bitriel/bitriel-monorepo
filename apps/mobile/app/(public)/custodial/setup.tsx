import React from "react";
import { View, Text, TouchableOpacity, StatusBar, SafeAreaView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { useRef, useCallback, useEffect } from "react";
import { useAuth } from "~/lib/hooks/useAuth";

export default function SignInScreen() {
    const { isRestore } = useLocalSearchParams<{ isRestore: string }>();
    const { signIn, isLoading, error, isAuthenticated } = useAuth();

    const isRestoreMode = isRestore === "true";
    const bottomSheetRef = useRef<BottomSheet>(null);

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

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
        []
    );

    const handleOpenSheet = useCallback(() => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.expand();
        }
    }, []);

    const handleCloseSheet = useCallback(() => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.close();
        }
    }, []);

    const handleContinue = useCallback(() => {
        handleCloseSheet();
        router.push("/mnemonic/create");
    }, []);

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
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            <View className="flex-row justify-between items-center px-6 py-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-lg font-SpaceGroteskBold text-gray-800">Cancel</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-1 justify-center items-center px-8">
                <View className="mb-8 p-6 bg-white rounded-3xl shadow-lg">
                    <Image
                        source={require("~Assets/svg/security.svg")}
                        style={{ width: 120, height: 120 }}
                        contentFit="contain"
                    />
                </View>

                <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">Sign in with Digital ID</Text>

                {!isRestoreMode ? (
                    <Text className="text-gray-600 text-center text-base leading-7 mb-12 px-2 max-w-sm">
                        Sign in with your Digital ID to set it up as a backup. You will be prompted to sign in again if
                        you ever lose your wallet.
                    </Text>
                ) : (
                    <Text className="text-gray-600 text-center text-base leading-7 mb-12 px-2 max-w-sm">
                        Sign in with your Digital ID you used to setup your wallet backup.
                    </Text>
                )}
            </View>

            <View className="px-6 pb-8 space-y-3">
                <TouchableOpacity
                    className={`${isLoading ? "bg-blue-400" : "bg-blue-600"} rounded-2xl py-4 px-6 flex-row items-center justify-center shadow-sm`}
                    activeOpacity={0.8}
                    onPress={handleCustodialAuth}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" size="small" style={{ marginRight: 12 }} />
                    ) : (
                        <Ionicons name="logo-apple" size={24} color="#fff" style={{ marginRight: 16 }} />
                    )}
                    <Text className="text-lg font-semibold text-white flex-1 text-center mr-10">
                        {isLoading ? "Authenticating..." : "Continue with Digital ID"}
                    </Text>
                </TouchableOpacity>

                {!isRestoreMode && (
                    <TouchableOpacity
                        className="bg-transparent rounded-2xl py-4 px-6 flex-row items-center justify-center shadow-sm mt-2"
                        activeOpacity={0.8}
                        onPress={handleOpenSheet}
                    >
                        <Text className="text-lg font-semibold text-black flex-1 text-center">Sign in another way</Text>
                    </TouchableOpacity>
                )}

                <Text className="text-xs text-gray-500 text-center mt-4 px-4 leading-5">
                    By continuing, you agree to our <Text className="text-blue-600 underline">Terms of Service</Text>{" "}
                    and <Text className="text-blue-600 underline">Privacy Policy</Text>
                </Text>
            </View>

            {/* Bottom Sheet with Dynamic Height */}
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                enableDynamicSizing
                enablePanDownToClose
                backdropComponent={renderBackdrop}
                handleIndicatorStyle={{ backgroundColor: "#999" }}
                backgroundStyle={{ backgroundColor: "white" }}
                enableContentPanningGesture
                enableHandlePanningGesture
            >
                <BottomSheetView style={{ paddingBottom: 40 }}>
                    <View className="px-6 py-4">
                        <Text className="text-xl font-bold text-center mb-2">
                            Save your recovery phrase to create a wallet
                        </Text>
                        <Text className="text-base text-gray-600 text-center mb-6">
                            We're going to be supporting other email providers soon, but in the meanwhile you'll have to
                            save your recovery phrase to finish creating a wallet.
                        </Text>
                        <TouchableOpacity
                            className="bg-blue-600 rounded-2xl py-4 px-6 items-center justify-center shadow-sm"
                            activeOpacity={0.8}
                            onPress={handleContinue}
                        >
                            <Text className="text-lg font-semibold text-white">Continue</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </SafeAreaView>
    );
}
