import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
    withTiming,
    Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "../ThemedText";
import { IconWallet, IconApps, IconTrophy, IconUser } from "@tabler/icons-react-native";

// Tab icons mapping with fallbacks
const getTabIcon = (routeName: string, focused: boolean) => {
    const iconSize = 24;
    const iconColor = focused ? "#667eea" : "#8E8E93";
    const strokeWidth = focused ? 2.5 : 2;

    try {
        const iconMap: Record<string, React.ReactNode> = {
            wallet: <IconWallet size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
            services: <IconApps size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
            rewards: <IconTrophy size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
            profile: <IconUser size={iconSize} color={iconColor} strokeWidth={strokeWidth} />,
        };

        return iconMap[routeName] || <IconWallet size={iconSize} color={iconColor} strokeWidth={strokeWidth} />;
    } catch (error) {
        // Fallback to emoji if icons fail
        const emojiMap: Record<string, string> = {
            wallet: "💳",
            services: "🔧",
            rewards: "🏆",
            profile: "👤",
        };

        return <ThemedText style={{ fontSize: iconSize }}>{emojiMap[routeName] || "📱"}</ThemedText>;
    }
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface TabBarButtonProps {
    label: string;
    routeName: string;
    isFocused: boolean;
    onPress: () => void;
    onLongPress: () => void;
    index: number;
    tabCount: number;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
    label,
    routeName,
    isFocused,
    onPress,
    onLongPress,
    index,
    tabCount,
}) => {
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(isFocused ? 1 : 0.6);

    React.useEffect(() => {
        scale.value = withSpring(isFocused ? 1.1 : 1, {
            damping: 15,
            stiffness: 150,
        });

        translateY.value = withSpring(isFocused ? -2 : 0, {
            damping: 15,
            stiffness: 150,
        });

        opacity.value = withTiming(isFocused ? 1 : 0.6, {
            duration: 200,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
    }, [isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { translateY: translateY.value }],
    }));

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: interpolate(scale.value, [1, 1.1], [0.85, 1]) }],
    }));

    const animatedButtonStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const animatedIndicatorStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <AnimatedTouchableOpacity
            style={[styles.tabButton, animatedButtonStyle]}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
        >
            {isFocused && (
                <Animated.View style={[styles.activeIndicator, animatedIndicatorStyle]}>
                    <LinearGradient
                        colors={["#667eea", "#764ba2"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientIndicator}
                    />
                </Animated.View>
            )}

            <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
                {getTabIcon(routeName, isFocused)}
            </Animated.View>

            <Animated.View style={animatedTextStyle}>
                <ThemedText style={[styles.labelText, { color: isFocused ? "#667eea" : "#8E8E93" }]}>
                    {label}
                </ThemedText>
            </Animated.View>
        </AnimatedTouchableOpacity>
    );
};

interface CustomTabBarProps {
    state: any;
    descriptors: any;
    navigation: any;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            {Platform.OS === "ios" ? (
                <BlurView intensity={95} tint="light" style={styles.backgroundContainer}>
                    <View style={styles.solidBackground} />
                </BlurView>
            ) : (
                <View style={styles.solidBackground} />
            )}

            <View style={styles.tabContainer}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                              ? options.title
                              : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: "tabLongPress",
                            target: route.key,
                        });
                    };

                    return (
                        <TabBarButton
                            key={route.key}
                            label={label as string}
                            routeName={route.name}
                            isFocused={isFocused}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            index={index}
                            tabCount={state.routes.length}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: "hidden",
    },
    backgroundContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    solidBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#ffffff",
    },
    tabContainer: {
        flexDirection: "row",
        paddingTop: 12,
        paddingHorizontal: 16,
        paddingBottom: 8,
        minHeight: 80,
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        position: "relative",
    },
    activeIndicator: {
        position: "absolute",
        top: -2,
        width: 32,
        height: 3,
        borderRadius: 2,
        overflow: "hidden",
    },
    gradientIndicator: {
        flex: 1,
        borderRadius: 2,
    },
    iconContainer: {
        marginBottom: 4,
        alignItems: "center",
        justifyContent: "center",
    },
    iconText: {
        fontSize: 24,
        lineHeight: 28,
    },
    labelText: {
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 0.5,
    },
});

export default CustomTabBar;
