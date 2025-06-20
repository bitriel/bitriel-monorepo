import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Colors from "~/src/constants/Colors";
import { BlurView } from "expo-blur";
import TopCryptoListing from "~/app/(auth)/home/crypto";
import { BackHandler } from "react-native";
import { useFocusEffect } from "expo-router";

interface BottomSheetProps {
    handleCloseBottomSheet: () => void;
}

type Ref = BottomSheetModal;

const TopTokensBottomSheet = forwardRef<Ref, BottomSheetProps>((bottomSheetProp, ref) => {
    const snapPoints = useMemo(() => ["100%"], []);
    const [isShowing, setIsShowing] = useState<boolean>(false);

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />,
        []
    );

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
        <BottomSheetModal
            ref={ref}
            snapPoints={snapPoints}
            index={1}
            onDismiss={() => {
                setIsShowing(false);
                handleBottomSheetClose();
            }}
            onAnimate={(fromIndex, toIndex) => {
                setIsShowing(toIndex > -1);
            }}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{ marginTop: 50, backgroundColor: Colors.secondary }}
            backgroundStyle={{ backgroundColor: "#ffffff99" }}
            backgroundComponent={({ style }) => (
                <BlurView
                    tint="light"
                    experimentalBlurMethod="dimezisBlurView"
                    intensity={90}
                    style={[style, { borderRadius: 20, overflow: "hidden" }]}
                />
            )}
        >
            <BottomSheetScrollView>
                <TopCryptoListing onCloseBottomSheet={handleBottomSheetClose} />
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});

export default TopTokensBottomSheet;
