import { Dimensions, FlatList, Platform, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import Colors from "~/src/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import LoadingModal from "~/components/Loading";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";

interface DialPadItem {
    value: string;
    onPress: (value: DialPadItem["value"]) => void;
}

const { width } = Dimensions.get("window");

const dialPad: DialPadItem["value"][] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

const dialPadSize = width * 0.2;
const pinLength = 4;

export default function PassCodeScreen() {
    const { modeTypeParam, fromParam, mnemonic } = useLocalSearchParams<{
        modeTypeParam?: string;
        fromParam?: string;
        mnemonic?: string;
    }>();

    const [pinCode, setPinCode] = useState<string[]>([]);
    const [createdPinCode, setCreatedPinCode] = useState<string[]>([]); // Store the PIN created in 'create' mode
    const [isPinMatch, setIsPinMatch] = useState<boolean | null>(null); // Used in confirm mode
    let [mode, setMode] = useState<string>(modeTypeParam!);
    let [from] = useState<string>(fromParam!);

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
                await ExpoSecureStoreAdapter.setItem("pin_code", resultPinCode);
            } else if (mode === "set" && newPinCode.length === pinLength) {
                // Store the first entered pin code and switch to confirm mode
                setCreatedPinCode(newPinCode);
                const resultPinCode = newPinCode.join("");
                await ExpoSecureStoreAdapter.setItem("pin_code", resultPinCode);
                setMode("confirm");
                setPinCode([]);
            } else if (mode === "confirm" && newPinCode.length === pinLength) {
                // In confirm mode, check if the pin matches the original
                const getPin = await ExpoSecureStoreAdapter.getItem("pin_code");
                const enteredPin = newPinCode.join("");

                if (getPin && getPin === enteredPin) {
                    // Navigate to wallet screen based on the flow
                    if (from === "custodial") {
                        // For custodial flow, navigate to wallet screen
                        router.replace({
                            pathname: "/(auth)/home/(tabs)/wallet",
                            params: {
                                mnemonicParam: mnemonic,
                                isDualWallet: "true",
                            },
                        });
                    } else if (from === "createMnemonic" || from === "importMnemonic") {
                        // For non-custodial flow
                        await ExpoSecureStoreAdapter.setItem("wallet_mnemonic", mnemonic!);
                        router.replace({
                            pathname: "/(auth)/home/(tabs)/wallet",
                            params: { mnemonicParam: mnemonic },
                        });
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
                <Text className="text-center text-darkBlue font-SpaceGroteskBold text-2xl mb-2">
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
                                backgroundColor: Colors.yellow,
                            }}
                        />
                    );
                })}
            </View>

            <DialPad onPress={handlePress} />
            {mode === "confirm" && isPinMatch !== null && (
                <Text className="text-red-500 top-7 font-SpaceGroteskMedium">
                    {isPinMatch ? "" : "Passcode does not match"}
                </Text>
            )}
        </View>
    );
}
