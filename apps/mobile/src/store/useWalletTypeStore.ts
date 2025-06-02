import { create } from "zustand";
import { ExpoSecureStoreAdapter } from "./localStorage";

type WalletType = "non-custodial" | "custodial";

interface WalletTypeState {
    walletType: WalletType;
    setWalletType: (type: WalletType) => Promise<void>;
    initialize: () => Promise<void>;
    clear: () => Promise<void>;
}

export const useWalletTypeStore = create<WalletTypeState>(set => ({
    walletType: "non-custodial",
    setWalletType: async type => {
        try {
            await ExpoSecureStoreAdapter.setItem("wallet_type", type);
            set({ walletType: type });
        } catch (error) {
            console.error("Error setting wallet type:", error);
        }
    },
    initialize: async () => {
        try {
            const savedType = await ExpoSecureStoreAdapter.getItem("wallet_type");
            if (savedType) {
                set({ walletType: savedType as WalletType });
            }
        } catch (error) {
            console.error("Error initializing wallet type:", error);
        }
    },
    clear: async () => {
        try {
            await ExpoSecureStoreAdapter.removeItem("wallet_type");
            set({ walletType: "non-custodial" });
        } catch (error) {
            console.error("Error clearing wallet type:", error);
        }
    },
}));
