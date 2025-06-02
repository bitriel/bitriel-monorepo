import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface Props {
    label: string;
    onPress: () => void;
}

const Transparent: React.FC<Props> = ({ label, onPress }) => {
    return (
        <TouchableOpacity className="py-2 items-center flex-1 mx-1" onPress={() => (onPress ? onPress() : {})}>
            <Text className="text-blackText font-SpaceGroteskBold">{label}</Text>
        </TouchableOpacity>
    );
};

export default Transparent;
