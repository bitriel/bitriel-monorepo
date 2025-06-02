import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native";
import { useWalletStore } from "~/src/store/useWalletStore";
import { router, useLocalSearchParams } from "expo-router";
import { Header } from "~/components";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ChangeNetworkBottomSheet from "~/components/BottomSheet/ChangeNetworkBottomSheet";
import useBottomSheet from "~/src/context/useBottomSheet";
import TopTokensBottomSheet from "~/components/BottomSheet/TopTokensBottomSheet";
import TokenListBottomSheet from "~/components/BottomSheet/TokenListBottomSheet";
import { useWalletTypeStore } from "~/src/store/useWalletTypeStore";
import { NonCustodialWallet } from "~/components/Wallet/NonCustodialWallet";
import { CustodialWallet } from "~/components/Wallet/CustodialWallet";
import { ExpoSecureStoreAdapter } from "~/src/store/localStorage";
import { SUPPORTED_NETWORKS, TokenBalance } from "@bitriel/wallet-sdk";
import BottomSheet from "@gorhom/bottom-sheet";

export default function WalletScreen() {
    const { mnemonicParam, isDualWallet } = useLocalSearchParams<{ mnemonicParam: string; isDualWallet: string }>();
    const { initializeWallet, currentNetwork, connectToNetwork, walletState } = useWalletStore();
    const { walletType, setWalletType } = useWalletTypeStore();

    const bottomSheetSwitchNetworkRef = useRef<BottomSheet>(null);
    const bottomSheetTopTokenRef = useRef<BottomSheet>(null);
    const bottomSheetTokenListRef = useRef<BottomSheet>(null);

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

    const handleOpenSwitchNetworkSheet = () => {
        bottomSheetSwitchNetworkRef.current?.expand();
    };

    const handleCloseSwitchNetworkSheet = () => {
        bottomSheetSwitchNetworkRef.current?.close();
    };

    const handleOpenTopTokenModal = () => {
        bottomSheetTopTokenRef.current?.expand();
    };

    const handleCloseTopTokenModal = () => {
        bottomSheetTopTokenRef.current?.close();
    };

    const handleOpenTokenListSheet = () => {
        bottomSheetTokenListRef.current?.expand();
    };

    const handleCloseTokenListSheet = () => {
        bottomSheetTokenListRef.current?.close();
    };

    // Initialize wallet and network when mnemonic is available and wallet type is non-custodial
    useEffect(() => {
        const initializeWalletAndNetwork = async () => {
            if (walletType === "non-custodial" && mnemonicParam) {
                try {
                    // Get last used network first
                    const lastNetwork = await ExpoSecureStoreAdapter.getItem("last_network");

                    // Initialize wallet
                    await initializeWallet(mnemonicParam);

                    // Connect to last used network after initialization
                    if (lastNetwork) {
                        const network = SUPPORTED_NETWORKS.find(n => n.chainId.toString() === lastNetwork);
                        if (network) {
                            await connectToNetwork(network.chainId.toString());
                        }
                    }
                } catch (error) {
                    console.error("Error initializing wallet and network:", error);
                }
            }
        };

        initializeWalletAndNetwork();
    }, [walletType, mnemonicParam]);

    // Handle dual wallet mode
    useEffect(() => {
        if (isDualWallet === "true") {
            // Set initial wallet type to non-custodial
            setWalletType("non-custodial");
        }
    }, [isDualWallet]);

    const handleOpenBottomSheet = {
        handleOpenTopTokenModal,
        handleOpenTokenListSheet,
    };

    const handleCloseBottomSheet = {
        handleCloseTopTokenModal,
        handleCloseTokenListSheet,
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView className="flex-1 bg-offWhite">
                <Header.Default
                    walletType={walletType}
                    handleOpenBottomSheet={handleOpenSwitchNetworkSheet}
                    selectedNetworkLabel={currentNetwork?.name || null}
                    selectedNetworkImage={currentNetwork?.logo || null}
                    networkChainName={currentNetwork?.name || null}
                    networkChainImage={currentNetwork?.logo || null}
                />

                {walletType === "custodial" ? (
                    <>
                        <CustodialWallet />
                    </>
                ) : (
                    <>
                        <NonCustodialWallet
                            handleOpenBottomSheet={handleOpenBottomSheet}
                            handleCloseBottomSheet={handleCloseBottomSheet}
                        />
                    </>
                )}

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
