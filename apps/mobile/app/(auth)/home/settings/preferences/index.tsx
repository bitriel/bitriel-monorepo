import { router } from "expo-router";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image } from "react-native";
import { Iconify } from "react-native-iconify";
import { settingStyles } from "../index";

export default function PreferencesPage() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
            <View style={settingStyles.container}>
                <ScrollView contentContainerStyle={settingStyles.content}>
                    <View style={[settingStyles.section, { paddingTop: 15 }]}>
                        <View style={settingStyles.sectionBody}>
                            <View style={[settingStyles.rowWrapper, settingStyles.rowFirst, settingStyles.rowLast]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        router.push({ pathname: "/(auth)/home/settings/preferences/appicon" });
                                    }}
                                    style={settingStyles.row}
                                >
                                    <Text style={settingStyles.rowLabel}>App Icon</Text>

                                    <View style={settingStyles.rowSpacer} />

                                    <Iconify color="#bcbcbc" icon="solar:alt-arrow-right-line-duotone" size={19} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
