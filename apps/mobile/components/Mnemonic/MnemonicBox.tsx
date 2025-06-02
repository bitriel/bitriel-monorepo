// MnemonicBox.tsx
import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Colors from "~/src/constants/Colors";
import copyAddress from "~/src/utilities/copyClipboard";
import { Iconify } from "react-native-iconify";

type MnemonicBoxProps = {
  mnemonic: string;
};

const MnemonicBox: React.FC<MnemonicBoxProps> = ({ mnemonic }) => {
  const [copy, setCopy] = useState(false);

  const copyToClipboard = () => {
    copyAddress(mnemonic);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 3000);
  };

  return (
    <View>
      <View className="border-yellow rounded-lg border p-5 mx-5 flex-row flex-wrap">
        {mnemonic.split(" ").map((item, index) => (
          <View key={index} className="flex-row items-center w-1/2 my-1">
            <Text className="w-1/6">{index + 1}.</Text>
            <View className="border border-yellow rounded-full h-9 justify-center items-center w-2/3">
              <Text>{item}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity className="mt-4" onPress={copyToClipboard}>
        <View className="flex justify-center items-center gap-3 flex-row">
          <Iconify icon="solar:copy-line-duotone" color={Colors.darkBlue} size={15} />
          <Text className="text-center text-darkBlue">{copy ? "Copied" : "Copy to Clipboard"}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MnemonicBox;
