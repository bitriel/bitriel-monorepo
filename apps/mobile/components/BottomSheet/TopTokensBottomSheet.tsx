import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Colors from "~/src/constants/Colors";
import { BlurView } from "expo-blur";
import TopCryptoListing from "~/app/(auth)/home/crypto";
import { BackHandler } from "react-native";
import { useFocusEffect } from "expo-router";

interface BottomSheetProps {
  handleCloseBottomSheet: () => void;
}

type Ref = BottomSheet;

const TopTokensBottomSheet = forwardRef<Ref, BottomSheetProps>((bottomSheetProp, ref) => {
  const snapPoints = useMemo(() => ["100%"], []);
  const [isShowing, setIsShowing] = useState<boolean>(false);

  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />, []);

  const handleBottomSheetClose = useCallback(() => {
    bottomSheetProp.handleCloseBottomSheet();
  }, [bottomSheetProp.handleCloseBottomSheet]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isShowing) {
          handleBottomSheetClose();
          return true;
        }
        return false;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [isShowing, handleBottomSheetClose])
  );

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      index={-1}
      onChange={(idx) => setIsShowing(idx > -1)}
      enablePanDownToClose={true}
      onClose={handleBottomSheetClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ marginTop: 50, backgroundColor: Colors.darkBlue }}
      backgroundStyle={{ backgroundColor: "#ffffff99" }}
      backgroundComponent={({ style }) => (
        <BlurView tint="light" experimentalBlurMethod="dimezisBlurView" intensity={30} style={[style, { borderRadius: 20, overflow: "hidden" }]} />
      )}>
      <BottomSheetScrollView>
        <TopCryptoListing />
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default TopTokensBottomSheet;
