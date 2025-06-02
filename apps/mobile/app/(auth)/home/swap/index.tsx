import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { MotiView } from "moti";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { RefreshCw, ArrowDownUp } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { SwapButton } from "~/components/Swap/SwapButton";
import { SwapInput } from "~/components/Swap/SwapInput";
import { SwapRate } from "~/components/Swap/SwapRate";
import { SwapSettings } from "~/components/Swap/SwapSettings";
import { SwapTokenSelector } from "~/components/Swap/SwapTokenSelector";
import { swapApi } from "~/src/api/swapApi";
import { useCustodialAuthStore } from "~/src/store/useCustodialAuthStore";
import * as SecureStore from "expo-secure-store";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";

interface Token {
    symbol: string;
    decimals: number;
    name: string;
    address: string;
    balance: string;
    ratio?: number;
    stable_coin_amount?: number;
}

interface TokenBalance {
    token: {
        symbol: string;
        decimals: number;
        name: string;
        address: string;
    };
    balance: string;
    formatted: string;
    ratio?: number;
    stable_coin_amount?: number;
}

interface SwapState {
    fromToken: TokenBalance | null;
    toToken: TokenBalance | null;
    fromAmount: string;
    toAmount: string;
    slippage: number;
    isLoading: boolean;
    error: string | null;
    isRefreshing: boolean;
    allTokens: TokenBalance[];
    createdTokens: Token[];
}

const KHR_TOKEN: Token = {
    symbol: "KHR",
    decimals: 18,
    name: "KHR Stablecoin",
    address: process.env.EXPO_PUBLIC_KHR_TOKEN_ADDRESS!,
    balance: "0",
};

const convertToTokenBalance = (token: Token): TokenBalance => ({
    token: {
        symbol: token.symbol,
        decimals: token.decimals,
        name: token.name,
        address: token.address,
    },
    balance: token.balance,
    formatted: token.balance,
});

