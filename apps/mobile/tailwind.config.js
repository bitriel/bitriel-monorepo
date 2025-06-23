/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Core Bitriel brand colors
                bitriel: {
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
                        DEFAULT: "#4F46E5",
                    },
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
                        DEFAULT: "#D97706",
                    },
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
                        DEFAULT: "#737373",
                    },
                },

                // Primary/secondary shortcuts for compatibility
                primary: {
                    50: "#EEF2FF",
                    100: "#E0E7FF", 
                    200: "#C7D2FE",
                    300: "#A5B4FC",
                    400: "#818CF8",
                    500: "#6366F1",
                    600: "#4F46E5",
                    700: "#4338CA",
                    800: "#3730A3",
                    900: "#312E81",
                    950: "#1E1B4B",
                    DEFAULT: "#4F46E5",
                },
                secondary: {
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
                    DEFAULT: "#D97706",
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
                    DEFAULT: "#10B981",
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
                    DEFAULT: "#F59E0B",
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
                    DEFAULT: "#EF4444",
                },
                danger: {
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
                    DEFAULT: "#EF4444",
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
                    DEFAULT: "#3B82F6",
                },

                // Light theme semantic tokens
                text: {
                    primary: "#171717",
                    secondary: "#404040",
                    tertiary: "#737373",
                    disabled: "#A3A3A3",
                    inverse: "#FFFFFF",
                    link: "#4F46E5",
                    accent: "#D97706",
                },
                background: {
                    primary: "#FFFFFF",
                    secondary: "#FAFAFA",
                    tertiary: "#F5F5F5",
                    inverse: "#171717",
                    overlay: "rgba(0, 0, 0, 0.5)",
                },
                surface: {
                    primary: "#FFFFFF",
                    secondary: "#FAFAFA",
                    tertiary: "#F5F5F5", 
                    elevated: "#FFFFFF",
                    brand: "#EEF2FF",
                    accent: "#FFFBEB",
                },
                border: {
                    primary: "#E5E5E5",
                    secondary: "#F5F5F5",
                    focus: "#6366F1",
                    error: "#EF4444",
                },

                // Dark theme variants
                dark: {
                    text: {
                        primary: "#FAFAFA",
                        secondary: "#D4D4D4",
                        tertiary: "#A3A3A3",
                        disabled: "#525252",
                        inverse: "#171717",
                        link: "#818CF8",
                        accent: "#FBBF24",
                    },
                    background: {
                        primary: "#0A0A0A",
                        secondary: "#171717",
                        tertiary: "#262626",
                        inverse: "#FFFFFF",
                        overlay: "rgba(0, 0, 0, 0.8)",
                    },
                    surface: {
                        primary: "#171717",
                        secondary: "#262626",
                        tertiary: "#404040",
                        elevated: "#262626",
                        brand: "#1E1B4B",
                        accent: "#451A03",
                    },
                    border: {
                        primary: "#404040",
                        secondary: "#262626",
                        focus: "#818CF8",
                        error: "#F87171",
                    },
                },

                // Base colors
                white: "#FFFFFF",
                black: "#000000",
                transparent: "transparent",
            },

            fontFamily: {
                SpaceGroteskBold: ["SpaceGrotesk-Bold"],
                SpaceGroteskLight: ["SpaceGrotesk-Light"],
                SpaceGroteskMedium: ["SpaceGrotesk-Medium"],
                SpaceGroteskRegular: ["SpaceGrotesk-Regular"],
                SpaceGroteskSemiBold: ["SpaceGrotesk-SemiBold"],
            },

            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },

            borderRadius: {
                '4xl': '2rem',
            },

            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
                'medium': '0 4px 16px rgba(0, 0, 0, 0.15)',
                'strong': '0 8px 32px rgba(0, 0, 0, 0.2)',
                'brand': '0 4px 16px rgba(79, 70, 229, 0.15)',
                'accent': '0 4px 16px rgba(217, 119, 6, 0.15)',
            },

            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale': 'scale 0.2s ease-in-out',
            },

            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scale: {
                    '0%': { transform: 'scale(0.95)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [
        function ({ addUtilities, theme }) {
            const newUtilities = {
                // Semantic utilities that adapt to dark mode
                '.bg-app-primary': {
                    backgroundColor: theme('colors.background.primary'),
                    '@media (prefers-color-scheme: dark)': {
                        backgroundColor: theme('colors.dark.background.primary'),
                    },
                },
                '.bg-app-secondary': {
                    backgroundColor: theme('colors.background.secondary'),
                    '@media (prefers-color-scheme: dark)': {
                        backgroundColor: theme('colors.dark.background.secondary'),
                    },
                },
                '.bg-app-tertiary': {
                    backgroundColor: theme('colors.background.tertiary'),
                    '@media (prefers-color-scheme: dark)': {
                        backgroundColor: theme('colors.dark.background.tertiary'),
                    },
                },

                // Surface utilities
                '.bg-surface-primary': {
                    backgroundColor: theme('colors.surface.primary'),
                    '@media (prefers-color-scheme: dark)': {
                        backgroundColor: theme('colors.dark.surface.primary'),
                    },
                },
                '.bg-surface-elevated': {
                    backgroundColor: theme('colors.surface.elevated'),
                    '@media (prefers-color-scheme: dark)': {
                        backgroundColor: theme('colors.dark.surface.elevated'),
                    },
                },
                '.bg-surface-brand': {
                    backgroundColor: theme('colors.surface.brand'),
                    '@media (prefers-color-scheme: dark)': {
                        backgroundColor: theme('colors.dark.surface.brand'),
                    },
                },

                // Text utilities
                '.text-app-primary': {
                    color: theme('colors.text.primary'),
                    '@media (prefers-color-scheme: dark)': {
                        color: theme('colors.dark.text.primary'),
                    },
                },
                '.text-app-secondary': {
                    color: theme('colors.text.secondary'),
                    '@media (prefers-color-scheme: dark)': {
                        color: theme('colors.dark.text.secondary'),
                    },
                },
                '.text-app-tertiary': {
                    color: theme('colors.text.tertiary'),
                    '@media (prefers-color-scheme: dark)': {
                        color: theme('colors.dark.text.tertiary'),
                    },
                },
                '.text-app-accent': {
                    color: theme('colors.text.accent'),
                    '@media (prefers-color-scheme: dark)': {
                        color: theme('colors.dark.text.accent'),
                    },
                },

                // Border utilities
                '.border-app-primary': {
                    borderColor: theme('colors.border.primary'),
                    '@media (prefers-color-scheme: dark)': {
                        borderColor: theme('colors.dark.border.primary'),
                    },
                },
                '.border-app-focus': {
                    borderColor: theme('colors.border.focus'),
                    '@media (prefers-color-scheme: dark)': {
                        borderColor: theme('colors.dark.border.focus'),
                    },
                },

                // Interactive utilities
                '.hover-app': {
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    },
                    '@media (prefers-color-scheme: dark)': {
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        },
                    },
                },

                // Brand gradients
                '.bg-gradient-brand': {
                    background: `linear-gradient(135deg, ${theme('colors.bitriel.blue.600')}, ${theme('colors.bitriel.blue.500')})`,
                },
                '.bg-gradient-accent': {
                    background: `linear-gradient(135deg, ${theme('colors.bitriel.gold.600')}, ${theme('colors.bitriel.gold.500')})`,
                },
                '.bg-gradient-brand-gold': {
                    background: `linear-gradient(135deg, ${theme('colors.bitriel.blue.600')}, ${theme('colors.bitriel.gold.600')})`,
                },
            };

            addUtilities(newUtilities);
        },
    ],
};
