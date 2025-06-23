import { View, Text, TouchableOpacity, FlatList, BackHandler, StyleSheet } from "react-native";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { SvgXml } from "react-native-svg";
import { BITRIEL_COLORS } from "~/src/constants/Colors";
import { useAppTheme } from "~/src/context/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import SVG from "~/src/constants/AssetSVG";
import { useFocusEffect } from "expo-router";

interface BottomSheetProps {
    handleCloseBottomSheet: () => void;
}

type Ref = BottomSheet;

const NeverShareMsgBottomSheet = forwardRef<Ref, BottomSheetProps>((bottomSheetProp, ref) => {
    const snapPoints = useMemo(() => ["95%"], []);
    const { getColor } = useAppTheme();

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );

    const dataMsg = [
        {
            key: "1",
            text: "Your 12-word secret phrase is the master key to your wallet. Anyone that has your secret phrase can access and take your crypto.",
        },
        {
            key: "2",
            text: "Trust Wallet does not keep a copy of your secret phrase.",
        },
        {
            key: "3",
            text: "Saving this digitally in plain text is NOT recommended.Examples include screenshots, text files, or emailing yourself",
        },
        {
            key: "4",
            text: "Write down your secret phrase, and store it in a secure offline location!",
        },
    ];

    const [isShowing, setIsShowing] = useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            // addEventListener and removeEventListener must refer to the same function
            const onBackPress = () => {
                if (isShowing) {
                    bottomSheetProp.handleCloseBottomSheet();
                    return true; // TS complains if handler doesn't return a boolean
                } else {
                    return false;
                }
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, [ref, isShowing])
    );

    return (
        <BottomSheet
            ref={ref}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            onChange={idx => setIsShowing(idx > -1)}
            handleIndicatorStyle={{ backgroundColor: getColor("primary.main") }}
            backgroundStyle={{ backgroundColor: getColor("background.primary") }}
        >
            <View style={[styles.container, { backgroundColor: getColor("background.primary") }]}>
                <View style={styles.header}>
                    <SvgXml xml={SVG.SecuritySVG} width={150} height={150} />
                    <Text style={[styles.headerText, { color: getColor("text.primary") }]}>
                        Never Share Your Secret Phrase
                    </Text>
                </View>

                <View>
                    <FlatList
                        scrollEnabled={false}
                        style={styles.flatList}
                        data={dataMsg}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <View style={[styles.circle, { backgroundColor: getColor("surface.secondary") }]}>
                                    <Text style={[styles.key, { color: getColor("primary.main") }]}>{item.key}</Text>
                                </View>
                                <Text style={[styles.text, { color: getColor("text.secondary") }]}>{item.text}</Text>
                            </View>
                        )}
                    />

                    <SafeAreaView>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: getColor("primary.main") }]}
                            onPress={bottomSheetProp.handleCloseBottomSheet}
                        >
                            <Text style={[styles.buttonText, { color: BITRIEL_COLORS.neutral[0] }]}>Continue</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>
            </View>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        alignItems: "center",
        marginTop: 20,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "center",
    },
    flatList: {
        marginTop: 20,
    },
    item: {
        flexDirection: "row",
        marginBottom: 10,
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    key: {
        fontWeight: "bold",
    },
    text: {
        flex: 1,
    },
    safeArea: {
        marginVertical: 20,
        alignItems: "center",
    },
    button: {
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default NeverShareMsgBottomSheet;
