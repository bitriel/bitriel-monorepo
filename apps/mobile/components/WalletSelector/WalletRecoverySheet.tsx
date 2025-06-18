import React, { useState, useCallback, useMemo, forwardRef } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Shield, AlertTriangle, X, Eye } from "lucide-react-native";
import { MultiWallet } from "~/src/store/multiWalletStore";
import MnemonicBox from "~/components/Mnemonic/MnemonicBox";
import Colors from "~/src/constants/Colors";

interface WalletRecoverySheetProps {
    wallet: MultiWallet | null;
    onClose: () => void;
}

const WalletRecoverySheet = forwardRef<BottomSheet, WalletRecoverySheetProps>(({ wallet, onClose }, ref) => {
    const [hasConfirmed, setHasConfirmed] = useState(false);

    // Bottom sheet snap points
    const snapPoints = useMemo(() => ["85%"], []);

    console.log("WalletRecoverySheet rendered with wallet:", wallet?.name, wallet?.type, !!wallet?.mnemonic);

    const handleRevealPhrase = () => {
        console.log("Revealing phrase for wallet:", wallet?.name);
        setHasConfirmed(true);
    };

    const handleCloseSheet = () => {
        console.log("Closing recovery sheet");
        setHasConfirmed(false);
        onClose();
    };

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            onChange={index => {
                console.log("Bottom sheet index changed to:", index);
                if (index === -1) {
                    // Sheet is closed by gesture, reset the state
                    handleCloseSheet();
                }
            }}
            enablePanDownToClose={true}
            backgroundStyle={{
                backgroundColor: "#F9FAFB",
            }}
            handleIndicatorStyle={{
                backgroundColor: "#D1D5DB",
            }}
        >
            <BottomSheetView style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 20 }}>
                <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                    {!wallet || wallet.type !== "non-custodial" || !wallet.mnemonic ? (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 }}>
                            <Text style={{ fontSize: 16, color: "#6B7280", textAlign: "center" }}>
                                No wallet selected or invalid wallet data
                            </Text>
                        </View>
                    ) : (
                        <>
                            {/* Header */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 24,
                                    paddingTop: 10,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 20, fontWeight: "700", color: "#1F2937" }}>
                                        Recovery Phrase
                                    </Text>
                                    <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>
                                        {wallet?.name || "Unknown Wallet"}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={handleCloseSheet}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                        backgroundColor: "#F3F4F6",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <X size={18} color="#6B7280" />
                                </TouchableOpacity>
                            </View>

                            {!hasConfirmed ? (
                                // Security Warning Screen
                                <View style={{ flex: 1 }}>
                                    {/* Warning Header */}
                                    <View style={{ alignItems: "center", marginBottom: 32 }}>
                                        <View
                                            style={{
                                                backgroundColor: "#FEF3C7",
                                                padding: 16,
                                                borderRadius: 50,
                                                marginBottom: 16,
                                            }}
                                        >
                                            <Shield size={32} color="#F59E0B" />
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 22,
                                                fontWeight: "700",
                                                color: "#1F2937",
                                                textAlign: "center",
                                                marginBottom: 8,
                                            }}
                                        >
                                            Show Recovery Phrase
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: "#6B7280",
                                                textAlign: "center",
                                                lineHeight: 24,
                                            }}
                                        >
                                            Make sure no one else can see your screen before revealing your recovery
                                            phrase.
                                        </Text>
                                    </View>

                                    {/* Warning Notice */}
                                    <View
                                        style={{
                                            backgroundColor: "#FEF2F2",
                                            borderRadius: 12,
                                            padding: 16,
                                            marginBottom: 24,
                                            borderLeftWidth: 4,
                                            borderLeftColor: "#EF4444",
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                                            <AlertTriangle size={20} color="#EF4444" />
                                            <View style={{ flex: 1, marginLeft: 12 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: "600",
                                                        color: "#B91C1C",
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    Security Warning
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: "#B91C1C",
                                                        lineHeight: 20,
                                                    }}
                                                >
                                                    Never share your recovery phrase with anyone. Anyone with access to
                                                    your phrase can control your wallet and steal your funds.
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Reveal Button */}
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: Colors.primary,
                                            borderRadius: 12,
                                            padding: 16,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginTop: 20,
                                        }}
                                        onPress={handleRevealPhrase}
                                        activeOpacity={0.7}
                                    >
                                        <Eye size={20} color="#FFFFFF" />
                                        <Text
                                            style={{
                                                color: "#FFFFFF",
                                                fontSize: 16,
                                                fontWeight: "600",
                                                marginLeft: 8,
                                            }}
                                        >
                                            Reveal Recovery Phrase
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                // Recovery Phrase Display
                                <View style={{ flex: 1 }}>
                                    {/* Mnemonic Display */}
                                    <View
                                        style={{
                                            backgroundColor: "#FFFFFF",
                                            borderRadius: 12,
                                            padding: 16,
                                            marginBottom: 20,
                                            borderWidth: 1,
                                            borderColor: "#E5E7EB",
                                        }}
                                    >
                                        <MnemonicBox mnemonic={wallet?.mnemonic || ""} />
                                    </View>

                                    {/* Final Warning */}
                                    <View
                                        style={{
                                            backgroundColor: "#FEF3C7",
                                            borderRadius: 12,
                                            padding: 16,
                                            borderLeftWidth: 4,
                                            borderLeftColor: "#F59E0B",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: "#92400E",
                                                fontWeight: "500",
                                                lineHeight: 18,
                                                textAlign: "center",
                                            }}
                                        >
                                            🔒 Remember: This is the only way to recover your wallet if you lose access
                                            to this device.
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                </BottomSheetScrollView>
            </BottomSheetView>
        </BottomSheet>
    );
});

WalletRecoverySheet.displayName = "WalletRecoverySheet";

export default WalletRecoverySheet;
