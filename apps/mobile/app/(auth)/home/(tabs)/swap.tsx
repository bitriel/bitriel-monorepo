import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { useWalletStore, useWalletTransactions } from "~/src/store/useWalletStore";
import { TokenBalance } from "@bitriel/wallet-sdk";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { RefreshCw, ArrowDownUp } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { SwapButton } from "~/components/Swap/SwapButton";
import { SwapInput } from "~/components/Swap/SwapInput";
import { SwapRate } from "~/components/Swap/SwapRate";
import { SwapSettings } from "~/components/Swap/SwapSettings";
import { SwapTokenSelector } from "~/components/Swap/SwapTokenSelector";

export default function SwapScreen() {
    const { walletState, currentNetwork, refreshWalletState } = useWalletStore();
    const { sendTransaction, estimateFee } = useWalletTransactions();
    const [fromToken, setFromToken] = useState<TokenBalance | null>(null);
    const [toToken, setToToken] = useState<TokenBalance | null>(null);
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const [showTokenSelector, setShowTokenSelector] = useState(false);
    const [selectorType, setSelectorType] = useState<"from" | "to">("from");
    const [slippage, setSlippage] = useState(0.5);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Prepare token data from wallet state
    const allTokens: TokenBalance[] = React.useMemo(() => {
        if (!walletState || !currentNetwork) return [];

        return [
            {
                token: {
                    symbol: currentNetwork?.nativeCurrency.symbol || "",
                    decimals: currentNetwork?.nativeCurrency.decimals || 18,
                    logoURI: currentNetwork?.nativeCurrency.logoURI,
                    name: currentNetwork?.nativeCurrency.name || "Native Token",
                    address: "0x0",
                },
                balance: walletState.balances.detailed?.formatted.transferable!,
                formatted: walletState.balances.detailed?.formatted.transferable!,
            },
            ...walletState.balances.tokens,
        ];
    }, [walletState, currentNetwork]);

    console.log(allTokens);

    // Set default tokens only once when allTokens changes and no tokens are selected
    useEffect(() => {
        if (allTokens.length > 0 && !fromToken && !toToken) {
            setFromToken(allTokens[0]);
            if (allTokens.length > 1) {
                setToToken(allTokens[1]);
            }
        }
    }, [allTokens, fromToken, toToken]);

    // Calculate estimated output whenever fromAmount or exchange rate changes
    useEffect(() => {
        if (fromAmount && fromToken && toToken) {
            // In a real application, this would come from an API or price oracle
            // For now, we'll use a dummy exchange rate calculation
            const exchangeRate = 1.5; // Dummy exchange rate
            const estimated = parseFloat(fromAmount) * exchangeRate;
            setToAmount(estimated.toFixed(6));
        } else {
            setToAmount("");
        }
    }, [fromAmount, fromToken, toToken]);

    const handleSwapTokens = () => {
        const temp = fromToken;
        setFromToken(toToken);
        setToToken(temp);

        // Swap amounts too
        const tempAmount = fromAmount;
        setFromAmount(toAmount);
        setToAmount(tempAmount);
    };

    const handleRefresh = async () => {
        try {
            setIsRefreshing(true);
            await refreshWalletState();
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleSwap = async () => {
        if (!fromToken || !toToken || !fromAmount) return;

        try {
            setIsLoading(true);
            setError(null);

            // Estimate fee first
            const fee = await estimateFee(fromAmount);
            console.log("Estimated fee:", fee);

            // Send transaction
            const { txHash } = await sendTransaction(toToken.token.address, fromAmount);
            console.log("Transaction hash:", txHash);

            // Refresh wallet state
            await refreshWalletState();
        } catch (error: any) {
            console.error("Swap failed:", error);
            setError(error.message || "Swap failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <LinearGradient colors={["#f8f9fa", "#e9ecef", "#dee2e6"]} style={[styles.background]}>
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: "timing", duration: 500 }}
                        style={styles.content}
                    >
                        <View style={styles.header}>
                            <Text style={styles.title}>Swap</Text>
                            <MotiView
                                animate={{ scale: isRefreshing ? 1.1 : 1 }}
                                transition={{ type: "timing", duration: 300 }}
                            >
                                <TouchableOpacity
                                    onPress={handleRefresh}
                                    style={styles.refreshButton}
                                    disabled={isRefreshing}
                                >
                                    <RefreshCw
                                        size={18}
                                        color="#6366f1"
                                        style={{ transform: [{ rotate: isRefreshing ? "180deg" : "0deg" }] }}
                                    />
                                </TouchableOpacity>
                            </MotiView>
                        </View>

                        {error && (
                            <MotiView
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", damping: 15 }}
                                style={styles.errorContainer}
                            >
                                <Text style={styles.errorText}>{error}</Text>
                            </MotiView>
                        )}

                        <BlurView intensity={10} tint="light" style={styles.swapCard}>
                            {/* From Token Input */}
                            <SwapInput
                                label="From"
                                token={fromToken}
                                amount={fromAmount}
                                onAmountChange={setFromAmount}
                                onTokenPress={() => {
                                    setSelectorType("from");
                                    setShowTokenSelector(true);
                                }}
                            />

                            {/* Swap Direction Button */}
                            <View style={styles.swapButtonContainer}>
                                <MotiView
                                    animate={{ rotate: "0deg" }}
                                    transition={{ type: "timing", duration: 300 }}
                                    style={styles.swapButtonWrapper}
                                >
                                    <TouchableOpacity onPress={handleSwapTokens} style={styles.swapDirectionButton}>
                                        <ArrowDownUp size={20} color="#ffffff" />
                                    </TouchableOpacity>
                                </MotiView>
                            </View>

                            {/* To Token Input */}
                            <SwapInput
                                label="To"
                                token={toToken}
                                amount={toAmount}
                                onAmountChange={setToAmount}
                                readOnly={true}
                                onTokenPress={() => {
                                    setSelectorType("to");
                                    setShowTokenSelector(true);
                                }}
                            />
                        </BlurView>

                        {/* Swap Rate */}
                        <SwapRate fromToken={fromToken} toToken={toToken} amount={fromAmount} />

                        {/* Swap Settings */}
                        <SwapSettings slippage={slippage} onSlippageChange={setSlippage} />
                    </MotiView>
                </ScrollView>

                {/* Swap Button */}
                <View style={[styles.bottomContainer]}>
                    <SwapButton
                        fromToken={fromToken}
                        toToken={toToken}
                        amount={fromAmount}
                        disabled={!fromToken || !toToken || !fromAmount || isLoading}
                        onPress={handleSwap}
                    />
                </View>

                {/* Token Selector Modal */}
                <SwapTokenSelector
                    visible={showTokenSelector}
                    onClose={() => setShowTokenSelector(false)}
                    type={selectorType}
                    onSelect={(token: TokenBalance) => {
                        if (selectorType === "from") {
                            setFromToken(token);
                        } else {
                            setToToken(token);
                        }
                        setShowTokenSelector(false);
                    }}
                    tokens={allTokens}
                />
            </LinearGradient>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1e293b",
    },
    refreshButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(99, 102, 241, 0.15)",
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#ef4444",
    },
    errorText: {
        color: "#b91c1c",
        fontWeight: "500",
    },
    swapCard: {
        borderRadius: 24,
        overflow: "hidden",
        marginBottom: 16,
        padding: 16,
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    swapButtonContainer: {
        alignItems: "center",
        marginVertical: 8,
        height: 50,
    },
    swapButtonWrapper: {
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    swapDirectionButton: {
        backgroundColor: "#6366f1",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    bottomContainer: {
        padding: 16,
    },
});
