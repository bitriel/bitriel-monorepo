import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useScaleFont } from "~/src/hooks/useScaleFont";
import { useThemeColor } from "~/src/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { formatDetailedBalance } from "~/src/utilities/formatBalance";
import { DetailedBalance } from "@bitriel/wallet-sdk";

interface BalanceProps {
    onPress: () => void;
    balance: DetailedBalance | null;
}

const Balance: React.FC<BalanceProps> = ({ onPress, balance }) => {
    const backgroundColor = useThemeColor("background.card");
    const text = useThemeColor("text.primary");
    const scaleFont = useScaleFont();

    const formattedBalance = formatDetailedBalance(balance, "transferable");

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <ThemedView
                style={{
                    padding: 14,
                    height: "100%",
                    borderRadius: 10,
                }}
            >
                <ThemedText>
                    <FontAwesome6 name="sack-dollar" size={18} />
                </ThemedText>
            </ThemedView>
            <View style={{ flex: 1 }}>
                <ThemedText
                    style={{
                        fontSize: scaleFont(13),
                        opacity: 0.5,
                    }}
                >
                    Transferable
                </ThemedText>
                <ThemedText
                    style={{
                        fontSize: scaleFont(18),
                        color: text,
                        fontFamily: "SpaceGrotesk-Medium",
                    }}
                >
                    {formattedBalance}
                </ThemedText>
            </View>
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: text + "08",
                    },
                ]}
                onPress={onPress}
            >
                <ThemedText style={{ fontSize: scaleFont(14) }}>Use Max</ThemedText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingVertical: 8,
        padding: 12,
        marginHorizontal: 16,
        borderRadius: 16,
        gap: 12,
        alignItems: "center",
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 15,
        backgroundColor: "#f4f4f4",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default Balance;
