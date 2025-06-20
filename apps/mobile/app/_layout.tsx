import "../global.css";

import { router, Slot, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useMultiWalletStore } from "~/src/store/multiWalletStore";
import { useMultiAccountStore } from "~/src/store/multiAccountStore";
import { API_CONFIG } from "~/lib/config/api";
import { ToastProvider } from "~/hooks/useToast";

const InitialLayout = () => {
    const [fontsLoaded] = useFonts({
        "SpaceGrotesk-Bold": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Bold.ttf"),
        "SpaceGrotesk-Light": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Light.ttf"),
        "SpaceGrotesk-Medium": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Medium.ttf"),
        "SpaceGrotesk-Regular": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Regular.ttf"),
        "SpaceGrotesk-SemiBold": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-SemiBold.ttf"),
    });

    const { loadWallets, activeWallet } = useMultiWalletStore();
    const { loadAccounts } = useMultiAccountStore();

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

    // Handle deep links at the root level to prevent conflicts
    useEffect(() => {
        const handleDeepLink = (url: string) => {
            console.log("🔗 Root deep link received:", url);

            // If it's an auth callback, let the dedicated route handle it
            if (url.startsWith(`${API_CONFIG.APP.URL_SCHEME}://auth/callback`)) {
                console.log("📞 Auth callback detected, routing to auth/callback");
                // Extract query parameters
                const urlObj = new URL(url);
                const params = Object.fromEntries(urlObj.searchParams.entries());

                // Navigate to the auth callback route with params
                router.push({
                    pathname: "/auth/callback",
                    params,
                });
                return;
            }
        };

        // Listen for deep link events
        const subscription = Linking.addEventListener("url", ({ url }) => {
            handleDeepLink(url);
        });

        // Check if app was opened with a deep link
        Linking.getInitialURL().then(url => {
            if (url) {
                handleDeepLink(url);
            }
        });

        return () => subscription?.remove();
    }, []);

    const checkKey = async () => {
        try {
            console.log("🚀 Initializing app-level data...");

            // Load all core data at app startup
            await Promise.all([loadWallets(), loadAccounts()]);

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
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    <ToastProvider>
                        <InitialLayout />
                    </ToastProvider>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </AlertNotificationRoot>
    );
};

export default RootLayout;
