import React, { useMemo, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import { ArrowRight, Info } from "lucide-react-native";
import { TokenBalance } from "@bitriel/wallet-sdk";
import { swapApi, Token } from "~/src/api/swapApi";

interface SwapRateProps {
    fromToken: TokenBalance | null;
    toToken: TokenBalance | null;
    amount: string;
}

export const SwapRate: React.FC<SwapRateProps> = ({ fromToken, toToken, amount }) => {
    const [createdTokens, setCreatedTokens] = useState<Token[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCreatedTokens = async () => {
            try {
                const tokens = await swapApi.getCreatedTokens();
                // Filter out tokens with null addresses and cast to CreatedToken[]
                const validTokens = tokens.filter(token => token.token_address !== null) as Token[];
                setCreatedTokens(validTokens);
            } catch (error) {
                console.error("Error fetching created tokens:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCreatedTokens();
    }, []);

    // Calculate exchange rate based on token ratio
    const exchangeRate = useMemo(() => {
        if (!fromToken || !toToken) return "0";

        // Find the created token that matches either fromToken or toToken
        const createdToken = createdTokens.find(
            token =>
                token.token_address?.toLowerCase() === fromToken.token.address.toLowerCase() ||
                token.token_address?.toLowerCase() === toToken.token.address.toLowerCase()
        );

        if (!createdToken) return "0";

        return createdToken.ratio.toString();
    }, [fromToken, toToken, createdTokens]);

    // Calculate estimated output
    const estimatedOutput = useMemo(() => {
        if (!amount || !exchangeRate || exchangeRate === "0") return "0.0";
        const output = parseFloat(amount) * parseFloat(exchangeRate);
        return output.toFixed(2);
    }, [amount, exchangeRate]);

    // Calculate price impact based on stable_coin_amount
    const priceImpact = useMemo(() => {
        if (!fromToken || !toToken) return "0";

        const createdToken = createdTokens.find(
            token =>
                token.token_address?.toLowerCase() === fromToken.token.address.toLowerCase() ||
                token.token_address?.toLowerCase() === toToken.token.address.toLowerCase()
        );

        if (!createdToken) return "0";

        // Calculate price impact based on stable_coin_amount
        const impact = (parseFloat(amount) / createdToken.stable_coin_amount) * 100;
        return impact.toFixed(2);
    }, [fromToken, toToken, amount, createdTokens]);

    // For demo: static network fee
    const networkFee = "0.001"; // ETH

    if (!fromToken || !toToken) {
        return null;
    }

    if (isLoading) {
        return (
            <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 400, delay: 200 }}
                style={styles.container}
            >
                <Text style={styles.loadingText}>Loading swap rate...</Text>
            </MotiView>
        );
    }

    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400, delay: 200 }}
            style={styles.container}
        >
            {/* Exchange Rate */}
            <View style={styles.row}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Exchange Rate</Text>
                    {/* <TouchableOpacity style={styles.infoButton}>
            <Info size={14} color="#64748b" />
          </TouchableOpacity> */}
                </View>
                <View style={styles.valueContainer}>
                    <Text style={styles.value}>
                        1 {fromToken.token.symbol} = {exchangeRate} {toToken.token.symbol}
                    </Text>
                </View>
            </View>

            {/* Estimated Output */}
            <View style={styles.row}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Estimated Output</Text>
                </View>
                <MotiView
                    animate={{ scale: parseFloat(amount) > 0 ? [1, 1.05, 1] : 1 }}
                    transition={{ type: "timing", duration: 300 }}
                    style={styles.valueContainer}
                >
                    <Text style={styles.valueHighlight}>
                        {estimatedOutput} {toToken.token.symbol}
                    </Text>
                </MotiView>
            </View>

            {/* Price Impact */}
            {/* <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Price Impact</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Info size={14} color="#64748b" />
          </TouchableOpacity>
        </View>
        <View style={styles.valueContainer}>
          <Text
            style={[
              styles.value,
              parseFloat(priceImpact) > 5 ? styles.dangerValue : parseFloat(priceImpact) > 2 ? styles.warningValue : styles.goodValue
            ]}>
            ~{priceImpact}%
          </Text>
        </View>
      </View> */}

            {/* Network Fee */}
            {/* <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Network Fee</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Info size={14} color="#64748b" />
          </TouchableOpacity>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{networkFee} ETH</Text>
        </View>
      </View> */}
        </MotiView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(203, 213, 225, 0.5)",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(203, 213, 225, 0.5)",
    },
    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        fontSize: 14,
        color: "#64748b",
        marginRight: 4,
    },
    infoButton: {
        padding: 4,
    },
    valueContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    value: {
        fontSize: 14,
        fontWeight: "600",
        color: "#334155",
    },
    valueHighlight: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#6366f1",
    },
    goodValue: {
        color: "#10b981",
    },
    warningValue: {
        color: "#f59e0b",
    },
    dangerValue: {
        color: "#ef4444",
    },
    loadingText: {
        fontSize: 14,
        color: "#64748b",
        textAlign: "center",
        padding: 8,
    },
});
