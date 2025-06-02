import React from "react";
import { TouchableOpacity, Image, View } from "react-native";

interface Props {
    uri: string;
}

const MenuAvatar: React.FC<Props> = ({ uri }) => {
    return (
        <View className="h-11 w-11 mx-3 rounded-2xl bg-darkBlue">
            <Image
                source={{
                    uri,
                }}
                className="absolute inset-0 w-full h-full rounded-full"
                style={{
                    borderRadius: 21.5,
                }}
            />
        </View>
    );
};

export default MenuAvatar;
