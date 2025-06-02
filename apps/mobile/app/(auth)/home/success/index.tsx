import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LottieView from "lottie-react-native";
import { router } from "expo-router";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";

export default function TransactionSuccess() {
  const [mnemonic, setMnemonic] = useState<string | null>(null);

  useEffect(() => {
    const fetchMnemonic = async () => {
      const mnemonicKey = await ExpoSecureStoreAdapter.getItem("wallet_mnemonic");

      setMnemonic(mnemonicKey);
    };
    fetchMnemonic();
  }, []);

  return (
    <View className="bg-white items-center justify-center gap-10 flex-1">
      <LottieView
        autoPlay
        style={{
          width: 200,
          height: 200
        }}
        source={require("~Assets/animations/success.json")}
      />

      <Text className="font-SpaceGroteskSemiBold text-base text-black">Token were successfully transferred.</Text>

      <TouchableOpacity
        className="bg-yellow mx-3 p-3 rounded-xl w-3/4"
        onPress={() => {
          router.navigate({ pathname: "/(auth)/home/(tabs)/wallet", params: { mnemonicParam: mnemonic } });
        }}>
        <Text className="text-base text-center text-white font-SpaceGroteskBold">Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
