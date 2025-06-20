import React, { forwardRef, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { Plus, Key, X, ArrowRight } from "lucide-react-native";

interface AddWalletSheetProps {
    handleCloseBottomSheet: () => void;
}

const AddWalletSheet = forwardRef<BottomSheetModal, AddWalletSheetProps>(({ handleCloseBottomSheet }, ref) => {
    const snapPoints = useMemo(() => ["60%"], []);

    const renderBackdrop = useCallback(
        (backdropProps: any) => (
            <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
        ),
        []
    );

    const handleCreateSelfCustodyWallet = () => {
        handleCloseBottomSheet();
        // Pass parameter indicating we're coming from wallet management
        router.push({
            pathname: "/(public)/mnemonic/create",
            params: { fromWalletManagement: "true" },
        });
    };

    const handleRestoreWallet = () => {
        handleCloseBottomSheet();
        // Pass parameter indicating we're coming from wallet management
        router.push({
            pathname: "/(public)/mnemonic/import",
            params: { fromWalletManagement: "true" },
        });
    };

    return (
        <BottomSheetModal
            ref={ref}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            enableDismissOnClose={true}
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: "#F9FAFB" }}
            handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 40 }}
        >
            <BottomSheetView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
                {/* Header */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 24,
                    }}
                >
                    <Text style={{ fontSize: 20, fontWeight: "600", color: "#1F2937" }}>Add New Wallet</Text>
                    <TouchableOpacity
                        onPress={handleCloseBottomSheet}
                        style={{
                            backgroundColor: "#F3F4F6",
                            borderRadius: 20,
                            padding: 8,
                        }}
                    >
                        <X size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <View style={{ gap: 16 }}>
                    {/* Create Self-Custody Wallet */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 16,
                            padding: 20,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            elevation: 3,
                            borderWidth: 1,
                            borderColor: "#F3F4F6",
                        }}
                        onPress={handleCreateSelfCustodyWallet}
                        activeOpacity={0.7}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View
                                style={{
                                    backgroundColor: "#ECFDF5",
                                    borderRadius: 16,
                                    padding: 12,
                                    marginRight: 16,
                                }}
                            >
                                <Key size={28} color="#059669" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "600",
                                        color: "#1F2937",
                                        marginBottom: 4,
                                    }}
                                >
                                    Self-Custody Wallet
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#6B7280",
                                        lineHeight: 20,
                                    }}
                                >
                                    Create a new wallet with a 12-word recovery phrase
                                </Text>
                            </View>
                            <ArrowRight size={20} color="#9CA3AF" />
                        </View>
                    </TouchableOpacity>

                    {/* Restore Wallet */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 16,
                            padding: 20,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            elevation: 3,
                            borderWidth: 1,
                            borderColor: "#F3F4F6",
                        }}
                        onPress={handleRestoreWallet}
                        activeOpacity={0.7}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View
                                style={{
                                    backgroundColor: "#F3F4F6",
                                    borderRadius: 16,
                                    padding: 12,
                                    marginRight: 16,
                                }}
                            >
                                <Plus size={28} color="#6B7280" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "600",
                                        color: "#1F2937",
                                        marginBottom: 4,
                                    }}
                                >
                                    Restore Wallet
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#6B7280",
                                        lineHeight: 20,
                                    }}
                                >
                                    Restore from recovery phrase or cloud backup
                                </Text>
                            </View>
                            <ArrowRight size={20} color="#9CA3AF" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        marginTop: 20,
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
                        }}
                    >
                        💡 Your wallets are secured with your device passcode and biometric authentication when
                        available.
                    </Text>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

AddWalletSheet.displayName = "AddWalletSheet";

export default AddWalletSheet;
