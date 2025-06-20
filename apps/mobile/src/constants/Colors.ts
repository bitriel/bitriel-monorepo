const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

const Colors = {
    // Basic colors
    white: "#FFFFFF",
    black: "#000000",
    primary: "#FFAC30",
    secondary: "#3a4276",
    defaultText: "#7B7F9E",
    blackText: "#1B1D28",
    offWhite: "#F1F3F6",
    red: "#FF0000",

    // Theme-based colors
    light: {
        text: "#11181C",
        background: "#fff",
        foreground: "#f9f9f9",
        ripple: "#B4B4B400",
        tint: tintColorLight,
        // Status bar specific colors
        statusBarBackground: "#FFFFFF",
        statusBarContent: "dark-content" as const,
        // Card and surface colors
        card: "#FFFFFF",
        surface: "#F8F9FA",
        border: "#E5E5E7",
    },
    dark: {
        text: "#ECEDEE",
        background: "#030003",
        foreground: "#110F11",
        ripple: "#84848420",
        tint: tintColorDark,
        // Status bar specific colors
        statusBarBackground: "#030003",
        statusBarContent: "light-content" as const,
        // Card and surface colors
        card: "#1C1C1E",
        surface: "#2C2C2E",
        border: "#48484A",
    },

    // Status Bar Colors
    statusBar: {
        light: {
            background: "#FFFFFF",
            content: "dark-content" as const,
        },
        dark: {
            background: "#030003",
            content: "light-content" as const,
        },
        primary: {
            background: "#FFAC30",
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

    // Background colors for different screens
    backgrounds: {
        light: "#FFFFFF",
        dark: "#030003",
        gradient: "#667eea",
        offWhite: "#F1F3F6",
        primaryGradient: ["#FFAC30", "#FF8C42"],
        secondaryGradient: ["#667eea", "#764ba2"],
    },
};

// Status bar presets for different screen types
export const StatusBarPresets = {
    default: (isDark: boolean) => ({
        backgroundColor: isDark ? Colors.dark.statusBarBackground : Colors.light.statusBarBackground,
        barStyle: isDark ? Colors.dark.statusBarContent : Colors.light.statusBarContent,
    }),
    primary: {
        backgroundColor: Colors.primary,
        barStyle: "dark-content" as const,
    },
    gradient: {
        backgroundColor: Colors.backgrounds.gradient,
        barStyle: "light-content" as const,
    },
    transparent: {
        backgroundColor: "transparent",
        barStyle: "light-content" as const,
    },
    // Auto-contrast presets
    lightBackground: {
        backgroundColor: "#FFFFFF",
        barStyle: "dark-content" as const,
    },
    darkBackground: {
        backgroundColor: "#000000",
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

export default Colors;
