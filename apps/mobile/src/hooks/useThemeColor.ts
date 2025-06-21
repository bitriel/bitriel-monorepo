/**
 * Enhanced Theme Color Hook for Bitriel Mobile App
 * Supports the new comprehensive theme system with semantic color tokens
 * Compatible with both legacy Colors and new THEMES structure
 */

import { useColorScheme } from "react-native";
import { useContext } from "react";
import Colors, { THEMES, type ThemeMode } from "../constants/Colors";

// Import the theme context - we'll need to make this accessible
let ThemeContext: React.Context<any> | null = null;

// Helper to set context reference from ThemeProvider
export function _setThemeContext(context: React.Context<any>) {
    ThemeContext = context;
}

// Type definitions for theme color paths
type ThemeColorPath =
    | "text.primary"
    | "text.secondary"
    | "text.tertiary"
    | "text.disabled"
    | "text.inverse"
    | "text.link"
    | "text.accent"
    | "background.primary"
    | "background.secondary"
    | "background.tertiary"
    | "background.inverse"
    | "background.overlay"
    | "background.card"
    | "background.surface"
    | "border.primary"
    | "border.secondary"
    | "border.accent"
    | "border.focus"
    | "border.error"
    | "interactive.ripple"
    | "interactive.hover"
    | "interactive.pressed"
    | "interactive.focus"
    | "statusBar.background"
    | "statusBar.content"
    | "shadow.color";

// Legacy color names for backward compatibility
type LegacyColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Enhanced hook to get theme-aware colors using semantic tokens
 * Now uses the theme context instead of system useColorScheme
 * @param colorPath - Semantic color path (e.g., "text.primary", "background.card")
 * @param overrides - Optional light/dark color overrides
 * @returns The appropriate color for the current theme
 */
export function useSemanticColor(colorPath: ThemeColorPath, overrides?: { light?: string; dark?: string }): string {
    // Always call hooks in the same order
    const systemColorScheme = useColorScheme();
    const themeContext = ThemeContext ? useContext(ThemeContext) : null;

    // Determine which theme to use
    let theme;
    let colorScheme: ThemeMode = "light";

    if (themeContext) {
        // Use context theme if available
        theme = themeContext.theme;
        colorScheme = themeContext.mode;
    } else {
        // Fallback to system color scheme
        colorScheme = systemColorScheme ?? "light";
        theme = THEMES[colorScheme];
    }

    // If overrides are provided, use them
    if (overrides?.[colorScheme]) {
        return overrides[colorScheme]!;
    }

    // Navigate through the color path to get the color value
    const pathParts = colorPath.split(".");
    let colorValue: any = theme;

    for (const part of pathParts) {
        colorValue = colorValue?.[part];
    }

    if (typeof colorValue === "string") {
        return colorValue;
    }

    // Fallback to a default color if path is invalid
    console.warn(`Invalid color path: ${colorPath}`);
    return colorScheme === "dark" ? "#FFFFFF" : "#000000";
}

/**
 * Legacy useThemeColor function for backward compatibility
 * @deprecated Use useSemanticColor with semantic color paths instead
 */
export function useThemeColor(props: { light?: string; dark?: string }, colorName: LegacyColorName) {
    // Always call hooks in the same order
    const systemColorScheme = useColorScheme();
    const themeContext = ThemeContext ? useContext(ThemeContext) : null;

    // Determine color scheme
    let colorScheme: ThemeMode;

    if (themeContext) {
        colorScheme = themeContext.mode;
    } else {
        colorScheme = systemColorScheme ?? "light";
    }

    const colorFromProps = props[colorScheme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[colorScheme][colorName];
    }
}

/**
 * Hook to get the current theme object
 * @returns Current theme object with all color tokens
 */
export function useTheme() {
    // Always call hooks in the same order
    const systemColorScheme = useColorScheme();
    const themeContext = ThemeContext ? useContext(ThemeContext) : null;

    if (themeContext) {
        return {
            ...themeContext.theme,
            mode: themeContext.mode,
            isDark: themeContext.isDark,
        };
    }

    // Fallback to system color scheme if context not available
    const colorScheme = systemColorScheme ?? "light";
    const theme = THEMES[colorScheme];

    return {
        ...theme,
        mode: colorScheme as ThemeMode,
        isDark: colorScheme === "dark",
    };
}

/**
 * Hook to get brand colors (theme-independent)
 * @returns Brand colors object
 */
export function useBrandColors() {
    return THEMES.light.brand;
}

/**
 * Hook to get adaptive colors based on theme
 * @param lightColor - Color for light theme
 * @param darkColor - Color for dark theme
 * @returns Appropriate color for current theme
 */
export function useAdaptiveColor(lightColor: string, darkColor: string): string {
    // Always call hooks in the same order
    const systemColorScheme = useColorScheme();
    const themeContext = ThemeContext ? useContext(ThemeContext) : null;

    // Determine color scheme
    let colorScheme: ThemeMode;

    if (themeContext) {
        colorScheme = themeContext.mode;
    } else {
        colorScheme = systemColorScheme ?? "light";
    }

    return colorScheme === "dark" ? darkColor : lightColor;
}

/**
 * Hook to get semantic color values with fallbacks
 * @param primary - Primary color path
 * @param fallback - Fallback color path if primary doesn't exist
 * @returns Color value
 */
export function useSemanticColorWithFallback(primary: ThemeColorPath, fallback?: ThemeColorPath): string {
    try {
        return useSemanticColor(primary);
    } catch {
        if (fallback) {
            return useSemanticColor(fallback);
        }

        // Always call hooks in the same order
        const systemColorScheme = useColorScheme();
        const themeContext = ThemeContext ? useContext(ThemeContext) : null;

        let colorScheme: ThemeMode;

        if (themeContext) {
            colorScheme = themeContext.mode;
        } else {
            colorScheme = systemColorScheme ?? "light";
        }

        return colorScheme === "dark" ? "#FFFFFF" : "#000000";
    }
}

// Helper function to create style objects with theme colors
export function createThemedStyles<T extends Record<string, any>>(
    styleCreator: (theme: ReturnType<typeof useTheme>) => T
) {
    return function useThemedStyles(): T {
        const theme = useTheme();
        return styleCreator(theme);
    };
}
