import React, { useState } from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowDown, Check } from "lucide-react-native";
import { TokenBalance } from "@bitriel/wallet-sdk";

interface SwapButtonProps {
  fromToken: TokenBalance | null;
  toToken: TokenBalance | null;
  amount: string;
  disabled: boolean;
  onPress: () => void;
}

export const SwapButton: React.FC<SwapButtonProps> = ({ fromToken, toToken, amount, disabled, onPress }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePress = async () => {
    if (disabled || loading || success) return;

    setLoading(true);
    setSuccess(false);

    try {
      await onPress();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Swap failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (!fromToken || !toToken) return "Select tokens";
    if (!amount) return "Enter amount";
    if (loading) return "Swapping...";
    if (success) return "Swap successful!";
    return "Swap";
  };

  const buttonText = getButtonText();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity onPress={handlePress} disabled={isDisabled} style={styles.container} activeOpacity={0.8}>
      <MotiView
        animate={{
          scale: isDisabled ? 0.98 : 1,
          opacity: isDisabled ? 0.7 : 1
        }}
        transition={{
          type: "timing",
          duration: 200
        }}
        style={styles.buttonWrapper}>
        <LinearGradient
          colors={success ? ["#10b981", "#059669"] : ["#6366f1", "#4f46e5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, isDisabled && styles.disabledGradient]}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : success ? (
            <MotiView from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }} style={styles.successIcon}>
              <Check size={20} color="#FFFFFF" />
            </MotiView>
          ) : (
            <Text style={styles.buttonText}>{buttonText}</Text>
          )}
        </LinearGradient>
      </MotiView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%"
  },
  buttonWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  gradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  disabledGradient: {
    opacity: 0.6
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold"
  },
  successIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 4
  }
});
