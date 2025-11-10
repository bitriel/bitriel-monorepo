const { hairlineWidth, platformSelect } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./screens/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    corePlugins: {
        fontWeight: false, // Disable default font-weight utilities
    },
    theme: {
        extend: {
            fontFamily: {
                sans: ["Manrope_400Regular"],
            },
            colors: {
                border: withOpacity("border"),
                input: withOpacity("input"),
                ring: withOpacity("ring"),
                background: withOpacity("background"),
                foreground: withOpacity("foreground"),
                primary: {
                    DEFAULT: withOpacity("primary"),
                    foreground: withOpacity("primary-foreground"),
                },
                secondary: {
                    DEFAULT: withOpacity("secondary"),
                    foreground: withOpacity("secondary-foreground"),
                },
                destructive: {
                    DEFAULT: withOpacity("destructive"),
                    foreground: withOpacity("destructive-foreground"),
                },
                muted: {
                    DEFAULT: withOpacity("muted"),
                    foreground: withOpacity("muted-foreground"),
                },
                accent: {
                    DEFAULT: withOpacity("accent"),
                    foreground: withOpacity("accent-foreground"),
                },
                popover: {
                    DEFAULT: withOpacity("popover"),
                    foreground: withOpacity("popover-foreground"),
                },
                card: {
                    DEFAULT: withOpacity("card"),
                    foreground: withOpacity("card-foreground"),
                },
            },
            borderWidth: {
                hairline: hairlineWidth(),
            },
        },
    },
    plugins: [
        function ({ addBase, addUtilities }) {
            // Set default font family globally for consistent rendering
            addBase({
                "*": {
                    fontFamily: "Manrope_400Regular",
                },
            });
            
            // Custom font-weight utilities that map to Manrope font families
            addUtilities({
                ".font-extralight": {
                    fontFamily: "Manrope_200ExtraLight",
                },
                ".font-light": {
                    fontFamily: "Manrope_300Light",
                },
                ".font-normal": {
                    fontFamily: "Manrope_400Regular",
                },
                ".font-medium": {
                    fontFamily: "Manrope_500Medium",
                },
                ".font-semibold": {
                    fontFamily: "Manrope_600SemiBold",
                },
                ".font-bold": {
                    fontFamily: "Manrope_700Bold",
                },
                ".font-extrabold": {
                    fontFamily: "Manrope_800ExtraBold",
                },
            });
        },
    ],
};

function withOpacity(variableName) {
    return ({ opacityValue }) => {
        if (opacityValue !== undefined) {
            return platformSelect({
                ios: `rgb(var(--${variableName}) / ${opacityValue})`,
                android: `rgb(var(--android-${variableName}) / ${opacityValue})`,
            });
        }
        return platformSelect({
            ios: `rgb(var(--${variableName}))`,
            android: `rgb(var(--android-${variableName}))`,
        });
    };
}
