import Colors from "~/src/constants/Colors";
import { Tabs } from "expo-router";
import { Iconify } from "react-native-iconify";

const TabsPage = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
            }}
        >
            <Tabs.Screen
                name="wallet"
                options={{
                    headerShown: false,
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
    );
};

export default TabsPage;
