import React, { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import {
    BottomSheetModal,
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import { TouchableOpacity, BackHandler, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { SUPPORTED_NETWORKS } from "@bitriel/wallet-sdk";
import { useWalletStore } from "~/src/store/useWalletStore";
import { Image } from "expo-image";
import { ThemedView } from "~/components/ThemedView";
import { ThemedText } from "~/components/ThemedText";
import { useAppTheme } from "~/src/context/ThemeProvider";

type Ref = BottomSheetModal;

interface BottomSheetProps {
    handleCloseBottomSheet: () => void;
}

const NetworkListItem = ({
    network,
    isSelected,
    onPress,
}: {
    network: (typeof SUPPORTED_NETWORKS)[0];
    isSelected: boolean;
    onPress: () => void;
}) => {
    const { getColor, getBrandColor } = useAppTheme();

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <ThemedView
                variant={isSelected ? "surface" : "card"}
                style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: getColor("border.secondary"),
                    backgroundColor: isSelected ? getBrandColor("primary", 50) : getColor("background.card"),
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                        style={{
                            position: "absolute",
                            width: 4,
                            left: -4,
                            borderRadius: 2,
                            height: "100%",
                            backgroundColor: isSelected ? getBrandColor("primary", 500) : "transparent",
                        }}
                    />
                    {network.logo && (
                        <Image
                            source={{ uri: network.logo }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                            contentFit="contain"
                        />
                    )}
                    <ThemedText
                        variant={isSelected ? "accent" : "primary"}
                        style={{
                            paddingHorizontal: 12,
                            fontSize: 16,
                            fontFamily: isSelected ? "SpaceGrotesk-Bold" : "SpaceGrotesk-Medium",
                        }}
                    >
                        {network.name}
                    </ThemedText>
                </View>
            </ThemedView>
        </TouchableOpacity>
    );
};

const ChangeNetworkBottomSheet = forwardRef<Ref, BottomSheetProps>((bottomSheetProp, ref) => {
    // Use optimized snap points for better list performance
    const snapPoints = useMemo(() => ["40%"], []);
    const [isShowing, setIsShowing] = useState<boolean>(false);
    const flatListRef = useRef<BottomSheetFlatListMethods>(null);
    const { currentNetwork, connectToNetwork } = useWalletStore();
    const { getColor, isDark } = useAppTheme();

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />,
        []
    );

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (isShowing) {
                    bottomSheetProp.handleCloseBottomSheet();
                    return true;
                }
                return false;
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, [isShowing, bottomSheetProp.handleCloseBottomSheet])
    );

    const handleNetworkSelect = useCallback(
        async (network: (typeof SUPPORTED_NETWORKS)[0]) => {
            await connectToNetwork(network.chainId.toString());
            bottomSheetProp.handleCloseBottomSheet();
        },
        [connectToNetwork, bottomSheetProp.handleCloseBottomSheet]
    );

    const renderItem = useCallback(
        ({ item }: { item: (typeof SUPPORTED_NETWORKS)[0] }) => (
            <NetworkListItem
                network={item}
                isSelected={currentNetwork?.chainId === item.chainId}
                onPress={() => handleNetworkSelect(item)}
            />
        ),
        [currentNetwork?.chainId, handleNetworkSelect]
    );

    const keyExtractor = useCallback((item: (typeof SUPPORTED_NETWORKS)[0]) => item.chainId.toString(), []);

    return (
        <BottomSheetModal
            ref={ref}
            snapPoints={snapPoints}
            index={1}
            onDismiss={() => setIsShowing(false)}
            onAnimate={(fromIndex, toIndex) => {
                setIsShowing(toIndex > -1);
            }}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{ backgroundColor: getColor("border.primary") }}
            backgroundStyle={{ backgroundColor: getColor("background.card") }}
        >
            <ThemedView variant="card" style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                <ThemedText
                    variant="primary"
                    style={{
                        textAlign: "center",
                        fontSize: 18,
                        fontFamily: "SpaceGrotesk-Bold",
                    }}
                >
                    Select a network
                </ThemedText>
            </ThemedView>

            <BottomSheetFlatList
                ref={flatListRef}
                data={SUPPORTED_NETWORKS}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </BottomSheetModal>
    );
});

export default ChangeNetworkBottomSheet;
