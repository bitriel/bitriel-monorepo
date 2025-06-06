import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Cloud, Lock, ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";

export default function RestoreWalletScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-row justify-between items-center px-6 py-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-lg font-bold text-gray-800">Cancel</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="flex-1 px-6 pt-8">
                <View className="mb-12">
                    <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">Restore Your Wallet</Text>
                    <Text className="text-lg text-gray-600 text-center leading-6">
                        Choose how you'd like to restore your wallet backup
                    </Text>
                </View>

                {/* Restore Options */}
                <View className="gap-4">
                    {/* Email & Phone Backup Option */}
                    <TouchableOpacity
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 active:bg-gray-50"
                        activeOpacity={0.7}
                        onPress={() =>
                            router.push({
                                pathname: "/(public)/custodial/setup",
                                params: { isRestore: "true" },
                            })
                        }
                    >
                        <View className="flex-row items-start">
                            <View className="bg-blue-50 rounded-full p-3 mr-4">
                                <Cloud size={24} color="#2563EB" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xl font-semibold text-gray-900 mb-2">Digital ID</Text>
                                <Text className="text-base text-gray-600 leading-5">
                                    Restore using your registered Single Sign-On (SSO)
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Recovery Phrase Option */}
                    <TouchableOpacity
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 active:bg-gray-50"
                        activeOpacity={0.7}
                        onPress={() => router.push({ pathname: "/(public)/mnemonic/import" })}
                    >
                        <View className="flex-row items-start">
                            <View className="bg-purple-50 rounded-full p-3 mr-4">
                                <Lock size={24} color="#7C3AED" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xl font-semibold text-gray-900 mb-2">Recovery Phrase</Text>
                                <Text className="text-base text-gray-600 leading-5">
                                    Enter your 12-word recovery phrase to restore your wallet
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
