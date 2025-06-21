/**
 * Comprehensive Color Theme System for Bitriel Mobile App
 * Supports both light and dark modes with semantic color tokens
 * Compatible with both StyleSheet usage and NativeWind classes
 */

// Base color palette - brand colors that don't change with theme
export const BRAND_COLORS = {
    // Primary brand colors
    primary: {
        50: "#FFF9E6",
        100: "#FFF5D5",
        200: "#FFE7AC",
        300: "#FFD782",
        400: "#FFC763",
        500: "#FFAC30", // Main primary color
        600: "#DB8923",
        700: "#B76A18",
        800: "#934E0F",
        900: "#7A3A09",
    },

    // Secondary brand colors
    secondary: {
        50: "#F4F5F8",
        100: "#E8EAF0",
        200: "#D1D5E1",
        300: "#A8B0C7",
        400: "#7B85A8",
        500: "#3A4276", // Main secondary color
        600: "#2F3660",
        700: "#252A4A",
        800: "#1A1E34",
        900: "#10121E",
    },

    // Status colors
    success: {
        50: "#F0FDE4",
        100: "#DEFCCA",
        200: "#C6F8AD",
        300: "#ADF196",
        400: "#89E874",
        500: "#60C754",
        600: "#3DA73A",
        700: "#258629",
        800: "#166F21",
        900: "#0F4F18",
    },

    warning: {
        50: "#FEFBD1",
        100: "#FDF6A4",
        200: "#FBEE76",
        300: "#F7E654",
        400: "#F2D91D",
        500: "#D0B715",
        600: "#AE970E",
        700: "#8C7809",
        800: "#746105",
        900: "#5C4D04",
    },

    danger: {
        50: "#FFEADF",
        100: "#FFD0C0",
        200: "#FFB1A1",
        300: "#FF948A",
        400: "#FF6363",
        500: "#DB4855",
        600: "#B73149",
        700: "#931F3D",
        800: "#7A1336",
        900: "#610F2B",
    },

    info: {
        50: "#D8F2FE",
        100: "#B2E2FE",
        200: "#8CCEFD",
        300: "#6FBAFB",
        400: "#409AF9",
        500: "#2E78D6",
        600: "#2059B3",
        700: "#143E90",
        800: "#0C2B77",
        900: "#081D5A",
    },

    // Neutral colors
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
} as const;

// Semantic color tokens for light theme
export const LIGHT_THEME = {
    // Text colors
    text: {
        primary: "#11181C",
        secondary: "#7B7F9E",
        tertiary: "#A1A1AA",
        disabled: "#D4D4D8",
        inverse: "#FFFFFF",
        link: "#0a7ea4",
        accent: BRAND_COLORS.primary[500],
    },

    // Background colors
    background: {
        primary: "#FFFFFF",
        secondary: "#F8F9FA",
        tertiary: "#F1F3F6",
        inverse: "#11181C",
        overlay: "rgba(0, 0, 0, 0.5)",
        card: "#FFFFFF",
        surface: "#F8F9FA",
    },

    // Border colors
    border: {
        primary: "#E5E5E7",
        secondary: "#F1F3F6",
        accent: BRAND_COLORS.primary[500],
        focus: BRAND_COLORS.primary[400],
        error: BRAND_COLORS.danger[500],
    },

    // Interactive states
    interactive: {
        ripple: "rgba(180, 180, 180, 0.2)",
        hover: "rgba(0, 0, 0, 0.05)",
        pressed: "rgba(0, 0, 0, 0.1)",
        focus: BRAND_COLORS.primary[100],
    },

    // Status bar
    statusBar: {
        background: "#FFFFFF",
        content: "dark-content" as const,
    },

    // Shadows
    shadow: {
        color: "#000000",
        opacity: 0.1,
    },
} as const;

// Semantic color tokens for dark theme
export const DARK_THEME = {
    // Text colors
    text: {
        primary: "#ECEDEE",
        secondary: "#A1A1AA",
        tertiary: "#71717A",
        disabled: "#52525B",
        inverse: "#11181C",
        link: "#60A5FA",
        accent: BRAND_COLORS.primary[400],
    },

    // Background colors
    background: {
        primary: "#030003",
        secondary: "#110F11",
        tertiary: "#1C1C1E",
        inverse: "#FFFFFF",
        overlay: "rgba(0, 0, 0, 0.7)",
        card: "#1C1C1E",
        surface: "#2C2C2E",
    },

    // Border colors
    border: {
        primary: "#48484A",
        secondary: "#2C2C2E",
        accent: BRAND_COLORS.primary[400],
        focus: BRAND_COLORS.primary[300],
        error: BRAND_COLORS.danger[400],
    },

    // Interactive states
    interactive: {
        ripple: "rgba(132, 132, 132, 0.2)",
        hover: "rgba(255, 255, 255, 0.05)",
        pressed: "rgba(255, 255, 255, 0.1)",
        focus: BRAND_COLORS.primary[900],
    },

    // Status bar
    statusBar: {
        background: "#030003",
        content: "light-content" as const,
    },

    // Shadows
    shadow: {
        color: "#000000",
        opacity: 0.3,
    },
} as const;

