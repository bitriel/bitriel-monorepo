import React, { useState, useCallback, useMemo } from "react";
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
import { useMultiAuth } from "~/lib/hooks/useMultiAuth";
import { AuthenticatedAccount } from "~/src/store/multiAccountStore";
import { settingStyles } from "../index";
import Colors from "~/src/constants/Colors";
import {
    Cloud,
    Key,
    Plus,
    ChevronRight,
    Check,
    Trash2,
    Info,
    Wallet,
    Shield,
    MoreVertical,
    User,
    Users,
    UserPlus,
    RefreshCw,
    ArrowRightLeft,
} from "lucide-react-native";
import useBottomSheet from "~/src/context/useBottomSheet";
import AddWalletSheet from "~/components/WalletSelector/AddWalletSheet";
import WalletRecoverySheet from "~/components/WalletSelector/WalletRecoverySheet";

export default function WalletManagementPage() {
    // Multi-wallet store - data should already be loaded
    const {
        wallets,
        activeWallet,
        setActiveWallet,
        removeWallet,
        reloadWallets,
        isLoading: walletsLoading,
    } = useMultiWalletStore();

    // Multi-account integration - data should already be loaded
    const {
        activeAccount,
        accounts,
        totalAccounts,
        signInNewAccount,
        switchAccount,
        removeAccount,
        error: authError,
    } = useMultiAuth();

    // Local state - only for UI interactions
    const [selectedWalletForRecovery, setSelectedWalletForRecovery] = useState<MultiWallet | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

    // Bottom sheets
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

    // Simple loading state - only for user actions
    const isLoading = walletsLoading || !!actionLoading;

    // Recovery phrase handlers
    const handleShowRecoveryPhrase = useCallback(
        (wallet: MultiWallet) => {
            if (wallet.type === "non-custodial" && wallet.mnemonic) {
                setSelectedWalletForRecovery(wallet);
                handleOpenRecoverySheet();
            } else {
                Alert.alert("Error", "Cannot show recovery phrase for this wallet type.");
            }
        },
        [handleOpenRecoverySheet]
    );

    const handleRecoverySheetClose = useCallback(() => {
        setSelectedWalletForRecovery(null);
        handleCloseRecoverySheet();
    }, [handleCloseRecoverySheet]);

    // Account management functions
    const handleAddNewAccount = useCallback(async () => {
        try {
            setActionLoading("add_account");
            const success = await signInNewAccount();

            if (success) {
                // Refresh wallets after adding new account
                await reloadWallets();
            }
        } catch (error) {
            console.error("❌ Failed to add new account:", error);
            Alert.alert("Error", "Failed to add new account. Please try again.", [{ text: "OK" }]);
        } finally {
            setActionLoading(null);
        }
    }, [signInNewAccount, reloadWallets]);

    const handleSwitchAccount = useCallback(
        async (account: AuthenticatedAccount) => {
            if (account.id === activeAccount?.id) {
                setShowAccountSwitcher(false);
                return;
            }

            try {
                setActionLoading(account.id);
                const success = await switchAccount(account.id);

                if (success) {
                    setShowAccountSwitcher(false);
                    // Refresh wallets after switching account
                    await reloadWallets();
                } else {
                    Alert.alert("Error", "Failed to switch account. Please try again.", [{ text: "OK" }]);
                }
            } catch (error) {
                console.error("❌ Failed to switch account:", error);
                Alert.alert("Error", "Failed to switch account. Please try again.", [{ text: "OK" }]);
            } finally {
                setActionLoading(null);
            }
        },
        [activeAccount?.id, switchAccount, reloadWallets]
    );

    const handleRemoveAccount = useCallback(
        (account: AuthenticatedAccount) => {
            if (totalAccounts <= 1) {
                Alert.alert("Cannot Remove", "You must have at least one account.", [{ text: "OK" }]);
                return;
            }

            Alert.alert(
                "Remove Account",
                `Are you sure you want to remove the account for "${account.user.fullname || account.user.email}"?\n\nThis will remove the account and all its associated wallets.`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Remove",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                setActionLoading(account.id);

                                // Remove all custodial wallets for this account
                                const accountWallets = wallets.filter(w => w.userId === account.user._id);
                                for (const wallet of accountWallets) {
                                    await removeWallet(wallet.id);
                                }

                                // Remove the account
                                const success = await removeAccount(account.id);

                                if (success) {
                                    setShowAccountSwitcher(false);
                                    Alert.alert("Success", "Account removed successfully", [{ text: "OK" }]);
                                    // Refresh wallets after removing account
                                    await reloadWallets();
                                } else {
                                    Alert.alert("Error", "Failed to remove account. Please try again.", [
                                        { text: "OK" },
                                    ]);
                                }
                            } catch (error) {
                                console.error("❌ Failed to remove account:", error);
                                Alert.alert("Error", "Failed to remove account. Please try again.", [{ text: "OK" }]);
                            } finally {
                                setActionLoading(null);
                            }
                        },
                    },
                ]
            );
        },
        [totalAccounts, wallets, removeWallet, removeAccount, reloadWallets]
    );

    // Wallet management functions
    const handleWalletPress = useCallback(
        async (wallet: MultiWallet) => {
            if (wallet.id !== activeWallet?.id) {
                try {
                    setActionLoading(wallet.id);
                    await setActiveWallet(wallet.id);
                    Alert.alert("Success", `Switched to ${wallet.name}`, [{ text: "OK" }]);
                } catch (error) {
                    console.error("❌ Failed to switch wallet:", error);
                    Alert.alert("Error", "Failed to switch wallet. Please try again.", [{ text: "OK" }]);
                } finally {
                    setActionLoading(null);
                }
            }
        },
        [activeWallet?.id, setActiveWallet]
    );

    const handleRemoveWallet = useCallback(
        (wallet: MultiWallet) => {
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
                                setActionLoading(wallet.id);
                                await removeWallet(wallet.id);
                                Alert.alert("Success", "Wallet removed successfully", [{ text: "OK" }]);
                            } catch (error) {
                                console.error("❌ Failed to remove wallet:", error);
                                Alert.alert("Error", "Failed to remove wallet. Please try again.", [{ text: "OK" }]);
                            } finally {
                                setActionLoading(null);
                            }
                        },
                    },
                ]
            );
        },
        [wallets.length, removeWallet]
    );

    const handleAddWallet = useCallback(() => {
        handleOpenAddWalletSheet();
    }, [handleOpenAddWalletSheet]);

    // Utility functions
    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }, []);

    const getWalletIcon = useCallback((type: WalletType) => {
        return type === "custodial" ? Cloud : Key;
    }, []);

    const getWalletTypeColor = useCallback((type: WalletType) => {
        return type === "custodial" ? "#2563EB" : "#059669";
    }, []);

    const getWalletTypeBadgeColor = useCallback((type: WalletType) => {
        return type === "custodial" ? "#EBF4FF" : "#ECFDF5";
    }, []);

    // Memoized wallet lists
    const { custodialWallets, nonCustodialWallets } = useMemo(
        () => ({
            custodialWallets: wallets.filter(w => w.type === "custodial"),
            nonCustodialWallets: wallets.filter(w => w.type === "non-custodial"),
        }),
        [wallets]
    );

    const renderWalletItem = (wallet: MultiWallet, index: number, totalItems: number) => {
        const isActive = activeWallet?.id === wallet.id;
        const isWalletLoading = actionLoading === wallet.id;

        return (
            <View
                key={wallet.id}
                style={[
                    {
                        backgroundColor: "#FFFFFF",
                        marginHorizontal: 16,
                        marginBottom: index === totalItems - 1 ? 0 : 12,
                        borderRadius: 16,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        elevation: 3,
                        borderWidth: isActive ? 2 : 1,
                        borderColor: isActive ? Colors.primary : "#F3F4F6",
                        opacity: isWalletLoading ? 0.6 : 1,
                    },
                ]}
            >
                <TouchableOpacity
                    style={{ padding: 20 }}
                    onPress={() => handleWalletPress(wallet)}
                    activeOpacity={0.7}
                    disabled={isWalletLoading}
                >
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
                            {isWalletLoading ? (
                                <ActivityIndicator size="small" color={Colors.primary} style={{ marginRight: 12 }} />
                            ) : isActive ? (
                                <View style={{ marginRight: 12 }}>
                                    <Check size={24} color="#10B981" />
                                </View>
                            ) : null}

                            {/* Show Recovery Phrase Button for Self-Custody Wallets */}
                            {wallet.type === "non-custodial" && wallet.mnemonic && !isWalletLoading && (
                                <TouchableOpacity
                                    style={{
                                        padding: 8,
                                        borderRadius: 8,
                                        backgroundColor: "#FEF3C7",
                                        marginRight: 8,
                                    }}
                                    onPress={e => {
                                        e.stopPropagation();
                                        handleShowRecoveryPhrase(wallet);
                                    }}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Shield size={18} color="#F59E0B" />
                                </TouchableOpacity>
                            )}

                            {wallets.length > 1 && !isWalletLoading && (
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
                                opacity: isWalletLoading ? 0.6 : 1,
                            }}
                            onPress={() => handleShowRecoveryPhrase(wallet)}
                            activeOpacity={0.7}
                            disabled={isWalletLoading}
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

    // Render account switcher
    const renderAccountSwitcher = () => {
        if (!showAccountSwitcher) return null;

        return (
            <View
                style={{
                    position: "absolute",
                    top: 80,
                    left: 16,
                    right: 16,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 8,
                    zIndex: 1000,
                    maxHeight: 300,
                }}
            >
                <ScrollView style={{ maxHeight: 250 }}>
                    {accounts.map(account => {
                        const isActive = account.id === activeAccount?.id;
                        const isLoadingAccount = actionLoading === account.id;

                        return (
                            <TouchableOpacity
                                key={account.id}
                                style={{
                                    padding: 16,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#F3F4F6",
                                    opacity: isLoadingAccount ? 0.6 : 1,
                                }}
                                onPress={() => handleSwitchAccount(account)}
                                disabled={isLoadingAccount}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    {account.user.profile ? (
                                        <Image
                                            source={{ uri: account.user.profile }}
                                            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
                                        />
                                    ) : (
                                        <View
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 20,
                                                backgroundColor: "#EBF4FF",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: 12,
                                            }}
                                        >
                                            <User size={20} color="#2563EB" />
                                        </View>
                                    )}

                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, fontWeight: "600", color: "#1F2937" }}>
                                            {account.user.fullname || account.user.email || "Unknown User"}
                                        </Text>
                                        {account.user.email && (
                                            <Text style={{ fontSize: 14, color: "#6B7280" }}>{account.user.email}</Text>
                                        )}
                                        <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                                            Last used: {formatDate(account.lastUsed)}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        {isLoadingAccount ? (
                                            <ActivityIndicator
                                                size="small"
                                                color={Colors.primary}
                                                style={{ marginRight: 8 }}
                                            />
                                        ) : isActive ? (
                                            <Check size={20} color="#10B981" style={{ marginRight: 8 }} />
                                        ) : null}

                                        {totalAccounts > 1 && !isActive && (
                                            <TouchableOpacity
                                                style={{
                                                    padding: 4,
                                                    borderRadius: 6,
                                                    backgroundColor: "#FEF2F2",
                                                }}
                                                onPress={e => {
                                                    e.stopPropagation();
                                                    handleRemoveAccount(account);
                                                }}
                                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                            >
                                                <Trash2 size={16} color="#EF4444" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Add New Account Button */}
                <TouchableOpacity
                    style={{
                        padding: 16,
                        borderTopWidth: 1,
                        borderTopColor: "#F3F4F6",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    onPress={handleAddNewAccount}
                    disabled={actionLoading === "add_account"}
                >
                    <View
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: Colors.primary,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                        }}
                    >
                        {actionLoading === "add_account" ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <UserPlus size={20} color="#FFFFFF" />
                        )}
                    </View>

                    <Text style={{ fontSize: 16, fontWeight: "600", color: Colors.primary }}>Add New Account</Text>
                </TouchableOpacity>

                {/* Close button */}
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        padding: 8,
                        borderRadius: 20,
                        backgroundColor: "#F3F4F6",
                    }}
                    onPress={() => setShowAccountSwitcher(false)}
                >
                    <Text style={{ fontSize: 16, color: "#6B7280" }}>✕</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {/* Account Info Header - Show even if no active account */}
                {(activeAccount || totalAccounts > 0) && (
                    <View style={{ paddingTop: 20, paddingBottom: 16 }}>
                        <TouchableOpacity
                            style={{
                                marginHorizontal: 16,
                                backgroundColor: "#FFFFFF",
                                borderRadius: 16,
                                padding: 20,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.08,
                                shadowRadius: 8,
                                elevation: 3,
                                borderWidth: 1,
                                borderColor: "#E5E7EB",
                            }}
                            onPress={() => setShowAccountSwitcher(!showAccountSwitcher)}
                            activeOpacity={0.7}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                {activeAccount?.user.profile ? (
                                    <Image
                                        source={{ uri: activeAccount.user.profile }}
                                        style={{ width: 48, height: 48, borderRadius: 24, marginRight: 16 }}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 24,
                                            backgroundColor: "#EBF4FF",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: 16,
                                        }}
                                    >
                                        <User size={24} color="#2563EB" />
                                    </View>
                                )}

                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={{ fontSize: 18, fontWeight: "600", color: "#1F2937", marginBottom: 2 }}
                                    >
                                        {activeAccount?.user.fullname || activeAccount?.user.email || "Select Account"}
                                    </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Users size={14} color="#6B7280" />
                                        <Text style={{ fontSize: 14, color: "#6B7280", marginLeft: 4 }}>
                                            {totalAccounts} account{totalAccounts !== 1 ? "s" : ""} • Tap to switch
                                        </Text>
                                    </View>
                                </View>

                                <ArrowRightLeft size={20} color="#6B7280" />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Add Wallet Options */}
                <View style={{ paddingBottom: 16 }}>
                    <View style={{ flexDirection: "row", marginHorizontal: 16, gap: 12 }}>
                        {/* Add Self-Custody Wallet */}
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: "#FFFFFF",
                                borderRadius: 16,
                                padding: 16,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.08,
                                shadowRadius: 8,
                                elevation: 3,
                                borderWidth: 2,
                                borderColor: "#ECFDF5",
                            }}
                            onPress={handleAddWallet}
                            activeOpacity={0.7}
                        >
                            <View style={{ alignItems: "center" }}>
                                <View
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: "#ECFDF5",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Key size={20} color="#059669" />
                                </View>
                                <Text
                                    style={{ fontSize: 14, fontWeight: "600", color: "#059669", textAlign: "center" }}
                                >
                                    Add Self-Custody
                                </Text>
                                <Text style={{ fontSize: 12, color: "#6B7280", textAlign: "center", marginTop: 2 }}>
                                    Create or restore
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* Add Cloud Wallet */}
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: "#FFFFFF",
                                borderRadius: 16,
                                padding: 16,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.08,
                                shadowRadius: 8,
                                elevation: 3,
                                borderWidth: 2,
                                borderColor: "#EBF4FF",
                            }}
                            onPress={handleAddNewAccount}
                            activeOpacity={0.7}
                            disabled={actionLoading === "add_account"}
                        >
                            <View style={{ alignItems: "center" }}>
                                <View
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: "#EBF4FF",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: 8,
                                    }}
                                >
                                    {actionLoading === "add_account" ? (
                                        <ActivityIndicator color="#2563EB" size="small" />
                                    ) : (
                                        <Cloud size={20} color="#2563EB" />
                                    )}
                                </View>
                                <Text
                                    style={{ fontSize: 14, fontWeight: "600", color: "#2563EB", textAlign: "center" }}
                                >
                                    Add Cloud Wallet
                                </Text>
                                <Text style={{ fontSize: 12, color: "#6B7280", textAlign: "center", marginTop: 2 }}>
                                    New Digital ID
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
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
                            Get Started
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
                            Add your first wallet. You can create a self-custody wallet or authenticate with your
                            Digital ID for a cloud wallet.
                        </Text>
                        <View style={{ flexDirection: "row", gap: 12 }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "#059669",
                                    paddingHorizontal: 24,
                                    paddingVertical: 16,
                                    borderRadius: 12,
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                                onPress={handleAddWallet}
                                activeOpacity={0.7}
                            >
                                <Key size={20} color="#FFFFFF" />
                                <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600", marginLeft: 8 }}>
                                    Self-Custody
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: Colors.primary,
                                    paddingHorizontal: 24,
                                    paddingVertical: 16,
                                    borderRadius: 12,
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                                onPress={handleAddNewAccount}
                                activeOpacity={0.7}
                                disabled={actionLoading === "add_account"}
                            >
                                {actionLoading === "add_account" ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <Cloud size={20} color="#FFFFFF" />
                                )}
                                <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600", marginLeft: 8 }}>
                                    Cloud Wallet
                                </Text>
                            </TouchableOpacity>
                        </View>
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
                                    About Accounts & Wallets
                                </Text>
                                <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>
                                    • <Text style={{ fontWeight: "500" }}>Accounts</Text> represent different Digital
                                    IDs you can authenticate with{"\n"}•{" "}
                                    <Text style={{ fontWeight: "500" }}>Cloud wallets</Text> are backed up automatically
                                    with your Digital ID{"\n"}•{" "}
                                    <Text style={{ fontWeight: "500" }}>Self-custody wallets</Text> require you to
                                    backup your recovery phrase manually{"\n"}• Switch between accounts by tapping your
                                    profile at the top{"\n"}• Each wallet has its own unique address and balance{"\n"}•
                                    Tap <Text style={{ fontWeight: "500" }}>"Show Recovery Phrase"</Text> on
                                    self-custody wallets to view their recovery phrases{"\n"}• Always secure your
                                    recovery phrases - they're the only way to recover your self-custody wallets
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Auth Error Display */}
                {authError && (
                    <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                        <View
                            style={{
                                backgroundColor: "#FEF2F2",
                                borderRadius: 12,
                                padding: 16,
                                borderWidth: 1,
                                borderColor: "#FECACA",
                            }}
                        >
                            <Text style={{ color: "#DC2626", fontSize: 14, textAlign: "center" }}>{authError}</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Account Switcher Overlay */}
            {renderAccountSwitcher()}

            {/* Add Wallet Bottom Sheet */}
            <AddWalletSheet ref={addWalletBottomSheetRef} handleCloseBottomSheet={handleCloseAddWalletSheet} />

            {/* Recovery Phrase Bottom Sheet */}
            <WalletRecoverySheet
                ref={recoveryBottomSheetRef}
                wallet={selectedWalletForRecovery}
                onClose={handleRecoverySheetClose}
            />

            {/* Background overlay when account switcher is open */}
            {showAccountSwitcher && (
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        zIndex: 999,
                    }}
                    onPress={() => setShowAccountSwitcher(false)}
                    activeOpacity={1}
                />
            )}
        </SafeAreaView>
    );
}
