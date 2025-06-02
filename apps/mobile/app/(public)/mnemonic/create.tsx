import React, { useCallback, useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MnemonicBox from "~/components/Mnemonic/MnemonicBox";
import Colors from "~/src/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";
import NeverShareMsgBottomSheet from "~/components/BottomSheet/NeverShareMsgBottomSheet";
import { router } from "expo-router";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { BitrielWalletSDK } from "@bitriel/wallet-sdk";
import { AlertTriangle, ArrowRight } from "lucide-react-native";

export default function SecretPhraseScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenBottomSheet = () => bottomSheetRef.current?.expand();

  const [mnemonicsArray, setMnemonicsArray] = useState<string[]>([]);
  const [mnemonicUser, setMnemonicUser] = useState<string | undefined>(undefined);

  const generateMnemonic = () => {
    const mnemonic = BitrielWalletSDK.createMnemonic();
    setMnemonicsArray((prevMnemonics) => [...prevMnemonics, mnemonic]);
    setMnemonicUser(mnemonic);
  };

  const [visible, setVisible] = useState(false);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  useEffect(() => {
    generateMnemonic();
  }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-white min-h-full justify-between py-5 px-2">
          <View className="mb-5">
            <Text className="text-2xl font-bold text-center mb-2">Secret Recovery Phrase</Text>
            <Text className="text-base text-darkBlue text-center">
              This is the only way you will be able to recover your account. Please store it somewhere safe
            </Text>
          </View>

          <View>
            {mnemonicsArray.map((mnemonic, index) => (
              <MnemonicBox key={index} mnemonic={mnemonic} />
            ))}
          </View>

          <SafeAreaView className="mx-2 my-5">
            <TouchableOpacity onPress={handleOpenBottomSheet}>
              <View className="bg-yellow/20 p-4 rounded-lg flex-row justify-between items-center mb-5">
                <AlertTriangle size={18} color={Colors.yellow} className="mx-2" />
                <Text className="flex-1 ml-2 text-yellow">Never share your secret phrase with anyone, and store it secretly!</Text>
                <ArrowRight size={18} color={Colors.darkBlue} className="mx-2" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-yellow p-4 rounded-lg"
              onPress={() => {
                setVisible(true);
              }}>
              <Text className="text-darkBlue text-base font-bold text-center">OK, I saved it somewhere</Text>
            </TouchableOpacity>

            {visible && (
              <View className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <View className="bg-white p-5 rounded-lg w-4/5">
                  <View className="gap-3">
                    <View className="gap-2">
                      <Text className="text-center text-xl text-darkBlue font-bold">Written the Secret Recovery Phrase down?</Text>

                      <Text className="text-center text-base text-defaultText">
                        Without the secret recovery phrase you will not be able to access your key or any assets associated with it.
                      </Text>
                    </View>

                    <View className="flex-row justify-center gap-2">
                      <TouchableOpacity className="flex-1" onPress={() => setVisible(false)}>
                        Cancel
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1"
                        onPress={() => {
                          setVisible(false);
                          router.push({
                            pathname: "/(public)/passcode",
                            params: {
                              modeTypeParam: "create",
                              fromParam: "importMnemonic",
                              mnemonic: mnemonicUser!
                            }
                          });
                        }}>
                        Yes
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </SafeAreaView>

          <NeverShareMsgBottomSheet ref={bottomSheetRef} handleCloseBottomSheet={handleCloseBottomSheet} />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
