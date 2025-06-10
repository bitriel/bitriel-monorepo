import helpers from "~/src/helpers";
import { router } from "expo-router";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Iconify } from "react-native-iconify";
import * as Linking from "expo-linking";

export default function SettingPage() {
    const user = helpers.activeUser();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
            <View style={settingStyles.container}>
                <ScrollView contentContainerStyle={settingStyles.content}>
                    <View style={[settingStyles.section, { paddingTop: 15 }]}>
                        <View style={settingStyles.sectionBody}>
                            <TouchableOpacity
                                onPress={() => {
                                    router.push({ pathname: "/(auth)/home/settings/account/recovery" });
                                }}
                                style={settingStyles.profile}
                            >
                                <Image
                                    alt="profile"
                                    source={{
                                        uri: user.avatar,
                                    }}
                                    style={settingStyles.profileAvatar}
                                />

                                <View style={settingStyles.profileBody}>
                                    <Text style={settingStyles.profileName}>{user.fullName}</Text>
                                </View>

                                <Iconify color="#bcbcbc" icon="solar:alt-arrow-right-line-duotone" size={22} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={settingStyles.section}>
                        <View style={settingStyles.sectionBody}>
                            <View style={[settingStyles.rowWrapper, settingStyles.rowFirst]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        Linking.openURL("https://t.me/selendranetwork");
                                    }}
                                    style={settingStyles.row}
                                >
                                    <Text style={settingStyles.rowLabel}>Help & Support</Text>

                                    <View style={settingStyles.rowSpacer} />

                                    <Iconify color="#bcbcbc" icon="solar:share-bold-duotone" size={19} />
                                </TouchableOpacity>
                            </View>

                            <View style={[settingStyles.rowWrapper, settingStyles.rowLast]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        router.push({ pathname: "/(auth)/home/settings/about" });
                                    }}
                                    style={settingStyles.row}
                                >
                                    <Text style={settingStyles.rowLabel}>About Bitriel</Text>

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

export const settingStyles = StyleSheet.create({
    container: {
        padding: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    /** Header */
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 16,
    },
    headerAction: {
        width: 40,
        height: 40,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: "600",
        color: "#000",
    },
    /** Content */
    content: {
        paddingHorizontal: 16,
    },
    contentFooter: {
        marginTop: 24,
        fontSize: 13,
        fontWeight: "500",
        textAlign: "center",
        color: "#a69f9f",
    },
    /** Section */
    section: {
        paddingVertical: 12,
    },
    sectionBody: {
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor: "#fff",
    },
    /** Profile */
    profile: {
        padding: 12,
        backgroundColor: "#fff",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 9999,
        marginRight: 12,
    },
    profileBody: {
        marginRight: "auto",
    },
    profileName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#292929",
    },
    profileHandle: {
        marginTop: 2,
        fontSize: 16,
        fontWeight: "400",
        color: "#858585",
    },
    /** Row */
    row: {
        height: 44,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingRight: 12,
    },
    rowWrapper: {
        paddingLeft: 16,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#f0f0f0",
    },
    rowFirst: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    rowLabel: {
        fontSize: 16,
        letterSpacing: 0.24,
        color: "#000",
    },
    rowSpacer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    rowValue: {
        fontSize: 16,
        fontWeight: "500",
        color: "#ababab",
        marginRight: 4,
    },
    rowLast: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    rowLabelLogout: {
        width: "100%",
        textAlign: "center",
        fontWeight: "600",
        color: "#dc2626",
    },
});
