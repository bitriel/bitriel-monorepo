import React from "react";
import { View, TouchableOpacity } from "react-native";
import getHeaderContainerStyle from "./getHeaderContainerStyle";
import { router } from "expo-router";
import { IconSettings, IconChevronDown, IconQrcode } from "@tabler/icons-react-native";
import { Image } from "expo-image";
import { ThemedView } from "~/components/ThemedView";
import { ThemedText } from "~/components/ThemedText";
import { useAppTheme } from "~/src/context/ThemeProvider";

interface Props {
    nomargin?: boolean | undefined;
    handleOpenBottomSheet: () => void;
    selectedNetworkLabel: string | null;
    selectedNetworkImage: string | null;
    networkChainName: string | null;
    networkChainImage: string | null;
}

const MainHeader: React.FC<Props> = ({
    nomargin = false,
    handleOpenBottomSheet,
    selectedNetworkLabel,
    selectedNetworkImage,
    networkChainName,
    networkChainImage,
}) => {
    const { getColor } = useAppTheme();
    const iconColor = getColor("text.secondary");
    const textColor = getColor("text.primary");
    const borderColor = getColor("border.accent");

    return (
        <ThemedView
            variant="primary"
            style={[
                {
                    height: 50,
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 13,
                },
                getHeaderContainerStyle(nomargin),
            ]}
        >
            <TouchableOpacity onPress={() => router.push({ pathname: "/(auth)/home/settings" })}>
                <IconSettings size={28} color={iconColor} />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    handleOpenBottomSheet();
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 2,
                        borderColor: borderColor,
                        paddingHorizontal: 8,
                        margin: 8,
                        borderRadius: 20,
                        paddingVertical: 4,
                    }}
                >
                    {networkChainImage && ( // Display network image if available
                        <Image
                            source={{ uri: selectedNetworkImage || networkChainImage }}
                            contentFit="contain"
                            style={{ width: 20, height: 20 }}
                        />
                    )}

                    <ThemedText
                        variant="primary"
                        style={{
                            fontFamily: "SpaceGrotesk-SemiBold",
                            padding: 4,
                            fontSize: 14,
                        }}
                    >
                        {selectedNetworkLabel || networkChainName}
                    </ThemedText>

                    <IconChevronDown color={textColor} size={18} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push({ pathname: "/(auth)/home/qrScanner", params: { from: "home" } })}
            >
                <IconQrcode size={28} color={iconColor} />
            </TouchableOpacity>
        </ThemedView>
    );
};

export default MainHeader;
