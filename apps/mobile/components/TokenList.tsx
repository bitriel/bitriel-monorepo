import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useWalletStore } from "~/src/store/useWalletStore";
import { Image } from "expo-image";
import { Iconify } from "react-native-iconify";

export const TokenList = () => {
    const { walletState, currentNetwork, isLoading, error, formatBalance } = useWalletStore();

    if (error) {
        return (
            <View className="mb-4 rounded-2xl bg-white p-4">
                <Text className="text-red-500">{error}</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View className="mb-4 items-center rounded-2xl bg-white p-4">
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (!walletState) {
        return (
            <View className="mb-4 rounded-2xl bg-white p-4">
                <Text className="italic text-gray-500">Not connected</Text>
            </View>
        );
    }

    // Combine native token with other tokens for unified list
    const allTokens = [
        {
            token: {
                symbol: currentNetwork?.nativeCurrency.symbol || "",
                decimals: currentNetwork?.nativeCurrency.decimals || 18,
                logoURI: currentNetwork?.nativeCurrency.logoURI,
                name: currentNetwork?.nativeCurrency.name || "Native Token",
            },
            balance: walletState.balances.native,
        },
        ...walletState.balances.tokens,
    ];

    return (
        <View className="flex-1">
            {/* Token List */}
            <View className="space-y-2">
                {allTokens.map((token, index) => (
                    <TouchableOpacity
                        key={index}
                        className="flex-row items-center bg-white p-4 rounded-xl border border-gray-100"
                    >
                        {/* Token Logo */}
                        {token.token.logoURI ? (
                            <Image
                                source={{ uri: token.token.logoURI }}
                                className="w-10 h-10 rounded-full"
                                contentFit="contain"
                            />
                        ) : (
                            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                                <Iconify icon="mingcute:coin-3-fill" size={24} color="#666666" />
                            </View>
                        )}

                        {/* Token Info */}
                        <View className="flex-1 ml-3">
                            <Text className="text-base font-semibold text-gray-900">{token.token.symbol}</Text>
                            <Text className="text-sm text-gray-500">{token.token.name}</Text>
                        </View>

                        {/* Balance */}
                        <View className="items-end">
                            <Text className="text-base font-semibold text-gray-900">
                                {formatBalance(token.balance, token.token.decimals)}
                            </Text>
                            <Text className="text-sm text-gray-500">≈ $0.00</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};
