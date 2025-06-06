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
            className="bg-primary flex-row py-4 justify-center items-center flex-1 rounded-lg mx-1"
            onPress={() => (onPress ? onPress() : {})}
        >
            <Text className="font-SpaceGroteskBold mr-2 text-secondary">{label}</Text>
            <FontAwesome name={icon} color={Colors.secondary} />
        </TouchableOpacity>
    );
};
export default DefaultWithIcon;
