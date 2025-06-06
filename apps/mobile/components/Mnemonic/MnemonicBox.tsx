import React, { useState, useCallback, useEffect } from "react";
import { Text, View, TouchableOpacity, Vibration, Animated } from "react-native";
import Colors from "~/src/constants/Colors";
import copyAddress from "~/src/utilities/copyClipboard";
import { Copy, Check, Eye, EyeOff } from "lucide-react-native";

type MnemonicBoxProps = {
    mnemonic: string;
};

const SkeletonWord: React.FC = () => {
    const animatedValue = new Animated.Value(0);

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: false,
                }),
            ])
        );
        animation.start();

        return () => animation.stop();
    }, []);

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#d1d5db", "#e5e7eb"],
    });

    return (
        <Animated.View
            style={{
                backgroundColor,
                height: 16,
                borderRadius: 4,
                width: "100%",
            }}
        />
    );
};

const MnemonicBox: React.FC<MnemonicBoxProps> = ({ mnemonic }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);

    const copyToClipboard = useCallback(async () => {
        try {
            copyAddress(mnemonic);
            setIsCopied(true);
            Vibration.vibrate(50); // Haptic feedback on iOS/Android

            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy to clipboard:", error);
        }
    }, [mnemonic]);

    const toggleReveal = useCallback(() => {
        setIsRevealed(prev => !prev);
    }, []);

    const mnemonicWords = mnemonic.split(" ");

    return (
        <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            {/* Header with reveal toggle */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-gray-800">Recovery Phrase</Text>
                <TouchableOpacity
                    onPress={toggleReveal}
                    className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
                >
                    {isRevealed ? (
                        <EyeOff size={16} color={Colors.secondary} />
                    ) : (
                        <Eye size={16} color={Colors.secondary} />
                    )}
                    <Text className="ml-2 text-sm text-gray-600 font-medium">{isRevealed ? "Hide" : "Reveal"}</Text>
                </TouchableOpacity>
            </View>

            {/* Mnemonic Grid */}

            <View className="flex-row flex-wrap">
                {mnemonicWords.map((word, index) => (
                    <View key={index} className="w-1/2 p-2">
                        <View className="bg-white border border-gray-200 rounded-lg p-3 flex-row items-center shadow-sm">
                            <Text className="text-xs font-mono text-gray-400 w-6">
                                {(index + 1).toString().padStart(2, "0")}.
                            </Text>
                            <View className="flex-1 ml-2 items-center justify-center min-h-[20px]">
                                {isRevealed ? (
                                    <Text className="font-mono text-gray-800 text-center font-medium">{word}</Text>
                                ) : (
                                    <View className="w-full px-2">
                                        <SkeletonWord />
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Warning Message */}
            {!isRevealed && (
                <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <Text className="text-yellow-800 text-sm text-center">
                        Tap "Reveal" to view your recovery phrase
                    </Text>
                </View>
            )}

            {/* Copy Button */}
            <TouchableOpacity
                onPress={copyToClipboard}
                disabled={!isRevealed}
                className={`flex-row items-center justify-center py-3 px-4 rounded-lg ${
                    isRevealed ? "bg-primary/10 border border-primary/20" : "bg-gray-100 border border-gray-200"
                }`}
            >
                {isCopied ? (
                    <>
                        <Check size={18} color={Colors.primary} />
                        <Text className="ml-2 font-semibold text-primary">Copied to Clipboard!</Text>
                    </>
                ) : (
                    <>
                        <Copy size={18} color={isRevealed ? Colors.primary : Colors.secondary} />
                        <Text className={`ml-2 font-semibold ${isRevealed ? "text-primary" : "text-gray-400"}`}>
                            {isRevealed ? "Copy to Clipboard" : "Reveal to Copy"}
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Security Note */}
            <View className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <Text className="text-red-800 text-xs text-center font-medium">
                    🔒 Keep this phrase private and secure. Anyone with access can control your wallet.
                </Text>
            </View>
        </View>
    );
};

export default MnemonicBox;
