import React from "react";
import Colors from "~/src/constants/Colors";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View, SafeAreaView, TouchableOpacity, Modal } from "react-native";
import { IconShieldHeart } from "@tabler/icons-react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function WarnMsgRecoveryPage() {
    const [checkboxState, setCheckboxState] = useState<Record<string, boolean>>({
        checkbox1: false,
        checkbox2: false,
        checkbox3: false,
    });

    const handleCheckboxPress = (checkboxKey: keyof typeof checkboxState) => {
        setCheckboxState(prev => ({
            ...prev,
            [checkboxKey]: !prev[checkboxKey],
        }));
    };

    const isAllCheckboxesChecked = Object.values(checkboxState).every(value => value);

    const [visible, setVisible] = useState(false);

    return (
        <View className="flex-1 bg-white">
            <View className="items-center flex-1">
                <View className="p-5 items-center">
                    <View className="bg-red-300/25 p-2 rounded-full m-5">
                        <IconShieldHeart color={Colors.red} size={50} />
                    </View>

                    <Text className="text-center text-2xl px-2 font-SpaceGroteskBold">Show secret phrase</Text>

                    <Text className="text-secondary text-center my-3 px-2 font-SpaceGroteskRegular">
                        Tap on all checkboxes to confirm you understand the importance of your secret phrase
                    </Text>
                </View>
            </View>

            <View className="flex-1 mx-3">
                <View className="gap-3">
                    <View className="bg-gray-50 p-4 rounded-xl">
                        <BouncyCheckbox
                            size={25}
                            fillColor={Colors.primary}
                            unFillColor={Colors.white}
                            text="Your secret phrase is the only way to recover your wallet. "
                            innerIconStyle={{ borderWidth: 2 }}
                            textStyle={{
                                textDecorationLine: "none",
                                fontSize: 15,
                                fontFamily: "SpaceGroteskRegular",
                            }}
                            onPress={() => handleCheckboxPress("checkbox1")}
                            isChecked={checkboxState.checkbox1}
                        />
                    </View>

                    <View className="bg-gray-50 p-4 rounded-xl">
                        <BouncyCheckbox
                            size={25}
                            fillColor={Colors.primary}
                            unFillColor={Colors.white}
                            text="Do not let anyone see your secret phrase"
                            innerIconStyle={{ borderWidth: 2 }}
                            textStyle={{
                                textDecorationLine: "none",
                                fontSize: 15,
                                fontFamily: "SpaceGroteskRegular",
                            }}
                            onPress={() => handleCheckboxPress("checkbox2")}
                            isChecked={checkboxState.checkbox2}
                        />
                    </View>

                    <View className="bg-gray-50 p-4 rounded-xl">
                        <BouncyCheckbox
                            size={25}
                            fillColor={Colors.primary}
                            unFillColor={Colors.white}
                            text="Never share your secret phrase with anyone"
                            innerIconStyle={{ borderWidth: 2 }}
                            textStyle={{
                                textDecorationLine: "none",
                                fontSize: 15,
                                fontFamily: "SpaceGroteskRegular",
                            }}
                            onPress={() => handleCheckboxPress("checkbox3")}
                            isChecked={checkboxState.checkbox3}
                        />
                    </View>
                </View>
            </View>

            <SafeAreaView>
                <TouchableOpacity
                    className={`bg-${isAllCheckboxesChecked ? "primary" : "primary/50"} p-4 m-3 rounded-xl ${!isAllCheckboxesChecked ? "opacity-50" : ""}`}
                    onPress={() => {
                        if (isAllCheckboxesChecked) {
                            setVisible(true);
                        }
                    }}
                    disabled={!isAllCheckboxesChecked}
                >
                    <Text className="text-base text-center text-secondary font-SpaceGroteskBold">Continue</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={() => setVisible(false)}>
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-2xl w-[80%] p-4">
                        <View className="gap-3">
                            <View className="gap-2">
                                <Text className="text-center text-xl text-secondary font-SpaceGroteskBold">
                                    Show secret recovery phrase
                                </Text>

                                <Text className="text-center text-base text-defaultText font-SpaceGroteskRegular">
                                    Are you sure you want to show your secret recovery phrase?
                                </Text>
                            </View>

                            <View className="flex-row justify-center gap-2">
                                <TouchableOpacity
                                    className="flex-1 bg-gray-100 p-3 rounded-lg"
                                    onPress={() => setVisible(false)}
                                >
                                    <Text className="text-center font-SpaceGroteskBold">Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-1 bg-primary p-3 rounded-lg"
                                    onPress={() => {
                                        setVisible(false);
                                        router.push({ pathname: "/(auth)/home/settings/account/recovery" });
                                    }}
                                >
                                    <Text className="text-center font-SpaceGroteskBold">Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
