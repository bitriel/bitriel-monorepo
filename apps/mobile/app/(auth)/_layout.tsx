import React from "react";
import { Stack, router } from "expo-router";
import Colors from "~/src/constants/Colors";
import { TouchableOpacity, Pressable } from "react-native";
import { IconArrowLeft } from "@tabler/icons-react-native";

const AuthLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerBackTitle: "Back",
                headerBackButtonMenuEnabled: false,
                headerBackTitleStyle: { fontFamily: "SpaceGrotesk-SemiBold" },
                headerTitleStyle: { fontFamily: "SpaceGrotesk-SemiBold" },
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="home/(tabs)"
                options={{
                    headerBackButtonMenuEnabled: false,
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="home/qrScanner/index"
                options={{
                    title: "Scan QR Code",
                    headerBackButtonMenuEnabled: false,
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="home/receive/index"
                options={{
                    title: "Receive",
                    headerShown: true,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="home/send/index"
                options={{
                    title: "Send",
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="home/crypto/[id]"
                options={{
                    title: "",
                    headerLeft: ({ canGoBack }) =>
                        canGoBack ? (
                            <Pressable
                                onPress={() => {
                                    router.back();
                                }}
                                style={{ marginLeft: 13 }}
                            >
                                <IconArrowLeft size={34} color={Colors.secondary} />
                            </Pressable>
                        ) : undefined,
                    headerShown: true,
                    animation: "slide_from_bottom",
                    headerLargeTitle: true,
                    headerTransparent: true,
                    headerStyle: {
                        backgroundColor: Colors.offWhite,
                    },
                }}
            />

            <Stack.Screen
                name="passcode/index"
                options={{
                    title: "PIN",
                    headerShown: true,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="home/success/index"
                options={{
                    headerShown: false,
                    animation: "slide_from_bottom",
                }}
            />

            <Stack.Screen
                name="webview/explorer"
                options={{
                    title: "Scan Explorer",
                    headerShown: true,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="home/settings/index"
                options={{
                    title: "Settings",
                    headerBackButtonMenuEnabled: false,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="home/settings/account/index"
                options={{
                    title: "Account",
                    headerBackButtonMenuEnabled: false,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="home/settings/account/recovery/warnMsg"
                options={{
                    title: "Recovery Phrase",
                    headerBackButtonMenuEnabled: false,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="home/settings/account/recovery/index"
                options={{
                    title: "Recovery Phrase",
                    headerBackButtonMenuEnabled: false,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="home/settings/about/index"
                options={{
                    title: "About Bitriel",
                    headerBackButtonMenuEnabled: false,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="home/settings/security/index"
                options={{
                    title: "Security & Privacy",
                    headerBackButtonMenuEnabled: false,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="home/settings/wallets/index"
                options={{
                    title: "Manage Wallets",
                    headerBackButtonMenuEnabled: false,
                    animation: "slide_from_right",
                }}
            />
        </Stack>
    );
};

export default AuthLayout;
