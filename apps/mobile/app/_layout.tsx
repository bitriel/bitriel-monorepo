import "../global.css";

import { router, Slot, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useCustodialAuthStore } from "~/src/store/useCustodialAuthStore";
import { useWalletTypeStore } from "~/src/store/useWalletTypeStore";
import { authApi } from "~/src/api/userApi";

const InitialLayout = () => {
    const [fontsLoaded] = useFonts({
        "SpaceGrotesk-Bold": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Bold.ttf"),
        "SpaceGrotesk-Light": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Light.ttf"),
        "SpaceGrotesk-Medium": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Medium.ttf"),
        "SpaceGrotesk-Regular": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Regular.ttf"),
        "SpaceGrotesk-SemiBold": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-SemiBold.ttf"),
    });

    const { initialize: initializeCustodialAuth } = useCustodialAuthStore();
    const { initialize: initializeWalletType } = useWalletTypeStore();

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    useEffect(() => {
        (async () => {
            await checkKey();
        })();
    }, []);

    const checkKey = async () => {
        try {
            // Initialize both stores first
            await Promise.all([initializeCustodialAuth(), initializeWalletType()]);

            // Check for mnemonic wallet
            const mnemonic: string | null = await ExpoSecureStoreAdapter.getItem("wallet_mnemonic");

            // Check for custodial token
            const custodialToken: string | null = await ExpoSecureStoreAdapter.getItem("custodial_token");

            if (mnemonic) {
                // Navigate to wallet screen with mnemonic
                router.replace({
                    pathname: "/(auth)/home/(tabs)/wallet",
                    params: { mnemonicParam: mnemonic },
                });
            } else if (custodialToken) {
                // Fetch user data to get private key
                const userData = await authApi.getCurrentUser();

                if (userData.privateKey) {
                    // Save private key as mnemonic for non-custodial wallet
                    await ExpoSecureStoreAdapter.setItem("wallet_mnemonic", userData.privateKey);

                    // Navigate to wallet screen with both wallet types
                    router.replace({
                        pathname: "/(auth)/home/(tabs)/wallet",
                        params: {
                            mnemonicParam: userData.privateKey,
                            isDualWallet: "true",
                        },
                    });
                } else {
                    // If no private key, just use custodial wallet
                    router.replace("/(auth)/home/(tabs)/wallet");
                }
            } else {
                // No wallet found, go to welcome screen
                router.replace("/welcome");
            }
        } catch (error) {
            console.error("Error checking wallet:", error);
            // Handle error state or show an error message to the user
            router.replace("/welcome");
        }
    };

    return <Slot />;
};

const RootLayout = () => {
    return (
        <AlertNotificationRoot>
            <GestureHandlerRootView>
                <InitialLayout />
            </GestureHandlerRootView>
        </AlertNotificationRoot>
    );
};

export default RootLayout;
