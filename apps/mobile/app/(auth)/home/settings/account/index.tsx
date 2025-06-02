import helpers from "~/src/helpers";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { router } from "expo-router";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image } from "react-native";
import { Iconify } from "react-native-iconify";
import { settingStyles } from "../index";
import Colors from "~/src/constants/Colors";
import { useWalletDataListStore } from "~/src/store/walletDataStore";
import { useWalletTypeStore } from "~/src/store/useWalletTypeStore";
import { useCustodialAuthStore } from "~/src/store/useCustodialAuthStore";

export default function AccountPage() {
    const user = helpers.activeUser();
    const { walletType } = useWalletTypeStore();
    const { logout } = useCustodialAuthStore();

    const handleLogout = async () => {
        await logout();
        useWalletDataListStore.getState().clearWalletDataListState();
        await ExpoSecureStoreAdapter.removeAll();

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

                    {walletType === "non-custodial" && (
                        <View style={settingStyles.section}>
                            <View style={settingStyles.sectionBody}>
                                <View style={[settingStyles.rowWrapper, settingStyles.rowFirst, settingStyles.rowLast]}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            router.push({ pathname: "/(auth)/home/settings/account/recovery/warnMsg" });
                                        }}
                                        style={settingStyles.row}
                                    >
                                        <Text style={settingStyles.rowLabel}>Show Secret Recovery Phrase</Text>

                                        <View style={settingStyles.rowSpacer} />

                                        <Iconify color="#bcbcbc" icon="solar:alt-arrow-right-line-duotone" size={19} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}

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
                                        {walletType === "custodial" ? "Logout" : "Remove Account"}
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
