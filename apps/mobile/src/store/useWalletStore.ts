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

    initializeWallet: async (mnemonic: string) => {
        try {
            set({ isLoading: true, error: null });

            const walletSdk = new BitrielWalletSDK(mnemonic!);
            set({ sdk: walletSdk });

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

    const sendTransaction = async (recipient: string, amount: string) => {
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
            tx = {
                to: recipient,
                value: parseTransactionAmount(amount, "evm"),
            };
        } else {
            throw new Error("Unsupported network type");
        }

        const fee = await sdk.estimateFee(tx);
        const txHash = await sdk.sendTransaction(tx);
        await refreshWalletState();

        return { txHash, fee };
    };

    const estimateFee = async (amount: string) => {
        if (!sdk || !currentNetwork) {
            throw new Error("Wallet not connected");
        }

        let tx: TransactionRequest;
        if (walletState?.network?.type === "substrate") {
            tx = {
                method: "balances",
                params: [
                    "transfer",
                    "5EkFVKkrvyVhhCWXs6sfri22zXkP5BgenDEHyuL9vaHt78XW",
                    parseTransactionAmount(amount, "substrate"),
                ],
            };
        } else if (walletState?.network?.type === "evm") {
            tx = {
                to: "0x0000000000000000000000000000000000000000", // Dummy address for estimation
                value: parseTransactionAmount(amount, "evm"),
            };
        } else {
            throw new Error("Unsupported network type");
        }

        return sdk.estimateFee(tx);
    };

    return { sendTransaction, estimateFee };
};
