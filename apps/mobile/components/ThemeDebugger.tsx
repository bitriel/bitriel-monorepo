/**
 * Theme Debugger Component
 * Helps debug theme switching issues by showing current theme state and colors
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme, useThemeColors } from "~/src/context/ThemeProvider";
import { useSemanticColor } from "~/src/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

export function ThemeDebugger() {
    const { theme, mode, isDark } = useAppTheme();
    const colors = useThemeColors();

    // Direct semantic color access
    const textPrimary = useSemanticColor("text.primary");
    const backgroundCard = useSemanticColor("background.card");

    console.log("🎨 Theme Debug:", {
        mode,
        isDark,
        textPrimary,
        backgroundCard,
        themeTextPrimary: theme.text.primary,
        themeBackgroundCard: theme.background.card,
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🔍 Theme Debug Info</Text>

            {/* Theme State */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Theme State:</Text>
                <Text style={styles.debugText}>Mode: {mode}</Text>
                <Text style={styles.debugText}>Is Dark: {isDark ? "Yes" : "No"}</Text>
                <Text style={styles.debugText}>Theme Object: {theme ? "✅ Loaded" : "❌ Missing"}</Text>
            </View>

            {/* Direct Theme Colors */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Direct Theme Colors:</Text>
                <Text style={styles.debugText}>text.primary: {theme.text.primary}</Text>
                <Text style={styles.debugText}>background.primary: {theme.background.primary}</Text>
                <Text style={styles.debugText}>background.card: {theme.background.card}</Text>
            </View>

            {/* Hook Colors */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hook Colors:</Text>
                <Text style={styles.debugText}>useThemeColors text.primary: {colors.text.primary}</Text>
                <Text style={styles.debugText}>useSemanticColor text.primary: {textPrimary}</Text>
                <Text style={styles.debugText}>useSemanticColor background.card: {backgroundCard}</Text>
            </View>

            {/* Visual Test */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Visual Test:</Text>

                {/* Manual styling with theme colors */}
                <View
                    style={[
                        styles.testCard,
                        {
                            backgroundColor: theme.background.card,
                            borderColor: theme.border.primary,
                        },
                    ]}
                >
                    <Text style={[styles.testText, { color: theme.text.primary }]}>Manual Theme Colors</Text>
                    <Text style={[styles.testSubtext, { color: theme.text.secondary }]}>
                        This should change with theme
                    </Text>
                </View>

                {/* Using themed components */}
                <ThemedView variant="card" style={styles.testCard}>
                    <ThemedText variant="primary" style={styles.testText}>
                        Themed Components
                    </ThemedText>
                    <ThemedText variant="secondary" style={styles.testSubtext}>
                        These should also change
                    </ThemedText>
                </ThemedView>

                {/* Using hook colors */}
                <View
                    style={[
                        styles.testCard,
                        {
                            backgroundColor: colors.background.card,
                            borderColor: colors.border.primary,
                        },
                    ]}
                >
                    <Text style={[styles.testText, { color: colors.text.primary }]}>Hook Colors</Text>
                    <Text style={[styles.testSubtext, { color: colors.text.secondary }]}>Hook-based colors</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#F0F0F0",
        margin: 16,
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#000",
    },
    section: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: "#FFF",
        borderRadius: 6,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        color: "#333",
    },
    debugText: {
        fontSize: 12,
        fontFamily: "monospace",
        marginBottom: 4,
        color: "#666",
    },
    testCard: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 8,
    },
    testText: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 4,
    },
    testSubtext: {
        fontSize: 12,
    },
});

export default ThemeDebugger;
