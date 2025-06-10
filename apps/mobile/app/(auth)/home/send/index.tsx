import { Ionicons } from "@expo/vector-icons";
import { DetailedBalance } from "@bitriel/wallet-sdk";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { PixelRatio, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Text } from "react-native";
import { Dialog, ALERT_TYPE } from "react-native-alert-notification";
import { Iconify } from "react-native-iconify";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedText from "~/components/AnimatedText";
import Balance from "~/components/Balance";
import NumberPad from "~/components/NumberPad";
import Recipient from "~/components/Recipient";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";
import Colors from "~/src/constants/Colors";
import useNumber from "~/src/hooks/useNumber";
import { useThemeColor } from "~/src/hooks/useThemeColor";
import { useWalletStore, useWalletTransactions } from "~/src/store/useWalletStore";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TransferScreen() {
    const { displayValue, appendDigit, addDecimalPoint, replaceDigit, deleteDigit, clearAll, replaceFullNumber } =
        useNumber();

    const text = useThemeColor({}, "text");
    const bg = useThemeColor({}, "background");
    const ripple = useThemeColor({}, "ripple");

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming(parseFloat(displayValue) === 0 ? text + "70" : text, { duration: 120 }),
        };
    });

    const { scannedData, tokenName, tokenBalance, tokenContract, tokenImage, decimalChain, currentNetwork } =
        useLocalSearchParams<{
            scannedData: string;
            tokenName: string;
            tokenBalance: string;
            tokenContract: string;
            tokenImage: string;
            decimalChain: string;
            currentNetwork: string;
        }>();

    const { estimateFee } = useWalletTransactions();

    const { getDetailedBalance } = useWalletStore();

    const [recipient, setRecipient] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [amountValid, setAmountValid] = useState<boolean>(true);
    const [estimatedFee, setEstimatedFee] = useState<string>("0");
    const [isEstimatingFee, setIsEstimatingFee] = useState<boolean>(false);
    const [balance, setBalance] = useState<DetailedBalance | null>(null);

    // Check if this is a native token (address is "0x0" or similar)
    const isNativeToken =
        !tokenContract ||
        tokenContract === "0x0" ||
        tokenContract.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

    const calculateFee = async (amt: string) => {
        if (!amt || !/^\d*\.?\d*$/.test(amt)) {
            setEstimatedFee("0");
            return;
        }

        setIsEstimatingFee(true);
        try {
            // Pass contract address and decimals for ERC-20 token fee estimation
            const fee = await estimateFee(amt, tokenContract, decimalChain ? parseInt(decimalChain) : undefined);
            setEstimatedFee(fee.formatted + " " + fee.currency);
        } catch (error) {
            console.error("Error estimating fee:", error);
            setEstimatedFee("0");
        } finally {
            setIsEstimatingFee(false);
        }
    };

    const handleAmountChange = (text: string) => {
        const validInput = /^\d*\.?\d*$/;
        setAmountValid(validInput.test(text));
        setAmount(text);
    };

    useEffect(() => {
        // Only get detailed balance for native tokens
        if (isNativeToken) {
            getDetailedBalance().then(balance => {
                setBalance(balance);
            });
        } else {
            // For custom tokens, create a mock DetailedBalance using the token balance
            const mockBalance: DetailedBalance = {
                total: "0", // We don't have this info for custom tokens
                locked: "0",
                transferable: tokenBalance || "0",
                formatted: {
                    total: "0",
                    locked: "0",
                    transferable: tokenBalance || "0",
                },
            };
            setBalance(mockBalance);
        }
    }, [tokenBalance, isNativeToken]);

    useEffect(() => {
        if (amount && amountValid) {
            calculateFee(amount);
        }
    }, [amount, amountValid]);

    useEffect(() => {
        if (scannedData) {
            const regexResult = scannedData.match(/^(0x[a-fA-F0-9]+)\?amount=(\d*)$/);
            if (regexResult) {
                const [, extractedAddress, extractedAmount] = regexResult;
                setRecipient(extractedAddress);
                setAmount(extractedAmount);
            }
        }
    }, [scannedData]);

    const sendTransaction = async () => {
        const availableBalance = isNativeToken ? balance?.formatted.transferable : tokenBalance;

        if (!displayValue || !recipient) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Attention",
                textBody: "All fields are required",
                button: "Close",
            });
        } else if (!amountValid) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Attention",
                textBody: "Invalid amount",
                button: "Close",
            });
        } else if (parseFloat(displayValue) > parseFloat(availableBalance || "0")) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: "Attention",
                textBody: "Insufficient balance",
                button: "Close",
            });
        } else {
            router.push({
                pathname: "passcode/",
                params: {
                    modeTypeParam: "confirm",
                    fromParam: "send",
                    amount: displayValue,
                    recipient: recipient,
                    contractAddress: tokenContract,
                    decimalChain: decimalChain,
                },
            } as never);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ThemedView style={styles.container}>
                <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Iconify icon="solar:arrow-left-linear" size={24} color={Colors.secondary} />
                    </TouchableOpacity>
                    <Text className="ml-4 text-xl font-SpaceGroteskBold text-gray-900">
                        Send {tokenName} on {currentNetwork || "Network"}
                    </Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.screen}
                    style={{ flex: 1, width: "100%" }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="mx-5">
                        <Text className="text-gray-500 text-base mb-2 font-SpaceGroteskMedium">Recipient</Text>
                        <View className="relative flex-row items-center bg-gray-100 rounded-lg">
                            <TextInput
                                className="flex-1 px-4 py-3 text-gray-900 font-SpaceGroteskRegular"
                                value={recipient}
                                onChangeText={setRecipient}
                                placeholder="Address"
                                placeholderTextColor="gray"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                className="px-2 justify-center items-center"
                                onPress={() =>
                                    recipient
                                        ? setRecipient("")
                                        : router.push({ pathname: "/(auth)/home/qrScanner", params: { from: "send" } })
                                }
                            >
                                <Ionicons
                                    name={recipient ? "close-circle-outline" : "qr-code-outline"}
                                    size={24}
                                    color={Colors.secondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <AnimatedText symbol={tokenName} size={66} style={[styles.textStyle, { color: text }]}>
                        {displayValue}
                    </AnimatedText>

                    <Balance
                        balance={balance}
                        onPress={() => {
                            if (balance?.formatted.transferable) {
                                replaceFullNumber(balance.formatted.transferable);
                            }
                        }}
                    />

                    <View className="mx-5">
                        <View className="flex-row justify-between items-center py-3 border-t border-gray-100">
                            <Text className="text-gray-500 text-base font-SpaceGroteskRegular">Network fee</Text>
                            <Text className="text-gray-900 text-base font-SpaceGroteskMedium">
                                {isEstimatingFee ? "Calculating..." : estimatedFee}
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                <NumberPad
                    onPress={digit => {
                        appendDigit(digit);
                    }}
                    onDot={() => {
                        addDecimalPoint();
                    }}
                    onClear={() => {
                        clearAll();
                    }}
                    onDelete={() => {
                        deleteDigit();
                    }}
                />

                <View
                    style={{
                        paddingHorizontal: 24,
                        width: "100%",
                        boxSizing: "border-box",
                        alignItems: "center",
                    }}
                >
                    <AnimatedPressable
                        onPress={sendTransaction}
                        style={[styles.continue, { backgroundColor: text }, buttonAnimatedStyle]}
                        android_ripple={{ color: ripple }}
                    >
                        <ThemedText style={{ color: bg }}>Continue</ThemedText>
                    </AnimatedPressable>
                </View>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    textStyle: {
        fontSize: PixelRatio.getPixelSizeForLayoutSize(32),
        fontFamily: "SpaceGrotesk-Bold",
        lineHeight: 100,
    },
    label: {
        fontSize: 18,
        opacity: 0.7,
        marginBottom: 8,
    },
    screen: {
        width: "100%",
        flexGrow: 1,
        paddingVertical: 12,
    },
    continue: {
        marginBottom: 24,
        marginTop: 12,
        height: 52,
        width: "100%",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
});
