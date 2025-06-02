import React, { useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";

interface TokenLogoProps {
    logoURI?: string;
    size?: number;
}

const TokenLogo: React.FC<TokenLogoProps> = ({ logoURI, size = 40 }) => {
    const [hasImageFailed, setHasImageFailed] = useState(false);

    return (
        <View
            className="rounded-full items-center justify-center"
            style={{
                width: size,
                height: size,
                backgroundColor: logoURI && !hasImageFailed ? "#f3f4f6" : "#000",
            }}
        >
            <Image
                source={logoURI && !hasImageFailed ? { uri: logoURI } : require("~Assets/logos/sel-white.png")}
                contentFit="contain"
                style={{ width: size * 0.8, height: size * 0.8, borderRadius: size / 2 }}
                onError={() => setHasImageFailed(true)}
            />
        </View>
    );
};

export default TokenLogo;
