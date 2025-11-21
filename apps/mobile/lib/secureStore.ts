import * as SecureStore from 'expo-secure-store';

/**
 * Secure storage adapter for persisting sensitive data on mobile devices
 * Uses expo-secure-store which utilizes iOS Keychain and Android Keystore
 */
export const SecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error getting item ${key} from secure store:`, error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error setting item ${key} in secure store:`, error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing item ${key} from secure store:`, error);
    }
  },

  removeAll: async (): Promise<void> => {
    try {
      // Remove all known auth-related keys
      const keys = ['auth-storage'];
      await Promise.all(keys.map((key) => SecureStore.deleteItemAsync(key)));
    } catch (error) {
      console.error('Error clearing secure store:', error);
    }
  },
};
