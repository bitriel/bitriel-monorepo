import React, { forwardRef, useCallback, useMemo, useState } from "react";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Colors from "~/src/constants/Colors";
import { BackHandler, TouchableOpacity, View, Text, TextInput } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { TokenBalance } from "@bitriel/wallet-sdk";
import { Image } from "expo-image";
import CustomAvatar from "~/components/Avatars/AvatarSymbol";
import { MaterialIcons } from "@expo/vector-icons";
import { useWalletStore } from "~/src/store/useWalletStore";
import TokenLogo from "../Avatars/TokenLogo";

interface BottomSheetProps {
    handleCloseBottomSheet: () => void;
    tokens: TokenBalance[];
    networkName: string;
}

type Ref = BottomSheet;

const TokenListBottomSheet = forwardRef<Ref, BottomSheetProps>((props, ref) => {
    const { formatBalance } = useWalletStore();

    const snapPoints = useMemo(() => ["93%"], []);
    const [searchQuery, setSearchQuery] = useState("");
    const [isShowing, setIsShowing] = useState<boolean>(false);

    const renderBackdrop = useCallback(
        (backdropProps: any) => (
            <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
        ),
        []
    );

    const handleBottomSheetClose = useCallback(() => {
        setSearchQuery("");
        props.handleCloseBottomSheet();
    }, [props.handleCloseBottomSheet]);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (isShowing) {
                    handleBottomSheetClose();
                    return true;
                }
                return false;
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, [isShowing, handleBottomSheetClose])
    );

    const handleTokenSelect = useCallback(
        (token: TokenBalance) => {
            router.navigate({
                pathname: "/(auth)/home/send",
                params: {
                    tokenName: token.token.symbol,
                    tokenBalance: formatBalance(token.balance, token.token.decimals),
                    tokenContract: token.token.address,
                    tokenImage: token.token.logoURI || "",
                    decimalChain: token.token.decimals.toString(),
                    networkName: props.networkName,
                    currentNetwork: props.networkName,
                },
            });
            handleBottomSheetClose();
        },
        [formatBalance, props.networkName, handleBottomSheetClose]
    );

    const filteredTokens = useMemo(() => {
        return props.tokens.filter(token => {
            const searchLower = searchQuery.toLowerCase();
            return (
                parseFloat(formatBalance(token.balance, token.token.decimals)) > 0 &&
                (token.token.symbol.toLowerCase().includes(searchLower) ||
                    token.token.name.toLowerCase().includes(searchLower))
            );
        });
    }, [props.tokens, searchQuery, formatBalance]);

    // Group tokens by network
    const groupedTokens = useMemo(() => {
        const currentNetwork = props.networkName || "Unknown Network";
        return filteredTokens.reduce(
            (acc, token) => {
                if (!acc[currentNetwork]) {
                    acc[currentNetwork] = [];
                }
                acc[currentNetwork].push(token);
                return acc;
            },
            {} as Record<string, TokenBalance[]>
        );
    }, [filteredTokens, props.networkName]);

    const renderTokenItem = useCallback(
        (token: TokenBalance) => (
            <TouchableOpacity
                key={token.token.address}
                className="flex-row items-center justify-between px-4 py-3 active:bg-gray-50"
                onPress={() => handleTokenSelect(token)}
            >
                <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full overflow-hidden justify-center items-center bg-gray-100">
                        <TokenLogo logoURI={token.token.logoURI} size={40} />
                    </View>
                    <View className="ml-3">
                        <Text className="font-SpaceGroteskSemiBold text-base text-gray-900">{token.token.symbol}</Text>
                        <View className="flex-row items-center">
                            <Text className="font-SpaceGroteskRegular text-sm text-gray-500">${0}</Text>
                            <Text className="font-SpaceGroteskRegular text-sm text-green-500 ml-1">+0%</Text>
                        </View>
                    </View>
                </View>
                <View className="items-end">
                    <Text className="font-SpaceGroteskBold text-base text-gray-900">
                        {formatBalance(token.balance, token.token.decimals)}
                    </Text>
                    <Text className="font-SpaceGroteskRegular text-sm text-gray-500">${0}</Text>
                </View>
            </TouchableOpacity>
        ),
        [formatBalance, handleTokenSelect]
    );

    return (
        <BottomSheet
            ref={ref}
            snapPoints={snapPoints}
            index={-1}
            onChange={idx => {
                setIsShowing(idx > -1);
                if (idx === -1) {
                    setSearchQuery("");
                }
            }}
            onClose={handleBottomSheetClose}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{ backgroundColor: Colors.darkBlue }}
            backgroundStyle={{ backgroundColor: "white" }}
        >
            <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100">
                <TouchableOpacity onPress={handleBottomSheetClose}>
                    <MaterialIcons name="close" size={24} color={Colors.darkBlue} />
                </TouchableOpacity>
                <Text className="text-xl font-SpaceGroteskBold text-gray-900">Send</Text>
                <View style={{ width: 24 }} />
            </View>
            <View className="px-4 py-2">
                <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                    <MaterialIcons name="search" size={20} color={Colors.darkBlue} />
                    <TextInput
                        className="flex-1 ml-2 text-gray-900 font-SpaceGroteskRegular"
                        placeholder="Search by network or token"
                        placeholderTextColor="gray"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <MaterialIcons name="close" size={20} color={Colors.darkBlue} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <BottomSheetScrollView>
                {filteredTokens.length > 0 ? (
                    Object.entries(groupedTokens).map(([network, tokens]) => (
                        <View key={network}>
                            <View className="flex-row items-center px-4 py-3">
                                <View className="w-8 h-8 rounded-lg bg-gray-100 justify-center items-center mr-2">
                                    <MaterialIcons name="token" size={20} color={Colors.darkBlue} />
                                </View>
                                <Text className="text-gray-500 text-base font-SpaceGroteskMedium uppercase">
                                    {network}
                                </Text>
                                <Text className="ml-auto text-gray-500">$0</Text>
                            </View>
                            {tokens.map(renderTokenItem)}
                        </View>
                    ))
                ) : (
                    <View className="flex-1 items-center justify-center px-6 py-12">
                        <View className="w-16 h-16 mb-4 items-center justify-center">
                            <MaterialIcons
                                name={searchQuery.length > 0 ? "search" : "public"}
                                size={48}
                                color={Colors.darkBlue}
                            />
                        </View>
                        <Text className="text-lg text-gray-400 font-SpaceGroteskMedium text-center mb-2">
                            {searchQuery.length > 0
                                ? "No network or tokens with entered name were found."
                                : "You don't have tokens to send."}
                        </Text>
                        <Text className="text-base text-gray-400 font-SpaceGroteskRegular text-center mb-6">
                            {searchQuery.length > 0
                                ? "Try searching with a different name"
                                : "Buy or Receive tokens to your account."}
                        </Text>
                        {/* {searchQuery.length === 0 && (
              <TouchableOpacity
                className="py-2 px-4"
                onPress={() => {
                  handleBottomSheetClose();
                  router.navigate({ pathname: "/(auth)/home/buy" });
                }}>
                <Text className="text-blue-500 font-SpaceGroteskBold">Buy tokens</Text>
              </TouchableOpacity>
            )} */}
                    </View>
                )}
            </BottomSheetScrollView>
        </BottomSheet>
    );
});

export default TokenListBottomSheet;
