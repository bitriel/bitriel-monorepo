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
import { useMultiWalletStore } from "~/src/store/multiWalletStore";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";

export default function WalletScreen() {
    const { mnemonicParam } = useLocalSearchParams<{ mnemonicParam: string }>();
    const { initializeWallet, refreshWalletState, isLoading, currentNetwork, walletState } = useWalletStore();
    const { activeWallet, loadWallets, addWallet, wallets, isInitialized: walletsInitialized } = useMultiWalletStore();

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

    const [isInitialized, setIsInitialized] = React.useState(false);
    const [currentMnemonic, setCurrentMnemonic] = React.useState<string | null>(null);

    // Initial wallet loading and migration
    React.useEffect(() => {
        let isMounted = true;

        const initWallets = async () => {
            try {
                await loadWallets();

                // Only run migration once on initial load
                if (!walletsInitialized && wallets.length === 0 && mnemonicParam && !isInitialized) {
                    const legacyMnemonic = await ExpoSecureStoreAdapter.getItem("wallet_mnemonic");
                    if (legacyMnemonic || mnemonicParam) {
                        // Migrate legacy wallet to multi-wallet system
                        await addWallet({
                            name: "My Wallet",
                            type: "non-custodial",
                            mnemonic: legacyMnemonic || mnemonicParam,
                            isActive: true,
                        });
                        console.log("Migrated legacy wallet to multi-wallet system");
                    }
                }
            } catch (error) {
                console.error("Failed to initialize wallets:", error);
            }
        };

        // Only initialize if not already initialized
        if (!walletsInitialized && !isInitialized) {
            initWallets();
        }
    }, [loadWallets, addWallet, walletsInitialized, mnemonicParam, isInitialized]);

    // Wallet initialization - only when active wallet or mnemonic changes
    React.useEffect(() => {
        let isMounted = true;

        const initWallet = async () => {
            // Determine which mnemonic to use
            const walletMnemonic = activeWallet?.type === "non-custodial" ? activeWallet.mnemonic : mnemonicParam;

            // Only initialize if we have a mnemonic and it's different from current
            if (walletMnemonic && walletMnemonic !== currentMnemonic && walletsInitialized) {
                try {
                    console.log("Initializing wallet with new mnemonic...");
                    await initializeWallet(walletMnemonic);
                    if (isMounted) {
                        setCurrentMnemonic(walletMnemonic);
                        setIsInitialized(true);
                    }
                } catch (error) {
                    console.error("Failed to initialize wallet:", error);
                }
            } else if (walletMnemonic === currentMnemonic && currentMnemonic) {
                console.log("Wallet already initialized with same mnemonic, skipping...");
            }
        };

        // Only initialize if wallets are loaded
        if (walletsInitialized) {
            initWallet();
        }

        return () => {
            isMounted = false;
        };
    }, [activeWallet, mnemonicParam, initializeWallet, currentMnemonic, walletsInitialized]);

    // Memoize quick actions to prevent unnecessary re-creations
    const quickActions: QuickAction[] = React.useMemo(
        () => [
            {
                icon: "SEND" as IconType,
                label: "Send",
                onPress: handleOpenTokenListSheet,
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
                          onPress: () => router.navigate({ pathname: "/(auth)/home/swap" }),
                      },
                  ]
                : []),
            {
                icon: "TOKENS" as IconType,
                label: "Tokens",
                onPress: handleOpenTopTokenModal,
            },
        ],
        [selectedNetwork?.name, handleOpenTokenListSheet, handleOpenTopTokenModal]
    );

    // Memoize token data to prevent unnecessary re-renders
    const allTokens: TokenBalance[] = React.useMemo(() => {
        if (!walletState || !currentNetwork) return [];

        return [
            {
                token: {
                    symbol: currentNetwork.nativeCurrency.symbol || "",
                    decimals: currentNetwork.nativeCurrency.decimals || 18,
                    logoURI: currentNetwork.nativeCurrency.logoURI,
                    name: currentNetwork.nativeCurrency.name || "Native Token",
                    address: "0x0",
                },
                balance: walletState.balances.native,
                formatted: walletState.balances.native,
            },
            ...walletState.balances.tokens,
        ];
    }, [walletState, currentNetwork]);

    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaView className="flex-1 bg-white">
                <Header.Default
                    networkChainImage={selectedNetwork?.logo || null}
                    networkChainName={selectedNetwork?.name || null}
                    handleOpenBottomSheet={handleOpenSwitchNetworkSheet}
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
                <TopTokensBottomSheet ref={bottomSheetTopTokenRef} handleCloseBottomSheet={handleCloseTopTokenModal} />
                <TokenListBottomSheet
                    ref={bottomSheetTokenListRef}
                    networkName={currentNetwork?.name!}
                    handleCloseBottomSheet={handleCloseTokenListSheet}
                    tokens={allTokens}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
