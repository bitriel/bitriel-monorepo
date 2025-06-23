import { useEffect, useCallback, useRef } from "react";
import { useColorScheme } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { autoDetectStatusBarConfig, getOptimalStatusBarStyle, isLightColor } from "../utils/colorAnalysis";
import { updateStatusBar, type StatusBarState } from "../utils/statusBarUtils";
import { useAppTheme } from "../context/ThemeProvider";
import { LIGHT_THEME, DARK_THEME } from "../constants/Colors";

export interface SmartStatusBarConfig {
    backgroundColor?: string;
    autoDetect?: boolean;
    forceStyle?: "light-content" | "dark-content";
    animated?: boolean;
    hidden?: boolean;
    translucent?: boolean;
}

export const useSmartStatusBar = (config: SmartStatusBarConfig = {}) => {
    const { isDark } = useAppTheme();
    const colorScheme = useColorScheme();
    const lastConfigRef = useRef<string>("");

    const applySmartStatusBar = useCallback(() => {
        const {
            backgroundColor,
            autoDetect = true,
            forceStyle,
            animated = true,
            hidden = false,
            translucent = false,
        } = config;

        let finalBackgroundColor: string;
        let finalBarStyle: "light-content" | "dark-content";

        if (forceStyle) {
            // Manual override
            finalBackgroundColor =
                backgroundColor || (isDark ? DARK_THEME.statusBar.background : LIGHT_THEME.statusBar.background);
            finalBarStyle = forceStyle;
        } else if (backgroundColor && autoDetect) {
            // Auto-detect based on provided background color
            const autoConfig = autoDetectStatusBarConfig(backgroundColor);
            finalBackgroundColor = autoConfig.backgroundColor;
            finalBarStyle = autoConfig.barStyle;
        } else if (backgroundColor) {
            // Use provided background with theme-based content
            finalBackgroundColor = backgroundColor;
            finalBarStyle = isDark ? "light-content" : "dark-content";
        } else {
            // Default theme-based configuration
            finalBackgroundColor = isDark ? DARK_THEME.statusBar.background : LIGHT_THEME.statusBar.background;
            finalBarStyle = isDark ? DARK_THEME.statusBar.content : LIGHT_THEME.statusBar.content;
        }

        // Create config hash to prevent unnecessary updates
        const configHash = `${finalBackgroundColor}-${finalBarStyle}-${hidden}-${translucent}`;
        if (lastConfigRef.current === configHash) {
            return; // No change needed
        }
        lastConfigRef.current = configHash;

        const statusBarState: StatusBarState = {
            backgroundColor: finalBackgroundColor,
            barStyle: finalBarStyle,
            hidden,
            translucent,
        };

        updateStatusBar(statusBarState, animated);
    }, [config, isDark]);

    // Apply on focus and when dependencies change
    useFocusEffect(applySmartStatusBar);

    useEffect(() => {
        applySmartStatusBar();
    }, [applySmartStatusBar]);

    return {
        isDark,
        colorScheme,
        applySmartStatusBar,
        // Utility functions for manual control
        setForBackground: useCallback(
            (bgColor: string) => {
                const autoConfig = autoDetectStatusBarConfig(bgColor);
                const statusBarState: StatusBarState = {
                    backgroundColor: autoConfig.backgroundColor,
                    barStyle: autoConfig.barStyle,
                    hidden: config.hidden || false,
                    translucent: config.translucent || false,
                };
                updateStatusBar(statusBarState, config.animated !== false);
            },
            [config]
        ),
    };
};

// Hook for components that want to automatically adapt to their background
export const useAdaptiveStatusBar = (componentBackgroundColor?: string) => {
    const { isDark } = useAppTheme();

    useEffect(() => {
        if (!componentBackgroundColor) return;

        const autoConfig = autoDetectStatusBarConfig(componentBackgroundColor);
        const statusBarState: StatusBarState = {
            backgroundColor: autoConfig.backgroundColor,
            barStyle: autoConfig.barStyle,
            hidden: false,
            translucent: false,
        };

        updateStatusBar(statusBarState, true);
    }, [componentBackgroundColor, isDark]);

    return {
        isLightBackground: componentBackgroundColor ? isLightColor(componentBackgroundColor) : !isDark,
        recommendedContentStyle: componentBackgroundColor
            ? getOptimalStatusBarStyle(componentBackgroundColor)
            : isDark
              ? "light-content"
              : "dark-content",
    };
};

// Hook for screens with complex backgrounds (like images or gradients)
export const useContextualStatusBar = () => {
    const { isDark } = useAppTheme();

    const adaptToBackground = useCallback((backgroundColor: string) => {
        const autoConfig = autoDetectStatusBarConfig(backgroundColor);
        const statusBarState: StatusBarState = {
            backgroundColor: autoConfig.backgroundColor,
            barStyle: autoConfig.barStyle,
            hidden: false,
            translucent: false,
        };

        updateStatusBar(statusBarState, true);
        return autoConfig;
    }, []);

    const adaptToImage = useCallback(
        (dominantImageColor?: string) => {
            const bgColor = dominantImageColor || (isDark ? "#000000" : "#FFFFFF");
            return adaptToBackground(bgColor);
        },
        [adaptToBackground, isDark]
    );

    return {
        adaptToBackground,
        adaptToImage,
        isDark,
    };
};
