import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { StatusBar, Platform, AppState } from "react-native";
import { useColorScheme } from "react-native";
import { StatusBarConfig, StatusBarStyle } from "../hooks/useStatusBar";
import Colors, { StatusBarPresets } from "../constants/Colors";

interface StatusBarContextType {
    currentStyle: StatusBarStyle;
    setStatusBarStyle: (style: StatusBarStyle, config?: Partial<StatusBarConfig>) => void;
    resetToDefault: () => void;
    isDark: boolean;
    isTransitioning: boolean;
}

const StatusBarContext = createContext<StatusBarContextType | undefined>(undefined);

interface StatusBarProviderProps {
    children: React.ReactNode;
    defaultStyle?: StatusBarStyle;
}

export const StatusBarProvider: React.FC<StatusBarProviderProps> = ({ children, defaultStyle = "default" }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [currentStyle, setCurrentStyle] = useState<StatusBarStyle>(defaultStyle);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [customConfig, setCustomConfig] = useState<Partial<StatusBarConfig>>({});

    // Apply status bar configuration
    const applyStatusBarConfig = useCallback(
        (style: StatusBarStyle, config: Partial<StatusBarConfig> = {}) => {
            setIsTransitioning(true);

            let finalBackgroundColor: string;
            let finalBarStyle: "default" | "light-content" | "dark-content";

            // Determine configuration based on style and custom config
            if (config.backgroundColor && config.barStyle) {
                finalBackgroundColor = config.backgroundColor;
                finalBarStyle = config.barStyle;
            } else {
                switch (style) {
                    case "primary":
                        finalBackgroundColor = StatusBarPresets.primary.backgroundColor;
                        finalBarStyle = StatusBarPresets.primary.barStyle;
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

            // Apply with smooth animation
            const animated = config.animated !== false;

            if (Platform.OS === "ios") {
                StatusBar.setBarStyle(finalBarStyle, animated);
                if (config.hidden !== undefined) {
                    StatusBar.setHidden(config.hidden, animated ? "slide" : "none");
                }
            } else {
                StatusBar.setBarStyle(finalBarStyle, animated);
                StatusBar.setBackgroundColor(finalBackgroundColor, animated);
                if (config.hidden !== undefined) {
                    StatusBar.setHidden(config.hidden, animated ? "slide" : "none");
                }
                if (config.translucent !== undefined) {
                    StatusBar.setTranslucent(config.translucent);
                }
            }

            // Reset transition state after animation
            setTimeout(() => setIsTransitioning(false), animated ? 300 : 0);
        },
        [isDark]
    );

    // Set status bar style with optional config
    const setStatusBarStyle = useCallback(
        (style: StatusBarStyle, config: Partial<StatusBarConfig> = {}) => {
            setCurrentStyle(style);
            setCustomConfig(config);
            applyStatusBarConfig(style, config);
        },
        [applyStatusBarConfig]
    );

    // Reset to default style
    const resetToDefault = useCallback(() => {
        setStatusBarStyle(defaultStyle);
        setCustomConfig({});
    }, [defaultStyle, setStatusBarStyle]);

    // Apply default configuration on mount and theme change
    useEffect(() => {
        applyStatusBarConfig(currentStyle, customConfig);
    }, [isDark, applyStatusBarConfig, currentStyle, customConfig]);

    // Handle app state changes
    useEffect(() => {
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === "active") {
                // Reapply status bar when app becomes active
                applyStatusBarConfig(currentStyle, customConfig);
            }
        };

        const subscription = AppState.addEventListener("change", handleAppStateChange);
        return () => subscription?.remove();
    }, [currentStyle, customConfig, applyStatusBarConfig]);

    const value: StatusBarContextType = {
        currentStyle,
        setStatusBarStyle,
        resetToDefault,
        isDark,
        isTransitioning,
    };

    return <StatusBarContext.Provider value={value}>{children}</StatusBarContext.Provider>;
};

// Hook to use status bar context
export const useStatusBarContext = (): StatusBarContextType => {
    const context = useContext(StatusBarContext);
    if (!context) {
        throw new Error("useStatusBarContext must be used within a StatusBarProvider");
    }
    return context;
};

// Hook for easy status bar management in components
export const useGlobalStatusBar = () => {
    const { setStatusBarStyle, resetToDefault, currentStyle, isDark, isTransitioning } = useStatusBarContext();

    const setDefault = useCallback(() => setStatusBarStyle("default"), [setStatusBarStyle]);
    const setPrimary = useCallback(() => setStatusBarStyle("primary"), [setStatusBarStyle]);

    const setTransparent = useCallback(() => setStatusBarStyle("transparent"), [setStatusBarStyle]);

    const setCustom = useCallback(
        (backgroundColor: string, barStyle: "light-content" | "dark-content") => {
            setStatusBarStyle("custom", { backgroundColor, barStyle });
        },
        [setStatusBarStyle]
    );

    return {
        currentStyle,
        isDark,
        isTransitioning,
        setDefault,
        setPrimary,
        setTransparent,
        setCustom,
        setStatusBarStyle,
        resetToDefault,
    };
};
