import { useEffect, useCallback } from "react";
import { StatusBar, Platform } from "react-native";
import { useColorScheme } from "react-native";
import Colors, { StatusBarPresets } from "../constants/Colors";
import { useFocusEffect } from "@react-navigation/native";

export type StatusBarStyle = "default" | "primary" | "gradient" | "transparent" | "custom";

export interface StatusBarConfig {
    style?: StatusBarStyle;
    backgroundColor?: string;
    barStyle?: "default" | "light-content" | "dark-content";
    hidden?: boolean;
    animated?: boolean;
    translucent?: boolean;
}

export const useStatusBar = (config: StatusBarConfig = {}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const applyStatusBar = useCallback(() => {
        const {
            style = "default",
            backgroundColor,
            barStyle,
            hidden = false,
            animated = true,
            translucent = false,
        } = config;

        let finalBackgroundColor: string;
        let finalBarStyle: "default" | "light-content" | "dark-content";

        // Determine background color and bar style based on preset or custom values
        if (backgroundColor && barStyle) {
            // Custom configuration
            finalBackgroundColor = backgroundColor;
            finalBarStyle = barStyle;
        } else {
            // Use preset configurations
            switch (style) {
                case "primary":
                    finalBackgroundColor = StatusBarPresets.primary.backgroundColor;
                    finalBarStyle = StatusBarPresets.primary.barStyle;
                    break;
                case "gradient":
                    finalBackgroundColor = StatusBarPresets.gradient.backgroundColor;
                    finalBarStyle = StatusBarPresets.gradient.barStyle;
                    break;
                case "transparent":
                    finalBackgroundColor = StatusBarPresets.transparent.backgroundColor;
                    finalBarStyle = StatusBarPresets.transparent.barStyle;
                    break;
                case "default":
                default:
                    const defaultPreset = StatusBarPresets.default(isDark);
                    finalBackgroundColor = defaultPreset.backgroundColor;
                    finalBarStyle = defaultPreset.barStyle;
                    break;
            }
        }

        // Apply status bar configuration
        if (Platform.OS === "ios") {
            StatusBar.setBarStyle(finalBarStyle, animated);
            StatusBar.setHidden(hidden, animated ? "slide" : "none");
        } else {
            StatusBar.setBarStyle(finalBarStyle, animated);
            StatusBar.setBackgroundColor(finalBackgroundColor, animated);
            StatusBar.setHidden(hidden, animated ? "slide" : "none");
            StatusBar.setTranslucent(translucent);
        }
    }, [config, isDark]);

    // Apply status bar when component is focused
    useFocusEffect(applyStatusBar);

    // Also apply on mount and when dependencies change
    useEffect(() => {
        applyStatusBar();
    }, [applyStatusBar]);

    return {
        isDark,
        colorScheme,
        currentConfig: config,
        applyStatusBar,
    };
};

// Hook for getting current status bar colors based on theme
export const useStatusBarColors = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    return {
        isDark,
        colors: isDark ? Colors.dark : Colors.light,
        statusBarBackground: isDark ? Colors.dark.statusBarBackground : Colors.light.statusBarBackground,
        statusBarContent: isDark ? Colors.dark.statusBarContent : Colors.light.statusBarContent,
        presets: StatusBarPresets,
    };
};
