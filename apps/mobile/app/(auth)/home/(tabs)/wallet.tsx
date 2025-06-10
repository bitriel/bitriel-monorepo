import React from "react";
import { SafeAreaView } from "react-native";
import { useWalletStore } from "~/src/store/useWalletStore";
import { router, useLocalSearchParams } from "expo-router";
import { Header } from "~/components";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ChangeNetworkBottomSheet from "~/components/BottomSheet/ChangeNetworkBottomSheet";
import useBottomSheet from "~/src/context/useBottomSheet";
import { SUPPORTED_NETWORKS, TokenBalance } from "@bitriel/wallet-sdk";
import TopTokensBottomSheet from "~/components/BottomSheet/TopTokensBottomSheet";
import TokenListBottomSheet from "~/components/BottomSheet/TokenListBottomSheet";
import copyAddress from "~/src/utilities/copyClipboard";
import { AnimatedWalletList } from "~/components/AnimatedWalletList";
import WalletBalanceCard from "~/components/Card/WalletBalanceCard";
import { QuickAction, IconType } from "~/src/types/quick.action.types";

export default function WalletScreen() {
    const { mnemonicParam } = useLocalSearchParams<{ mnemonicParam: string }>();
    const { initializeWallet, refreshWalletState, isLoading, currentNetwork, walletState } = useWalletStore();

    // Find the current network details from SUPPORTED_NETWORKS
    const selectedNetwork = SUPPORTED_NETWORKS.find(network => network.chainId === currentNetwork?.chainId);

    const {
        bottomSheetRef: bottomSheetSwitchNetworkRef,
        handleOpenBottomSheet: handleOpenSwitchNetworkSheet,
        handleCloseBottomSheet: handleCloseSwitchNetworkSheet,
    } = useBottomSheet();

    const {
        bottomSheetRef: bottomSheetTopTokenRef,
        handleOpenBottomSheet: handleOpenTopTokenModal,
        handleCloseBottomSheet: handleCloseTopTokenModal,
    } = useBottomSheet();

    const {
        bottomSheetRef: bottomSheetTokenListRef,
        handleOpenBottomSheet: handleOpenTokenListSheet,
        handleCloseBottomSheet: handleCloseTokenListSheet,
    } = useBottomSheet();

    React.useEffect(() => {
        const initWallet = async () => {
            await initializeWallet(mnemonicParam);
        };

        initWallet();
    }, []);

    // Quick actions data
    const quickActions: QuickAction[] = [
        {
            icon: "SEND" as IconType,
            label: "Send",
            onPress: handleOpenTokenListSheet(),
        },
        {
            icon: "RECEIVE" as IconType,
            label: "Receive",
            onPress: () => router.navigate({ pathname: "/(auth)/home/receive" }),
        },
        ...(selectedNetwork?.name === "Selendra Mainnet"
            ? [
                  {
                      icon: "SWAP" as IconType,
                      label: "Swap",
                      onPress: () => router.navigate({ pathname: "/(auth)/home/(tabs)/swap" }),
                  },
              ]
            : []),
        {
            icon: "TOKENS" as IconType,
            label: "Tokens",
            onPress: handleOpenTopTokenModal(),
        },
    ];

    // Prepare token data
    const allTokens: TokenBalance[] = walletState
        ? [
              {
                  token: {
                      symbol: currentNetwork?.nativeCurrency.symbol || "",
                      decimals: currentNetwork?.nativeCurrency.decimals || 18,
                      logoURI: currentNetwork?.nativeCurrency.logoURI,
                      name: currentNetwork?.nativeCurrency.name || "Native Token",
                      address: "0x0",
                  },
                  balance: walletState.balances.native,
                  formatted: walletState.balances.native,
              },
              ...walletState.balances.tokens,
          ]
        : [];

    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaView className="flex-1 bg-white">
                <Header.Default
                    networkChainImage={selectedNetwork?.logo || null}
                    networkChainName={selectedNetwork?.name || null}
                    handleOpenBottomSheet={handleOpenSwitchNetworkSheet()}
                    selectedNetworkLabel={selectedNetwork?.name || null}
                    selectedNetworkImage={selectedNetwork?.logo || null}
                />

                <WalletBalanceCard
                    address={walletState?.address}
                    totalBalance={"≈$" + 0}
                    onCopyAddress={copyAddress}
                    quickActions={quickActions}
                    networkName={selectedNetwork?.name}
                />

                <AnimatedWalletList tokens={allTokens} onRefresh={refreshWalletState} isRefreshing={isLoading} />

                <ChangeNetworkBottomSheet
                    ref={bottomSheetSwitchNetworkRef}
                    handleCloseBottomSheet={handleCloseSwitchNetworkSheet}
                />
                <TopTokensBottomSheet
                    ref={bottomSheetTopTokenRef}
                    handleCloseBottomSheet={handleCloseTopTokenModal()}
                />
                <TokenListBottomSheet
                    ref={bottomSheetTokenListRef}
                    networkName={currentNetwork?.name!}
                    handleCloseBottomSheet={handleCloseTokenListSheet()}
                    tokens={allTokens}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
