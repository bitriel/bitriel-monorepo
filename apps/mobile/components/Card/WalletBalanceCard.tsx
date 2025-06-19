import { MotiImage, MotiView } from "moti";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Easing } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { QuickAction, IconType } from "~/src/types/quick.action.types";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "~/src/constants/Colors";
import React from "react";

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
    return (
        <View
            style={{
                width: width,
                height: 100,
                borderRadius: 12,
                overflow: "hidden",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
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
                    colors={["transparent", "rgba(255, 255, 255, 0.2)", "transparent"]}
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

    React.useEffect(() => {
        if (networkName) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [networkName]);

    return (
        <View style={{ alignItems: "center", marginVertical: 10 }}>
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
                            <Text className="font-SpaceGroteskBold text-white text-base" numberOfLines={1}>
                                {address ? truncateString(address, 9, 9) : "N/A"}
                            </Text>
                            <MaterialCommunityIcons
                                name="content-copy"
                                size={16}
                                color={Colors.white}
                                style={{ marginLeft: 5 }}
                            />
                        </TouchableOpacity>
                        <View style={{ marginTop: _spacing }}>
                            <Text className="font-SpaceGroteskRegular" style={{ color: "white", opacity: 0.7 }}>
                                Total Balance
                            </Text>
                            <Text className="font-SpaceGroteskBold" style={{ color: "white", fontSize: 32 }}>
                                {totalBalance}
                            </Text>
                        </View>
                    </View>

                    {/* Quick Actions */}
                    {isLoading ? (
                        <View
                            style={{
                                flexDirection: "row",
                                gap: _spacing,
                                justifyContent: "center",
                                paddingHorizontal: quickActions.length === 4 ? _spacing : 0,
                            }}
                        >
                            {quickActions.map((_, index) => {
                                const { _buttonWidth } = calculateButtonWidths(quickActions.length);
                                return <ShimmerButton key={`shimmer-${index}`} width={_buttonWidth} />;
                            })}
                        </View>
                    ) : (
                        <MotiView
                            key={`quick-actions-${networkName}`}
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{
                                opacity: {
                                    type: "timing",
                                    duration: 1000,
                                    delay: 500,
                                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                                },
                                translateY: {
                                    type: "timing",
                                    duration: 1000,
                                    delay: 500,
                                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                                },
                            }}
                            style={{
                                flexDirection: "row",
                                gap: _spacing,
                                justifyContent: "center",
                                paddingHorizontal: quickActions.length === 4 ? _spacing : 0,
                            }}
                        >
                            {quickActions.map((action, index) => {
                                const { _buttonWidth } = calculateButtonWidths(quickActions.length);

                                return (
                                    <MotiView
                                        key={`${action.label}-${networkName}`}
                                        from={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            scale: {
                                                type: "spring",
                                                delay: 800 + index * 100,
                                                damping: 15,
                                            },
                                            opacity: {
                                                type: "timing",
                                                duration: 300,
                                                delay: 800 + index * 100,
                                            },
                                        }}
                                        style={{
                                            width: _buttonWidth,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={action.onPress}
                                            style={{
                                                height: 100,
                                                borderRadius: 12,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flex: 1,
                                                    padding: _spacing * 1.5,
                                                    justifyContent: "space-between",
                                                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                                                }}
                                            >
                                                <MaterialCommunityIcons
                                                    name={getIconForType(action.icon)}
                                                    size={30}
                                                    color={Colors.white}
                                                />
                                                <Text className="font-SpaceGroteskBold text-base text-white">
                                                    {action.label}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </MotiView>
                                );
                            })}
                        </MotiView>
                    )}
                </View>
            </View>
        </View>
    );
}
