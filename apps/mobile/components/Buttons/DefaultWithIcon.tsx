import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Colors from "~/src/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";

type FontAwesomeIconName = React.ComponentProps<typeof FontAwesome>["name"];

interface Props {
  label: string;
  icon: FontAwesomeIconName;
  onPress: () => void;
}

const DefaultWithIcon: React.FC<Props> = ({ label, icon, onPress }) => {
  return (
    <TouchableOpacity
      className="bg-yellow flex-row py-4 justify-center items-center flex-1 rounded-lg mx-1"
      onPress={() => (onPress ? onPress() : {})}>
      <Text className="font-SpaceGroteskBold mr-2 text-darkBlue">{label}</Text>
      <FontAwesome name={icon} color={Colors.darkBlue} />
    </TouchableOpacity>
  );
};
export default DefaultWithIcon;
