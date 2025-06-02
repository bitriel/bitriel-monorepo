import React from "react";
import { TouchableOpacity, Text } from "react-native";
import Colors from "~/src/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type FontAwesomeIconName = React.ComponentProps<typeof Ionicons>["name"];

interface Props {
  label: string;
  icon: FontAwesomeIconName;
  onPress: () => void;
}

const Transparent: React.FC<Props> = ({ label, onPress, icon }) => {
  return (
    <TouchableOpacity className="py-2 items-center flex-1 flex-row justify-center" onPress={() => (onPress ? onPress() : {})}>
      <Ionicons name={icon} color={Colors.blackText} size={20} />
      <Text className="text-darkBlue font-SpaceGroteskBold ml-2">{label}</Text>
    </TouchableOpacity>
  );
};

export default Transparent;
