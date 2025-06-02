import React from "react";
import { View, Modal, StyleSheet, Text, ActivityIndicator, StyleProp, ViewStyle, TextStyle } from "react-native";

interface Props {
    modalVisible: boolean;
    color?: string;
    task?: string;
    title?: string;
    fontFamily?: string;
    darkMode?: boolean;
    modalStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export default function LoadingModal({
    modalVisible = false,
    color,
    task,
    title,
    fontFamily,
    darkMode = false,
    modalStyle,
    textStyle,
}: Props) {
    return (
        <Modal animationType="fade" transparent={true} visible={modalVisible} statusBarTranslucent={true}>
            <View style={styles.centeredView}>
                <View style={[styles.modalView, darkMode && { backgroundColor: "#121212" }, modalStyle]}>
                    <ActivityIndicator size="large" color={color} />
                    <Text
                        style={[
                            styles.modalText,
                            { fontFamily: "SpaceGrotesk-SemiBold" },
                            darkMode && { color: "white" },
                            textStyle,
                        ]}
                    >
                        {title ? title + " " : ""}
                        {typeof task === "undefined" ? "Loading..." : task}
                    </Text>
                </View>
            </View>
        </Modal>
    );
}

LoadingModal.defaultProps = {
    modalVisible: false,
    darkMode: false,
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0008",
    },
    modalView: {
        margin: 20,
        width: 200,
        height: 70,
        backgroundColor: "white",
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    modalText: {
        marginVertical: 15,
        textAlign: "center",
        fontSize: 17,
        marginLeft: 15,
    },
});
