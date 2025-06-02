import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface Props {
    label: string;

    onPress: () => void;
}

const Default: React.FC<Props> = ({ label, onPress }) => {
    return (
        <TouchableOpacity
            className="bg-yellow py-4 justify-center items-center rounded-lg"
            onPress={() => (onPress ? onPress() : {})}
        >
            <Text className="font-bold mr-2 font-SpaceGroteskBold">{label}</Text>
        </TouchableOpacity>
    );
};
export default Default;