// Complete theme structure
export const THEMES = {
    light: {
        ...LIGHT_THEME,
        brand: BRAND_COLORS,
    },
    dark: {
        ...DARK_THEME,
        brand: BRAND_COLORS,
    },
} as const;

// Legacy Colors object for backward compatibility
const Colors = {
    // Basic colors (deprecated - use BRAND_COLORS instead)
    white: BRAND_COLORS.white,
    black: BRAND_COLORS.black,
    primary: BRAND_COLORS.primary[500],
    secondary: BRAND_COLORS.secondary[500],
    defaultText: "#7B7F9E",
    blackText: "#1B1D28",
    offWhite: "#F1F3F6",
    red: BRAND_COLORS.danger[500],

    // Theme-based colors (deprecated - use THEMES instead)
    light: {
        text: LIGHT_THEME.text.primary,
        background: LIGHT_THEME.background.primary,
        foreground: LIGHT_THEME.background.secondary,
        ripple: LIGHT_THEME.interactive.ripple,
        tint: "#0a7ea4",
        statusBarBackground: LIGHT_THEME.statusBar.background,
        statusBarContent: LIGHT_THEME.statusBar.content,
        card: LIGHT_THEME.background.card,
        surface: LIGHT_THEME.background.surface,
        border: LIGHT_THEME.border.primary,
    },
    dark: {
        text: DARK_THEME.text.primary,
        background: DARK_THEME.background.primary,
        foreground: DARK_THEME.background.secondary,
        ripple: DARK_THEME.interactive.ripple,
        tint: "#fff",
        statusBarBackground: DARK_THEME.statusBar.background,
        statusBarContent: DARK_THEME.statusBar.content,
        card: DARK_THEME.background.card,
        surface: DARK_THEME.background.surface,
        border: DARK_THEME.border.primary,
    },

    // Status Bar Colors (deprecated)
    statusBar: {
        light: {
            background: LIGHT_THEME.statusBar.background,
            content: LIGHT_THEME.statusBar.content,
        },
        dark: {
            background: DARK_THEME.statusBar.background,
            content: DARK_THEME.statusBar.content,
        },
        primary: {
            background: BRAND_COLORS.primary[500],
            content: "dark-content" as const,
        },
        gradient: {
            background: "#667eea",
            content: "light-content" as const,
        },
        transparent: {
            background: "transparent",
            content: "light-content" as const,
        },
    },

    // Background colors (deprecated)
    backgrounds: {
        light: LIGHT_THEME.background.primary,
        dark: DARK_THEME.background.primary,
        gradient: "#667eea",
        offWhite: "#F1F3F6",
        primaryGradient: [BRAND_COLORS.primary[500], BRAND_COLORS.primary[600]],
        secondaryGradient: ["#667eea", "#764ba2"],
    },
};

// Status bar presets (legacy compatibility)
export const StatusBarPresets = {
    default: (isDark: boolean) => ({
        backgroundColor: isDark ? DARK_THEME.statusBar.background : LIGHT_THEME.statusBar.background,
        barStyle: isDark ? DARK_THEME.statusBar.content : LIGHT_THEME.statusBar.content,
    }),
    primary: {
        backgroundColor: BRAND_COLORS.primary[500],
        barStyle: "dark-content" as const,
    },
    gradient: {
        backgroundColor: "#667eea",
        barStyle: "light-content" as const,
    },
    transparent: {
        backgroundColor: "transparent",
        barStyle: "light-content" as const,
    },
    lightBackground: {
        backgroundColor: BRAND_COLORS.white,
        barStyle: "dark-content" as const,
    },
    darkBackground: {
        backgroundColor: BRAND_COLORS.black,
        barStyle: "light-content" as const,
    },
} as const;

// Helper function to automatically determine status bar style based on background
export const getContrastStatusBar = (backgroundColor: string) => {
    if (!backgroundColor || backgroundColor === "transparent") {
        return StatusBarPresets.transparent;
    }

    // Remove # if present
    const hex = backgroundColor.replace("#", "");

    // Handle 3-digit hex codes
    const fullHex =
        hex.length === 3
            ? hex
                  .split("")
                  .map(char => char + char)
                  .join("")
            : hex;

    // Convert to RGB
    const r = parseInt(fullHex.substr(0, 2), 16);
    const g = parseInt(fullHex.substr(2, 2), 16);
    const b = parseInt(fullHex.substr(4, 2), 16);

    // Calculate relative luminance (WCAG formula)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Use dark content for light backgrounds (luminance > 0.5)
    // Use light content for dark backgrounds (luminance <= 0.5)
    return {
        backgroundColor,
        barStyle: luminance > 0.5 ? ("dark-content" as const) : ("light-content" as const),
    };
};

// Theme type definitions
export type ThemeMode = "light" | "dark";
export type Theme = typeof THEMES.light;
export type BrandColors = typeof BRAND_COLORS;

// Export everything
export { THEMES as Themes };
export default Colors;
