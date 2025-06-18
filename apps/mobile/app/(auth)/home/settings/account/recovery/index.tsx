import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMultiWalletStore } from "~/src/store/multiWalletStore";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import MnemonicBox from "~/components/Mnemonic/MnemonicBox";
import Colors from "~/src/constants/Colors";
import { Key, Shield, AlertTriangle, Copy, CheckCircle } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";

interface WalletMnemonic {
    walletId: string;
    walletName: string;
    mnemonic: string;
    isActive: boolean;
}

export default function RecoverySecretPhraseScreen() {
    const [walletMnemonics, setWalletMnemonics] = useState<WalletMnemonic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedWalletId, setCopiedWalletId] = useState<string | null>(null);
    const { wallets } = useMultiWalletStore();

    const getMnemonics = async () => {
        try {
            setIsLoading(true);
            const mnemonicsData: WalletMnemonic[] = [];

            // Get mnemonics from multi-wallet store
            for (const wallet of wallets) {
                if (wallet.type === "non-custodial" && wallet.mnemonic) {
                    mnemonicsData.push({
                        walletId: wallet.id,
                        walletName: wallet.name,
                        mnemonic: wallet.mnemonic,
                        isActive: wallet.isActive,
                    });
                }
            }

            // If no wallets found in multi-wallet store, check legacy storage
            if (mnemonicsData.length === 0) {
                const legacyMnemonic = await ExpoSecureStoreAdapter.getItem("wallet_mnemonic");
                if (legacyMnemonic) {
                    mnemonicsData.push({
                        walletId: "legacy",
                        walletName: "My Wallet (Legacy)",
                        mnemonic: legacyMnemonic,
                        isActive: true,
                    });
                }
            }

            setWalletMnemonics(mnemonicsData);
        } catch (error) {
            console.error("Failed to get mnemonics:", error);
            Alert.alert("Error", "Failed to retrieve recovery phrases");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyMnemonic = async (walletId: string, mnemonic: string) => {
        try {
            await Clipboard.setStringAsync(mnemonic);
            setCopiedWalletId(walletId);

            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopiedWalletId(null);
            }, 2000);
        } catch (error) {
            Alert.alert("Error", "Failed to copy to clipboard");
        }
    };

    useEffect(() => {
        getMnemonics();
    }, [wallets]);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading recovery phrases...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (walletMnemonics.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Key size={48} color="#9CA3AF" />
                    </View>
                    <Text style={styles.emptyTitle}>No Self-Custody Wallets</Text>
                    <Text style={styles.emptyText}>
                        You don't have any self-custody wallets with recovery phrases. Cloud wallets are automatically
                        backed up with your Digital ID.
                    </Text>
                    <TouchableOpacity style={styles.doneButton} onPress={() => router.dismissAll()}>
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <GestureHandlerRootView style={styles.root}>
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerIconContainer}>
                            <Shield size={32} color="#F59E0B" />
                        </View>
                        <Text style={styles.headerTitle}>Recovery Phrases</Text>
                        <Text style={styles.headerSubtitle}>
                            Your secret recovery phrases for self-custody wallets. Keep these safe and never share them
                            with anyone.
                        </Text>
                    </View>

                    {/* Warning Notice */}
                    <View style={styles.warningContainer}>
                        <AlertTriangle size={20} color="#EF4444" />
                        <Text style={styles.warningText}>
                            Screenshot this page only if your device is secure. Consider writing down these phrases on
                            paper instead.
                        </Text>
                    </View>

                    {/* Wallet Mnemonics */}
                    <View style={styles.walletsContainer}>
                        {walletMnemonics.map((walletData, index) => (
                            <View key={walletData.walletId} style={styles.walletCard}>
                                {/* Wallet Header */}
                                <View style={styles.walletHeader}>
                                    <View style={styles.walletInfo}>
                                        <View style={styles.walletIconContainer}>
                                            <Key size={20} color="#059669" />
                                        </View>
                                        <View style={styles.walletDetails}>
                                            <Text style={styles.walletName}>{walletData.walletName}</Text>
                                            {walletData.isActive && (
                                                <View style={styles.activeWalletBadge}>
                                                    <Text style={styles.activeWalletText}>Active</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.copyButton}
                                        onPress={() => handleCopyMnemonic(walletData.walletId, walletData.mnemonic)}
                                    >
                                        {copiedWalletId === walletData.walletId ? (
                                            <CheckCircle size={20} color="#10B981" />
                                        ) : (
                                            <Copy size={20} color="#6B7280" />
                                        )}
                                    </TouchableOpacity>
                                </View>

                                {/* Mnemonic Display */}
                                <MnemonicBox mnemonic={walletData.mnemonic} />
                            </View>
                        ))}
                    </View>

                    {/* Security Tips */}
                    <View style={styles.securityTipsContainer}>
                        <Text style={styles.securityTipsTitle}>Security Tips</Text>
                        <View style={styles.securityTip}>
                            <Text style={styles.securityTipText}>
                                • Write these phrases on paper and store in a secure location
                            </Text>
                        </View>
                        <View style={styles.securityTip}>
                            <Text style={styles.securityTipText}>• Never share your recovery phrases with anyone</Text>
                        </View>
                        <View style={styles.securityTip}>
                            <Text style={styles.securityTipText}>
                                • Consider storing copies in multiple secure locations
                            </Text>
                        </View>
                        <View style={styles.securityTip}>
                            <Text style={styles.securityTipText}>
                                • These phrases are the only way to recover your wallet if you lose your device
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Button */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.doneButton} onPress={() => router.dismissAll()}>
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: "600",
        color: "#1F2937",
        textAlign: "center",
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 32,
    },
    header: {
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 24,
    },
    headerIconContainer: {
        backgroundColor: "#FEF3C7",
        padding: 16,
        borderRadius: 50,
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1F2937",
        textAlign: "center",
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 24,
    },
    warningContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#FEF2F2",
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: "#EF4444",
    },
    warningText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        color: "#B91C1C",
        lineHeight: 20,
    },
    walletsContainer: {
        paddingHorizontal: 16,
        gap: 20,
    },
    walletCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    walletHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    walletInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    walletIconContainer: {
        backgroundColor: "#ECFDF5",
        padding: 8,
        borderRadius: 10,
        marginRight: 12,
    },
    walletDetails: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    walletName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1F2937",
        marginRight: 8,
    },
    activeWalletBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    activeWalletText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "600",
    },
    copyButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#F9FAFB",
    },
    securityTipsContainer: {
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 20,
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
    },
    securityTipsTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1F2937",
        marginBottom: 12,
    },
    securityTip: {
        marginBottom: 8,
    },
    securityTipText: {
        fontSize: 14,
        color: "#6B7280",
        lineHeight: 20,
    },
    bottomContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 16,
        backgroundColor: "#F9FAFB",
    },
    doneButton: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    doneButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
