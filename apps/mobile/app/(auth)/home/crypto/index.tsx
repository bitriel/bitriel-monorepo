import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Coins } from "~/src/interfaces/crypto";
import { Link, router } from "expo-router";
import { GetListingCoins } from "~/src/api/listingsApi";
import { GetListingCoinsInfo } from "~/src/api/infoApi";
import LottieView from "lottie-react-native";
import BottomSheet from "@gorhom/bottom-sheet";

const TopCryptoListing = () => {
    const [coins, setCoins] = useState<Coins[]>([]);
    const [coinInfo, setCoinInfo] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoins = async () => {
            setLoading(true);
            try {
                const coinsData = await GetListingCoins();
                setCoins(coinsData);

                if (coinsData.length > 0) {
                    const ids = coinsData.map((coin: Coins) => coin.id).join(",");
                    const coinInfoData = await GetListingCoinsInfo(ids);
                    setCoinInfo(coinInfoData);
                }
            } catch (error) {
                console.error("Error fetching coinData:", error);
                setError("Error fetching coinData. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCoins();
    }, []);

    return (
        <View className="flex-1 bg-transparent">
            {loading ? (
                <View className="flex-1 items-center">
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
                <ScrollView className="bg-transparent">
                    <Text className="font-SpaceGroteskBold mx-5 mb-2 text-xl">Top Tokens</Text>
                    <View style={{ marginHorizontal: 10, padding: 14, gap: 20 }}>
                        {coins.map((coin: Coins) => (
                            <Link href={`/home/crypto/${coin.id}`} key={coin.id} asChild>
                                <TouchableOpacity style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
                                    <Image
                                        source={{ uri: coinInfo?.[coin.id]?.["logo"] }}
                                        style={{ width: 40, height: 40 }}
                                    />
                                    <View style={{ flex: 1, gap: 6 }}>
                                        <Text className="font-SpaceGroteskBold text-secondary">{coin.name}</Text>
                                        <Text className="font-SpaceGroteskRegular text-defaultText">{coin.symbol}</Text>
                                    </View>
                                    <View style={{ gap: 6, alignItems: "flex-end" }}>
                                        <Text className="font-SpaceGroteskBold text-secondary">
                                            {coin.quote.USD.price.toFixed(2)} $
                                        </Text>
                                        <View className="gap-1 flex-row items-center">
                                            <Ionicons
                                                name={coin.quote.USD.percent_change_1h > 0 ? "caret-up" : "caret-down"}
                                                size={16}
                                                color={coin.quote.USD.percent_change_1h > 0 ? "green" : "red"}
                                            />
                                            <Text
                                                style={{
                                                    fontFamily: "SpaceGrotesk-Regular",
                                                    color: coin.quote.USD.percent_change_1h > 0 ? "green" : "red",
                                                }}
                                            >
                                                {coin.quote.USD.percent_change_1h.toFixed(2)} %
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Link>
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default TopCryptoListing;
