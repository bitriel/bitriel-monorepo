import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, SectionList, StyleSheet, Image, TextInput, Platform } from "react-native";
import { useEffect, useState } from "react";
import { Area, CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import Animated, { SharedValue, useAnimatedProps } from "react-native-reanimated";
import Colors from "~/src/constants/Colors";
import { defaultStyles } from "~/src/constants/Styles";
import { GetListingCoinsInfo } from "~/src/api/infoApi";
import { GetCoinTickers } from "~/src/api/tickersApi";
import LottieView from "lottie-react-native";

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
//   return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
// }

const InfoCoin = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [coinInfo, setCoinInfo] = useState<Record<string, any>>({});
    const [coinTicker, setCoinTicker] = useState<[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const font = useFont(require("~Assets/fonts/SpaceGrotesk/SpaceGrotesk-Regular.ttf"), 12);
    const { state, isActive } = useChartPressState({ x: 0 as never, y: { high: 0 } });
    const [overView, setOveriew] = useState<string | null>(null);

    useEffect(() => {
        if (isActive) Haptics.selectionAsync();
    }, [isActive]);

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const coinInfoData = await GetListingCoinsInfo(id!);
                setCoinInfo(coinInfoData);
                setOveriew(coinInfoData[id!].description);

                let symbol: string = coinInfoData[id!].symbol;

                const coinTicketData = await GetCoinTickers(symbol);
                setCoinTicker(coinTicketData);

                console.log(coinTicketData);
            } catch (error) {
                console.error("Error fetching coinData:", error);
                setError("Error fetching coinData. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCoins();
    }, []);

    const animatedText = useAnimatedProps(() => {
        return {
            text: `${state.y.high.value.value.toFixed(2)} $`,
            defaultValue: "",
        };
    });

    const animatedDateText = useAnimatedProps(() => {
        const date = new Date(state.x.value.value * 1000);
        return {
            text: `${date.toLocaleDateString()}`,
            defaultValue: "",
        };
    });

    return (
        <>
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <LottieView
                        autoPlay
                        style={{
                            width: 200,
                            height: 200,
                        }}
                        source={require("~Assets/animations/loading.json")}
                    />

                    <Text className="font-SpaceGroteskSemiBold text-base text-secondary">Loading...</Text>
                </View>
            ) : error ? (
                <Text>{error}</Text>
            ) : (
                <>
                    <Stack.Screen options={{ title: coinInfo[id!]?.name }} />

                    <SectionList
                        contentInsetAdjustmentBehavior="automatic"
                        scrollEnabled={true}
                        keyExtractor={i => i.title}
                        sections={[{ data: [{ title: "Chart" }] }]}
                        ListHeaderComponent={() => (
                            <>
                                <View
                                    className="flex-row justify-between items-center m-5"
                                    style={{ marginTop: Platform.OS === "android" ? 60 : 0 }}
                                >
                                    <Text className="font-SpaceGroteskSemiBold text-2xl text-defaultText">
                                        {coinInfo[id!]?.symbol}
                                    </Text>
                                    <Image source={{ uri: coinInfo[id!]?.logo }} style={{ width: 60, height: 60 }} />
                                </View>
                            </>
                        )}
                        renderItem={() => (
                            <>
                                <View style={[defaultStyles.block, { height: 500 }]}>
                                    {coinTicker && (
                                        <>
                                            {!isActive && (
                                                <View>
                                                    <Text className="text-3xl font-SpaceGroteskBold text-secondary">
                                                        {coinTicker[coinTicker.length - 1]["high"]} $
                                                    </Text>
                                                    <Text className={"text-lg text-defaultText"}>Today</Text>
                                                </View>
                                            )}
                                            {isActive && (
                                                <View>
                                                    <AnimatedTextInput
                                                        editable={false}
                                                        underlineColorAndroid={"transparent"}
                                                        className="text-3xl font-SpaceGroteskBold text-secondary"
                                                        animatedProps={animatedText}
                                                    ></AnimatedTextInput>
                                                    <AnimatedTextInput
                                                        editable={false}
                                                        underlineColorAndroid={"transparent"}
                                                        className={"text-lg text-defaultText"}
                                                        animatedProps={animatedDateText}
                                                    ></AnimatedTextInput>
                                                </View>
                                            )}
                                            <CartesianChart
                                                chartPressState={state}
                                                axisOptions={{
                                                    font,
                                                    tickCount: 5,
                                                    labelOffset: { x: -2, y: 0 },
                                                    labelColor: Colors.defaultText,
                                                    formatYLabel: v => `${v} $`,
                                                    formatXLabel: ms => format(new Date(ms * 1000), "MM/yy"),
                                                }}
                                                data={coinTicker!}
                                                xKey="time"
                                                yKeys={["high"]}
                                            >
                                                {({ points }) => (
                                                    <>
                                                        <Line
                                                            points={points.high}
                                                            color={Colors.primary}
                                                            strokeWidth={3}
                                                        />
                                                        {/* {isActive && <ToolTip x={state.x.position} y={state.y.high.position} />} */}
                                                    </>
                                                )}
                                            </CartesianChart>
                                        </>
                                    )}
                                </View>
                                <View style={[defaultStyles.block, { marginTop: 20, marginBottom: 20 }]}>
                                    <Text style={styles.subtitle}>Overview</Text>
                                    <Text style={{ color: Colors.defaultText }}>{overView}</Text>
                                </View>
                            </>
                        )}
                    ></SectionList>
                </>
            )}
        </>
    );
};
const styles = StyleSheet.create({
    subtitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.defaultText,
    },
    categoryText: {
        fontSize: 14,
        color: Colors.defaultText,
    },
    categoryTextActive: {
        fontSize: 14,
        color: "#000",
    },
    categoriesBtn: {
        padding: 10,
        paddingHorizontal: 14,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    categoriesBtnActive: {
        padding: 10,
        paddingHorizontal: 14,

        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 20,
    },
});

export default InfoCoin;
