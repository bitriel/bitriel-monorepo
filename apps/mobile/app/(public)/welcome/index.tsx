import React from "react";
import { View, SafeAreaView, Text, Dimensions, StatusBar, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Welcome = () => {
    return (
        <SafeAreaView className="flex-1 bg-[#1a1a1a]">
            <StatusBar barStyle="light-content" />
            <Image source={require("~Assets/svg/modern-crypto-bg.svg")} style={styles.artwork} contentFit="cover" />

            <View className="flex-1 p-6 justify-between">
                <View className="mt-10 items-center">
                    <Image source={require("~Assets/bitriel-logo.png")} style={styles.logo} />
                    <Text className="text-3xl font-bold text-white mb-3 text-center">Bitriel Wallet</Text>
                    <Text className="text-base text-[#b3b3b3] leading-6 text-center mb-10">
                        Your gateway to the Selendra ecosystem.{"\n\n"}
                        Experience secure wallet assets with Bitriel.
                    </Text>
                </View>

                <View className="mb-5">
                    <View className="mb-6">
                        <View className="gap-3">
                            <TouchableOpacity
                                className="bg-[#007AFF] rounded-xl p-4 shadow-lg shadow-[#007AFF]/30"
                                onPress={() =>
                                    router.push({
                                        pathname: "/(public)/passcode",
                                        params: {
                                            modeTypeParam: "create",
                                            fromParam: "createWallet",
                                        },
                                    })
                                }
                            >
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-white text-base font-semibold text-center flex-1">
                                        Create new wallet
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-transparent rounded-xl p-4"
                                onPress={() =>
                                    router.push({
                                        pathname: "/(public)/passcode",
                                        params: {
                                            modeTypeParam: "create",
                                            fromParam: "restoreWallet",
                                        },
                                    })
                                }
                            >
                                <Text className="text-white text-base font-semibold text-center">I have a wallet</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    artwork: {
        position: "absolute",
        width: windowWidth,
        height: windowHeight,
        opacity: 0.15,
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 16,
    },
});

export default Welcome;
