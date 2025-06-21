/**
 * Comprehensive Theme Provider for Bitriel Mobile App
 * Supports both light and dark modes with NativeWind integration
 * Provides theme switching and consistent color management
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useColorScheme, Appearance } from "react-native";
import { THEMES, type ThemeMode } from "../constants/Colors";
import { _setThemeContext } from "../hooks/useThemeColor";

// Theme context type
interface ThemeContextType {
    // Current theme data
    theme: typeof THEMES.light | typeof THEMES.dark;
    mode: ThemeMode;
    isDark: boolean;

    // Theme controls
    setTheme: (mode: ThemeMode | "system") => void;
    toggleTheme: () => void;

    // Color utilities
    getColor: (path: string) => string;
    getBrandColor: (color: string, shade?: number) => string;

    // NativeWind class generation
    getThemeClass: (baseClass: string) => string;
    getTextClass: (variant?: "primary" | "secondary" | "tertiary" | "accent") => string;
    getBackgroundClass: (variant?: "primary" | "secondary" | "card" | "surface") => string;
    getBorderClass: (variant?: "primary" | "secondary" | "accent" | "focus") => string;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme preference type
type ThemePreference = "light" | "dark" | "system";

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: ThemePreference;
    storageKey?: string;
}

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "bitriel-theme" }: ThemeProviderProps) {
    const systemColorScheme = useColorScheme() ?? "light";
    const [themePreference, setThemePreference] = useState<ThemePreference>(defaultTheme);

    // Expose context to color hooks
    useEffect(() => {
        _setThemeContext(ThemeContext);
    }, []);

    // Determine actual theme mode based on preference
    const actualMode: ThemeMode = themePreference === "system" ? systemColorScheme : themePreference;
    const theme = THEMES[actualMode];
    const isDark = actualMode === "dark";

    // Listen to system theme changes
    useEffect(() => {
        if (themePreference === "system") {
            const subscription = Appearance.addChangeListener(({ colorScheme }) => {
                // The actualMode will automatically update due to systemColorScheme dependency
                console.log("📱 System theme changed to:", colorScheme);
            });
            return () => subscription?.remove();
        }
    }, [themePreference]);

    // Theme control functions
    const setTheme = (mode: ThemeMode | "system") => {
        console.log("🎨 Setting theme to:", mode);
        setThemePreference(mode);
        // TODO: Add AsyncStorage persistence
        // AsyncStorage.setItem(storageKey, mode);
    };

    const toggleTheme = () => {
        console.log("🔄 Toggling theme. Current:", { themePreference, isDark });
        if (themePreference === "system") {
            setTheme(isDark ? "light" : "dark");
        } else {
            setTheme(isDark ? "light" : "dark");
        }
    };

    // Color utility functions
    const getColor = (path: string): string => {
        const pathParts = path.split(".");
        let colorValue: any = theme;

        for (const part of pathParts) {
            colorValue = colorValue?.[part];
        }

        if (typeof colorValue === "string") {
            return colorValue;
        }

        console.warn(`Invalid color path: ${path}`);
        return isDark ? "#FFFFFF" : "#000000";
    };

    const getBrandColor = (color: string, shade: number = 500): string => {
        const brandColors = theme.brand as any;
        return brandColors[color]?.[shade] || theme.brand.primary[500];
    };

    // NativeWind class generation utilities
    const getThemeClass = (baseClass: string): string => {
        return isDark ? `dark:${baseClass}` : baseClass;
    };

    const getTextClass = (variant: "primary" | "secondary" | "tertiary" | "accent" = "primary"): string => {
        const baseClasses = {
            primary: "text-text-primary dark:text-dark-text-primary",
            secondary: "text-text-secondary dark:text-dark-text-secondary",
            tertiary: "text-text-tertiary dark:text-dark-text-tertiary",
            accent: "text-text-accent dark:text-dark-text-accent",
        };
        return baseClasses[variant];
    };

    const getBackgroundClass = (variant: "primary" | "secondary" | "card" | "surface" = "primary"): string => {
        const baseClasses = {
            primary: "bg-background-primary dark:bg-dark-background-primary",
            secondary: "bg-background-secondary dark:bg-dark-background-secondary",
            card: "bg-background-card dark:bg-dark-background-card",
            surface: "bg-background-surface dark:bg-dark-background-surface",
        };
        return baseClasses[variant];
    };

    const getBorderClass = (variant: "primary" | "secondary" | "accent" | "focus" = "primary"): string => {
        const baseClasses = {
            primary: "border-border-primary dark:border-dark-border-primary",
            secondary: "border-border-secondary dark:border-dark-border-secondary",
            accent: "border-border-accent dark:border-dark-border-accent",
            focus: "border-border-focus dark:border-dark-border-focus",
        };
        return baseClasses[variant];
    };

    const contextValue: ThemeContextType = {
        theme,
        mode: actualMode,
        isDark,
        setTheme,
        toggleTheme,
        getColor,
        getBrandColor,
        getThemeClass,
        getTextClass,
        getBackgroundClass,
        getBorderClass,
    };

    // Debug log
    useEffect(() => {
        console.log("🎨 Theme Provider State:", {
            themePreference,
            actualMode,
            isDark,
            systemColorScheme,
        });
    }, [themePreference, actualMode, isDark, systemColorScheme]);

    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

// Hook to use theme context
export function useAppTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useAppTheme must be used within a ThemeProvider");
    }
    return context;
}

// Utility hooks for common use cases
export function useThemeColors() {
    const { theme, getColor } = useAppTheme();
    return {
        theme,
        text: {
            primary: getColor("text.primary"),
            secondary: getColor("text.secondary"),
            tertiary: getColor("text.tertiary"),
            accent: getColor("text.accent"),
            inverse: getColor("text.inverse"),
        },
        background: {
            primary: getColor("background.primary"),
            secondary: getColor("background.secondary"),
            tertiary: getColor("background.tertiary"),
            card: getColor("background.card"),
            surface: getColor("background.surface"),
            inverse: getColor("background.inverse"),
        },
        border: {
            primary: getColor("border.primary"),
            secondary: getColor("border.secondary"),
            accent: getColor("border.accent"),
            focus: getColor("border.focus"),
            error: getColor("border.error"),
        },
        interactive: {
            ripple: getColor("interactive.ripple"),
            hover: getColor("interactive.hover"),
            pressed: getColor("interactive.pressed"),
            focus: getColor("interactive.focus"),
        },
    };
}

export function useThemeClasses() {
    const { getTextClass, getBackgroundClass, getBorderClass, getThemeClass } = useAppTheme();
    return {
        text: getTextClass,
        background: getBackgroundClass,
        border: getBorderClass,
        theme: getThemeClass,
    };
}

// Export theme provider and hooks
export default ThemeProvider;
