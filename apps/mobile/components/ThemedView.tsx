import { View, type ViewProps } from "react-native";
import { useAppTheme } from "~/src/context/ThemeProvider";

export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    variant?: "primary" | "secondary" | "tertiary" | "card" | "surface" | "inverse";
};

export function ThemedView({ style, lightColor, darkColor, variant = "primary", ...otherProps }: ThemedViewProps) {
    const { getColor, isDark } = useAppTheme();

    // Use custom colors if provided, otherwise use semantic color
    let backgroundColor: string;

    if (lightColor || darkColor) {
        backgroundColor = isDark ? darkColor || lightColor || "#000000" : lightColor || darkColor || "#FFFFFF";
    } else {
        backgroundColor = getColor(`background.${variant}`);
    }

    return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
