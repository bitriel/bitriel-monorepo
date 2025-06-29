import React from "react";
import helpers from "~/src/helpers";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { router } from "expo-router";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image } from "react-native";
import { settingStyles } from "../index";
import Colors from "~/src/constants/Colors";
import { useWalletDataListStore } from "~/src/store/walletDataStore";
import { useAuth } from "~/lib/hooks/useAuth";

export default function AccountPage() {
    const user = helpers.activeUser();

    const { signOut } = useAuth();

    const handleLogout = () => {
        // clearWalletState(); // Clear the state when logging out

        useWalletDataListStore.getState().clearWalletDataListState;

        ExpoSecureStoreAdapter.removeAll();

        signOut();

        router.navigate({
            pathname: "/(public)/welcome",
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
            <View style={settingStyles.container}>
                <ScrollView contentContainerStyle={settingStyles.content}>
                    <View className="items-center m-5">
                        <Image
                            source={{ uri: user.avatar }}
                            style={{ height: 100, width: 100, borderRadius: 50, backgroundColor: Colors.white }}
                        />
                    </View>

                    <View style={settingStyles.section}>
                        <View style={settingStyles.sectionBody}>
                            <View
                                style={[
                                    settingStyles.rowWrapper,
                                    settingStyles.rowFirst,
                                    settingStyles.rowLast,
                                    { alignItems: "center" },
                                ]}
                            >
                                <TouchableOpacity onPress={handleLogout} style={settingStyles.row}>
                                    <Text style={[settingStyles.rowLabel, settingStyles.rowLabelLogout]}>
                                        Remove Account
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