export default function SwapScreenCustodial() {
    const { user } = useCustodialAuthStore();
    const [state, setState] = useState<SwapState>({
        fromToken: null,
        toToken: null,
        fromAmount: "",
        toAmount: "",
        slippage: 0.5,
        isLoading: false,
        error: null,
        isRefreshing: false,
        allTokens: [],
        createdTokens: [],
    });
    const [showTokenSelector, setShowTokenSelector] = useState(false);
    const [selectorType, setSelectorType] = useState<"from" | "to">("from");
    const router = useRouter();

    const updateState = (updates: Partial<SwapState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const fetchKhrBalance = async () => {
        if (!user?.address) return null;
        try {
            const response = await swapApi.getStablecoinBalance(user.address);
            return {
                ...KHR_TOKEN,
                balance: response.balance || "0",
            };
        } catch (error) {
            console.error("Error fetching KHR balance:", error);
            return null;
        }
    };

    const fetchCreatedTokens = async () => {
        if (!user?.address) return [];
        try {
            const tokens = await swapApi.getCreatedTokens();
            const validTokens = tokens.filter(token => token.status === "CREATED" && token.token_address);

            const tokenBalances = await Promise.all(
                validTokens.map(async token => {
                    if (!token.token_address) return null;
                    try {
                        const response = await swapApi.getTokenBalance(token.token_address, user.address);
                        const tokenData: Token = {
                            symbol: token.symbol,
                            decimals: 18, // Default to 18 decimals
                            name: token.name,
                            address: token.token_address,
                            balance: response.balance || "0",
                            ratio: token.ratio,
                            stable_coin_amount: token.stable_coin_amount,
                        };
                        return tokenData;
                    } catch (error) {
                        console.error(`Error fetching balance for token ${token.token_address}:`, error);
                        return null;
                    }
                })
            );

            // Filter out null values
            return tokenBalances.filter((token): token is Token => token !== null);
        } catch (error) {
            console.error("Error fetching created tokens:", error);
            return [];
        }
    };

    const fetchBalances = async () => {
        if (!user?.address) return;

        try {
            updateState({ isRefreshing: true, error: null });

            // Fetch KHR and created tokens in parallel
            const [khrToken, createdTokens] = await Promise.all([fetchKhrBalance(), fetchCreatedTokens()]);

            // Convert KHR token to TokenBalance if it exists
            const khrTokenBalance = khrToken ? convertToTokenBalance(khrToken) : null;

            // Convert created tokens to TokenBalance
            const createdTokenBalances = createdTokens.map(convertToTokenBalance);

            // Combine all tokens
            const allTokens = [...(khrTokenBalance ? [khrTokenBalance] : []), ...createdTokenBalances];

            updateState({ allTokens, createdTokens });

            // Set default tokens if none selected
            if (!state.fromToken && !state.toToken && allTokens.length > 0) {
                updateState({
                    fromToken: allTokens[0],
                    toToken: allTokens.length > 1 ? allTokens[1] : null,
                });
            }
        } catch (error: any) {
            console.error("Error fetching balances:", error);
            updateState({ error: error.message || "Failed to fetch balances" });
        } finally {
            updateState({ isRefreshing: false });
        }
    };

    useEffect(() => {
        fetchBalances();
    }, [user?.address]);

    useEffect(() => {
        if (state.fromAmount && state.fromToken && state.toToken) {
            // Find the created token that matches either fromToken or toToken
            const createdToken = state.createdTokens.find(
                token =>
                    token.address.toLowerCase() === state.fromToken?.token.address.toLowerCase() ||
                    token.address.toLowerCase() === state.toToken?.token.address.toLowerCase()
            );

            if (createdToken?.ratio) {
                const estimated = parseFloat(state.fromAmount) * createdToken.ratio;
                updateState({ toAmount: estimated.toFixed(2) });
            } else {
                updateState({ toAmount: "" });
            }
        } else {
            updateState({ toAmount: "" });
        }
    }, [state.fromAmount, state.fromToken, state.toToken, state.createdTokens]);

    const handleSwapTokens = () => {
        // Only swap tokens, don't update amounts
        updateState({
            fromToken: state.toToken,
            toToken: state.fromToken,
            fromAmount: "", // Clear amounts to trigger recalculation
            toAmount: "",
        });
    };

    const handleSwap = async () => {
        if (!state.fromToken || !state.toToken || !state.fromAmount || !user?.address) return;

        try {
            updateState({ isLoading: true, error: null });

            const isTokenToStablecoin =
                state.fromToken.token.address !== KHR_TOKEN.address &&
                state.toToken.token.address === KHR_TOKEN.address;
            const isStablecoinToToken =
                state.fromToken.token.address === KHR_TOKEN.address &&
                state.toToken.token.address !== KHR_TOKEN.address;

            console.log("state.allTokens", state.allTokens);

            // Route to passcode screen for confirmation
            router.push({
                pathname: "/(auth)/passcode",
                params: {
                    modeTypeParam: "confirm",
                    fromParam: "swap",
                    amount: state.fromAmount,
                    fromToken: state.fromToken.token.symbol,
                    toToken: state.toToken.token.symbol,
                    fromTokenAddress: state.fromToken.token.address,
                    toTokenAddress: state.toToken.token.address,
                    isTokenToStablecoin: isTokenToStablecoin.toString(),
                    isStablecoinToToken: isStablecoinToToken.toString(),
                    tokenAddress: state.allTokens.map(token => token.token.address),
                },
            } as never);
        } catch (error: any) {
            console.error("Swap failed:", error);
            updateState({ error: error.message || "Swap failed" });
        } finally {
            updateState({ isLoading: false });
        }
    };

    if (state.isRefreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingText}>Loading balances...</Text>
            </View>
        );
    }

    if (state.error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{state.error}</Text>
                <TouchableOpacity onPress={fetchBalances} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{ title: "" }} />
            <GestureHandlerRootView style={styles.container}>
                <LinearGradient colors={["#f8f9fa", "#e9ecef", "#dee2e6"]} style={styles.background}>
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
                                    animate={{ scale: state.isRefreshing ? 1.1 : 1 }}
                                    transition={{ type: "timing", duration: 300 }}
                                >
                                    <TouchableOpacity
                                        onPress={fetchBalances}
                                        style={styles.refreshButton}
                                        disabled={state.isRefreshing}
                                    >
                                        <RefreshCw
                                            size={18}
                                            color="#6366f1"
                                            style={{ transform: [{ rotate: state.isRefreshing ? "180deg" : "0deg" }] }}
                                        />
                                    </TouchableOpacity>
                                </MotiView>
                            </View>

                            <View style={styles.swapCardContainer}>
                                <BlurView intensity={10} tint="light" style={styles.swapCard}>
                                    <SwapInput
                                        label="From"
                                        token={state.fromToken}
                                        amount={state.fromAmount}
                                        onAmountChange={amount => updateState({ fromAmount: amount })}
                                        onTokenPress={() => {
                                            setSelectorType("from");
                                            setShowTokenSelector(true);
                                        }}
                                    />

                                    <View style={styles.swapButtonContainer}>
                                        <MotiView
                                            animate={{ rotate: "0deg" }}
                                            transition={{ type: "timing", duration: 300 }}
                                            style={styles.swapButtonWrapper}
                                        >
                                            <TouchableOpacity
                                                onPress={handleSwapTokens}
                                                style={styles.swapDirectionButton}
                                            >
                                                <ArrowDownUp size={20} color="#ffffff" />
                                            </TouchableOpacity>
                                        </MotiView>
                                    </View>

                                    <SwapInput
                                        label="To"
                                        token={state.toToken}
                                        amount={state.toAmount}
                                        onAmountChange={amount => updateState({ toAmount: amount })}
                                        readOnly={true}
                                        onTokenPress={() => {
                                            setSelectorType("to");
                                            setShowTokenSelector(true);
                                        }}
                                    />
                                </BlurView>
                            </View>

                            <SwapRate fromToken={state.fromToken} toToken={state.toToken} amount={state.fromAmount} />

                            {/* <SwapSettings slippage={state.slippage} onSlippageChange={(slippage) => updateState({ slippage })} /> */}
                        </MotiView>
                    </ScrollView>

                    <View style={styles.bottomContainer}>
                        <SwapButton
                            fromToken={state.fromToken}
                            toToken={state.toToken}
                            amount={state.fromAmount}
                            disabled={!state.fromToken || !state.toToken || !state.fromAmount || state.isLoading}
                            onPress={handleSwap}
                        />
                    </View>

                    <SwapTokenSelector
                        visible={showTokenSelector}
                        onClose={() => setShowTokenSelector(false)}
                        type={selectorType}
                        onSelect={token => {
                            if (selectorType === "from") {
                                updateState({ fromToken: token });
                            } else {
                                updateState({ toToken: token });
                            }
                            setShowTokenSelector(false);
                        }}
                        tokens={state.allTokens}
                    />
                </LinearGradient>
            </GestureHandlerRootView>
        </>
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#6366f1",
        fontWeight: "500",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        padding: 20,
    },
    errorText: {
        color: "#ef4444",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: "#6366f1",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
    swapCardContainer: {
        borderRadius: 24,
        overflow: "hidden",
        marginBottom: 16,
        backgroundColor: "white",
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    swapCard: {
        padding: 16,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    swapButtonContainer: {
        alignItems: "center",
        marginVertical: 8,
        height: 50,
    },
    swapButtonWrapper: {
        backgroundColor: "white",
        borderRadius: 20,
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
        backgroundColor: "white",
    },
});
