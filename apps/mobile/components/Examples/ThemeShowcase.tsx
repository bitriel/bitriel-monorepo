/**
 * Theme Showcase Component
 * Demonstrates how to use both the new semantic theme system and NativeWind classes
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useAppTheme, useThemeColors, useThemeClasses } from "~/src/context/ThemeProvider";
import { useSemanticColor, createThemedStyles } from "~/src/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

// Example using createThemedStyles helper
const useStyles = createThemedStyles(theme => ({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: theme.background.primary,
    },
    card: {
        backgroundColor: theme.background.card,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: theme.border.primary,
        shadowColor: theme.shadow.color,
        shadowOpacity: theme.shadow.opacity,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    button: {
        backgroundColor: theme.brand.primary[500],
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center" as const,
        marginVertical: 4,
    },
    buttonText: {
        color: theme.text.inverse,
        fontFamily: "SpaceGroteskSemiBold",
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: "SpaceGroteskBold",
        color: theme.text.primary,
        marginBottom: 12,
        marginTop: 16,
    },
}));

export function ThemeShowcase() {
    const { mode, isDark, toggleTheme, getBrandColor } = useAppTheme();
    const colors = useThemeColors();
    const classes = useThemeClasses();
    const styles = useStyles();

    // Example using semantic color hook
    const accentColor = useSemanticColor("text.accent");
    const cardBackground = useSemanticColor("background.card");

    return (
        <ScrollView style={styles.container}>
            <ThemedText variant="primary" style={styles.sectionTitle}>
                Theme System Showcase
            </ThemedText>

            {/* Theme Control Section */}
            <View style={styles.card}>
                <ThemedText variant="secondary" style={{ marginBottom: 12 }}>
                    Current Theme: {mode} {isDark ? "🌙" : "☀️"}
                </ThemedText>

                <TouchableOpacity style={styles.button} onPress={toggleTheme}>
                    <Text style={styles.buttonText}>Switch to {isDark ? "Light" : "Dark"} Mode</Text>
                </TouchableOpacity>
            </View>

            {/* Semantic Colors with StyleSheet */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Semantic Colors (StyleSheet)</Text>

                <ThemedText variant="primary">Primary Text</ThemedText>
                <ThemedText variant="secondary">Secondary Text</ThemedText>
                <ThemedText variant="tertiary">Tertiary Text</ThemedText>
                <ThemedText variant="accent">Accent Text</ThemedText>

                <View style={{ marginTop: 12 }}>
                    <ThemedView variant="surface" style={{ padding: 8, borderRadius: 6, marginVertical: 4 }}>
                        <ThemedText variant="primary">Surface Background</ThemedText>
                    </ThemedView>

                    <ThemedView variant="card" style={{ padding: 8, borderRadius: 6, marginVertical: 4 }}>
                        <ThemedText variant="primary">Card Background</ThemedText>
                    </ThemedView>
                </View>
            </View>

            {/* NativeWind Classes Section */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>NativeWind Classes</Text>

                <View className="space-y-2">
                    <Text className={classes.text("primary")}>Primary text with NativeWind</Text>
                    <Text className={classes.text("secondary")}>Secondary text with NativeWind</Text>
                    <Text className={classes.text("accent")}>Accent text with NativeWind</Text>
                </View>

                <View className="mt-4 space-y-2">
                    <View className={`${classes.background("surface")} p-2 rounded-md`}>
                        <Text className={classes.text("primary")}>Surface with NativeWind</Text>
                    </View>

                    <View
                        className={`${classes.background("card")} p-2 rounded-md ${classes.border("primary")} border`}
                    >
                        <Text className={classes.text("primary")}>Card with border using NativeWind</Text>
                    </View>
                </View>
            </View>

            {/* Brand Colors Section */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Brand Colors</Text>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {[100, 300, 500, 700, 900].map(shade => (
                        <View
                            key={shade}
                            style={{
                                backgroundColor: getBrandColor("primary", shade),
                                width: 50,
                                height: 50,
                                borderRadius: 8,
                                justifyContent: "center" as const,
                                alignItems: "center" as const,
                            }}
                        >
                            <Text
                                style={{
                                    color: shade > 500 ? colors.text.inverse : colors.text.primary,
                                    fontSize: 12,
                                    fontFamily: "SpaceGroteskMedium",
                                }}
                            >
                                {shade}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Status Colors Section */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Status Colors</Text>

                <View style={{ gap: 8 }}>
                    <View className="bg-success-500 p-3 rounded-lg">
                        <Text className="text-white font-SpaceGroteskMedium">Success Message</Text>
                    </View>

                    <View className="bg-warning-500 p-3 rounded-lg">
                        <Text className="text-white font-SpaceGroteskMedium">Warning Message</Text>
                    </View>

                    <View className="bg-danger-500 p-3 rounded-lg">
                        <Text className="text-white font-SpaceGroteskMedium">Error Message</Text>
                    </View>

                    <View className="bg-info-500 p-3 rounded-lg">
                        <Text className="text-white font-SpaceGroteskMedium">Info Message</Text>
                    </View>
                </View>
            </View>

            {/* Interactive States */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Interactive States</Text>

                <TouchableOpacity
                    style={{
                        backgroundColor: colors.background.surface,
                        padding: 12,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: colors.border.primary,
                        marginVertical: 4,
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={{ color: colors.text.primary, textAlign: "center" }}>Tap me! (StyleSheet)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`${classes.background("surface")} ${classes.border("primary")} border p-3 rounded-lg mt-2`}
                    activeOpacity={0.8}
                >
                    <Text className={`${classes.text("primary")} text-center`}>Tap me! (NativeWind)</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 20 }} />
        </ScrollView>
    );
}

export default ThemeShowcase;
