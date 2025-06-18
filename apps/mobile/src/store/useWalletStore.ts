import {
    BitrielWalletSDK,
    NetworkConfig,
    WalletState,
    TransactionRequest,
    parseTransactionAmount,
    SUPPORTED_NETWORKS,
    formatTokenBalance,
    TokenBalanceFormatOptions,
    DetailedBalance,
} from "@bitriel/wallet-sdk";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface WalletStateStore {
    sdk: BitrielWalletSDK | null;
    walletState: WalletState | null;
    currentNetwork: NetworkConfig | null;
    isLoading: boolean;
    error: string | null;
    lastMnemonic: string | null;

    // Actions
    initializeWallet: (mnemonic: string) => Promise<void>;
    connectToNetwork: (chainId: string) => Promise<void>;
    refreshWalletState: () => Promise<void>;
    setError: (error: string | null) => void;
    disconnect: () => Promise<void>;
    formatBalance: (balance: string, decimals: number, options?: TokenBalanceFormatOptions) => string;
    getDetailedBalance: () => Promise<DetailedBalance>;
}

export const useWalletStore = create<WalletStateStore>((set, get) => ({
    sdk: null,
    walletState: null,
    currentNetwork: null,
    isLoading: false,
    error: null,
    lastMnemonic: null,

    initializeWallet: async (mnemonic: string) => {
        const { lastMnemonic, sdk } = get();

        // Skip initialization if the same mnemonic and SDK is already active
        if (lastMnemonic === mnemonic && sdk) {
            console.log("Wallet already initialized with same mnemonic, skipping...");
            return;
        }

        try {
            set({ isLoading: true, error: null });

            const walletSdk = new BitrielWalletSDK(mnemonic!);
            set({ sdk: walletSdk, lastMnemonic: mnemonic });

            // Connect to last used network if available
            const lastNetwork = await SecureStore.getItemAsync("last_network");
            if (lastNetwork) {
                await get().connectToNetwork(lastNetwork);
            } else {
                await get().connectToNetwork(SUPPORTED_NETWORKS[0].chainId.toString());
            }
        } catch (error: any) {
            set({ error: error.message });
            console.error("Failed to initialize wallet:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    connectToNetwork: async (chainId: string) => {
        const { sdk } = get();
        if (!sdk) {
            set({ error: "Wallet not initialized" });
            return;
        }

        try {
            set({ isLoading: true, error: null });
            await sdk.connect(chainId);
            const state = await sdk.getWalletState();

            set({
                walletState: state,
                currentNetwork: state.network,
            });

            // Save last used network
            await SecureStore.setItemAsync("last_network", chainId);
        } catch (error: any) {
            set({ error: error.message });
            console.error("Failed to connect to network:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    formatBalance: (balance: string, decimals: number, options?: TokenBalanceFormatOptions) => {
        const { sdk } = get();
        if (!sdk) {
            return "0";
        }
        return formatTokenBalance(balance, decimals, options);
    },

    refreshWalletState: async () => {
        const { sdk, currentNetwork } = get();
        if (!sdk || !currentNetwork) {
            return;
        }

        try {
            set({ isLoading: true, error: null });
            const state = await sdk.getWalletState();
            set({ walletState: state });
        } catch (error: any) {
            set({ error: error.message });
            console.error("Failed to refresh wallet state:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    setError: (error: string | null) => set({ error }),

    disconnect: async () => {
        const { sdk } = get();
        if (sdk) {
            try {
                set({ isLoading: true, error: null });
                await sdk.disconnect();
                set({
                    walletState: null,
                    currentNetwork: null,
                    lastMnemonic: null,
                    sdk: null,
                });
            } catch (error: any) {
                set({ error: error.message });
            } finally {
                set({ isLoading: false });
            }
        }
    },

    getDetailedBalance: async () => {
        const { sdk } = get();
        if (!sdk) {
            throw new Error("Wallet not initialized");
        }
        return sdk.getDetailedBalance();
    },
}));

// Custom hook for transaction handling
export const useWalletTransactions = () => {
    const { sdk, currentNetwork, walletState, refreshWalletState } = useWalletStore();

    const sendTransaction = async (recipient: string, amount: string, contractAddress?: string, decimals?: number) => {
        if (!sdk || !currentNetwork) {
            throw new Error("Wallet not connected");
        }

        let tx: TransactionRequest;

        if (walletState?.network?.type === "substrate") {
            tx = {
                method: "balances",
                params: ["transfer", recipient, parseTransactionAmount(amount, "substrate")],
            };
        } else if (walletState?.network?.type === "evm") {
            // Check if this is a custom token transaction
            const isCustomToken =
                contractAddress &&
                contractAddress !== "0x0" &&
                contractAddress.toLowerCase() !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

            if (isCustomToken) {
                // ERC-20 token transfer
                const tokenDecimals = decimals || 18;
                const parsedAmount = parseTransactionAmount(amount, "evm", tokenDecimals);

                // Encode ERC-20 transfer function call
                // transfer(address,uint256) function selector is 0xa9059cbb
                const transferSelector = "0xa9059cbb";
                const paddedRecipient = recipient.slice(2).padStart(64, "0");
                // Convert the parsed amount to hex and pad to 64 characters
                const paddedAmount = BigInt(parsedAmount).toString(16).padStart(64, "0");
                const data = transferSelector + paddedRecipient + paddedAmount;

                tx = {
                    to: contractAddress,
                    value: "0", // No ETH sent for ERC-20 transfers
                    data: data,
                };
            } else {
                // Native token transfer (use 18 decimals for native ETH/native tokens)
                tx = {
                    to: recipient,
                    value: parseTransactionAmount(amount, "evm", 18),
                };
            }
        } else {
            throw new Error("Unsupported network type");
        }

        const fee = await sdk.estimateFee(tx);
        const txHash = await sdk.sendTransaction(tx);
        await refreshWalletState();

        return { txHash, fee };
    };

    const estimateFee = async (amount: string, contractAddress?: string, decimals?: number) => {
        if (!sdk || !currentNetwork) {
            throw new Error("Wallet not connected");
        }

        if (!walletState?.network) {
            throw new Error("Network not available");
        }

        // Validate amount
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            throw new Error("Invalid amount for fee estimation");
        }

        console.log("Estimating fee for:", {
            amount,
            contractAddress,
            decimals,
            networkType: walletState.network.type,
            networkName: walletState.network.name,
        });

        let tx: TransactionRequest;

        try {
            if (walletState.network.type === "substrate") {
                // Use the actual amount for accurate fee estimation
                tx = {
                    method: "balances",
                    params: [
                        "transfer",
                        "5EkFVKkrvyVhhCWXs6sfri22zXkP5BgenDEHyuL9vaHt78XW", // Dummy address for estimation
                        parseTransactionAmount(amount, "substrate"),
                    ],
                };
            } else if (walletState.network.type === "evm") {
                // Check if this is a custom token transaction
                const isCustomToken =
                    contractAddress &&
                    contractAddress !== "0x0" &&
                    contractAddress.toLowerCase() !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

                if (isCustomToken) {
                    // ERC-20 token transfer - use actual amount for accurate fee estimation
                    const tokenDecimals = decimals || 18;
                    console.log("Preparing ERC-20 token transfer estimation with decimals:", tokenDecimals);

                    const parsedAmount = parseTransactionAmount(amount, "evm", tokenDecimals);

                    // Encode ERC-20 transfer function call for estimation
                    const transferSelector = "0xa9059cbb";
                    // Use a valid dummy recipient address for gas estimation (not zero address)
                    const dummyRecipient = "1111111111111111111111111111111111111111"; // Valid non-zero address

                    // Convert the parsed amount to hex and pad to 64 characters
                    const paddedAmount = BigInt(parsedAmount).toString(16).padStart(64, "0");
                    const data = transferSelector + dummyRecipient.padStart(64, "0") + paddedAmount;

                    tx = {
                        to: contractAddress,
                        value: "0",
                        data: data,
                    };
                } else {
                    // Native token transfer - use actual amount for accurate fee estimation
                    const nativeDecimals = walletState.network.nativeCurrency?.decimals || 18;
                    console.log("Preparing native token transfer estimation with decimals:", nativeDecimals);

                    tx = {
                        to: "0x1111111111111111111111111111111111111111", // Valid dummy address for estimation
                        value: parseTransactionAmount(amount, "evm", nativeDecimals),
                    };
                }
            } else {
                throw new Error(`Unsupported network type: ${walletState.network.type}`);
            }

            console.log("Transaction prepared for fee estimation:", tx);
            const result = await sdk.estimateFee(tx);
            console.log("Fee estimation result:", result);

            return result;
        } catch (error) {
            console.error("Fee estimation failed:", error);

            // Check if it's a balance-related error - use smaller amounts as fallback
            if (
                error instanceof Error &&
                (error.message.includes("execution reverted") ||
                    error.message.includes("insufficient funds") ||
                    error.message.includes("insufficient balance"))
            ) {
                console.warn("Balance-related fee estimation failed, using minimal amount estimation");

                try {
                    let fallbackTx: TransactionRequest;

                    if (walletState.network.type === "substrate") {
                        // Use a very small amount for Substrate estimation
                        fallbackTx = {
                            method: "balances",
                            params: [
                                "transfer",
                                "5EkFVKkrvyVhhCWXs6sfri22zXkP5BgenDEHyuL9vaHt78XW",
                                parseTransactionAmount("0.0001", "substrate"),
                            ],
                        };
                    } else {
                        // For EVM, use minimal native transfer regardless of token type
                        fallbackTx = {
                            to: "0x1111111111111111111111111111111111111111",
                            value: parseTransactionAmount("0.0001", "evm", 18),
                        };
                    }

                    const fallbackResult = await sdk.estimateFee(fallbackTx);
                    console.log("Using minimal amount fallback fee estimation:", fallbackResult);
                    return fallbackResult;
                } catch (fallbackError) {
                    console.error("Fallback fee estimation also failed:", fallbackError);
                }
            }

            throw new Error(`Fee estimation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return { sendTransaction, estimateFee };
};
