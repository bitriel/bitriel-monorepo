import { MotiImage, MotiView } from "moti";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Easing } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { QuickAction, IconType } from "~/src/types/quick.action.types";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";
import { useAppTheme } from "~/src/context/ThemeProvider";

const { width } = Dimensions.get("screen");

const images = [
    `https://images.pexels.com/photos/2887710/pexels-photo-2887710.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=350&w=660`,
    `https://images.pexels.com/photos/1561020/pexels-photo-1561020.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350&w=660`,
    `https://images.pexels.com/photos/1212407/pexels-photo-1212407.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350&w=660`,
    `https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350&w=660`,
];

interface WalletBalanceCardProps {
    address?: string;
    totalBalance: string;
    onCopyAddress?: (address: string) => void;
    quickActions: QuickAction[];
    networkName?: string;
}

const _width = width * 0.94;
const _height = _width * 0.6;
const _spacing = 8;
const _cardPadding = _spacing * 2;
const _availableWidth = _width - _cardPadding;
const _gapsBetweenButtons = _spacing;

const calculateButtonWidths = (numButtons: number) => {
    const _totalButtonsWidth = _availableWidth - _gapsBetweenButtons * (numButtons - 1);
    const _buttonWidth = _totalButtonsWidth / numButtons;
    return { _buttonWidth };
};

const getIconForType = (type: IconType): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (type) {
        case "SEND":
            return "send";
        case "RECEIVE":
            return "download";
        case "SWAP":
            return "swap-horizontal";
        case "TOKENS":
            return "fire";
    }
};

const truncateString = (str: string, first: number, last: number) => {
    if (!str) return str;
    const strLen = str.length;
    if (strLen <= first + last) return str;
    return `${str.slice(0, first)}...${str.slice(strLen - last)}`;
};

const AnimatedBackground = React.memo(() => {
    return (
        <MotiView
            key="background-container"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                opacity: {
                    type: "timing",
                    duration: 1000,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                },
            }}
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
            }}
        >
            <MotiImage
                key="background-image"
                source={{ uri: images[3] }}
                from={{
                    transform: [{ rotate: "0deg" }, { scale: 1.8 }],
                }}
                animate={{
                    transform: [{ rotate: "360deg" }, { scale: 3 }],
                }}
                transition={{
                    type: "timing",
                    duration: 8000,
                    easing: Easing.linear,
                    loop: true,
                    repeatReverse: true,
                }}
                blurRadius={60}
                style={{
                    width: _width * 1.5,
                    height: _height * 1.5,
                    resizeMode: "cover",
                    position: "absolute",
                    alignSelf: "center",
                }}
            />
        </MotiView>
    );
});

const ShimmerButton = ({ width }: { width: number }) => {
    const { isDark } = useAppTheme();

    return (
        <View
            style={{
                width: width,
                height: 100,
                borderRadius: 12,
                overflow: "hidden",
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.1)",
            }}
        >
            <MotiView
                from={{
                    translateX: -width * 2,
                }}
                animate={{
                    translateX: width * 2,
                }}
                transition={{
                    type: "timing",
                    duration: 1500,
                    loop: true,
                    easing: Easing.linear,
                }}
                style={{
                    position: "absolute",
                    width: width * 4,
                    height: "100%",
                }}
            >
                <LinearGradient
                    colors={
                        isDark
                            ? ["transparent", "rgba(255, 255, 255, 0.1)", "transparent"]
                            : ["transparent", "rgba(255, 255, 255, 0.2)", "transparent"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </MotiView>
        </View>
    );
};

export default function WalletBalanceCard({
    address,
    totalBalance,
    onCopyAddress,
    quickActions,
    networkName,
}: WalletBalanceCardProps) {
    const [isLoading, setIsLoading] = React.useState(true);
    const { getColor, isDark } = useAppTheme();

    React.useEffect(() => {
        if (networkName) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [networkName]);

    const { _buttonWidth } = calculateButtonWidths(quickActions.length);

    return (
        <ThemedView variant="primary" style={{ alignItems: "center", marginVertical: 10 }}>
            <View
                style={{
                    width: _width,
                    height: _height,
                    overflow: "hidden",
                    borderRadius: 20,
                    padding: _cardPadding,
                }}
            >
                <AnimatedBackground />

                <View style={{ flex: 1, justifyContent: "space-between" }}>
                    {/* Top Section */}
                    <View>
                        <TouchableOpacity
                            style={{ flexDirection: "row", alignItems: "center" }}
                            onPress={() => address && onCopyAddress?.(address)}
                        >
                            <ThemedText
                                style={{
                                    fontFamily: "SpaceGrotesk-Bold",
                                    color: "#FFFFFF",
                                    fontSize: 16,
                                }}
                                numberOfLines={1}
                            >
                                {address ? truncateString(address, 9, 9) : "N/A"}
                            </ThemedText>
                            <MaterialCommunityIcons
                                name="content-copy"
                                size={16}
                                color="#FFFFFF"
                                style={{ marginLeft: 5 }}
                            />
                        </TouchableOpacity>

                        <ThemedText
                            style={{
                                fontFamily: "SpaceGrotesk-Regular",
                                color: "rgba(255, 255, 255, 0.8)",
                                fontSize: 12,
                                marginTop: 2,
                            }}
                        >
                            Total Balance
                        </ThemedText>
                        <ThemedText
                            style={{
                                fontFamily: "SpaceGrotesk-Bold",
                                color: "#FFFFFF",
                                fontSize: 28,
                                marginTop: 4,
                            }}
                        >
                            {totalBalance}
                        </ThemedText>
                    </View>

                    {/* Bottom Section - Action Buttons */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: _gapsBetweenButtons,
                        }}
                    >
                        {isLoading
                            ? quickActions.map((_, index) => <ShimmerButton key={index} width={_buttonWidth} />)
                            : quickActions.map((action, index) => (
                                  <TouchableOpacity
                                      key={index}
                                      onPress={action.onPress}
                                      style={{
                                          width: _buttonWidth,
                                          height: 100,
                                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                                          borderRadius: 12,
                                          alignItems: "center",
                                          justifyContent: "center",
                                          backdropFilter: "blur(10px)",
                                      }}
                                      activeOpacity={0.8}
                                  >
                                      <MaterialCommunityIcons
                                          name={getIconForType(action.icon)}
                                          size={32}
                                          color="#FFFFFF"
                                      />
                                      <ThemedText
                                          style={{
                                              fontFamily: "SpaceGrotesk-Medium",
                                              color: "#FFFFFF",
                                              fontSize: 12,
                                              marginTop: 8,
                                          }}
                                      >
                                          {action.label}
                                      </ThemedText>
                                  </TouchableOpacity>
                              ))}
                    </View>
                </View>
            </View>
        </ThemedView>
    );
}
