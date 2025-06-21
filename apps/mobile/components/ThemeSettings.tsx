/**
 * Theme Settings Component
 * Comprehensive theme settings with system detection and manual options
 * Perfect for settings screens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAppTheme } from "~/src/context/ThemeProvider";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { ThemeToggle } from "./ThemeToggle";

export function ThemeSettings() {
    const { mode, isDark, setTheme } = useAppTheme();

    const themeOptions = [
        {
            key: "light" as const,
            label: "Light Mode",
            description: "Always use light theme",
            icon: "sunny" as const,
            color: "#FF6B35",
        },
        {
            key: "dark" as const,
            label: "Dark Mode",
            description: "Always use dark theme",
            icon: "moon" as const,
            color: "#FFD700",
        },
        {
            key: "system" as const,
            label: "System",
            description: "Follow system preference",
            icon: "phone-portrait" as const,
            color: "#60A5FA",
        },
    ];

    const handleThemeChange = (themeMode: "light" | "dark" | "system") => {
        if (themeMode === "system") {
            Alert.alert(
                "System Theme",
                "The app will automatically switch between light and dark modes based on your device settings.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "OK", onPress: () => setTheme(themeMode) },
                ]
            );
        } else {
            setTheme(themeMode);
        }
    };

    return (
        <ThemedView variant="primary" style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <ThemedText variant="primary" style={styles.title}>
                    Appearance
                </ThemedText>
                <ThemedText variant="secondary" style={styles.subtitle}>
                    Customize how Bitriel looks on your device
                </ThemedText>
            </View>

            {/* Quick Toggle */}
            <ThemedView variant="card" style={styles.quickToggleCard}>
                <View style={styles.quickToggleContent}>
                    <View style={styles.quickToggleText}>
                        <ThemedText variant="primary" style={styles.cardTitle}>
                            Theme
                        </ThemedText>
                        <ThemedText variant="secondary" style={styles.cardDescription}>
                            Currently using {isDark ? "dark" : "light"} mode
                        </ThemedText>
                    </View>
                    <ThemeToggle size="large" showLabel={false} />
                </View>
            </ThemedView>

            {/* Theme Options */}
            <View style={styles.optionsSection}>
                <ThemedText variant="secondary" style={styles.sectionTitle}>
                    THEME OPTIONS
                </ThemedText>

                <ThemedView variant="card" style={styles.optionsCard}>
                    {themeOptions.map((option, index) => (
                        <React.Fragment key={option.key}>
                            <TouchableOpacity
                                style={styles.optionItem}
                                onPress={() => handleThemeChange(option.key)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.optionContent}>
                                    <View style={[styles.iconContainer, { backgroundColor: `${option.color}15` }]}>
                                        <Ionicons name={option.icon} size={20} color={option.color} />
                                    </View>

                                    <View style={styles.optionText}>
                                        <ThemedText variant="primary" style={styles.optionLabel}>
                                            {option.label}
                                        </ThemedText>
                                        <ThemedText variant="secondary" style={styles.optionDescription}>
                                            {option.description}
                                        </ThemedText>
                                    </View>
                                </View>

                                <View style={styles.optionRight}>
                                    {mode === option.key && (
                                        <View style={styles.activeIndicator}>
                                            <Ionicons name="checkmark-circle" size={20} color="#FFAC30" />
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>

                            {index < themeOptions.length - 1 && <View style={styles.separator} />}
                        </React.Fragment>
                    ))}
                </ThemedView>
            </View>

            {/* Preview Section */}
            <View style={styles.previewSection}>
                <ThemedText variant="secondary" style={styles.sectionTitle}>
                    PREVIEW
                </ThemedText>

                <ThemedView variant="card" style={styles.previewCard}>
                    <View style={styles.previewContent}>
                        <ThemedText variant="primary" style={styles.previewTitle}>
                            Sample Card
                        </ThemedText>
                        <ThemedText variant="secondary" style={styles.previewText}>
                            This is how text appears in the current theme
                        </ThemedText>

                        <View style={styles.previewButtons}>
                            <View style={[styles.previewButton, { backgroundColor: "#FFAC30" }]}>
                                <Text style={styles.previewButtonText}>Primary</Text>
                            </View>
                            <ThemedView variant="surface" style={styles.previewButton}>
                                <ThemedText variant="primary" style={styles.previewButtonText}>
                                    Secondary
                                </ThemedText>
                            </ThemedView>
                        </View>
                    </View>
                </ThemedView>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontFamily: "SpaceGroteskBold",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "SpaceGroteskRegular",
    },
    quickToggleCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    quickToggleContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    quickToggleText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: "SpaceGroteskSemiBold",
        marginBottom: 2,
    },
    cardDescription: {
        fontSize: 14,
        fontFamily: "SpaceGroteskRegular",
    },
    optionsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: "SpaceGroteskSemiBold",
        letterSpacing: 0.5,
        marginBottom: 8,
        textTransform: "uppercase",
    },
    optionsCard: {
        borderRadius: 12,
        overflow: "hidden",
    },
    optionItem: {
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    optionContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        marginRight: 12,
    },
    optionText: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontFamily: "SpaceGroteskSemiBold",
        marginBottom: 2,
    },
    optionDescription: {
        fontSize: 14,
        fontFamily: "SpaceGroteskRegular",
    },
    optionRight: {
        marginLeft: 12,
    },
    activeIndicator: {
        width: 24,
        height: 24,
        justifyContent: "center" as const,
        alignItems: "center" as const,
    },
    separator: {
        height: 1,
        backgroundColor: "#E5E5E7",
        marginLeft: 68,
    },
    previewSection: {
        marginBottom: 24,
    },
    previewCard: {
        padding: 16,
        borderRadius: 12,
    },
    previewContent: {
        alignItems: "center" as const,
    },
    previewTitle: {
        fontSize: 18,
        fontFamily: "SpaceGroteskBold",
        marginBottom: 8,
    },
    previewText: {
        fontSize: 14,
        fontFamily: "SpaceGroteskRegular",
        textAlign: "center" as const,
        marginBottom: 16,
    },
    previewButtons: {
        flexDirection: "row",
        gap: 12,
    },
    previewButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 80,
        justifyContent: "center" as const,
        alignItems: "center" as const,
    },
    previewButtonText: {
        fontSize: 14,
        fontFamily: "SpaceGroteskSemiBold",
        color: "#FFFFFF",
    },
});

export default ThemeSettings;
