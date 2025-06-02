import React from "react";
import { ScrollView } from "react-native";
import { useWalletStore } from "~/src/store/useWalletStore";
import { router } from "expo-router";
import { SUPPORTED_NETWORKS, TokenBalance } from "@bitriel/wallet-sdk";
import { QuickAction, IconType } from "~/src/types/quick.action.types";
import { AnimatedWalletList } from "~/components/AnimatedWalletList";
import WalletBalanceCard from "~/components/Card/WalletBalanceCard";
import copyAddress from "~/src/utilities/copyClipboard";

interface NonCustodialWalletProps {
    handleOpenBottomSheet: {
        handleOpenTopTokenModal: () => void;
        handleOpenTokenListSheet: () => void;
    };
    handleCloseBottomSheet: {
        handleCloseTopTokenModal: () => void;
        handleCloseTokenListSheet: () => void;
    };
}

export const NonCustodialWallet: React.FC<NonCustodialWalletProps> = ({ handleOpenBottomSheet }) => {
    const { refreshWalletState, isLoading, currentNetwork, walletState } = useWalletStore();

    // Find the current network details from SUPPORTED_NETWORKS
    const selectedNetwork = SUPPORTED_NETWORKS.find(network => network.chainId === currentNetwork?.chainId);

    // Quick actions data for non-custodial wallet
    const quickActions: QuickAction[] = [
        {
            icon: "SEND" as IconType,
            label: "Send",
            onPress: () => handleOpenBottomSheet.handleOpenTokenListSheet(),
        },
        {
            icon: "RECEIVE" as IconType,
            label: "Receive",
            onPress: () => router.navigate({ pathname: "/(auth)/home/receive" }),
        },
        // ...(selectedNetwork?.name === "Selendra Mainnet"
        //   ? [
        //       {
        //         icon: "SWAP" as IconType,
        //         label: "Swap",
        //         onPress: () => router.navigate({ pathname: "/(auth)/home/(tabs)/swap" })
        //       }
        //     ]
        //   : []),
        {
            icon: "TOKENS" as IconType,
            label: "Tokens",
            onPress: () => handleOpenBottomSheet.handleOpenTopTokenModal(),
        },
    ];

    // Prepare token data for non-custodial wallet
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
        <>
            <WalletBalanceCard
                address={walletState?.address}
                totalBalance={"≈$" + 0}
                onCopyAddress={copyAddress}
                quickActions={quickActions}
                networkName={selectedNetwork?.name}
            />

            <AnimatedWalletList tokens={allTokens} onRefresh={refreshWalletState} isRefreshing={isLoading} />
        </>
    );
};
