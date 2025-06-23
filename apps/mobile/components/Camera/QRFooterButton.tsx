import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "~/src/context/ThemeProvider";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface QRFooterButtonProps {
    title?: string;
    isActive?: boolean;
    onPress: () => void;
    icon?: React.ReactNode;
    // Legacy props for backward compatibility
    iconName?: IoniconsName;
    iconSize?: number;
}

const QRFooterButton: React.FC<QRFooterButtonProps> = ({
    title,
    isActive = false,
    onPress,
    icon,
    iconName,
    iconSize = 24,
}) => {
    const { getColor } = useAppTheme();

    const buttonColor = isActive ? getColor("primary.main") : "transparent";
    const iconColor = isActive ? getColor("text.inverse") : "#FFFFFF";
    const textColor = isActive ? getColor("text.inverse") : "#FFFFFF";
    const borderColor = isActive ? getColor("primary.main") : "rgba(255, 255, 255, 0.3)";

    // Use provided icon or create one from iconName
    const displayIcon = icon || (iconName && <Ionicons name={iconName} size={iconSize} color={iconColor} />);

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: buttonColor,
                    borderColor: borderColor,
                },
            ]}
            onPress={onPress}
        >
            {displayIcon}
            {title && <Text style={[styles.text, { color: textColor }]}>{title}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 50,
        borderWidth: 1,
        minWidth: 60,
        minHeight: 60,
    },
    text: {
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 8,
    },
});

export default QRFooterButton;
