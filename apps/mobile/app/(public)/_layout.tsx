import React from "react";
import { Stack } from "expo-router";

const PublicLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerBackTitle: "Back",
                headerBackButtonMenuEnabled: false,
                headerBackTitleStyle: { fontFamily: "SpaceGrotesk-SemiBold" },
                headerTitleStyle: { fontFamily: "SpaceGrotesk-SemiBold" },
            }}
        >
            <Stack.Screen
                name="welcome/index"
                options={{
                    headerShown: false,
                    animation: "slide_from_bottom",
                }}
            />

            <Stack.Screen
                name="mnemonic/create"
                options={{
                    title: "Create Mnemonic",
                    headerShown: true,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="custodial/setup"
                options={{
                    title: "Setup Custodial",
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="restore/index"
                options={{
                    title: "Restore",
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            />

            <Stack.Screen
                name="mnemonic/import"
                options={{
                    title: "Import Mnemonic",
                    headerShown: true,
                    animation: "slide_from_right",
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
                name="auth-method/index"
                options={{
                    title: "Authentication Method",
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            />
        </Stack>
    );
};

export default PublicLayout;
