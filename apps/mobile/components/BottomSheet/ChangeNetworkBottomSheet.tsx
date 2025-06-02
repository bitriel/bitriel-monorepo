import React, { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetFlatListMethods } from "@gorhom/bottom-sheet";
import Colors from "~/src/constants/Colors";
import { Text, View, TouchableOpacity, BackHandler } from "react-native";
import { useFocusEffect } from "expo-router";
import { SUPPORTED_NETWORKS } from "@bitriel/wallet-sdk";
import { useWalletStore } from "~/src/store/useWalletStore";
import { Image } from "expo-image";

type Ref = BottomSheet;

interface BottomSheetProps {
  handleCloseBottomSheet: () => void;
}

const NetworkListItem = ({ network, isSelected, onPress }: { network: (typeof SUPPORTED_NETWORKS)[0]; isSelected: boolean; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`${isSelected ? "bg-blue-950/95" : "bg-white"}`}
    style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: Colors.darkBlue }}>
    <View className="flex-row items-center">
      <View className={`${isSelected ? "bg-yellow" : "bg-transparent"} absolute w-1 -ml-1 rounded-full h-full`} />
      {network.logo && <Image source={{ uri: network.logo }} style={{ width: 40, height: 40 }} className="rounded-full" contentFit="contain" />}
      <Text className={`px-3 text-base ${isSelected ? "text-white font-SpaceGroteskBold" : "text-black font-SpaceGroteskMedium"}`}>
        {network.name}
      </Text>
    </View>
  </TouchableOpacity>
);

const ChangeNetworkBottomSheet = forwardRef<Ref, BottomSheetProps>((bottomSheetProp, ref) => {
  const snapPoints = useMemo(() => ["50%"], []);
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const flatListRef = useRef<BottomSheetFlatListMethods>(null);
  const { currentNetwork, connectToNetwork } = useWalletStore();

  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />, []);

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
      <NetworkListItem network={item} isSelected={currentNetwork?.chainId === item.chainId} onPress={() => handleNetworkSelect(item)} />
    ),
    [currentNetwork?.chainId, handleNetworkSelect]
  );

  const keyExtractor = useCallback((item: (typeof SUPPORTED_NETWORKS)[0]) => item.chainId.toString(), []);

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      onChange={(idx) => setIsShowing(idx > -1)}
      index={-1}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: Colors.darkBlue }}
      backgroundStyle={{ backgroundColor: Colors.white }}>
      <View className="px-4 py-2">
        <Text className="text-center text-lg font-SpaceGroteskBold text-darkBlue">Select a network</Text>
      </View>

      <BottomSheetFlatList
        ref={flatListRef}
        data={SUPPORTED_NETWORKS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </BottomSheet>
  );
});

export default ChangeNetworkBottomSheet;
