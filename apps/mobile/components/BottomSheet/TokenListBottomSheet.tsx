import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BackHandler, TouchableOpacity, View, TextInput } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { TokenBalance } from "@bitriel/wallet-sdk";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useWalletStore } from "~/src/store/useWalletStore";
import TokenLogo from "../Avatars/TokenLogo";
import { ThemedView } from "~/components/ThemedView";
import { ThemedText } from "~/components/ThemedText";
import { useAppTheme } from "~/src/context/ThemeProvider";

interface BottomSheetProps {
    handleCloseBottomSheet: () => void;
    tokens: TokenBalance[];
    networkName: string;
}

type Ref = BottomSheetModal;

const TokenListBottomSheet = forwardRef<Ref, BottomSheetProps>((props, ref) => {
    const { formatBalance } = useWalletStore();
    const { getColor, getBrandColor, isDark } = useAppTheme();

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
            <TouchableOpacity key={token.token.address} onPress={() => handleTokenSelect(token)} activeOpacity={0.7}>
                <ThemedView
                    variant="card"
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: getColor("border.secondary"),
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                overflow: "hidden",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: getColor("background.surface"),
                            }}
                        >
                            <TokenLogo logoURI={token.token.logoURI} size={40} />
                        </View>
                        <View style={{ marginLeft: 12 }}>
                            <ThemedText
                                variant="primary"
                                style={{
                                    fontFamily: "SpaceGrotesk-SemiBold",
                                    fontSize: 16,
                                }}
                            >
                                {token.token.symbol}
                            </ThemedText>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <ThemedText
                                    variant="secondary"
                                    style={{
                                        fontFamily: "SpaceGrotesk-Regular",
                                        fontSize: 14,
                                    }}
                                >
                                    ${0}
                                </ThemedText>
                                <ThemedText
                                    style={{
                                        fontFamily: "SpaceGrotesk-Regular",
                                        fontSize: 14,
                                        color: getBrandColor("success", 500),
                                        marginLeft: 4,
                                    }}
                                >
                                    +0%
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <ThemedText
                            variant="primary"
                            style={{
                                fontFamily: "SpaceGrotesk-Bold",
                                fontSize: 16,
                            }}
                        >
                            {formatBalance(token.balance, token.token.decimals)}
                        </ThemedText>
                        <ThemedText
                            variant="secondary"
                            style={{
                                fontFamily: "SpaceGrotesk-Regular",
                                fontSize: 14,
                            }}
                        >
                            ${0}
                        </ThemedText>
                    </View>
                </ThemedView>
            </TouchableOpacity>
        ),
        [formatBalance, handleTokenSelect, getColor, getBrandColor]
    );

    return (
        <BottomSheetModal
            ref={ref}
            snapPoints={snapPoints}
            index={1}
            onDismiss={() => {
                setIsShowing(false);
                setSearchQuery("");
                handleBottomSheetClose();
            }}
            onAnimate={(fromIndex, toIndex) => {
                setIsShowing(toIndex > -1);
            }}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{ backgroundColor: getColor("border.primary") }}
            backgroundStyle={{ backgroundColor: getColor("background.card") }}
        >
            <ThemedView
                variant="card"
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: getColor("border.secondary"),
                }}
            >
                <TouchableOpacity onPress={handleBottomSheetClose}>
                    <MaterialIcons name="close" size={24} color={getColor("text.secondary")} />
                </TouchableOpacity>
                <ThemedText
                    variant="primary"
                    style={{
                        fontSize: 20,
                        fontFamily: "SpaceGrotesk-Bold",
                    }}
                >
                    Send
                </ThemedText>
                <View style={{ width: 24 }} />
            </ThemedView>

            <ThemedView variant="card" style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: getColor("background.surface"),
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                    }}
                >
                    <MaterialIcons name="search" size={20} color={getColor("text.secondary")} />
                    <TextInput
                        style={{
                            flex: 1,
                            marginLeft: 8,
                            color: getColor("text.primary"),
                            fontFamily: "SpaceGrotesk-Regular",
                        }}
                        placeholder="Search by network or token"
                        placeholderTextColor={getColor("text.tertiary")}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <MaterialIcons name="close" size={20} color={getColor("text.secondary")} />
                        </TouchableOpacity>
                    )}
                </View>
            </ThemedView>

            <BottomSheetScrollView>
                {filteredTokens.length > 0 ? (
                    Object.entries(groupedTokens).map(([network, tokens]) => (
                        <View key={network}>
                            <ThemedView
                                variant="card"
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                }}
                            >
                                <View
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        backgroundColor: getColor("background.surface"),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: 8,
                                    }}
                                >
                                    <MaterialIcons name="token" size={20} color={getColor("text.secondary")} />
                                </View>
                                <ThemedText
                                    variant="secondary"
                                    style={{
                                        fontSize: 16,
                                        fontFamily: "SpaceGrotesk-Medium",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {network}
                                </ThemedText>
                                <ThemedText
                                    variant="secondary"
                                    style={{
                                        marginLeft: "auto",
                                    }}
                                >
                                    $0
                                </ThemedText>
                            </ThemedView>
                            {tokens.map(renderTokenItem)}
                        </View>
                    ))
                ) : (
                    <ThemedView
                        variant="card"
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingHorizontal: 24,
                            paddingVertical: 48,
                        }}
                    >
                        <View
                            style={{
                                width: 64,
                                height: 64,
                                marginBottom: 16,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <MaterialIcons
                                name={searchQuery.length > 0 ? "search" : "public"}
                                size={48}
                                color={getColor("text.tertiary")}
                            />
                        </View>
                        <ThemedText
                            variant="secondary"
                            style={{
                                fontSize: 18,
                                fontFamily: "SpaceGrotesk-Medium",
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            {searchQuery.length > 0
                                ? "No network or tokens with entered name were found."
                                : "You don't have tokens to send."}
                        </ThemedText>
                        {searchQuery.length === 0 && (
                            <ThemedText
                                variant="tertiary"
                                style={{
                                    fontSize: 14,
                                    fontFamily: "SpaceGrotesk-Regular",
                                    textAlign: "center",
                                    lineHeight: 20,
                                }}
                            >
                                You need to have tokens with a positive balance to be able to send them.
                            </ThemedText>
                        )}
                    </ThemedView>
                )}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});

export default TokenListBottomSheet;
