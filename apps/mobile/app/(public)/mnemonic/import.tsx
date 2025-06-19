import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, ScrollView, Platform } from "react-native";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import { validateMnemonic } from "@bitriel/wallet-sdk";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import Colors from "~/src/constants/Colors";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { useMultiWalletStore } from "~/src/store/multiWalletStore";

export default function ImportSecretPhraseScreen() {
    const { fromWalletManagement } = useLocalSearchParams<{ fromWalletManagement?: string }>();
    const [enteredMnemonic, setEnteredMnemonic] = useState<string>("");
    const { addWallet, wallets, checkMnemonicExists, setActiveWallet } = useMultiWalletStore();

    const handlePasteFromClipboard = async () => {
        const clipboardContent = await Clipboard.getStringAsync();
        setEnteredMnemonic(clipboardContent);
    };

    const importWallet = async () => {
        const trimmedMnemonic = enteredMnemonic.trimEnd();

        const isValidMnemonic = validateMnemonic(trimmedMnemonic);

        if (!isValidMnemonic) {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Error",
                textBody: "Invalid secret recovery phrase",
                button: "Close",
            });
            return;
        }

        // Check for existing wallet with same mnemonic
        const existingWallet = checkMnemonicExists(trimmedMnemonic);
        if (existingWallet) {
            try {
                // Auto-switch to existing wallet with friendly notification
                await setActiveWallet(existingWallet.id);

                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Wallet Found!",
                    textBody: `Switched to your existing wallet: "${existingWallet.name}"`,
                    button: "Continue",
                    onPressButton: () => {
                        Dialog.hide();
                        if (fromWalletManagement === "true") {
                            router.replace("/(auth)/home/settings/wallets");
                        } else {
                            router.replace({
                                pathname: "/(auth)/home/(tabs)/wallet",
                                params: { mnemonicParam: existingWallet.mnemonic },
                            });
                        }
                    },
                });
                return;
            } catch (error) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Error",
                    textBody: "Failed to switch to existing wallet",
                    button: "Close",
                });
                return;
            }
        }

        try {
            // Add the imported wallet to the multi-wallet store
            const walletName = `Imported Wallet ${wallets.length + 1}`;
            await addWallet({
                name: walletName,
                type: "non-custodial",
                mnemonic: trimmedMnemonic,
                isActive: true,
            });

            // Navigate based on where we came from
            if (fromWalletManagement === "true") {
                router.replace("/(auth)/home/settings/wallets");
            } else {
                router.replace({
                    pathname: "/(auth)/home/(tabs)/wallet",
                    params: { mnemonicParam: trimmedMnemonic },
                });
            }
        } catch (error) {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Error",
                textBody: "Failed to import wallet. Please try again.",
                button: "Close",
            });
            console.error("Failed to import wallet:", error);
        }
    };

    return (
        <View className="bg-white flex-1 p-5 justify-between">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}>
                <View>
                    <Text className="mb-2 text-black font-SpaceGroteskBold">Secret Phrase</Text>

                    <KeyboardAvoidingView>
                        <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            className="h-3/5 border-primary border mb-4 px-3 py-4 text-base rounded-lg"
                            onChangeText={text => setEnteredMnemonic(text)}
                            value={enteredMnemonic}
                            multiline={true}
                            placeholder="Enter your Secret Phrase"
                            placeholderTextColor={Colors.defaultText}
                            textAlignVertical="top"
                        />

                        <TouchableOpacity className="items-end" onPress={handlePasteFromClipboard}>
                            <Text className="text-base text-secondary font-SpaceGroteskBold">Paste</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>

                    <Text className="text-center font-SpaceGroteskRegular">
                        Typically 12 (sometimees 18, 24) words separated by single spaces
                    </Text>
                </View>

                <TouchableOpacity className="bg-primary p-5 mt-5 rounded-xl" onPress={importWallet}>
                    <Text className="text-base text-center text-secondary font-SpaceGroteskBold">Import Wallet</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
