import "../global.css";

import { router, Slot, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMultiWalletStore } from "~/src/store/multiWalletStore";

const InitialLayout = () => {
    const [fontsLoaded] = useFonts({
        "SpaceGrotesk-Bold": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Bold.ttf"),
        "SpaceGrotesk-Light": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Light.ttf"),
        "SpaceGrotesk-Medium": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Medium.ttf"),
        "SpaceGrotesk-Regular": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Regular.ttf"),
        "SpaceGrotesk-SemiBold": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-SemiBold.ttf"),
    });

    const { loadWallets, activeWallet } = useMultiWalletStore();

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
            console.log("Checking wallet state...");

            // Load wallets from the multi-wallet store
            await loadWallets();

            // Get the current state after loading
            const currentState = useMultiWalletStore.getState();
            console.log("Current wallet state:", {
                hasActiveWallet: !!currentState.activeWallet,
                walletsCount: currentState.wallets.length,
            });

            if (currentState.activeWallet) {
                // Navigate to wallet screen with active wallet
                const mnemonic =
                    currentState.activeWallet.type === "non-custodial" ? currentState.activeWallet.mnemonic : "";
                console.log("Navigating to wallet with active wallet");
                router.replace({
                    pathname: "/(auth)/home/(tabs)/wallet",
                    params: { mnemonicParam: mnemonic || "" },
                });
            } else {
                // No active wallet, check for legacy single wallet
                const legacyMnemonic: string | null = await ExpoSecureStoreAdapter.getItem("wallet_mnemonic");

                if (legacyMnemonic) {
                    // Pass the legacy mnemonic to be migrated
                    console.log("Found legacy wallet, passing for migration");
                    router.replace({
                        pathname: "/(auth)/home/(tabs)/wallet",
                        params: { mnemonicParam: legacyMnemonic },
                    });
                } else {
                    console.log("No wallets found, redirecting to welcome");
                    router.replace("/welcome");
                }
            }
        } catch (error) {
            console.error("Error checking wallets:", error);
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
