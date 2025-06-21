/**
 * Theme Toggle Switch Component
 * Beautiful animated toggle for switching between light and dark modes
 * Integrates with the Bitriel theme system
 */

import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, Animated, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { useAppTheme } from "~/src/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

interface ThemeToggleProps {
    size?: "small" | "medium" | "large";
    showLabel?: boolean;
    style?: ViewStyle;
    labelStyle?: TextStyle;
}

export function ThemeToggle({ size = "medium", showLabel = true, style, labelStyle }: ThemeToggleProps) {
    const { mode, isDark, toggleTheme } = useAppTheme();
    const animatedValue = useRef(new Animated.Value(isDark ? 1 : 0)).current;

    // Animate toggle when theme changes
    useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: isDark ? 1 : 0,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
        }).start();
    }, [isDark, animatedValue]);

    // Size configurations
    const sizeConfig = {
        small: {
            width: 44,
            height: 24,
            padding: 2,
            thumbSize: 20,
            fontSize: 12,
            iconSize: 12,
        },
        medium: {
            width: 56,
            height: 32,
            padding: 2,
            thumbSize: 28,
            fontSize: 14,
            iconSize: 16,
        },
        large: {
            width: 68,
            height: 40,
            padding: 3,
            thumbSize: 34,
            fontSize: 16,
            iconSize: 20,
        },
    };

    const config = sizeConfig[size];

    // Animated styles
    const thumbTranslateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [config.padding, config.width - config.thumbSize - config.padding],
    });

    const trackBackgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#E5E5E7", "#FFAC30"], // Light gray to brand primary
    });

    const thumbBackgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#FFFFFF", "#FFFFFF"], // Always white
    });

    const thumbShadowOpacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.1, 0.2],
    });

    const iconOpacity = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 1],
    });

    const iconRotation = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    return (
        <View style={[styles.container, style]}>
            {showLabel && (
                <Text style={[styles.label, { fontSize: config.fontSize }, labelStyle]}>
                    {isDark ? "Dark" : "Light"}
                </Text>
            )}

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={toggleTheme}
                style={[
                    styles.track,
                    {
                        width: config.width,
                        height: config.height,
                        borderRadius: config.height / 2,
                    },
                ]}
            >
                {/* Animated track background */}
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: trackBackgroundColor,
                            borderRadius: config.height / 2,
                        },
                    ]}
                />

                {/* Animated thumb */}
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            width: config.thumbSize,
                            height: config.thumbSize,
                            borderRadius: config.thumbSize / 2,
                            backgroundColor: thumbBackgroundColor,
                            transform: [{ translateX: thumbTranslateX }],
                            shadowOpacity: thumbShadowOpacity,
                        },
                    ]}
                >
                    {/* Icon inside thumb */}
                    <Animated.View
                        style={[
                            styles.iconContainer,
                            {
                                opacity: iconOpacity,
                                transform: [{ rotate: iconRotation }],
                            },
                        ]}
                    >
                        <Ionicons
                            name={isDark ? "moon" : "sunny"}
                            size={config.iconSize}
                            color={isDark ? "#FFD700" : "#FF6B35"}
                        />
                    </Animated.View>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    label: {
        fontFamily: "SpaceGroteskMedium",
        color: "#7B7F9E",
        minWidth: 40,
    },
    track: {
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
    },
    thumb: {
        position: "absolute",
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ThemeToggle;
