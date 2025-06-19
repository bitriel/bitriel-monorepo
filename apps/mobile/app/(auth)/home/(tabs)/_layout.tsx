import Colors from "~/src/constants/Colors";
import { Tabs } from "expo-router";
import { Wallet, Settings, Gift, User, ArrowUpDown, Shield } from "lucide-react-native";

const TabsPage = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: "#8E8E93",
                tabBarStyle: {
                    backgroundColor: "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor: "#E5E5E7",
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 88,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                },
            }}
        >
            <Tabs.Screen
                name="wallet"
                options={{
                    headerShown: false,
                    headerTitle: "Wallet",
                    tabBarIcon: ({ color, size }) => <Wallet size={size} color={color} />,
                    tabBarLabel: "Wallet",
                }}
            />

            <Tabs.Screen
                name="services"
                options={{
                    headerShown: false,
                    headerTitle: "Services",
                    tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
                    tabBarLabel: "Services",
                }}
            />

            <Tabs.Screen
                name="rewards"
                options={{
                    headerShown: false,
                    headerTitle: "Rewards",
                    tabBarIcon: ({ color, size }) => <Gift size={size} color={color} />,
                    tabBarLabel: "Rewards",
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    headerTitle: "Profile",
                    tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
                    tabBarLabel: "Profile",
                }}
            />

            {/* Hidden tabs for backward compatibility */}
            <Tabs.Screen
                name="home"
                options={{
                    headerTitle: "Home",
                    tabBarIcon: ({ color, size }) => <Wallet size={size} color={color} />,
                    tabBarLabel: "Home",
                    href: null,
                }}
            />

            <Tabs.Screen
                name="ecosystem"
                options={{
                    headerTitle: "Ecosystem",
                    tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
                    tabBarLabel: "Ecosystem",
                    href: null,
                }}
            />

            <Tabs.Screen
                name="swap"
                options={{
                    headerTitle: "Swap Tokens",
                    tabBarIcon: ({ color, size }) => <ArrowUpDown size={size} color={color} />,
                    tabBarLabel: "Swap",
                    href: null,
                }}
            />

            <Tabs.Screen
                name="dApps"
                options={{
                    headerTitle: "DApps",
                    tabBarIcon: ({ color, size }) => <Shield size={size} color={color} />,
                    tabBarLabel: "DApps",
                    href: null,
                }}
            />
        </Tabs>
    );
};

export default TabsPage;
