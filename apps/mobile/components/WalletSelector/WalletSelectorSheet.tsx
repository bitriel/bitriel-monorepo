import React, { forwardRef, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useMultiWalletStore, MultiWallet, WalletType } from "~/src/store/multiWalletStore";
import Colors from "~/src/constants/Colors";
import { Cloud, Key, Plus, X, Check, Trash2, Wallet } from "lucide-react-native";

interface WalletSelectorSheetProps {
    handleCloseBottomSheet: () => void;
    onWalletSelected?: (wallet: MultiWallet) => void;
}

const WalletSelectorSheet = forwardRef<BottomSheet, WalletSelectorSheetProps>(
    ({ handleCloseBottomSheet, onWalletSelected }, ref) => {
        const { wallets, activeWallet, setActiveWallet, removeWallet } = useMultiWalletStore();

        const snapPoints = useMemo(() => ["50%", "90%"], []);

        const custodialWallets = wallets.filter(w => w.type === "custodial");
        const nonCustodialWallets = wallets.filter(w => w.type === "non-custodial");

        const handleWalletPress = useCallback(
            async (wallet: MultiWallet) => {
                try {
                    await setActiveWallet(wallet.id);
                    onWalletSelected?.(wallet);
                    handleCloseBottomSheet();
                } catch (error) {
                    console.error("Failed to switch wallet:", error);
                    Alert.alert("Error", "Failed to switch wallet");
                }
            },
            [setActiveWallet, onWalletSelected, handleCloseBottomSheet]
        );

        const handleRemoveWallet = useCallback(
            (wallet: MultiWallet) => {
                Alert.alert(
                    "Remove Wallet",
                    `Are you sure you want to remove "${wallet.name}"? This action cannot be undone.`,
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Remove",
                            style: "destructive",
                            onPress: async () => {
                                try {
                                    await removeWallet(wallet.id);
                                } catch (error) {
                                    console.error("Failed to remove wallet:", error);
                                    Alert.alert("Error", "Failed to remove wallet");
                                }
                            },
                        },
                    ]
                );
            },
            [removeWallet]
        );

        const handleAddWallet = useCallback(() => {
            handleCloseBottomSheet();
            router.push({ pathname: "/(public)/auth-method", params: { flowType: "createWallet" } });
        }, [handleCloseBottomSheet]);

        const getWalletIcon = (type: WalletType) => {
            return type === "custodial" ? Cloud : Key;
        };

        const getWalletTypeColor = (type: WalletType) => {
            return type === "custodial" ? "#2563EB" : "#059669";
        };

        const renderWalletItem = useCallback(
            (wallet: MultiWallet) => {
                const isActive = activeWallet?.id === wallet.id;

                return (
                    <View key={wallet.id} className="bg-white mb-3 rounded-xl border border-gray-100">
                        <TouchableOpacity
                            className={`p-4 rounded-xl ${isActive ? "bg-blue-50" : ""}`}
                            onPress={() => handleWalletPress(wallet)}
                        >
                            <View className="flex-row items-center">
                                <View className="mr-3">
                                    {wallet.avatar ? (
                                        <Image source={{ uri: wallet.avatar }} className="w-12 h-12 rounded-full" />
                                    ) : (
                                        <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
                                            {React.createElement(getWalletIcon(wallet.type), {
                                                size: 24,
                                                color: getWalletTypeColor(wallet.type),
                                            })}
                                        </View>
                                    )}
                                </View>

                                <View className="flex-1">
                                    <View className="flex-row items-center mb-1">
                                        <Text className="font-SpaceGroteskBold text-base text-gray-900">
                                            {wallet.name}
                                        </Text>
                                        {isActive && (
                                            <View className="ml-2 bg-blue-500 px-2 py-1 rounded-full">
                                                <Text className="text-white text-xs font-SpaceGroteskBold">Active</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View className="flex-row items-center mb-1">
                                        {React.createElement(getWalletIcon(wallet.type), {
                                            size: 14,
                                            color: getWalletTypeColor(wallet.type),
                                        })}
                                        <Text className="ml-1 text-sm text-gray-500 capitalize">
                                            {wallet.type.replace("-", " ")}
                                        </Text>
                                    </View>

                                    {wallet.address && (
                                        <Text className="text-xs text-gray-400 font-mono">
                                            {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                                        </Text>
                                    )}
                                </View>

                                <View className="flex-row items-center">
                                    {isActive && <Check size={24} color="#10B981" />}

                                    {wallets.length > 1 && (
                                        <TouchableOpacity
                                            className="ml-2 p-2"
                                            onPress={() => handleRemoveWallet(wallet)}
                                        >
                                            <Trash2 size={20} color="#EF4444" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            },
            [activeWallet, handleWalletPress, handleRemoveWallet, wallets.length]
        );

        return (
            <BottomSheet ref={ref} snapPoints={snapPoints} enablePanDownToClose>
                <BottomSheetView className="flex-1 px-4">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-xl font-SpaceGroteskBold text-gray-900">My Wallets</Text>
                        <TouchableOpacity onPress={handleCloseBottomSheet}>
                            <X size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                        {custodialWallets.length > 0 && (
                            <View className="mb-4">
                                <Text className="text-sm font-SpaceGroteskBold text-gray-600 mb-3">CLOUD WALLETS</Text>
                                {custodialWallets.map(renderWalletItem)}
                            </View>
                        )}

                        {nonCustodialWallets.length > 0 && (
                            <View className="mb-4">
                                <Text className="text-sm font-SpaceGroteskBold text-gray-600 mb-3">
                                    SELF-CUSTODY WALLETS
                                </Text>
                                {nonCustodialWallets.map(renderWalletItem)}
                            </View>
                        )}

                        {wallets.length === 0 && (
                            <View className="items-center py-8">
                                <Wallet size={48} color="#9CA3AF" />
                                <Text className="text-gray-500 text-center mt-4 font-SpaceGroteskRegular">
                                    No wallets found
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity className="bg-primary p-4 rounded-xl mt-4 mb-8" onPress={handleAddWallet}>
                            <View className="flex-row items-center justify-center">
                                <Plus size={20} color="#FFFFFF" />
                                <Text className="ml-2 text-white font-SpaceGroteskBold">Add New Wallet</Text>
                            </View>
                        </TouchableOpacity>
                    </BottomSheetScrollView>
                </BottomSheetView>
            </BottomSheet>
        );
    }
);

WalletSelectorSheet.displayName = "WalletSelectorSheet";

export default WalletSelectorSheet;
