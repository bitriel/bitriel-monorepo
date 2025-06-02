import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { router, Stack } from "expo-router";
import { swapApi } from "~/src/api/swapApi";
import { useCustodialAuthStore } from "~/src/store/useCustodialAuthStore";
import { Iconify } from "react-native-iconify";
import Colors from "~/src/constants/Colors";
import { Dialog, ALERT_TYPE } from "react-native-alert-notification";
import { useWalletStore } from "~/src/store/useWalletStore";

interface TokenWithBalance {
  token_address: string;
  symbol: string;
  name: string;
  logo?: string;
  balance: string;
}

export default function CustodialSendScreen() {
  const { user } = useCustodialAuthStore();
  const [tokens, setTokens] = useState<TokenWithBalance[]>([]);
  const [khrBalance, setKhrBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { walletState, currentNetwork } = useWalletStore();

  const fetchTokens = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch KHR balance
      const khrResponse = await swapApi.getStablecoinBalance(user?.address!);
      setKhrBalance(khrResponse.balance || "0");

      // Fetch created tokens
      const createdTokens = await swapApi.getCreatedTokens();
      const validTokens = createdTokens.filter((token) => token.status === "CREATED" && token.token_address);

      // Fetch balances for each token
      const tokensWithBalances = await Promise.all(
        validTokens.map(async (token) => {
          try {
            const balanceResponse = await swapApi.getTokenBalance(token.token_address!, user?.address!);
            return {
              token_address: token.token_address!,
              symbol: token.symbol,
              name: token.name,
              balance: balanceResponse.balance || "0"
            } as TokenWithBalance;
          } catch (error) {
            console.error(`Error fetching balance for token ${token.token_address}:`, error);
            return null;
          }
        })
      );

      // Filter out null values and add KHR token
      const allTokens = [
        {
          token_address: "KHR",
          symbol: "KHR",
          name: "KHR Token",
          balance: khrBalance
        } as TokenWithBalance,
        ...tokensWithBalances.filter((token): token is TokenWithBalance => token !== null)
      ];

      setTokens(allTokens);
    } catch (error: any) {
      console.error("Error fetching tokens:", error);
      setError(error.message || "Failed to fetch tokens");
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to fetch tokens. Please try again.",
        button: "Close"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.address) {
      fetchTokens();
    }
  }, [user?.address]);

  const handleTokenSelect = (token: TokenWithBalance) => {
    router.push({
      pathname: "/(auth)/home/send",
      params: {
        tokenName: token.name,
        tokenSymbol: token.symbol,
        tokenBalance: token.balance,
        tokenContract: token.token_address,
        tokenImage: token.logo || "",
        decimalChain: "18",
        currentNetwork: "Selendra"
      }
    });
  };

  const handleRefresh = () => {
    fetchTokens();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Select Token" }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.darkBlue} />
          <Text className="mt-4 text-gray-600 font-SpaceGroteskMedium">Loading tokens...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Select Token" }} />
        <View style={styles.errorContainer}>
          <Text className="text-red-500 text-center font-SpaceGroteskMedium">{error}</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
            <Text className="text-white font-SpaceGroteskMedium">Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Select Token" }} />
      <View style={styles.container}>
        <ScrollView className="flex-1">
          {tokens.length > 0 ? (
            tokens.map((token) => (
              <TouchableOpacity key={token.token_address} style={styles.tokenItem} onPress={() => handleTokenSelect(token)}>
                <View className="flex-row items-center">
                  {token.logo ? (
                    <Image source={{ uri: token.logo }} style={styles.tokenLogo} />
                  ) : (
                    <View style={styles.tokenLogoPlaceholder}>
                      <Text className="text-white font-SpaceGroteskMedium">{token.symbol[0]}</Text>
                    </View>
                  )}
                  <View className="ml-4 flex-1">
                    <Text className="text-lg font-SpaceGroteskSemiBold">{token.name}</Text>
                    <Text className="text-sm text-gray-500 font-SpaceGroteskRegular">{token.symbol}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-SpaceGroteskSemiBold">{token.balance}</Text>
                    <Text className="text-sm text-gray-500 font-SpaceGroteskRegular">Balance</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noTokensContainer}>
              <Text className="text-gray-500 text-center font-SpaceGroteskMedium">No tokens available</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  retryButton: {
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16
  },
  tokenItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6"
  },
  tokenLogo: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  tokenLogoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkBlue,
    justifyContent: "center",
    alignItems: "center"
  },
  noTokensContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  }
});
