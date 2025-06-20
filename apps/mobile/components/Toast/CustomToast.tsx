import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import {
    IconCircleCheck,
    IconCircleX,
    IconAlertTriangle,
    IconInfoCircle,
    IconSquareX,
} from "@tabler/icons-react-native";
import Colors from "~/src/constants/Colors";

interface ToastProps {
    visible: boolean;
    message: string;
    title?: string;
    type: "success" | "error" | "info" | "warning";
    onHide: () => void;
    duration?: number;
}

const { width } = Dimensions.get("window");

export const CustomToast: React.FC<ToastProps> = ({ visible, message, title, type, onHide, duration = 3000 }) => {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Show animation
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide after duration
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onHide();
        });
    };

    const getIconComponent = () => {
        switch (type) {
            case "success":
                return IconCircleCheck;
            case "error":
                return IconCircleX;
            case "warning":
                return IconAlertTriangle;
            case "info":
                return IconInfoCircle;
            default:
                return IconInfoCircle;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case "success":
                return Colors.offWhite;
            case "error":
                return "#FF6B6B";
            case "warning":
                return "#FFD93D";
            case "info":
                return "#74C0FC";
            default:
                return Colors.offWhite;
        }
    };

    const getTextColor = () => {
        switch (type) {
            case "success":
                return Colors.blackText;
            case "error":
                return Colors.white;
            case "warning":
                return Colors.blackText;
            case "info":
                return Colors.white;
            default:
                return Colors.blackText;
        }
    };

    const getIconColor = () => {
        switch (type) {
            case "success":
                return Colors.primary;
            case "error":
                return Colors.white;
            case "warning":
                return "#F59E0B";
            case "info":
                return Colors.white;
            default:
                return Colors.primary;
        }
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }],
                    opacity,
                    backgroundColor: getBackgroundColor(),
                },
            ]}
        >
            <View style={styles.content}>
                {React.createElement(getIconComponent(), { size: 24, color: getIconColor() })}
                <View style={styles.textContainer}>
                    {title && <Text style={[styles.title, { color: getTextColor() }]}>{title}</Text>}
                    <Text style={[styles.message, { color: getTextColor() }]}>{message}</Text>
                </View>
                <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
                    <IconSquareX size={20} color={getTextColor()} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 60,
        left: 16,
        right: 16,
        zIndex: 9999,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
    },
    title: {
        fontSize: 16,
        fontFamily: "SpaceGrotesk-Bold",
        marginBottom: 2,
    },
    message: {
        fontSize: 14,
        fontFamily: "SpaceGrotesk-Medium",
    },
    closeButton: {
        padding: 4,
    },
});
