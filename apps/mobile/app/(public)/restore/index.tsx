import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Cloud, Lock, ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";

export default function RestoreWalletScreen() {
    // Redirect to the new flow - this screen is now deprecated
    React.useEffect(() => {
        router.replace({
            pathname: "/(public)/passcode",
            params: {
                modeTypeParam: "create",
                fromParam: "restoreWallet",
            },
        } as any);
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg text-gray-600">Redirecting...</Text>
            </View>
        </SafeAreaView>
    );
}
