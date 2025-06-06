import Colors from "~/src/constants/Colors";
import { Tabs, router } from "expo-router";
import { Iconify } from "react-native-iconify";
import { View, TouchableOpacity, Text } from "react-native";
import { useWalletTypeStore } from "~/src/store/useWalletTypeStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { useWalletStore } from "~/src/store/useWalletStore";
import { useCustodialAuthStore } from "~/src/store/useCustodialAuthStore";
import { SUPPORTED_NETWORKS } from "@bitriel/wallet-sdk";

const TabsPage = () => {
    const { walletType, setWalletType } = useWalletTypeStore();
    const { initializeWallet, connectToNetwork, currentNetwork } = useWalletStore();
    const { isAuthenticated } = useCustodialAuthStore();

    const handleWalletTypeChange = async (type: "non-custodial" | "custodial") => {
        if (type === walletType) return;

        try {
            if (type === "custodial") {
                // Check if user is authenticated for custodial wallet
                if (!isAuthenticated) {
                    // Redirect to login screen with fromWallet parameter
                    router.push({
                        pathname: "/(public)/custodial/login",
                        params: { fromWallet: "true" },
                    });
                    return;
                }
                // Store wallet type in secure storage for persistence
                await ExpoSecureStoreAdapter.setItem("wallet_type", "custodial");

                // Only switch to Selendra Mainnet if currently on Selendra Substrate
                if (currentNetwork?.name === "Selendra") {
                    const selendraMainnet = SUPPORTED_NETWORKS.find(network => network.name === "Selendra Mainnet");
                    if (selendraMainnet) {
                        await connectToNetwork(selendraMainnet.chainId.toString());
                    }
                }
            } else {
                // Store wallet type in secure storage for persistence
                await ExpoSecureStoreAdapter.setItem("wallet_type", "non-custodial");

                // Get last used network first
                const lastNetwork = await ExpoSecureStoreAdapter.getItem("last_network");

                // Initialize non-custodial wallet with existing mnemonic
                const mnemonic = await ExpoSecureStoreAdapter.getItem("wallet_mnemonic");
                if (mnemonic) {
                    await initializeWallet(mnemonic);

                    // Connect to last used network after initialization
                    if (lastNetwork) {
                        const network = SUPPORTED_NETWORKS.find(n => n.chainId.toString() === lastNetwork);
                        if (network) {
                            await connectToNetwork(network.chainId.toString());
                        }
                    }
                }
            }

            // Update wallet type state
            setWalletType(type);

            // Navigate to wallet screen
            router.replace({
                pathname: "/(auth)/home/(tabs)/wallet",
            });
        } catch (error) {
            console.error("Error changing wallet type:", error);
            // Handle error appropriately
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.offWhite }}>
            <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.offWhite }}>
                <View
                    style={{
                        flexDirection: "row",
                        backgroundColor: Colors.offWhite,
                        padding: 10,
                        justifyContent: "center",
                        gap: 10,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => handleWalletTypeChange("non-custodial")}
                        style={{
                            paddingHorizontal: 20,
                            paddingVertical: 8,
                            borderRadius: 20,
                            backgroundColor: walletType === "non-custodial" ? Colors.primary : "transparent",
                        }}
                    >
                        <Text
                            style={{
                                color: walletType === "non-custodial" ? Colors.blackText : Colors.secondary,
                                fontFamily: "SpaceGrotesk-SemiBold",
                            }}
                        >
                            Wallet
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleWalletTypeChange("custodial")}
                        style={{
                            paddingHorizontal: 20,
                            paddingVertical: 8,
                            borderRadius: 20,
                            backgroundColor: walletType === "custodial" ? Colors.primary : "transparent",
                        }}
                    >
                        <Text
                            style={{
                                color: walletType === "custodial" ? Colors.blackText : Colors.secondary,
                                fontFamily: "SpaceGrotesk-SemiBold",
                            }}
                        >
                            Exchange
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <View style={{ flex: 1 }}>
                <Tabs
                    screenOptions={{
                        tabBarActiveTintColor: Colors.primary,
                        headerShown: false,
                    }}
                >
                    <Tabs.Screen
                        name="wallet"
                        options={{
                            headerTitle: "Wallet",
                            tabBarIcon: ({ color, size }) => (
                                <Iconify icon="solar:wallet-money-bold-duotone" size={size} color={color} />
                            ),
                            tabBarLabel: "Wallet",
                        }}
                    />

                    <Tabs.Screen
                        name="swap"
                        options={{
                            headerTitle: "Swap Tokens",
                            tabBarIcon: ({ color, size }) => (
                                <Iconify icon="solar:square-transfer-vertical-bold-duotone" size={size} color={color} />
                            ),
                            tabBarLabel: "Swap",
                            href: null,
                        }}
                    />

                    <Tabs.Screen
                        name="dApps"
                        options={{
                            headerTitle: "DApps",
                            tabBarIcon: ({ color, size }) => (
                                <Iconify icon="solar:shield-network-bold-duotone" size={size} color={color} />
                            ),
                            tabBarLabel: "DApps",
                            href: null,
                        }}
                    />
                </Tabs>
            </View>
        </View>
    );
};

export default TabsPage;
