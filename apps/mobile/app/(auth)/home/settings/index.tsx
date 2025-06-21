import React from "react";
import helpers from "~/src/helpers";
import { router } from "expo-router";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { IconChevronRight, IconShare } from "@tabler/icons-react-native";
import * as Linking from "expo-linking";
import { ThemedView } from "~/components/ThemedView";
import { ThemedText } from "~/components/ThemedText";
import { ThemeToggle } from "~/components/ThemeToggle";
import { ThemeSettings } from "~/components/ThemeSettings";
import { useAppTheme } from "~/src/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

export default function SettingPage() {
    const user = helpers.activeUser();
    const { isDark } = useAppTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
            <ThemedView variant="primary" style={settingStyles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={settingStyles.header}>
                        <ThemedText variant="primary" style={settingStyles.title}>
                            Settings
                        </ThemedText>
                        <ThemedText variant="secondary" style={settingStyles.subtitle}>
                            Customize your Bitriel experience
                        </ThemedText>
                    </View>

                    <View style={[settingStyles.section, { paddingTop: 15 }]}>
                        <View style={settingStyles.sectionBody}>
                            <TouchableOpacity
                                onPress={() => {
                                    router.push({ pathname: "/(auth)/home/settings/account" });
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

                                <IconChevronRight color="#bcbcbc" size={22} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={settingStyles.section}>
                        <View style={settingStyles.sectionBody}>
                            <View style={[settingStyles.rowWrapper, settingStyles.rowFirst]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        router.push({ pathname: "/(auth)/home/settings/wallets" });
                                    }}
                                    style={settingStyles.row}
                                >
                                    <Text style={settingStyles.rowLabel}>Manage Wallets</Text>

                                    <View style={settingStyles.rowSpacer} />

                                    <IconChevronRight color="#bcbcbc" size={19} />
                                </TouchableOpacity>
                            </View>

                            <View style={settingStyles.rowWrapper}>
                                <TouchableOpacity
                                    onPress={() => {
                                        Linking.openURL("https://t.me/selendranetwork");
                                    }}
                                    style={settingStyles.row}
                                >
                                    <Text style={settingStyles.rowLabel}>Help & Support</Text>

                                    <View style={settingStyles.rowSpacer} />

                                    <IconShare color="#bcbcbc" size={19} />
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

                                    <IconChevronRight color="#bcbcbc" size={19} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={settingStyles.section}>
                        <ThemedText variant="secondary" style={settingStyles.sectionTitle}>
                            APPEARANCE
                        </ThemedText>
                        <ThemeSettings />
                    </View>

                    <View style={settingStyles.section}>
                        <ThemedText variant="secondary" style={settingStyles.sectionTitle}>
                            THEME DEMO
                        </ThemedText>

                        <ThemedView variant="card" style={settingStyles.demoCard}>
                            <ThemedText variant="primary" style={settingStyles.demoTitle}>
                                Live Preview
                            </ThemedText>
                            <ThemedText variant="secondary" style={settingStyles.demoText}>
                                This card automatically adapts to your theme preference. Try switching themes to see the
                                colors change!
                            </ThemedText>

                            <View style={settingStyles.demoButtons}>
                                <View style={[settingStyles.primaryButton, { backgroundColor: "#FFAC30" }]}>
                                    <ThemedText variant="inverse" style={settingStyles.buttonText}>
                                        Primary Button
                                    </ThemedText>
                                </View>

                                <ThemedView variant="surface" style={settingStyles.secondaryButton}>
                                    <ThemedText variant="primary" style={settingStyles.buttonText}>
                                        Secondary Button
                                    </ThemedText>
                                </ThemedView>
                            </View>
                        </ThemedView>
                    </View>

                    <View style={settingStyles.section}>
                        <ThemedText variant="secondary" style={settingStyles.sectionTitle}>
                            TOGGLE SIZES
                        </ThemedText>

                        <ThemedView variant="card" style={settingStyles.sizesCard}>
                            <View style={settingStyles.sizeRow}>
                                <ThemedText variant="primary" style={settingStyles.sizeLabel}>
                                    Small
                                </ThemedText>
                                <ThemeToggle size="small" showLabel={true} />
                            </View>

                            <View style={settingStyles.sizeRow}>
                                <ThemedText variant="primary" style={settingStyles.sizeLabel}>
                                    Medium
                                </ThemedText>
                                <ThemeToggle size="medium" showLabel={true} />
                            </View>

                            <View style={settingStyles.sizeRow}>
                                <ThemedText variant="primary" style={settingStyles.sizeLabel}>
                                    Large
                                </ThemedText>
                                <ThemeToggle size="large" showLabel={true} />
                            </View>
                        </ThemedView>
                    </View>
                </ScrollView>
            </ThemedView>
        </SafeAreaView>
    );
}

export const settingStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontFamily: "SpaceGroteskBold",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "SpaceGroteskRegular",
    },
    section: {
        marginBottom: 24,
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
    sectionTitle: {
        fontSize: 12,
        fontFamily: "SpaceGroteskSemiBold",
        letterSpacing: 0.5,
        marginBottom: 12,
        textTransform: "uppercase",
    },
    demoCard: {
        padding: 16,
        borderRadius: 12,
    },
    demoTitle: {
        fontSize: 18,
        fontFamily: "SpaceGroteskBold",
        marginBottom: 8,
    },
    demoText: {
        fontSize: 14,
        fontFamily: "SpaceGroteskRegular",
        lineHeight: 20,
        marginBottom: 16,
    },
    demoButtons: {
        flexDirection: "row",
        gap: 12,
    },
    primaryButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: "center" as const,
        alignItems: "center" as const,
    },
    secondaryButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        borderWidth: 1,
        borderColor: "#E5E5E7",
    },
    buttonText: {
        fontSize: 14,
        fontFamily: "SpaceGroteskSemiBold",
    },
    sizesCard: {
        padding: 16,
        borderRadius: 12,
    },
    sizeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
    },
    sizeLabel: {
        fontSize: 16,
        fontFamily: "SpaceGroteskMedium",
        minWidth: 80,
    },
});
