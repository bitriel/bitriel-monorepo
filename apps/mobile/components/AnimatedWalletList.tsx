import React from "react";
import { View, TouchableOpacity, RefreshControl } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { router } from "expo-router";
import { TokenBalance } from "@bitriel/wallet-sdk";
import { useWalletStore } from "~/src/store/useWalletStore";
import TokenLogo from "./Avatars/TokenLogo";
import { ThemedView } from "~/components/ThemedView";
import { ThemedText } from "~/components/ThemedText";
import { useAppTheme } from "~/src/context/ThemeProvider";

interface AnimatedWalletListProps {
    tokens: TokenBalance[];
    isRefreshing?: boolean;
    onRefresh?: () => void;
}

export const AnimatedWalletList: React.FC<AnimatedWalletListProps> = React.memo(
    ({ tokens, isRefreshing = false, onRefresh }) => {
        const { formatBalance } = useWalletStore();
        const { getColor, getBrandColor } = useAppTheme();

        // Animation values
        const headerAnim = useSharedValue(0);
        const scrollY = useSharedValue(0);

        // Animation handlers
        const onScroll = useAnimatedScrollHandler(event => {
            const { y } = event.contentOffset;
            scrollY.value = y;
            headerAnim.value = y;
        });

        // Memoize the render function to prevent unnecessary re-renders
        const renderTokenItem = React.useCallback(
            (token: TokenBalance) => {
                const tokenId = token.token.address || token.token.symbol;

                const handleTokenPress = () => {
                    router.push({
                        pathname: "/(auth)/(routes)/token-detail/[id]",
                        params: { token: JSON.stringify(token), id: tokenId },
                    });
                };

                return (
                    <TouchableOpacity key={tokenId} onPress={handleTokenPress} activeOpacity={0.7}>
                        <ThemedView
                            variant="card"
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                padding: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: getColor("border.secondary"),
                            }}
                        >
                            {/* Token Logo */}
                            <TokenLogo logoURI={token.token.logoURI} size={40} />

                            {/* Token Info */}
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <ThemedText
                                    variant="primary"
                                    style={{
                                        fontFamily: "SpaceGrotesk-Bold",
                                        fontSize: 16,
                                    }}
                                >
                                    {token.token.symbol}
                                </ThemedText>
                                <ThemedText
                                    variant="secondary"
                                    style={{
                                        fontFamily: "SpaceGrotesk-Regular",
                                        fontSize: 14,
                                    }}
                                >
                                    {token.token.name}
                                </ThemedText>
                            </View>

                            {/* Balance */}
                            <View style={{ alignItems: "flex-end" }}>
                                <ThemedText
                                    variant="primary"
                                    style={{
                                        fontFamily: "SpaceGrotesk-Bold",
                                        fontSize: 16,
                                    }}
                                >
                                    {formatBalance(token.balance, token.token.decimals)}
                                </ThemedText>
                                <ThemedText
                                    variant="secondary"
                                    style={{
                                        fontFamily: "SpaceGrotesk-Regular",
                                        fontSize: 14,
                                    }}
                                >
                                    ≈ $0.00
                                </ThemedText>
                            </View>
                        </ThemedView>
                    </TouchableOpacity>
                );
            },
            [formatBalance, getColor]
        );

        return (
            <ThemedView variant="primary" style={{ flex: 1 }}>
                <Animated.ScrollView
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingTop: 0 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            tintColor={getBrandColor("primary", 500)}
                            colors={[getBrandColor("primary", 500)]}
                            progressBackgroundColor={getColor("background.card")}
                            style={{ backgroundColor: "transparent" }}
                        />
                    }
                >
                    <ThemedView
                        variant="card"
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: getColor("border.secondary"),
                            paddingVertical: 8,
                            zIndex: 10,
                        }}
                    >
                        <ThemedText
                            variant="primary"
                            style={{
                                fontFamily: "SpaceGrotesk-Bold",
                                fontSize: 20,
                                paddingHorizontal: 16,
                            }}
                        >
                            Assets
                        </ThemedText>
                    </ThemedView>
                    <ThemedView variant="card" style={{ flex: 1 }}>
                        {tokens.map(renderTokenItem)}
                    </ThemedView>
                </Animated.ScrollView>
            </ThemedView>
        );
    }
);
