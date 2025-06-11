import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MnemonicBox from "~/components/Mnemonic/MnemonicBox";
import Colors from "~/src/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { router } from "expo-router";

export default function RecoverySecretPhraseScreen() {
    const [mnemonicsArray, setMnemonicsArray] = useState<string[]>([]);

    const getMnemonic = async () => {
        const mnemonic = await ExpoSecureStoreAdapter.getItem("wallet_mnemonic");

        setMnemonicsArray([mnemonic!]);
    };

    useEffect(() => {
        getMnemonic();
    }, []);
    return (
        <GestureHandlerRootView style={styles.root}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.container}>
                    <View>
                        {mnemonicsArray.map((mnemonic, index) => (
                            <MnemonicBox key={index} mnemonic={mnemonic} />
                        ))}
                    </View>

                    <SafeAreaView style={styles.safeArea}>
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={() => {
                                router.dismissAll();
                            }}
                        >
                            <Text style={styles.continueButtonText}>Done</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    container: {
        backgroundColor: Colors.white,
        minHeight: "100%",
        justifyContent: "space-between",
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    header: {
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    headerText: {
        fontSize: 16,
        color: Colors.secondary,
        textAlign: "center",
    },
    safeArea: {
        marginHorizontal: 10,
        marginVertical: 20,
    },
    warningContainer: {
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    warningIcon: {
        marginHorizontal: 10,
    },
    warningText: {
        flex: 1,
        marginLeft: 10,
        color: Colors.red,
    },
    continueButton: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
    },
    continueButtonText: {
        color: Colors.secondary,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});
