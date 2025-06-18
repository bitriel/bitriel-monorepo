"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Animated } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import type BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { BitrielWalletSDK } from "@bitriel/wallet-sdk";
import { Shield, Copy } from "lucide-react-native";

import MnemonicBox from "~/components/Mnemonic/MnemonicBox";
import Colors from "~/src/constants/Colors";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { useMultiWalletStore } from "~/src/store/multiWalletStore";

export default function SecretPhraseScreen() {
    const [mnemonic, setMnemonic] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [hasConfirmed, setHasConfirmed] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { addWallet, wallets } = useMultiWalletStore();

    const generateMnemonic = useCallback(() => {
        try {
            setIsLoading(true);
            const newMnemonic = BitrielWalletSDK.createMnemonic();
            setMnemonic(newMnemonic);

            // Fade in animation for the mnemonic
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } catch (error) {
            Alert.alert("Error", "Failed to generate recovery phrase. Please try again.", [
                { text: "Retry", onPress: generateMnemonic },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [fadeAnim]);

    const handleConfirmBackup = useCallback(async () => {
        if (hasConfirmed) {
            try {
                // Add the non-custodial wallet to the multi-wallet store
                const walletName = `Wallet ${wallets.length + 1}`;
                await addWallet({
                    name: walletName,
                    type: "non-custodial",
                    mnemonic: mnemonic,
                    isActive: true,
                });

                // Navigate to wallet screen
                router.replace({
                    pathname: "/(auth)/home/(tabs)/wallet",
                    params: { mnemonicParam: mnemonic },
                });
            } catch (error) {
                Alert.alert("Error", "Failed to create wallet. Please try again.");
                console.error("Failed to create wallet:", error);
            }
        } else {
            setHasConfirmed(true);
        }
    }, [mnemonic, hasConfirmed, addWallet, wallets.length]);

    useEffect(() => {
        generateMnemonic();
    }, [generateMnemonic]);

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {/* Title Section with improved visual hierarchy */}
                <View style={{ alignItems: "center", paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 }}>
                    <View
                        style={{
                            backgroundColor: "#FEF3C7",
                            padding: 16,
                            borderRadius: 50,
                            marginBottom: 20,
                        }}
                    >
                        <Shield size={32} color="#F59E0B" />
                    </View>

                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "700",
                            color: "#1F2937",
                            textAlign: "center",
                            marginBottom: 12,
                        }}
                    >
                        Secret Recovery Phrase
                    </Text>

                    <Text
                        style={{
                            color: "#4B5563",
                            textAlign: "center",
                            fontSize: 16,
                            lineHeight: 24,
                            paddingHorizontal: 8,
                        }}
                    >
                        Write down these 12 words in order and store them safely. You'll need them to recover your
                        wallet.
                    </Text>
                </View>

                {/* Mnemonic Display with animation */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        marginHorizontal: 16,
                        marginBottom: 24,
                        backgroundColor: "#F9FAFB",
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                    }}
                >
                    {isLoading ? (
                        <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 64 }}>
                            <ActivityIndicator size="large" color="#F59E0B" />
                            <Text style={{ color: "#6B7280", marginTop: 12, fontSize: 16 }}>
                                Generating secure phrase...
                            </Text>
                        </View>
                    ) : (
                        <>
                            <MnemonicBox mnemonic={mnemonic} />
                        </>
                    )}
                </Animated.View>
            </ScrollView>

            {/* Fixed Bottom Section with improved buttons */}
            <View
                style={{
                    paddingHorizontal: 16,
                    paddingBottom: 24,
                    paddingTop: 16,
                    backgroundColor: "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor: "#F3F4F6",
                    elevation: 4,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                }}
            >
                <TouchableOpacity
                    style={{
                        paddingVertical: 16,
                        borderRadius: 12,
                        backgroundColor: Colors.primary,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={handleConfirmBackup}
                    disabled={isLoading || !mnemonic}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            fontWeight: "600",
                            fontSize: 16,
                            color: "#FFFFFF",
                        }}
                    >
                        I've saved it
                    </Text>
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
}
