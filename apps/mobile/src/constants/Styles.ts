import { StyleSheet } from "react-native";
import { BITRIEL_COLORS } from "./Colors";

export const defaultStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BITRIEL_COLORS.neutral[0],
        padding: 16,
    },
    header: {
        fontSize: 40,
        fontWeight: "700",
    },
    pillButton: {
        padding: 10,
        height: 60,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    textLink: {
        color: BITRIEL_COLORS.blue[600],
        fontSize: 18,
        fontWeight: "500",
    },
    descriptionText: {
        fontSize: 18,
        marginTop: 20,
        color: BITRIEL_COLORS.neutral[700],
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "500",
    },
    pillButtonSmall: {
        paddingHorizontal: 20,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonTextSmall: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: "bold",
        margin: 20,
        marginBottom: 10,
    },
    block: {
        marginHorizontal: 20,
        padding: 14,
        backgroundColor: "#fff",
        borderRadius: 16,
        gap: 20,
    },
});
