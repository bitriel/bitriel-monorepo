import * as SecureStore from "expo-secure-store";

let storedKeys = [
    "prv_key",
    "wallet_mnemonic",
    "network_name",
    "network_image",
    "network_rpc",
    "network_chainId",
    "pin_code",
    "contractDataSelEvm",
    "walletList",
    "last_network",
    "multi_wallets",
]; // List of all keys you have data stored under

export const ExpoSecureStoreAdapter = {
    getItem: async (key: string) => {
        return await SecureStore.getItemAsync(key);
    },
    setItem: async (key: string, value: string) => {
        await SecureStore.setItemAsync(key, value);
    },
    removeItem: async (key: string) => {
        await SecureStore.deleteItemAsync(key);
    },
    removeAll: async () => {
        for (const key of storedKeys) {
            await SecureStore.deleteItemAsync(key);
        }
    },
};
