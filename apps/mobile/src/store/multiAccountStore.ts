import { create } from "zustand";
import { ExpoSecureStoreAdapter } from "./localStorage";
import { User } from "../../lib/services/oauthService";

export interface AuthenticatedAccount {
    id: string;
    user: User;
    accessToken: string;
    isActive: boolean;
    authenticatedAt: string;
    lastUsed: string;
    deviceInfo?: {
        deviceId?: string;
        platform?: string;
    };
}

interface MultiAccountState {
    accounts: AuthenticatedAccount[];
    activeAccount: AuthenticatedAccount | null;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;

    // Actions
    loadAccounts: () => Promise<void>;
    reloadAccounts: () => Promise<void>;
    addAccount: (user: User, accessToken: string) => Promise<AuthenticatedAccount>;
    setActiveAccount: (accountId: string) => Promise<void>;
    removeAccount: (accountId: string) => Promise<void>;
    updateAccount: (accountId: string, updates: Partial<AuthenticatedAccount>) => Promise<void>;
    clearAccounts: () => Promise<void>;
    getAccountByUserId: (userId: string) => AuthenticatedAccount | null;
    refreshAccountToken: (accountId: string, newToken: string) => Promise<void>;
}

const STORAGE_KEY = "multi_accounts";

export const useMultiAccountStore = create<MultiAccountState>((set, get) => ({
    accounts: [],
    activeAccount: null,
    isLoading: false,
    error: null,
    isInitialized: false,

    loadAccounts: async () => {
        const { isLoading, isInitialized } = get();

        // Prevent multiple concurrent loads
        if (isLoading) {
            console.log("Account loading already in progress, skipping...");
            return;
        }

        // Only load once unless explicitly reloading
        if (isInitialized) {
            console.log("Accounts already loaded, skipping...");
            return;
        }

        try {
            set({ isLoading: true, error: null });

            const accountsData = await ExpoSecureStoreAdapter.getItem(STORAGE_KEY);
            const accounts: AuthenticatedAccount[] = accountsData ? JSON.parse(accountsData) : [];

            // Find the active account
            const activeAccount = accounts.find(a => a.isActive) || accounts[0] || null;

            console.log(
                `Loaded ${accounts.length} accounts, active:`,
                activeAccount?.user.fullname || activeAccount?.user.email
            );

            set({ accounts, activeAccount, isLoading: false, isInitialized: true });
        } catch (error: any) {
            set({ error: error.message, isLoading: false, isInitialized: true });
            console.error("Failed to load accounts:", error);
        }
    },

    reloadAccounts: async () => {
        set({ isInitialized: false });
        await get().loadAccounts();
    },

    addAccount: async (user, accessToken) => {
        try {
            set({ isLoading: true, error: null });

            const { accounts } = get();
            const now = new Date().toISOString();

            // Check if account already exists
            const existingAccount = accounts.find(a => a.user._id === user._id);
            if (existingAccount) {
                // Update existing account with new token
                const updatedAccount = {
                    ...existingAccount,
                    accessToken,
                    lastUsed: now,
                    isActive: true,
                };

                // Deactivate other accounts
                const updatedAccounts = accounts.map(a => ({
                    ...a,
                    isActive: a.user._id === user._id,
                    lastUsed: a.user._id === user._id ? now : a.lastUsed,
                }));

                await ExpoSecureStoreAdapter.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));

                set({
                    accounts: updatedAccounts,
                    activeAccount: updatedAccount,
                    isLoading: false,
                });

                return updatedAccount;
            }

            // Generate unique ID
            const id = `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const newAccount: AuthenticatedAccount = {
                id,
                user,
                accessToken,
                isActive: true, // New account becomes active
                authenticatedAt: now,
                lastUsed: now,
                deviceInfo: {
                    platform: "mobile",
                },
            };

            // Deactivate other accounts
            const updatedAccounts = accounts.map(a => ({ ...a, isActive: false }));
            updatedAccounts.push(newAccount);

            await ExpoSecureStoreAdapter.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));

            set({
                accounts: updatedAccounts,
                activeAccount: newAccount,
                isLoading: false,
            });

            console.log("✅ Added new account:", user.fullname || user.email);
            return newAccount;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            console.error("Failed to add account:", error);
            throw error;
        }
    },

    setActiveAccount: async accountId => {
        try {
            set({ isLoading: true, error: null });

            const { accounts } = get();
            const updatedAccounts = accounts.map(a => ({
                ...a,
                isActive: a.id === accountId,
                lastUsed: a.id === accountId ? new Date().toISOString() : a.lastUsed,
            }));

            const activeAccount = updatedAccounts.find(a => a.id === accountId) || null;

            await ExpoSecureStoreAdapter.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));

            set({
                accounts: updatedAccounts,
                activeAccount,
                isLoading: false,
            });

            console.log("✅ Switched to account:", activeAccount?.user.fullname || activeAccount?.user.email);
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            console.error("Failed to set active account:", error);
            throw error;
        }
    },

    removeAccount: async accountId => {
        try {
            set({ isLoading: true, error: null });

            const { accounts, activeAccount } = get();
            const updatedAccounts = accounts.filter(a => a.id !== accountId);

            // If removing the active account, set another one as active
            let newActiveAccount = activeAccount;
            if (activeAccount?.id === accountId) {
                newActiveAccount = updatedAccounts[0] || null;
                if (newActiveAccount) {
                    updatedAccounts[0] = { ...updatedAccounts[0], isActive: true };
                }
            }

            await ExpoSecureStoreAdapter.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));

            set({
                accounts: updatedAccounts,
                activeAccount: newActiveAccount,
                isLoading: false,
            });

            console.log("✅ Removed account:", accountId);
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            console.error("Failed to remove account:", error);
            throw error;
        }
    },

    updateAccount: async (accountId, updates) => {
        try {
            set({ isLoading: true, error: null });

            const { accounts, activeAccount } = get();
            const updatedAccounts = accounts.map(a => (a.id === accountId ? { ...a, ...updates } : a));

            const updatedActiveAccount =
                activeAccount?.id === accountId ? { ...activeAccount, ...updates } : activeAccount;

            await ExpoSecureStoreAdapter.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));

            set({
                accounts: updatedAccounts,
                activeAccount: updatedActiveAccount,
                isLoading: false,
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            console.error("Failed to update account:", error);
            throw error;
        }
    },

    clearAccounts: async () => {
        try {
            await ExpoSecureStoreAdapter.removeItem(STORAGE_KEY);
            set({ accounts: [], activeAccount: null, error: null });
            console.log("✅ Cleared all accounts");
        } catch (error: any) {
            set({ error: error.message });
            console.error("Failed to clear accounts:", error);
        }
    },

    getAccountByUserId: userId => {
        const { accounts } = get();
        return accounts.find(a => a.user._id === userId) || null;
    },

    refreshAccountToken: async (accountId, newToken) => {
        try {
            const { accounts } = get();
            const accountIndex = accounts.findIndex(a => a.id === accountId);

            if (accountIndex === -1) {
                throw new Error("Account not found");
            }

            const updatedAccounts = [...accounts];
            updatedAccounts[accountIndex] = {
                ...updatedAccounts[accountIndex],
                accessToken: newToken,
                lastUsed: new Date().toISOString(),
            };

            await ExpoSecureStoreAdapter.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));

            const { activeAccount } = get();
            const updatedActiveAccount =
                activeAccount?.id === accountId ? updatedAccounts[accountIndex] : activeAccount;

            set({
                accounts: updatedAccounts,
                activeAccount: updatedActiveAccount,
            });

            console.log("✅ Refreshed token for account:", accountId);
        } catch (error: any) {
            console.error("Failed to refresh account token:", error);
            throw error;
        }
    },
}));
