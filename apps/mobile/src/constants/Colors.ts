/**
 * Bitriel Unified Color System
 * Modern, scalable color system for consistent theming across the app
 * Supports both light and dark modes with semantic color tokens
 */

// Core Bitriel brand colors
export const BITRIEL_COLORS = {
    // Primary: Bitriel Blue
    blue: {
        50: "#EEF2FF",
        100: "#E0E7FF",
        200: "#C7D2FE",
        300: "#A5B4FC",
        400: "#818CF8",
        500: "#6366F1",
        600: "#4F46E5", // Main brand blue
        700: "#4338CA",
        800: "#3730A3",
        900: "#312E81",
        950: "#1E1B4B",
    },

    // Secondary: Bitriel Gold
    gold: {
        50: "#FFFBEB",
        100: "#FEF3C7",
        200: "#FDE68A",
        300: "#FCD34D",
        400: "#FBBF24",
        500: "#F59E0B",
        600: "#D97706", // Main brand gold
        700: "#B45309",
        800: "#92400E",
        900: "#78350F",
        950: "#451A03",
    },

    // Neutral scale for backgrounds and text
    neutral: {
        0: "#FFFFFF",
        50: "#FAFAFA",
        100: "#F5F5F5",
        200: "#E5E5E5",
        300: "#D4D4D4",
        400: "#A3A3A3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
        950: "#0A0A0A",
        1000: "#000000",
    },

    // Status colors
    success: {
        50: "#ECFDF5",
        100: "#D1FAE5",
        200: "#A7F3D0",
        300: "#6EE7B7",
        400: "#34D399",
        500: "#10B981",
        600: "#059669",
        700: "#047857",
        800: "#065F46",
        900: "#064E3B",
        950: "#022C22",
    },

    warning: {
        50: "#FFFBEB",
        100: "#FEF3C7",
        200: "#FDE68A",
        300: "#FCD34D",
        400: "#FBBF24",
        500: "#F59E0B",
        600: "#D97706",
        700: "#B45309",
        800: "#92400E",
        900: "#78350F",
        950: "#451A03",
    },

    error: {
        50: "#FEF2F2",
        100: "#FEE2E2",
        200: "#FECACA",
        300: "#FCA5A5",
        400: "#F87171",
        500: "#EF4444",
        600: "#DC2626",
        700: "#B91C1C",
        800: "#991B1B",
        900: "#7F1D1D",
        950: "#450A0A",
    },

    info: {
        50: "#EFF6FF",
        100: "#DBEAFE",
        200: "#BFDBFE",
        300: "#93C5FD",
        400: "#60A5FA",
        500: "#3B82F6",
        600: "#2563EB",
        700: "#1D4ED8",
        800: "#1E40AF",
        900: "#1E3A8A",
        950: "#172554",
    },
} as const;

// Light theme
export const LIGHT_THEME = {
    // Brand colors
    primary: {
        main: BITRIEL_COLORS.blue[600],
        light: BITRIEL_COLORS.blue[400],
        dark: BITRIEL_COLORS.blue[700],
        surface: BITRIEL_COLORS.blue[50],
    },

    secondary: {
        main: BITRIEL_COLORS.gold[600],
        light: BITRIEL_COLORS.gold[400],
        dark: BITRIEL_COLORS.gold[700],
        surface: BITRIEL_COLORS.gold[50],
    },

    // Text colors
    text: {
        primary: BITRIEL_COLORS.neutral[900],
        secondary: BITRIEL_COLORS.neutral[700],
        tertiary: BITRIEL_COLORS.neutral[500],
        disabled: BITRIEL_COLORS.neutral[400],
        inverse: BITRIEL_COLORS.neutral[0],
        link: BITRIEL_COLORS.blue[600],
        accent: BITRIEL_COLORS.gold[600],
    },

    // Background colors
    background: {
        primary: BITRIEL_COLORS.neutral[0],
        secondary: BITRIEL_COLORS.neutral[50],
        tertiary: BITRIEL_COLORS.neutral[100],
        inverse: BITRIEL_COLORS.neutral[900],
        overlay: "rgba(0, 0, 0, 0.5)",
        card: BITRIEL_COLORS.neutral[0],
        surface: BITRIEL_COLORS.neutral[50],
    },

    // Surface colors (cards, sheets, modals)
    surface: {
        primary: BITRIEL_COLORS.neutral[0],
        secondary: BITRIEL_COLORS.neutral[50],
        tertiary: BITRIEL_COLORS.neutral[100],
        elevated: BITRIEL_COLORS.neutral[0],
        brand: BITRIEL_COLORS.blue[50],
        accent: BITRIEL_COLORS.gold[50],
    },

    // Border colors
    border: {
        primary: BITRIEL_COLORS.neutral[200],
        secondary: BITRIEL_COLORS.neutral[100],
        focus: BITRIEL_COLORS.blue[500],
        error: BITRIEL_COLORS.error[500],
        accent: BITRIEL_COLORS.blue[500],
    },

    // Interactive states
    interactive: {
        hover: "rgba(0, 0, 0, 0.05)",
        pressed: "rgba(0, 0, 0, 0.1)",
        disabled: BITRIEL_COLORS.neutral[100],
        ripple: "rgba(79, 70, 229, 0.12)",
        focus: BITRIEL_COLORS.blue[500],
    },

    // Status colors
    status: {
        success: BITRIEL_COLORS.success[500],
        warning: BITRIEL_COLORS.warning[500],
        error: BITRIEL_COLORS.error[500],
        info: BITRIEL_COLORS.info[500],
    },

    // Status bar
    statusBar: {
        background: BITRIEL_COLORS.neutral[0],
        content: "dark-content" as const,
    },
} as const;

