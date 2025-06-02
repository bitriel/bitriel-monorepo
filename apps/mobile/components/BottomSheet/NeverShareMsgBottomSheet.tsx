import { View, Text, TouchableOpacity, FlatList, BackHandler, StyleSheet } from "react-native";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { SvgXml } from "react-native-svg";
import Colors from "~/src/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import SVG from "~/src/constants/AssetSVG";
import { useFocusEffect } from "expo-router";

interface BottomSheetProps {
    handleCloseBottomSheet: () => void;
}

type Ref = BottomSheet;

const NeverShareMsgBottomSheet = forwardRef<Ref, BottomSheetProps>((bottomSheetProp, ref) => {
    const snapPoints = useMemo(() => ["95%"], []);

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
            handleIndicatorStyle={{ backgroundColor: Colors.darkBlue }}
            backgroundStyle={{ backgroundColor: Colors.white }}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <SvgXml xml={SVG.SecuritySVG} width={150} height={150} />
                    <Text style={styles.headerText}>Never Share Your Secret Phrase</Text>
                </View>

                <View>
                    <FlatList
                        scrollEnabled={false}
                        style={styles.flatList}
                        data={dataMsg}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <View style={styles.circle}>
                                    <Text style={styles.key}>{item.key}</Text>
                                </View>
                                <Text style={styles.text}>{item.text}</Text>
                            </View>
                        )}
                    />

                    <SafeAreaView>
                        <TouchableOpacity style={styles.button} onPress={bottomSheetProp.handleCloseBottomSheet}>
                            <Text style={styles.buttonText}>Continue</Text>
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
        backgroundColor: Colors.white,
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
        backgroundColor: Colors.offWhite,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    key: {
        color: Colors.darkBlue,
        fontWeight: "bold",
    },
    text: {
        flex: 1,
        color: Colors.darkBlue,
    },
    safeArea: {
        marginVertical: 20,
        alignItems: "center",
    },
    button: {
        backgroundColor: Colors.yellow,
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: Colors.darkBlue,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default NeverShareMsgBottomSheet;
