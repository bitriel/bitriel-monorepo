import React from "react";
import { View, Text, TouchableOpacity, RefreshControl } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { router } from "expo-router";

import { Colors } from "react-native/Libraries/NewAppScreen";
import { TokenBalance } from "@bitriel/wallet-sdk";
import { useWalletStore } from "~/src/store/useWalletStore";
import TokenLogo from "./Avatars/TokenLogo";

interface AnimatedWalletListProps {
  tokens: TokenBalance[];

  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export const AnimatedWalletList: React.FC<AnimatedWalletListProps> = ({ tokens, isRefreshing = false, onRefresh }) => {
  const { formatBalance } = useWalletStore();

  // Animation values
  const headerAnim = useSharedValue(0);
  const scrollY = useSharedValue(0);

  // Animation handlers
  const onScroll = useAnimatedScrollHandler((event) => {
    const { y } = event.contentOffset;
    scrollY.value = y;
    headerAnim.value = y;
  });

  const renderTokenItem = (token: TokenBalance) => {
    const tokenId = token.token.address || token.token.symbol;

    const handleTokenPress = () => {
      router.push({
        pathname: "/(auth)/(routes)/token-detail/[id]",
        params: { token: JSON.stringify(token), id: tokenId }
      });
    };

    console.log("json token", JSON.stringify(token));

    console.log("token", token);

    console.log("tokenId", tokenId);

    return (
      <TouchableOpacity key={tokenId} className="flex-row items-center p-4 bg-white border-b border-gray-100" onPress={handleTokenPress}>
        {/* Token Logo */}
        <TokenLogo logoURI={token.token.logoURI} size={40} />

        {/* Token Info */}
        <View className="flex-1 ml-3">
          <Text className="font-SpaceGroteskBold text-base text-gray-900">{token.token.symbol}</Text>
          <Text className="font-SpaceGroteskRegular text-sm text-gray-500">{token.token.name}</Text>
        </View>

        {/* Balance */}
        <View className="items-end">
          <Text className="font-SpaceGroteskBold text-base text-gray-900">{formatBalance(token.balance, token.token.decimals)}</Text>
          <Text className="font-SpaceGroteskRegular text-sm text-gray-500">≈ $0.00</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1">
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerStyle={{ paddingTop: 0 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.yellow}
            colors={[Colors.yellow]}
            progressBackgroundColor="#ffffff"
            style={{ backgroundColor: "transparent" }}
          />
        }>
        <View className="bg-white boarder-b border-gray-100 py-2 z-10">
          <Text className="font-SpaceGroteskBold text-xl text-gray-900 px-4">Assets</Text>
        </View>
        <View className="flex-1 bg-white">{tokens.map(renderTokenItem)}</View>
      </Animated.ScrollView>
    </View>
  );
};
