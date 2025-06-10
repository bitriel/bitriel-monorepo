import { Dimensions, FlatList, Platform, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Colors from "~/src/constants/Colors";
import { Stack, router, useLocalSearchParams } from "expo-router";
import LoadingModal from "~/components/Loading";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { useWalletTransactions } from "~/src/store/useWalletStore";

interface DialPadItem {
    value: string;
    onPress: (value: DialPadItem["value"]) => void;
}

const { width } = Dimensions.get("window");

const dialPad: DialPadItem["value"][] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

const dialPadSize = width * 0.2;
const pinLength = 4;

export default function PassCodeScreen() {
    const { modeTypeParam, fromParam, mnemonic, amount, recipient, contractAddress, decimalChain } =
        useLocalSearchParams<{
            modeTypeParam?: string;
            fromParam?: string;
            mnemonic?: string;
            amount?: string;
            recipient?: string;
            contractAddress?: string;
            decimalChain?: string;
        }>();

    const decimalChainAsNumber: number | undefined = decimalChain ? parseInt(decimalChain) : undefined;

    // const { networkName, networkRpc, networkChainId } = useNetwork();

    // const handleSubmitTransaction = async () => {
    //   try {
    //     if (networkName === "Selendra Network") {
    //       const selNativeTransactionHash = await selSubstrateTransaction(toAddress!, parseFloat(amount!));

    //       if (selNativeTransactionHash) {
    //         router.replace({ pathname: "/home/success/" });
    //       }
    //     }

    //     // if (networkName === "Selendra EVM") {
    //     //   if (contractAddress) {
    //     //     // Contract
    //     //     const evmContractTransactionHash = await multiChainContractTransaction(
    //     //       networkRpc!,
    //     //       networkChainId!,
    //     //       contractAddress!,
    //     //       toAddress!,
    //     //       amount!,
    //     //       decimalChainAsNumber!
    //     //     );
    //     //     if (evmContractTransactionHash) {
    //     //       router.replace({ pathname: "/home/success/" });
    //     //     }
    //     //   } else {
    //     //     // EVM Native
    //     //     const evmNativeTransactionHash = await multiChainTransaction(toAddress!, amount!, decimalChainAsNumber!, networkRpc!, networkChainId!);
    //     //     if (evmNativeTransactionHash) {
    //     //       router.replace({ pathname: "/home/success/" });
    //     //     }
    //     //   }
    //     // }

    //     // if (networkName === "Ethereum") {
    //     //   if (contractAddress!.toLowerCase() !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
    //     //     // Contract
    //     //     const evmContractTransactionHash = await multiChainContractTransaction(
    //     //       networkRpc!,
    //     //       networkChainId!,
    //     //       contractAddress!,
    //     //       toAddress!,
    //     //       amount!,
    //     //       decimalChainAsNumber!
    //     //     );
    //     //     if (evmContractTransactionHash) {
    //     //       router.replace({ pathname: "/home/success/" });
    //     //     }
    //     //   } else {
    //     //     // EVM Native
    //     //     const evmNativeTransactionHash = await multiChainTransaction(toAddress!, amount!, decimalChainAsNumber!, networkRpc!, networkChainId!);
    //     //     if (evmNativeTransactionHash) {
    //     //       router.replace({ pathname: "/home/success/" });
    //     //     }
    //     //   }
    //     // }

    //     // if (networkName === "Polygon") {
    //     //   if (contractAddress!.toLowerCase() !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
    //     //     // Contract
    //     //     const evmContractTransactionHash = await multiChainContractTransaction(
    //     //       networkRpc!,
    //     //       networkChainId!,
    //     //       contractAddress!,
    //     //       toAddress!,
    //     //       amount!,
    //     //       decimalChainAsNumber!
    //     //     );
    //     //     if (evmContractTransactionHash) {
    //     //       router.replace({ pathname: "/home/success/" });
    //     //     }
    //     //   } else {
    //     //     // EVM Native
    //     //     const evmNativeTransactionHash = await multiChainTransaction(toAddress!, amount!, decimalChainAsNumber!, networkRpc!, networkChainId!);
    //     //     if (evmNativeTransactionHash) {
    //     //       router.replace({ pathname: "/home/success/" });
    //     //     }
    //     //   }
    //     // }

    //     // if (networkName === "Binance Smart Chain") {
    //     //   if (contractAddress!.toLowerCase() !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
    //     //     // Contract
    //     //     const evmContractTransactionHash = await multiChainContractTransaction(
    //     //       networkRpc!,
    //     //       networkChainId!,
    //     //       contractAddress!,
    //     //       toAddress!,
    //     //       amount!,
    //     //       decimalChainAsNumber!
    //     //     );
    //     //     if (evmContractTransactionHash) {
    //     //       router.replace({ pathname: "/home/success/" });
    //     //     }
    //     //   } else {
    //     //     // EVM Native
    //     //     const evmNativeTransactionHash = await multiChainTransaction(toAddress!, amount!, decimalChainAsNumber!, networkRpc!, networkChainId!);
    //     //     if (evmNativeTransactionHash) {
    //     //       router.replace({ pathname: "/home/success/" });
    //     //     }
    //     //   }
    //     // }
    //   } catch (error) {
    //     setIsLoading(false);
    //     setPinCode([]);
    //   }
    // };

    const [pinCode, setPinCode] = useState<string[]>([]);
    const [createdPinCode, setCreatedPinCode] = useState<string[]>([]); // Store the PIN created in 'create' mode
    const [isPinMatch, setIsPinMatch] = useState<boolean | null>(null); // Used in confirm mode
    let [mode, setMode] = useState<string>(modeTypeParam!);
    let [from] = useState<string>(fromParam!);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { sendTransaction } = useWalletTransactions();

    const handlePress = async (value: DialPadItem["value"]) => {
        if (value === "del") {
            setPinCode(prev => prev.slice(0, -1));
            setIsPinMatch(null);
        } else if (typeof value === "string" && pinCode.length < pinLength) {
            const newPinCode = [...pinCode, value];

            setPinCode(newPinCode);

            if (mode === "create" && newPinCode.length === pinLength) {
                // Store the first entered pin code and switch to confirm mode
                setCreatedPinCode(newPinCode); // Store the created PIN

                setMode("confirm");

                setPinCode([]);

                const resultPinCode = newPinCode.join("");

                ExpoSecureStoreAdapter.setItem("pin_code", resultPinCode);
            }

            // In confirm mode, check if the pin matches the original
            if (mode === "create" && newPinCode.length === pinLength) {
                // Store the first entered pin code and switch to confirm mode
                setCreatedPinCode(newPinCode); // Store the created PIN
                setMode("confirm");
                setPinCode([]);
            } else if (mode === "confirm" && newPinCode.length === pinLength) {
                // In confirm mode, check if the pin matches the original
                const getPin = await ExpoSecureStoreAdapter.getItem("pin_code");

                console.log("getPin: ", getPin);

                console.log("newPinCode: ", newPinCode.join(""));

                if (getPin && getPin === newPinCode.join("")) {
                    // Navigate to new screen if PIN matches
                    if (from === "createMnemonic" || from === "importMnemonic") {
                        await ExpoSecureStoreAdapter.setItem("wallet_mnemonic", mnemonic!);

                        router.navigate({
                            pathname: "/(auth)/home/(tabs)/wallet",
                            params: { mnemonicParam: mnemonic },
                        });
                    } else if (from === "send") {
                        setIsLoading(true);

                        const hash = await sendTransaction(
                            recipient!,
                            amount!,
                            contractAddress!,
                            decimalChain ? parseInt(decimalChain) : undefined
                        );

                        if (hash) {
                            router.replace({ pathname: "/(auth)/home/success" });
                        }
                    }
                } else {
                    setIsPinMatch(false);
                }
                setPinCode([]);
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
                    {mode === "create" ? "Create Passcode" : "Confirm Passcode"}
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

            {isLoading && <LoadingModal modalVisible={true} color={Colors.primary} />}

            <DialPad onPress={handlePress} />
            {mode === "confirm" && isPinMatch !== null && (
                <Text className="text-red-500 top-7 font-SpaceGroteskMedium">
                    {isPinMatch ? "" : "Passcode does not match"}
                </Text>
            )}
        </View>
    );
}
