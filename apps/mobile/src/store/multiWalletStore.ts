import { create } from "zustand";
import { ExpoSecureStoreAdapter } from "./localStorage";
import { BitrielWalletSDK, SUPPORTED_NETWORKS } from "@bitriel/wallet-sdk";

export type WalletType = "custodial" | "non-custodial";

export interface MultiWallet {
    id: string;
    name: string;
    type: WalletType;
    address?: string;
    avatar?: string;
    mnemonic?: string; // Only for non-custodial wallets
    userId?: string; // Only for custodial wallets
    accessToken?: string; // Only for custodial wallets
    isActive: boolean;
    createdAt: string;
    lastUsed: string;
}

interface MultiWalletState {
    wallets: MultiWallet[];
    activeWallet: MultiWallet | null;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;

    // Actions
    loadWallets: () => Promise<void>;
    reloadWallets: () => Promise<void>;
    addWallet: (wallet: Omit<MultiWallet, "id" | "createdAt" | "lastUsed">) => Promise<void>;
    setActiveWallet: (walletId: string) => Promise<void>;
    removeWallet: (walletId: string) => Promise<void>;
    updateWallet: (walletId: string, updates: Partial<MultiWallet>) => Promise<void>;
    clearWallets: () => Promise<void>;
    getWalletByType: (type: WalletType) => MultiWallet[];
    checkMnemonicExists: (mnemonic: string) => MultiWallet | null;
}

const STORAGE_KEY = "multi_wallets";

export const useMultiWalletStore = create<MultiWalletState>((set, get) => ({
    wallets: [],
    activeWallet: null,
    isLoading: false,
    error: null,
    isInitialized: false,

    loadWallets: async () => {
        const { isLoading, isInitialized } = get();

        // Prevent multiple concurrent loads
        if (isLoading) {
            console.log("Wallet loading already in progress, skipping...");
            return;
        }

        // Only load once unless explicitly reloading
        if (isInitialized) {
            console.log("Wallets already loaded, skipping...");
            return;
        }

        try {
            set({ isLoading: true, error: null });

            const walletsData = await ExpoSecureStoreAdapter.getItem(STORAGE_KEY);
            const wallets: MultiWallet[] = walletsData ? JSON.parse(walletsData) : [];

            // Find the active wallet
            const activeWallet = wallets.find(w => w.isActive) || wallets[0] || null;

            console.log(`Loaded ${wallets.length} wallets, active:`, activeWallet?.name);

            set({ wallets, activeWallet, isLoading: false, isInitialized: true });
        } catch (error: any) {
            set({ error: error.message, isLoading: false, isInitialized: true });
            console.error("Failed to load wallets:", error);
        }
    },

    reloadWallets: async () => {
        set({ isInitialized: false });
        await get().loadWallets();
    },

    addWallet: async walletData => {
        try {
            set({ isLoading: true, error: null });

            const { wallets } = get();
            const now = new Date().toISOString();

            // Generate unique ID
            const id = `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Set address for non-custodial wallets
            let address = walletData.address;
            if (!address && walletData.type === "non-custodial" && walletData.mnemonic) {
                try {
                    const sdk = new BitrielWalletSDK(walletData.mnemonic);
                    // Use the first supported EVM network (Selendra Mainnet)
                    const evmNetwork = SUPPORTED_NETWORKS.find(n => n.type === "evm");
                    if (evmNetwork) {
                        await sdk.connect(evmNetwork.chainId.toString());
                        const walletState = await sdk.getWalletState();
                        address = walletState.address;
                        await sdk.disconnect();
                    }
                } catch (error) {
                    console.error("Failed to get address from mnemonic:", error);
                    // Don't throw here - wallet can still be created without address initially
                }
            }

            const newWallet: MultiWallet = {
                ...walletData,
                id,
                address,
                createdAt: now,
                lastUsed: now,
                isActive: walletData.isActive !== undefined ? walletData.isActive : wallets.length === 0, // First wallet is active by default
            };

            // If this wallet should be active, deactivate others
            let updatedWallets = [...wallets];
            if (newWallet.isActive) {
                updatedWallets = wallets.map(w => ({ ...w, isActive: false }));
            }
            updatedWallets.push(newWallet);

            await ExpoSecureStoreAdapter.setItem(STORAGE_KEY, JSON.stringify(updatedWallets));

            set({
                wallets: updatedWallets,
                activeWallet: newWallet.isActive ? newWallet : get().activeWallet,
                isLoading: false,
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            console.error("Failed to add wallet:", error);
            throw error;
        }
    },

    setActiveWallet: async walletId => {
        try {
            set({ isLoading: true, error: null });

            const { wallets } = get();
            const updatedWallets = wallets.map(w => ({
                ...w,
                isActive: w.id === walletId,
                lastUsed: w.id === walletId ? new Date().toISOString() : w.lastUsed,
            }));

            const activeWallet = updatedWallets.find(w => w.id === walletId) || null;

            await ExpoSecureStoreAdapter.setItem(STORAGE_KEY, JSON.stringify(updatedWallets));

            set({
                wallets: updatedWallets,
                activeWallet,
                isLoading: false,
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            console.error("Failed to set active wallet:", error);
        }
    },

    removeWallet: async walletId => {
        try {
            set({ isLoading: true, error: null });

            const { wallets, activeWallet } = get();
            const updatedWallets = wallets.filter(w => w.id !== walletId);

            // If removing the active wallet, set another one as active
            let newActiveWallet = activeWallet;
            if (activeWallet?.id === walletId) {
                newActiveWallet = updatedWallets[0] || null;
                if (newActiveWallet) {
                    updatedWallets[0] = { ...updatedWallets[0], isActive: true };
                }
            }

            await ExpoSecureStoreAdapter.setItem(STORAGE_KEY, JSON.stringify(updatedWallets));

            set({
                wallets: updatedWallets,
                activeWallet: newActiveWallet,
                isLoading: false,
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            console.error("Failed to remove wallet:", error);
        }
    },

    updateWallet: async (walletId, updates) => {
        try {
            set({ isLoading: true, error: null });

            const { wallets, activeWallet } = get();
            const updatedWallets = wallets.map(w => (w.id === walletId ? { ...w, ...updates } : w));

            const updatedActiveWallet = activeWallet?.id === walletId ? { ...activeWallet, ...updates } : activeWallet;

            await ExpoSecureStoreAdapter.setItem(STORAGE_KEY, JSON.stringify(updatedWallets));

            set({
                wallets: updatedWallets,
                activeWallet: updatedActiveWallet,
                isLoading: false,
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            console.error("Failed to update wallet:", error);
        }
    },

    clearWallets: async () => {
        try {
            await ExpoSecureStoreAdapter.removeItem(STORAGE_KEY);
            set({ wallets: [], activeWallet: null, error: null });
        } catch (error: any) {
            set({ error: error.message });
            console.error("Failed to clear wallets:", error);
        }
    },

    getWalletByType: type => {
        const { wallets } = get();
        return wallets.filter(w => w.type === type);
    },

    checkMnemonicExists: mnemonic => {
        const { wallets } = get();
        return wallets.find(w => w.mnemonic === mnemonic) || null;
    },
}));
