import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { CustodialWalletCard } from "~/components/CustodialWallet/CustodialWalletCard";
import { swapApi, Token } from "~/src/api/swapApi";
import { useCustodialAuthStore } from "~/src/store/useCustodialAuthStore";
import { MotiView } from "moti";

interface TokenBalance {
  tokenAddress: string;
  balance: string;
  supply: string;
  symbol: string;
}

export const CustodialWallet: React.FC = () => {
  const { user, fetchCurrentUser, isLoading: isAuthLoading } = useCustodialAuthStore();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [khrBalance, setKhrBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createdTokens, setCreatedTokens] = useState<Token[]>([]);

  const fetchCreatedTokens = async () => {
    try {
      const tokens = await swapApi.getCreatedTokens();
      const validTokens = tokens.filter((token) => token.status === "CREATED" && token.token_address);
      console.log("Fetched created tokens:", validTokens); // Debug log
      setCreatedTokens(validTokens);
      return validTokens;
    } catch (error) {
      console.error("Error fetching created tokens:", error);
      setError("Failed to fetch created tokens");
      return [];
    }
  };

  const fetchKhrBalance = async () => {
    if (!user?.address) {
      setError("User address not found");
      setIsLoading(false);
      return;
    }

    try {
      const response = await swapApi.getStablecoinBalance(user.address);
      setKhrBalance(response.balance || "0");
    } catch (error) {
      console.error("Error fetching KHR balance:", error);
      setKhrBalance("0");
    }
  };

  const fetchBalances = async () => {
    if (!user?.address) {
      setError("User address not found");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First fetch created tokens
      const validTokens = await fetchCreatedTokens();

      const balancePromises = validTokens.map(async (token) => {
        if (!token.token_address) return null;
        try {
          // Get token balance
          const balanceResponse = await swapApi.getTokenBalance(token.token_address, user.address);

          // Get token supply
          const supplyResponse = await swapApi.getTokenTotalSupply(token.token_address);

          return {
            tokenAddress: token.token_address,
            balance: balanceResponse.balance || "0",
            supply: supplyResponse.balance || "0",
            symbol: token.symbol
          };
        } catch (error) {
          console.error(`Error fetching balance for token ${token.token_address}:`, error);
          return null;
        }
      });

      const results = await Promise.all(balancePromises);
      const validResults = results.filter((result): result is TokenBalance => result !== null);

      console.log("Fetched balances:", validResults); // Debug log
      setBalances(validResults);
    } catch (error: any) {
      console.error("Error fetching balances:", error);
      setError(error.message || "Failed to fetch balances");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        if (!user) {
          await fetchCurrentUser();
        }
        await Promise.all([fetchKhrBalance()]);
        await fetchBalances(); // This will now fetch created tokens and their balances
      } catch (error: any) {
        console.error("Error initializing data:", error);
        setError(error.message || "Failed to initialize wallet data");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [user]);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await fetchCurrentUser();
      await Promise.all([fetchKhrBalance()]);
      await fetchBalances();
    } catch (error: any) {
      console.error("Error refreshing data:", error);
      setError(error.message || "Failed to refresh wallet data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading wallet data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!user?.address) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No wallet address found</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 500 }}>
        <CustodialWalletCard
          balance={khrBalance}
          onSwap={() => router.navigate({ pathname: "/(auth)/home/swap" })}
          onReceive={() => router.navigate({ pathname: "/(auth)/home/receive" })}
          onSend={() => router.navigate({ pathname: "/(auth)/home/send/custodial" })}
        />

        {/* Token Balances */}
        <View style={styles.tokenBalancesContainer}>
          {balances.length > 0 ? (
            balances.map((token) => (
              <View key={token.tokenAddress} style={styles.tokenBalanceCard}>
                <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                <Text style={styles.tokenBalance}>Balance: {token.balance}</Text>
                <Text style={styles.tokenSupply}>Total Supply: {token.supply}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noTokensContainer}>
              <Text style={styles.noTokensText}>No tokens found</Text>
            </View>
          )}
        </View>
      </MotiView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa"
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "500"
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16
  },
  retryButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  },
  tokenBalancesContainer: {
    padding: 16
  },
  tokenBalanceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  tokenSymbol: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8
  },
  tokenBalance: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 4
  },
  tokenSupply: {
    fontSize: 14,
    color: "#64748b"
  },
  noTokensContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  noTokensText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center"
  }
});
