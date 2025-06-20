import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import getHeaderContainerStyle from "./getHeaderContainerStyle";
import Colors from "~/src/constants/Colors";
import { router } from "expo-router";
import { IconSettings, IconChevronDown, IconQrcode } from "@tabler/icons-react-native";
import { Image } from "expo-image";
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
}) => (
    <View
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
            <IconSettings size={28} color={Colors.secondary} />
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => {
                handleOpenBottomSheet();
            }}
        >
            <View className="flex-1 flex-row items-center border-primary border-2 px-2 m-2 rounded-full">
                {networkChainImage && ( // Display network image if available
                    <Image
                        source={{ uri: selectedNetworkImage || networkChainImage }}
                        contentFit="contain"
                        style={{ width: 20, height: 20 }}
                    />
                )}

                <Text className="font-SpaceGroteskSemiBold p-1 text-sm text-blackText">
                    {selectedNetworkLabel || networkChainName}
                </Text>

                <IconChevronDown color={Colors.blackText} size={18} />
            </View>
        </TouchableOpacity>

        <>
            <TouchableOpacity
                onPress={() => router.push({ pathname: "/(auth)/home/qrScanner", params: { from: "home" } })}
            >
                <IconQrcode size={28} color={Colors.secondary} />
            </TouchableOpacity>
        </>
    </View>
);

export default MainHeader;
