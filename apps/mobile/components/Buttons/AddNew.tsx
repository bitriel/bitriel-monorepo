import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "~/src/context/ThemeProvider";

interface AddNewProps {
    onPress: () => void;
    title: string;
}

const AddNew: React.FC<AddNewProps> = ({ onPress, title }) => {
    const { getColor } = useAppTheme();

    return (
        <TouchableOpacity style={[styles.container, { borderColor: getColor("border.primary") }]} onPress={onPress}>
            <Feather name="plus" color={getColor("text.primary")} size={20} />
            <Text style={[styles.text, { color: getColor("text.primary") }]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderWidth: 2,
        borderStyle: "dashed",
        borderRadius: 12,
        gap: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
    },
});

export default AddNew;
