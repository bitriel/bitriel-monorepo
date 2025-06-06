import { Dimensions, FlatList, Platform, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import Colors from "~/src/constants/Colors";
import { Stack, router, useLocalSearchParams } from "expo-router";
import LoadingModal from "~/components/Loading";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { useWalletTransactions } from "~/src/store/useWalletStore";
import { useCustodialAuthStore } from "~/src/store/useCustodialAuthStore";
import { useWalletTypeStore } from "~/src/store/useWalletTypeStore";
import { Dialog, ALERT_TYPE } from "react-native-alert-notification";
import { swapApi, TokenTransferRequest } from "~/src/api/swapApi";

interface DialPadItem {
    value: string;
    onPress: (value: DialPadItem["value"]) => void;
}

const { width } = Dimensions.get("window");

const dialPad: DialPadItem["value"][] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

const dialPadSize = width * 0.2;
const pinLength = 4;

export default function PassCodeScreen() {
    const {
        modeTypeParam,
        fromParam,
        mnemonic,
        amount,
        recipient,
        contractAddress,
        decimalChain,
        tokenName,
        tokenSymbol,
        tokenBalance,
        fromToken,
        toToken,
        fromTokenAddress,
        toTokenAddress,
        tokenAddress,
        isTokenToStablecoin,
        isStablecoinToToken,
    } = useLocalSearchParams<{
        modeTypeParam?: string;
        fromParam?: string;
        mnemonic?: string;
        amount?: string;
        recipient?: string;
        contractAddress?: string;
        decimalChain?: string;
        tokenName?: string;
        tokenSymbol?: string;
        tokenBalance?: string;
        fromToken?: string;
        toToken?: string;
        fromTokenAddress?: string;
        toTokenAddress?: string;
        isTokenToStablecoin?: string;
        isStablecoinToToken?: string;
        tokenAddress?: string;
    }>();

    const decimalChainAsNumber: number | undefined = decimalChain ? parseInt(decimalChain) : undefined;

    const { user } = useCustodialAuthStore();
    const { walletType } = useWalletTypeStore();

    const [pinCode, setPinCode] = useState<string[]>([]);
    const [createdPinCode, setCreatedPinCode] = useState<string[]>([]);
    const [isPinMatch, setIsPinMatch] = useState<boolean | null>(null);
    let [mode, setMode] = useState<string>(modeTypeParam!);
    let [from] = useState<string>(fromParam!);

    const [showLoadingModal, setShowLoadingModal] = useState<boolean>(false);

    const { sendTransaction } = useWalletTransactions();

    const handleSendOperation = async () => {
        setShowLoadingModal(true);
        try {
            if (walletType === "custodial") {
                const transferRequest: TokenTransferRequest = {
                    tokenAddress: contractAddress!,
                    toAddress: recipient!,
                    amount: parseFloat(amount!),
                };

                await swapApi.transferToken(transferRequest);
                await new Promise(resolve => setTimeout(resolve, 800));
                setShowLoadingModal(false);
                setTimeout(() => {
                    Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "Success",
                        textBody: "Transfer completed successfully",
                        button: "Close",
                        autoClose: 3000,
                    });
                }, 1000);

                setTimeout(() => {
                    router.replace({ pathname: "/(auth)/home/success" });
                }, 3500);
            } else {
                const hash = await sendTransaction(recipient!, amount!);
                if (hash) {
                    await new Promise(resolve => setTimeout(resolve, 800));
                    setShowLoadingModal(false);
                    setTimeout(() => {
                        Dialog.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: "Success",
                            textBody: "Transfer completed successfully",
                            button: "Close",
                            autoClose: 3000,
                        });
                    }, 1000);

                    setTimeout(() => {
                        router.replace({ pathname: "/(auth)/home/success" });
                    }, 3500);
                }
            }
        } catch (error: any) {
            console.error("Send operation failed:", error);
            await new Promise(resolve => setTimeout(resolve, 800));
            setShowLoadingModal(false);
            setTimeout(() => {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Error",
                    textBody: error.message || "Transfer failed",
                    button: "Close",
                    autoClose: 3000,
                });
            }, 1000);
        }
    };

    const handleSwapOperation = async () => {
        setShowLoadingModal(true);
        try {
            let response;
            if (isTokenToStablecoin === "true") {
                console.log("Attempting token to stablecoin swap:", {
                    tokenAddress: fromTokenAddress,
                    amount: amount,
                });
                response = await swapApi.swapTokenToStablecoin({
                    tokenAddress: fromTokenAddress!,
                    amount: parseFloat(amount!),
                });
            } else if (isStablecoinToToken === "true") {
                console.log("Attempting stablecoin to token swap:", {
                    tokenAddress: toTokenAddress,
                    amount: amount,
                });
                response = await swapApi.swapStablecoinToToken({
                    tokenAddress: toTokenAddress!,
                    amount: parseFloat(amount!),
                });
            }

            console.log("Swap response:", response);
            await new Promise(resolve => setTimeout(resolve, 800));
            setShowLoadingModal(false);
            setTimeout(() => {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Success",
                    textBody: `Successfully swapped ${amount} ${fromToken} to ${toToken}`,
                    button: "Close",
                    autoClose: 3000,
                });
            }, 1000);

            setTimeout(() => {
                router.replace({ pathname: "/(auth)/home/success" });
            }, 3500);
        } catch (error: any) {
            console.error("Swap API Error:", error);
            let errorMessage = "Failed to complete swap";
            if (error.response?.data?.error) {
                try {
                    const errorData = JSON.parse(error.response.data.message);
                    if (errorData.reason) {
                        errorMessage = errorData.reason;
                    }
                } catch (e) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            await new Promise(resolve => setTimeout(resolve, 800));
            setShowLoadingModal(false);
            setTimeout(() => {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Error",
                    textBody: errorMessage,
                    button: "Close",
                    autoClose: 3000,
                });
            }, 1000);
        }
    };

    const handlePress = async (value: DialPadItem["value"]) => {
        if (value === "del") {
            setPinCode(prev => prev.slice(0, -1));
            setIsPinMatch(null);
        } else if (typeof value === "string" && pinCode.length < pinLength) {
            const newPinCode = [...pinCode, value];

            setPinCode(newPinCode);

            if (mode === "create" && newPinCode.length === pinLength) {
                setCreatedPinCode(newPinCode);
                setMode("confirm");
                setPinCode([]);
                const resultPinCode = newPinCode.join("");
                await ExpoSecureStoreAdapter.setItem("pin_code", resultPinCode);
            } else if (mode === "set" && newPinCode.length === pinLength) {
                setCreatedPinCode(newPinCode);
                const resultPinCode = newPinCode.join("");
                await ExpoSecureStoreAdapter.setItem("pin_code", resultPinCode);
                setMode("confirm");
                setPinCode([]);
            } else if (mode === "confirm" && newPinCode.length === pinLength) {
                const getPin = await ExpoSecureStoreAdapter.getItem("pin_code");
                const enteredPin = newPinCode.join("");

                if (getPin && getPin === enteredPin) {
                    if (from === "swap") {
                        await handleSwapOperation();
                    } else if (from === "send") {
                        await handleSendOperation();
                    } else if (from === "custodial") {
                        setShowLoadingModal(true);
                        try {
                            await new Promise(resolve => setTimeout(resolve, 800));
                            setShowLoadingModal(false);
                            setTimeout(() => {
                                Dialog.show({
                                    type: ALERT_TYPE.SUCCESS,
                                    title: "Success",
                                    textBody: "Wallet setup completed successfully",
                                    button: "Close",
                                    autoClose: 3000,
                                });
                            }, 1000);

                            setTimeout(() => {
                                router.replace({
                                    pathname: "/(auth)/home/(tabs)/wallet",
                                    params: {
                                        mnemonicParam: mnemonic,
                                        isDualWallet: "true",
                                    },
                                });
                            }, 3500);
                        } catch (error: any) {
                            await new Promise(resolve => setTimeout(resolve, 800));
                            setShowLoadingModal(false);
                            setTimeout(() => {
                                Dialog.show({
                                    type: ALERT_TYPE.WARNING,
                                    title: "Error",
                                    textBody: error.message || "Operation failed",
                                    button: "Close",
                                    autoClose: 3000,
                                });
                            }, 1000);
                        }
                    } else if (from === "createMnemonic" || from === "importMnemonic") {
                        setShowLoadingModal(true);
                        try {
                            await ExpoSecureStoreAdapter.setItem("wallet_mnemonic", mnemonic!);
                            await new Promise(resolve => setTimeout(resolve, 800));
                            setShowLoadingModal(false);
                            setTimeout(() => {
                                Dialog.show({
                                    type: ALERT_TYPE.SUCCESS,
                                    title: "Success",
                                    textBody: "Wallet setup completed successfully",
                                    button: "Close",
                                    autoClose: 3000,
                                });
                            }, 1000);

                            setTimeout(() => {
                                router.replace({
                                    pathname: "/(auth)/home/(tabs)/wallet",
                                    params: { mnemonicParam: mnemonic },
                                });
                            }, 3500);
                        } catch (error: any) {
                            await new Promise(resolve => setTimeout(resolve, 800));
                            setShowLoadingModal(false);
                            setTimeout(() => {
                                Dialog.show({
                                    type: ALERT_TYPE.WARNING,
                                    title: "Error",
                                    textBody: error.message || "Operation failed",
                                    button: "Close",
                                    autoClose: 3000,
                                });
                            }, 1000);
                        }
                    }
                } else {
                    setIsPinMatch(false);
                    setPinCode([]);
                }
            }
        }
    };

    const DialPad = ({ onPress }: { onPress: (value: DialPadItem["value"]) => void }) => {
        return (
            <>
                <View style={{ height: 420 }}>
                    <FlatList
                        data={dialPad}
                        numColumns={3}
                        className="flex-grow"
                        keyExtractor={(_, index) => index.toString()}
                        scrollEnabled={false}
                        columnWrapperStyle={{ gap: 30 }}
                        contentContainerStyle={{ gap: 30 }}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity onPress={() => onPress(item)} disabled={item === ""}>
                                    <View
                                        style={{
                                            width: dialPadSize,
                                            height: dialPadSize,
                                            borderRadius: dialPadSize / 2,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {item === "del" ? (
                                            <Ionicons name="backspace-outline" size={dialPadSize / 2} color="black" />
                                        ) : item === "" ? (
                                            <View></View>
                                        ) : (
                                            <Text
                                                style={{
                                                    fontSize: dialPadSize / 2,
                                                    color: "black",
                                                    fontFamily: "SpaceGrotesk-Regular",
                                                }}
                                            >
                                                {item}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </>
        );
    };

    return (
        <View className="flex flex-1 justify-center items-center bg-white">
            <View className="w-10/12 items-center">
                <Text className="text-center text-secondary font-SpaceGroteskBold text-2xl mb-2">
                    {mode === "create" || mode === "set" ? "Create Passcode" : "Confirm Passcode"}
                </Text>
                <Text className="text-center text-gray-500 text-base mb-10 font-SpaceGroteskRegular">
                    Enter your passcode. Be sure to remember it so you can unlock your wallet.
                </Text>
            </View>
            <View className="flex flex-row gap-5 mb-10 h-7 items-end">
                {[...Array(pinLength).keys()].map(index => {
                    const isSelected = !!pinCode[index];

                    return (
                        <View
                            key={index}
                            style={{
                                width: 22,
                                height: isSelected ? 22 : 2,
                                borderRadius: 22,
                                backgroundColor: Colors.primary,
                            }}
                        />
                    );
                })}
            </View>

            {showLoadingModal && <LoadingModal modalVisible={showLoadingModal} color={Colors.primary} />}

            <DialPad onPress={handlePress} />
            {mode === "confirm" && isPinMatch !== null && (
                <Text className="text-red-500 top-7 font-SpaceGroteskMedium">
                    {isPinMatch ? "" : "Passcode does not match"}
                </Text>
            )}
        </View>
    );
}