// Dark theme
export const DARK_THEME = {
    // Brand colors - adjusted for dark mode
    primary: {
        main: BITRIEL_COLORS.blue[400],
        light: BITRIEL_COLORS.blue[300],
        dark: BITRIEL_COLORS.blue[600],
        surface: BITRIEL_COLORS.blue[950],
    },

    secondary: {
        main: BITRIEL_COLORS.gold[400],
        light: BITRIEL_COLORS.gold[300],
        dark: BITRIEL_COLORS.gold[600],
        surface: BITRIEL_COLORS.gold[950],
    },

    // Text colors - optimized for dark backgrounds
    text: {
        primary: BITRIEL_COLORS.neutral[50],
        secondary: BITRIEL_COLORS.neutral[300],
        tertiary: BITRIEL_COLORS.neutral[400],
        disabled: BITRIEL_COLORS.neutral[600],
        inverse: BITRIEL_COLORS.neutral[900],
        link: BITRIEL_COLORS.blue[400],
        accent: BITRIEL_COLORS.gold[400],
    },

    // Background colors - consistent dark hierarchy
    background: {
        primary: BITRIEL_COLORS.neutral[950],
        secondary: BITRIEL_COLORS.neutral[900],
        tertiary: BITRIEL_COLORS.neutral[800],
        inverse: BITRIEL_COLORS.neutral[0],
        overlay: "rgba(0, 0, 0, 0.8)",
        card: BITRIEL_COLORS.neutral[900],
        surface: BITRIEL_COLORS.neutral[800],
    },

    // Surface colors - unified dark surfaces
    surface: {
        primary: BITRIEL_COLORS.neutral[900],
        secondary: BITRIEL_COLORS.neutral[800],
        tertiary: BITRIEL_COLORS.neutral[700],
        elevated: BITRIEL_COLORS.neutral[800],
        brand: BITRIEL_COLORS.blue[950],
        accent: BITRIEL_COLORS.gold[950],
    },

    // Border colors - subtle in dark mode
    border: {
        primary: BITRIEL_COLORS.neutral[700],
        secondary: BITRIEL_COLORS.neutral[800],
        focus: BITRIEL_COLORS.blue[400],
        error: BITRIEL_COLORS.error[400],
        accent: BITRIEL_COLORS.blue[400],
    },

    // Interactive states
    interactive: {
        hover: "rgba(255, 255, 255, 0.05)",
        pressed: "rgba(255, 255, 255, 0.1)",
        disabled: BITRIEL_COLORS.neutral[800],
        ripple: "rgba(129, 140, 248, 0.12)",
        focus: BITRIEL_COLORS.blue[400],
    },

    // Status colors - adapted for dark mode
    status: {
        success: BITRIEL_COLORS.success[400],
        warning: BITRIEL_COLORS.warning[400],
        error: BITRIEL_COLORS.error[400],
        info: BITRIEL_COLORS.info[400],
    },

    // Status bar
    statusBar: {
        background: BITRIEL_COLORS.neutral[950],
        content: "light-content" as const,
    },
} as const;

// Combined themes
export const THEMES = {
    light: LIGHT_THEME,
    dark: DARK_THEME,
} as const;

// Utility functions
export const getThemeColor = (colorPath: string, theme: "light" | "dark" = "light") => {
    const themeObj = THEMES[theme];
    const pathParts = colorPath.split(".");
    let value: any = themeObj;

    for (const part of pathParts) {
        value = value?.[part];
    }

    return typeof value === "string" ? value : BITRIEL_COLORS.neutral[theme === "dark" ? 50 : 900];
};

export const getContrastStatusBar = (backgroundColor: string): "dark-content" | "light-content" => {
    // Simple logic: if background is dark, use light content
    const isDarkBackground =
        backgroundColor.toLowerCase().includes("#0") ||
        backgroundColor.toLowerCase().includes("#1") ||
        backgroundColor.toLowerCase().includes("#2");

    return isDarkBackground ? "light-content" : "dark-content";
};

// Type exports
export type ThemeMode = "light" | "dark";
export type Theme = typeof THEMES.light;
export type BitrielColors = typeof BITRIEL_COLORS;

// Status bar presets for different scenarios
export const StatusBarPresets = {
    default: (isDark: boolean) => ({
        backgroundColor: isDark ? BITRIEL_COLORS.neutral[950] : BITRIEL_COLORS.neutral[0],
        barStyle: (isDark ? "light-content" : "dark-content") as "light-content" | "dark-content",
    }),
    primary: {
        backgroundColor: BITRIEL_COLORS.blue[600],
        barStyle: "light-content" as const,
    },
    transparent: {
        backgroundColor: "transparent",
        barStyle: "light-content" as const,
    },
};

// Legacy compatibility layer for existing components
// This provides backward compatibility while we migrate to the new system
const LEGACY_COLORS = {
    // Primary brand color
    primary: BITRIEL_COLORS.blue[600],

    // Secondary brand color
    secondary: BITRIEL_COLORS.gold[600],

    // Text colors
    blackText: BITRIEL_COLORS.neutral[900],
    defaultText: BITRIEL_COLORS.neutral[700],

    // Background colors
    white: BITRIEL_COLORS.neutral[0],
    offWhite: BITRIEL_COLORS.neutral[50],

    // Status colors
    red: BITRIEL_COLORS.error[500],
    green: BITRIEL_COLORS.success[500],

    // Add other common legacy colors as needed
    black: BITRIEL_COLORS.neutral[1000],
    gray: BITRIEL_COLORS.neutral[500],
} as const;

// Export the new unified color system with legacy compatibility
export default {
    ...BITRIEL_COLORS,
    ...LEGACY_COLORS,
};
