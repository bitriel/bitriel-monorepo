// Color analysis utilities for smart status bar detection

interface ColorRGB {
    r: number;
    g: number;
    b: number;
}

/**
 * Convert hex color to RGB
 */
export const hexToRgb = (hex: string): ColorRGB | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
};

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 specification
 */
export const getLuminance = (color: ColorRGB): number => {
    const { r, g, b } = color;

    // Convert to sRGB
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;

    // Apply gamma correction
    const rLin = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLin = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLin = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    // Calculate luminance
    return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
};

/**
 * Determine optimal status bar content style based on background color
 */
export const getOptimalStatusBarStyle = (backgroundColor: string): "light-content" | "dark-content" => {
    // Handle special cases
    if (backgroundColor === "transparent" || backgroundColor === "rgba(0,0,0,0)") {
        return "light-content"; // Assume dark background for transparent
    }

    // Convert color to RGB
    const rgb = hexToRgb(backgroundColor);
    if (!rgb) {
        // Fallback for invalid colors
        return "dark-content";
    }

    // Calculate luminance
    const luminance = getLuminance(rgb);

    // WCAG 2.1 threshold: 0.179 provides good contrast
    // Above threshold = light background = dark content
    // Below threshold = dark background = light content
    return luminance > 0.179 ? "dark-content" : "light-content";
};

/**
 * Auto-detect the best status bar configuration for a given background
 */
export const autoDetectStatusBarConfig = (backgroundColor: string) => {
    const contentStyle = getOptimalStatusBarStyle(backgroundColor);

    return {
        backgroundColor: backgroundColor === "transparent" ? "transparent" : backgroundColor,
        barStyle: contentStyle,
        isOptimized: true,
        luminance:
            backgroundColor !== "transparent" ? getLuminance(hexToRgb(backgroundColor) || { r: 0, g: 0, b: 0 }) : 0,
    };
};

/**
 * Detect if a color is considered "dark" or "light"
 */
export const isLightColor = (color: string): boolean => {
    const rgb = hexToRgb(color);
    if (!rgb) return false;

    const luminance = getLuminance(rgb);
    return luminance > 0.5;
};
