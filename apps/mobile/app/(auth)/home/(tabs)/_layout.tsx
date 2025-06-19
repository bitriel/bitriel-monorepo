import { withLayoutContext } from "expo-router";
import {
    createNativeBottomTabNavigator,
    NativeBottomTabNavigationOptions,
    NativeBottomTabNavigationEventMap,
} from "@bottom-tabs/react-navigation";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { CustomTabBar } from "../../../../components/Tabbar/CustomTabbar";

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const Tabs = withLayoutContext<
    NativeBottomTabNavigationOptions,
    typeof BottomTabNavigator,
    TabNavigationState<ParamListBase>,
    NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

export default function TabLayout() {
    return (
        <Tabs tabBar={props => <CustomTabBar {...props} />}>
            <Tabs.Screen
                name="wallet"
                options={{
                    title: "Wallet",
                    tabBarLabel: "Wallet",
                }}
            />
            <Tabs.Screen
                name="services"
                options={{
                    title: "Services",
                    tabBarLabel: "Services",
                }}
            />
            <Tabs.Screen
                name="rewards"
                options={{
                    title: "Rewards",
                    tabBarLabel: "Rewards",
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarLabel: "Profile",
                }}
            />
        </Tabs>
    );
}
