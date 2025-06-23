import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAppTheme } from "~/src/context/ThemeProvider";

type FontAwesomeIconName = React.ComponentProps<typeof FontAwesome>["name"];

interface DefaultWithIconProps {
    title: string;
    icon: FontAwesomeIconName;
    onPress: () => void;
}

const DefaultWithIcon: React.FC<DefaultWithIconProps> = ({ title, icon, onPress }) => {
    const { getColor } = useAppTheme();

    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: getColor("primary.main") }]} onPress={onPress}>
            <FontAwesome name={icon} color={getColor("text.inverse")} size={16} />
            <Text style={[styles.text, { color: getColor("text.inverse") }]}>{title}</Text>
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
        gap: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
    },
});

export default DefaultWithIcon;
