import "../global.css";

import { router, Slot, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const InitialLayout = () => {
    const [fontsLoaded] = useFonts({
        "SpaceGrotesk-Bold": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Bold.ttf"),
        "SpaceGrotesk-Light": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Light.ttf"),
        "SpaceGrotesk-Medium": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Medium.ttf"),
        "SpaceGrotesk-Regular": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-Regular.ttf"),
        "SpaceGrotesk-SemiBold": require("./../assets/fonts/SpaceGrotesk/SpaceGrotesk-SemiBold.ttf"),
    });

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
            const mnemonic: string | null = await ExpoSecureStoreAdapter.getItem("wallet_mnemonic");

            if (mnemonic) {
                // Navigate to a screen when data is cached
                router.replace({
                    pathname: "/(auth)/home/(tabs)/wallet",
                    params: { mnemonicParam: mnemonic! },
                });
            } else {
                router.replace("/welcome");
            }
        } catch (error) {
            console.error("Error checking key:", error);
            // Handle error state or show an error message to the user
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
