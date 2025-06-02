import React from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "~/src/constants/Colors";

interface Props {
  onPress: () => void;
}

const AddNew: React.FC<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity className="bg-yellow justify-center items-center w-12 h-12 rounded-3xl mx-1" onPress={onPress}>
      <Feather name="plus" color={Colors.blackText} size={20} />
    </TouchableOpacity>
  );
};

export default AddNew;
