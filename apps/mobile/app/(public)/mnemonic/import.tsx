import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, ScrollView, Platform } from "react-native";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import { validateMnemonic } from "@bitriel/wallet-sdk/src/utils/mnemonic";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import Colors from "~/src/constants/Colors";

export default function ImportSecretPhraseScreen() {
  const [enteredMnemonic, setEnteredMnemonic] = useState<string>("");

  const handlePasteFromClipboard = async () => {
    const clipboardContent = await Clipboard.getStringAsync();
    setEnteredMnemonic(clipboardContent);
  };

  const importWallet = () => {
    const trimmedMnemonic = enteredMnemonic.trimEnd();

    const isValidMnemonic = validateMnemonic(trimmedMnemonic);

    if (isValidMnemonic) {
      router.push({
        pathname: "/(public)/passcode",
        params: {
          modeTypeParam: "create",
          fromParam: "importMnemonic",
          mnemonic: trimmedMnemonic
        }
      });
    } else {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Invalid secret recovery phrase",
        button: "Close"
      });
    }
  };

  return (
    <View className="bg-white flex-1 p-5 justify-between">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}>
        <View>
          <Text className="mb-2 text-black font-SpaceGroteskBold">Secret Phrase</Text>

          <KeyboardAvoidingView>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              className="h-3/5 border-yellow border mb-4 px-3 py-4 text-base rounded-lg"
              onChangeText={(text) => setEnteredMnemonic(text)}
              value={enteredMnemonic}
              multiline={true}
              placeholder="Enter your Secret Phrase"
              placeholderTextColor={Colors.defaultText}
              textAlignVertical="top"
            />

            <TouchableOpacity className="items-end" onPress={handlePasteFromClipboard}>
              <Text className="text-base text-darkBlue font-SpaceGroteskBold">Paste</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>

          <Text className="text-center font-SpaceGroteskRegular">Typically 12 (sometimees 18, 24) words separated by single spaces</Text>
        </View>

        <TouchableOpacity className="bg-yellow p-5 mt-5 rounded-xl" onPress={importWallet}>
          <Text className="text-base text-center text-darkBlue font-SpaceGroteskBold">Import Wallet</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
