import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Iconify } from "react-native-iconify";
import Colors from "~/src/constants/Colors";

interface CustodialWalletCardProps {
  balance: string;
  onSwap: () => void;
  onReceive: () => void;
  onSend: () => void;
}

export const CustodialWalletCard: React.FC<CustodialWalletCardProps> = ({ balance, onSwap, onReceive, onSend }) => {
  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>KHR Balance</Text>
        <Text style={styles.balanceAmount}>{balance}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onSend}>
          <Iconify icon="solar:round-arrow-up-bold" size={24} color={Colors.darkBlue} />
          <Text style={styles.actionLabel}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onReceive}>
          <Iconify icon="solar:round-arrow-left-down-bold" size={24} color={Colors.darkBlue} />
          <Text style={styles.actionLabel}>Receive</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onSwap}>
          <Iconify icon="solar:round-transfer-vertical-bold" size={24} color={Colors.darkBlue} />
          <Text style={styles.actionLabel}>Swap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5
  },
  balanceContainer: {
    alignItems: "center",
    marginBottom: 24
  },
  balanceLabel: {
    fontSize: 16,
    color: Colors.darkBlue,
    fontFamily: "SpaceGrotesk-Regular",
    marginBottom: 8
  },
  balanceAmount: {
    fontSize: 32,
    color: Colors.blackText,
    fontFamily: "SpaceGrotesk-Bold"
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  actionButton: {
    alignItems: "center",
    width: "25%",
    padding: 8
  },
  actionLabel: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.darkBlue,
    fontFamily: "SpaceGrotesk-Regular"
  }
});
