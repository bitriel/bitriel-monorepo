import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { Image } from "expo-image";
import { ChevronDown } from "lucide-react-native";
import { TokenBalance } from "@bitriel/wallet-sdk";
import TokenLogo from "../Avatars/TokenLogo";

interface SwapInputProps {
  label: string;
  token: TokenBalance | null;
  amount: string;
  onAmountChange: (amount: string) => void;
  onTokenPress: () => void;
  readOnly?: boolean;
}

export const SwapInput: React.FC<SwapInputProps> = ({ label, token, amount, onAmountChange, onTokenPress, readOnly = false }) => {
  // Handle "MAX" button press
  const handleMaxPress = () => {
    if (token && !readOnly) {
      onAmountChange(token.formatted);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 400 }}
      style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {token && !readOnly && (
          <TouchableOpacity onPress={handleMaxPress} style={styles.maxButton}>
            <Text style={styles.maxButtonText}>MAX</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, readOnly && styles.readOnlyInput]}
          value={amount}
          onChangeText={onAmountChange}
          placeholder="0.0"
          placeholderTextColor="rgba(30, 41, 59, 0.5)"
          keyboardType="decimal-pad"
          editable={!readOnly}
        />

        <TouchableOpacity onPress={onTokenPress} style={styles.tokenSelector}>
          {token ? (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "timing", duration: 300 }} style={styles.tokenContainer}>
              <TokenLogo logoURI={token.token.logoURI} size={24} />
              <Text style={styles.tokenSymbol}>{token.token.symbol}</Text>
              <ChevronDown size={16} color="#6366f1" />
            </MotiView>
          ) : (
            <Text style={styles.selectTokenText}>Select Token</Text>
          )}
        </TouchableOpacity>
      </View>

      {token && (
        <MotiView
          from={{ opacity: 0, translateY: -5 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300 }}
          style={styles.balanceContainer}>
          <Text style={styles.balanceText}>
            Balance: {token.formatted} {token.token.symbol}
          </Text>
        </MotiView>
      )}
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(203, 213, 225, 0.5)"
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569"
  },
  maxButton: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  maxButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6366f1"
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    padding: 0
  },
  readOnlyInput: {
    color: "#64748b",
    opacity: 0.8
  },
  tokenSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(241, 245, 249, 0.8)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "rgba(203, 213, 225, 0.5)"
  },
  tokenContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#334155",
    marginHorizontal: 8
  },
  selectTokenText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1"
  },
  balanceContainer: {
    marginTop: 8
  },
  balanceText: {
    fontSize: 12,
    color: "#64748b"
  }
});
