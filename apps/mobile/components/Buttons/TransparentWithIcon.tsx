import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "~/src/context/ThemeProvider";

type IoniconsIconName = React.ComponentProps<typeof Ionicons>["name"];

interface TransparentWithIconProps {
    title: string;
    icon: IoniconsIconName;
    onPress: () => void;
}

const TransparentWithIcon: React.FC<TransparentWithIconProps> = ({ title, icon, onPress }) => {
    const { getColor } = useAppTheme();

    return (
        <TouchableOpacity style={[styles.button, { borderColor: getColor("border.primary") }]} onPress={onPress}>
            <Ionicons name={icon} color={getColor("text.primary")} size={20} />
            <Text style={[styles.text, { color: getColor("text.primary") }]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: "transparent",
        gap: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
    },
});

export default TransparentWithIcon;
