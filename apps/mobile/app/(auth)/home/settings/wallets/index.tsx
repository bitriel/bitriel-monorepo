import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useMultiWalletStore, MultiWallet, WalletType } from "~/src/store/multiWalletStore";
import { settingStyles } from "../index";
import Colors from "~/src/constants/Colors";
import { Cloud, Key, Plus, ChevronRight, Check, Trash2, Info, Wallet, Shield, MoreVertical } from "lucide-react-native";
import useBottomSheet from "~/src/context/useBottomSheet";
import AddWalletSheet from "~/components/WalletSelector/AddWalletSheet";
import WalletRecoverySheet from "~/components/WalletSelector/WalletRecoverySheet";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";

const { width } = Dimensions.get("window");

export default function WalletManagementPage() {
    const { wallets, activeWallet, setActiveWallet, removeWallet, loadWallets, isLoading, addWallet } =
        useMultiWalletStore();
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [selectedWalletForRecovery, setSelectedWalletForRecovery] = useState<MultiWallet | null>(null);

    const {
        bottomSheetRef: addWalletBottomSheetRef,
        handleOpenBottomSheet: handleOpenAddWalletSheet,
        handleCloseBottomSheet: handleCloseAddWalletSheet,
    } = useBottomSheet();

    const {
        bottomSheetRef: recoveryBottomSheetRef,
        handleOpenBottomSheet: handleOpenRecoverySheet,
        handleCloseBottomSheet: handleCloseRecoverySheet,
    } = useBottomSheet();

    const handleShowRecoveryPhrase = (wallet: MultiWallet) => {
        console.log("handleShowRecoveryPhrase called with wallet:", wallet.name, wallet.type, !!wallet.mnemonic);
        if (wallet.type === "non-custodial" && wallet.mnemonic) {
            console.log("Setting selected wallet and opening recovery sheet");
            setSelectedWalletForRecovery(wallet);
            handleOpenRecoverySheet();
        } else {
            console.log("Wallet conditions not met - type:", wallet.type, "has mnemonic:", !!wallet.mnemonic);
            Alert.alert(
                "Error",
                `Cannot show recovery phrase. Type: ${wallet.type}, Has mnemonic: ${!!wallet.mnemonic}`
            );
        }
    };

    const handleRecoverySheetClose = () => {
        console.log("Closing recovery sheet");
        setSelectedWalletForRecovery(null);
        handleCloseRecoverySheet();
    };

    useEffect(() => {
        const initializeWallets = async () => {
            setIsInitialLoading(true);
            try {
                await loadWallets();

                // Check if we need to migrate legacy wallet
                if (wallets.length === 0) {
                    const legacyMnemonic = await ExpoSecureStoreAdapter.getItem("wallet_mnemonic");
                    if (legacyMnemonic) {
                        // Migrate legacy wallet to multi-wallet system
                        await addWallet({
                            name: "My Wallet",
                            type: "non-custodial",
                            mnemonic: legacyMnemonic,
                            isActive: true,
                        });
                        console.log("Migrated legacy wallet to multi-wallet system");
                    }
                }
            } catch (error) {
                console.error("Error initializing wallets:", error);
            } finally {
                setIsInitialLoading(false);
            }
        };

        initializeWallets();
    }, [loadWallets, addWallet, wallets.length]);

    const handleWalletPress = async (wallet: MultiWallet) => {
        if (wallet.id !== activeWallet?.id) {
            try {
                await setActiveWallet(wallet.id);
                Alert.alert("Success", `Switched to ${wallet.name}`, [{ text: "OK" }]);
            } catch (error) {
                Alert.alert("Error", "Failed to switch wallet", [{ text: "OK" }]);
            }
        }
    };

    const handleRemoveWallet = (wallet: MultiWallet) => {
        if (wallets.length <= 1) {
            Alert.alert("Cannot Remove", "You must have at least one wallet.", [{ text: "OK" }]);
            return;
        }

        Alert.alert(
            "Remove Wallet",
            `Are you sure you want to remove "${wallet.name}"?\n\nThis action cannot be undone and you'll lose access to this wallet unless you have your recovery phrase.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await removeWallet(wallet.id);
                            Alert.alert("Success", "Wallet removed successfully", [{ text: "OK" }]);
                        } catch (error) {
                            Alert.alert("Error", "Failed to remove wallet", [{ text: "OK" }]);
                        }
                    },
                },
            ]
        );
    };

    const handleAddWallet = () => {
        handleOpenAddWalletSheet();
    };

    const getWalletIcon = (type: WalletType) => {
        return type === "custodial" ? Cloud : Key;
    };

    const getWalletTypeColor = (type: WalletType) => {
        return type === "custodial" ? "#2563EB" : "#059669";
    };

    const getWalletTypeBadgeColor = (type: WalletType) => {
        return type === "custodial" ? "#EBF4FF" : "#ECFDF5";
    };

    const renderWalletItem = (wallet: MultiWallet, index: number, totalItems: number) => {
        const isActive = activeWallet?.id === wallet.id;
        const isFirst = index === 0;
        const isLast = index === totalItems - 1;

        return (
            <View
                key={wallet.id}
                style={[
                    {
                        backgroundColor: "#FFFFFF",
                        marginHorizontal: 16,
                        marginBottom: isLast ? 0 : 12,
                        borderRadius: 16,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        elevation: 3,
                        borderWidth: isActive ? 2 : 1,
                        borderColor: isActive ? Colors.primary : "#F3F4F6",
                    },
                ]}
            >
                <TouchableOpacity style={{ padding: 20 }} onPress={() => handleWalletPress(wallet)} activeOpacity={0.7}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {/* Wallet Avatar */}
                        <View style={{ marginRight: 16 }}>
                            {wallet.avatar ? (
                                <Image
                                    source={{ uri: wallet.avatar }}
                                    style={{ width: 56, height: 56, borderRadius: 28 }}
                                />
                            ) : (
                                <View
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 28,
                                        backgroundColor: getWalletTypeBadgeColor(wallet.type),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {React.createElement(getWalletIcon(wallet.type), {
                                        size: 28,
                                        color: getWalletTypeColor(wallet.type),
                                    })}
                                </View>
                            )}
                        </View>

                        {/* Wallet Info */}
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                                <Text style={{ fontSize: 18, fontWeight: "600", color: "#1F2937", flex: 1 }}>
                                    {wallet.name}
                                </Text>
                                {isActive && (
                                    <View
                                        style={{
                                            backgroundColor: Colors.primary,
                                            paddingHorizontal: 12,
                                            paddingVertical: 4,
                                            borderRadius: 12,
                                            marginLeft: 8,
                                        }}
                                    >
                                        <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600" }}>
                                            Active
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Wallet Type Badge */}
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                {React.createElement(getWalletIcon(wallet.type), {
                                    size: 14,
                                    color: getWalletTypeColor(wallet.type),
                                })}
                                <Text
                                    style={{
                                        marginLeft: 6,
                                        fontSize: 14,
                                        color: getWalletTypeColor(wallet.type),
                                        fontWeight: "500",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {wallet.type === "custodial" ? "Cloud Wallet" : "Self-Custody"}
                                </Text>
                            </View>

                            {/* Wallet Address */}
                            {wallet.address && (
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: "#6B7280",
                                        fontFamily: "monospace",
                                        backgroundColor: "#F9FAFB",
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderRadius: 6,
                                        alignSelf: "flex-start",
                                    }}
                                >
                                    {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                                </Text>
                            )}
                        </View>

                        {/* Action Icons */}
                        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 12 }}>
                            {isActive && (
                                <View style={{ marginRight: 12 }}>
                                    <Check size={24} color="#10B981" />
                                </View>
                            )}

                            {/* Show Recovery Phrase Button for Self-Custody Wallets */}
                            {wallet.type === "non-custodial" && wallet.mnemonic && (
                                <TouchableOpacity
                                    style={{
                                        padding: 8,
                                        borderRadius: 8,
                                        backgroundColor: "#FEF3C7",
                                        marginRight: 8,
                                    }}
                                    onPress={e => {
                                        e.stopPropagation();
                                        console.log("Shield button pressed for wallet:", wallet.name);
                                        handleShowRecoveryPhrase(wallet);
                                    }}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Shield size={18} color="#F59E0B" />
                                </TouchableOpacity>
                            )}

                            {wallets.length > 1 && (
                                <TouchableOpacity
                                    style={{
                                        padding: 8,
                                        borderRadius: 8,
                                        backgroundColor: "#FEF2F2",
                                    }}
                                    onPress={e => {
                                        e.stopPropagation();
                                        handleRemoveWallet(wallet);
                                    }}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Trash2 size={18} color="#EF4444" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Recovery Phrase Action for Self-Custody Wallets */}
                {wallet.type === "non-custodial" && wallet.mnemonic && (
                    <View
                        style={{
                            paddingHorizontal: 20,
                            paddingBottom: 16,
                            borderTopWidth: 1,
                            borderTopColor: "#F3F4F6",
                            marginTop: 8,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                backgroundColor: "#FEF3C7",
                                borderRadius: 10,
                            }}
                            onPress={() => {
                                console.log("Main recovery button pressed for wallet:", wallet.name);
                                handleShowRecoveryPhrase(wallet);
                            }}
                            activeOpacity={0.7}
                        >
                            <Shield size={16} color="#F59E0B" />
                            <Text
                                style={{
                                    marginLeft: 8,
                                    fontSize: 14,
                                    fontWeight: "500",
                                    color: "#92400E",
                                    flex: 1,
                                }}
                            >
                                Show Recovery Phrase
                            </Text>
                            <ChevronRight size={16} color="#92400E" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    const custodialWallets = wallets.filter(w => w.type === "custodial");
    const nonCustodialWallets = wallets.filter(w => w.type === "non-custodial");

    if (isInitialLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={{ marginTop: 16, fontSize: 16, color: "#6B7280" }}>Loading wallets...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {/* Header with Add Wallet Button */}
                <View style={{ paddingTop: 20, paddingBottom: 16 }}>
                    <TouchableOpacity
                        style={{
                            marginHorizontal: 16,
                            backgroundColor: "#FFFFFF",
                            borderRadius: 16,
                            padding: 20,
                            flexDirection: "row",
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            elevation: 3,
                            borderWidth: 2,
                            borderColor: Colors.primary,
                        }}
                        onPress={handleAddWallet}
                        activeOpacity={0.7}
                    >
                        <View
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: Colors.primary,
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 16,
                            }}
                        >
                            <Plus size={24} color="#FFFFFF" />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 18, fontWeight: "600", color: Colors.primary, marginBottom: 2 }}>
                                Add New Wallet
                            </Text>
                            <Text style={{ fontSize: 14, color: "#6B7280" }}>Create or restore a wallet</Text>
                        </View>

                        <ChevronRight color={Colors.primary} size={24} />
                    </TouchableOpacity>
                </View>

                {/* Cloud Wallets Section */}
                {custodialWallets.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                        <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Cloud size={20} color="#2563EB" />
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "600",
                                        color: "#1F2937",
                                        marginLeft: 8,
                                    }}
                                >
                                    Cloud Wallets
                                </Text>
                            </View>
                            <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>
                                Backed up automatically with your Digital ID
                            </Text>
                        </View>
                        <View>
                            {custodialWallets.map((wallet, index) =>
                                renderWalletItem(wallet, index, custodialWallets.length)
                            )}
                        </View>
                    </View>
                )}

                {/* Self-Custody Wallets Section */}
                {nonCustodialWallets.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                        <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Key size={20} color="#059669" />
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "600",
                                        color: "#1F2937",
                                        marginLeft: 8,
                                    }}
                                >
                                    Self-Custody Wallets
                                </Text>
                            </View>
                            <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>
                                You control the private keys and recovery phrase
                            </Text>
                        </View>
                        <View>
                            {nonCustodialWallets.map((wallet, index) =>
                                renderWalletItem(wallet, index, nonCustodialWallets.length)
                            )}
                        </View>
                    </View>
                )}

                {/* Empty State */}
                {wallets.length === 0 && !isLoading && (
                    <View style={{ marginTop: 60, alignItems: "center", paddingHorizontal: 32 }}>
                        <View
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                backgroundColor: "#F3F4F6",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 24,
                            }}
                        >
                            <Wallet size={48} color="#9CA3AF" />
                        </View>
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: "600",
                                color: "#1F2937",
                                textAlign: "center",
                                marginBottom: 12,
                            }}
                        >
                            No Wallets Found
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                color: "#6B7280",
                                textAlign: "center",
                                lineHeight: 24,
                                marginBottom: 32,
                            }}
                        >
                            Get started by adding your first wallet. You can create a new one or restore an existing
                            wallet.
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.primary,
                                paddingHorizontal: 32,
                                paddingVertical: 16,
                                borderRadius: 12,
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                            onPress={handleAddWallet}
                            activeOpacity={0.7}
                        >
                            <Plus size={20} color="#FFFFFF" />
                            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600", marginLeft: 8 }}>
                                Add Your First Wallet
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Information Section */}
                <View style={{ marginHorizontal: 16, marginBottom: 32, marginTop: wallets.length > 0 ? 16 : 0 }}>
                    <View
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 16,
                            padding: 20,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            elevation: 3,
                            borderLeftWidth: 4,
                            borderLeftColor: "#3B82F6",
                        }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                            <View
                                style={{
                                    backgroundColor: "#EBF4FF",
                                    borderRadius: 10,
                                    padding: 8,
                                    marginRight: 16,
                                }}
                            >
                                <Info size={24} color="#3B82F6" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "600",
                                        color: "#1F2937",
                                        marginBottom: 8,
                                    }}
                                >
                                    About Multiple Wallets
                                </Text>
                                <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>
                                    • <Text style={{ fontWeight: "500" }}>Cloud wallets</Text> are backed up
                                    automatically with your Digital ID{"\n"}•{" "}
                                    <Text style={{ fontWeight: "500" }}>Self-custody wallets</Text> require you to
                                    backup your recovery phrase manually{"\n"}• You can switch between wallets anytime
                                    by tapping on a wallet card{"\n"}• Each wallet has its own unique address and
                                    balance{"\n"}• Tap <Text style={{ fontWeight: "500" }}>"Show Recovery Phrase"</Text>{" "}
                                    on self-custody wallets to view their recovery phrases{"\n"}• Always secure your
                                    recovery phrases - they're the only way to recover your self-custody wallets
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Add Wallet Bottom Sheet */}
            <AddWalletSheet ref={addWalletBottomSheetRef} handleCloseBottomSheet={handleCloseAddWalletSheet} />

            {/* Recovery Phrase Bottom Sheet */}
            <WalletRecoverySheet
                ref={recoveryBottomSheetRef}
                wallet={selectedWalletForRecovery}
                onClose={handleRecoverySheetClose}
            />
        </SafeAreaView>
    );
}
