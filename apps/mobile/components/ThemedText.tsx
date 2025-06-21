import { Text, type TextProps, StyleSheet } from "react-native";
import { useAppTheme } from "~/src/context/ThemeProvider";

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    variant?: "primary" | "secondary" | "tertiary" | "accent" | "inverse" | "link";
    type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
    style,
    lightColor,
    darkColor,
    variant = "primary",
    type = "default",
    ...rest
}: ThemedTextProps) {
    const { getColor, isDark } = useAppTheme();

    // Use custom colors if provided, otherwise use semantic color
    let textColor: string;

    if (lightColor || darkColor) {
        textColor = isDark ? darkColor || lightColor || "#FFFFFF" : lightColor || darkColor || "#000000";
    } else {
        textColor = getColor(`text.${variant}`);
    }

    return (
        <Text
            style={[
                { color: textColor },
                type === "default" ? styles.default : undefined,
                type === "title" ? styles.title : undefined,
                type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
                type === "subtitle" ? styles.subtitle : undefined,
                type === "link" ? styles.link : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        fontFamily: "SpaceGroteskRegular",
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: "SpaceGroteskSemiBold",
    },
    title: {
        fontSize: 32,
        fontFamily: "SpaceGroteskBold",
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontFamily: "SpaceGroteskBold",
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        fontFamily: "SpaceGroteskMedium",
    },
});
