import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { Settings, ChevronDown, ChevronUp } from "lucide-react-native";

interface SwapSettingsProps {
    slippage: number;
    onSlippageChange: (slippage: number) => void;
}

export const SwapSettings: React.FC<SwapSettingsProps> = ({ slippage, onSlippageChange }) => {
    const [expanded, setExpanded] = useState(false);

    const predefinedSlippages = [0.1, 0.5, 1.0, 2.0];

    const handleSlippageSelect = (value: number) => {
        onSlippageChange(value);
    };

    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400, delay: 300 }}
            style={styles.container}
        >
            <TouchableOpacity style={styles.header} onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
                <View style={styles.headerLeft}>
                    <Settings size={18} color="#6366f1" style={styles.icon} />
                    <Text style={styles.title}>Advanced Settings</Text>
                </View>
                <MotiView
                    animate={{ rotate: expanded ? "180deg" : "0deg" }}
                    transition={{ type: "timing", duration: 300 }}
                >
                    <ChevronDown size={20} color="#64748b" />
                </MotiView>
            </TouchableOpacity>

            {expanded && (
                <MotiView
                    from={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ type: "timing", duration: 300 }}
                    style={styles.content}
                >
                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Slippage Tolerance</Text>
                        <Text style={styles.settingValue}>{slippage}%</Text>
                    </View>

                    <View style={styles.slippageOptions}>
                        {predefinedSlippages.map(value => (
                            <TouchableOpacity
                                key={value}
                                style={[styles.slippageOption, slippage === value && styles.slippageOptionSelected]}
                                onPress={() => handleSlippageSelect(value)}
                            >
                                <Text
                                    style={[
                                        styles.slippageOptionText,
                                        slippage === value && styles.slippageOptionTextSelected,
                                    ]}
                                >
                                    {value}%
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>
                            Your transaction will revert if the price changes unfavorably by more than this percentage.
                        </Text>
                    </View>

                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Transaction Deadline</Text>
                        <Text style={styles.settingValue}>30 minutes</Text>
                    </View>
                </MotiView>
            )}
        </MotiView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(203, 213, 225, 0.5)",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#334155",
    },
    content: {
        padding: 16,
        paddingTop: 0,
    },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    settingLabel: {
        fontSize: 14,
        color: "#64748b",
    },
    settingValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6366f1",
    },
    slippageOptions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    slippageOption: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: "rgba(241, 245, 249, 0.8)",
        borderWidth: 1,
        borderColor: "rgba(203, 213, 225, 0.5)",
    },
    slippageOptionSelected: {
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderColor: "#6366f1",
    },
    slippageOptionText: {
        fontSize: 14,
        color: "#64748b",
        fontWeight: "500",
    },
    slippageOptionTextSelected: {
        color: "#6366f1",
        fontWeight: "bold",
    },
    infoRow: {
        backgroundColor: "rgba(241, 245, 249, 0.8)",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(203, 213, 225, 0.5)",
    },
    infoText: {
        fontSize: 12,
        color: "#64748b",
        lineHeight: 18,
    },
});
