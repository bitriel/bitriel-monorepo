import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import getHeaderContainerStyle from "./getHeaderContainerStyle";

interface Props {
  nomargin?: boolean | undefined;
  openDrawer: () => void;
}

const SecondaryHeader: React.FC<Props> = ({ nomargin = false, openDrawer }) => (
  <View
    style={[
      {
        height: 45,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 13
      },
      getHeaderContainerStyle(nomargin)
    ]}>
    <TouchableOpacity onPress={openDrawer}>
      <View className="flex-row items-center">
        <Image source={require("~Assets/bitriel-logo.png")} resizeMode="contain" className="w-7" />
        <Text className="font-SpaceGroteskBold text-lg ml-2 text-blackText">Bitriel</Text>
      </View>
    </TouchableOpacity>
  </View>
);

export default SecondaryHeader;
