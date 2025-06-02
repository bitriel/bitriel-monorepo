import { create } from "zustand";
import { ExpoSecureStoreAdapter } from "./localStorage";
import { authApi, User } from "../api/userApi";
import { apiClient } from "../api/client";
import { useWalletTypeStore } from "./useWalletTypeStore";

interface CustodialAuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  fetchCurrentUser: () => Promise<void>;
}

export const useCustodialAuthStore = create<CustodialAuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,

  fetchCurrentUser: async () => {
    try {
      const user = await authApi.getCurrentUser();
      await ExpoSecureStoreAdapter.setItem("custodial_user", JSON.stringify(user));
      await ExpoSecureStoreAdapter.setItem("wallet_mnemonic", user.privateKey);

      set({ user, isAuthenticated: true });
    } catch (error: any) {
      console.error("Error fetching current user:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch user data");
    }
  },

  initialize: async () => {
    try {
      const [token, userStr] = await Promise.all([
        ExpoSecureStoreAdapter.getItem("custodial_token"),
        ExpoSecureStoreAdapter.getItem("custodial_user")
      ]);

      if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // If we have a token but no user data, fetch the current user
        if (!userStr) {
          const { fetchCurrentUser } = get();
          await fetchCurrentUser();
        } else {
          const user = JSON.parse(userStr);
          set({ isAuthenticated: true, token, user });
        }
      }
    } catch (error) {
      console.error("Initialization error:", error);
      set({ error: "Failed to initialize authentication state" });
    }
  },

  login: async (email: string, password: string) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login({ email, password });

      // Set the token in API client first
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;

      // Store the token and user data
      await Promise.all([
        ExpoSecureStoreAdapter.setItem("custodial_token", response.token),
        ExpoSecureStoreAdapter.setItem("custodial_user", JSON.stringify(response.user))
      ]);

      // Set wallet type to custodial
      const { setWalletType } = useWalletTypeStore.getState();
      await setWalletType("custodial");

      // Fetch the latest user data to ensure we have the most up-to-date information
      const { fetchCurrentUser } = get();
      await fetchCurrentUser();

      set({
        isAuthenticated: true,
        token: response.token,
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  register: async (email: string, password: string) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register({
        name: email.split("@")[0],
        email,
        password
      });

      // Set the token in API client first
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;

      // Store the token and user data
      await Promise.all([
        ExpoSecureStoreAdapter.setItem("custodial_token", response.token),
        ExpoSecureStoreAdapter.setItem("custodial_user", JSON.stringify(response.user))
      ]);

      // Set wallet type to custodial
      const { setWalletType } = useWalletTypeStore.getState();
      await setWalletType("custodial");

      // Fetch the latest user data to ensure we have the most up-to-date information
      const { fetchCurrentUser } = get();
      await fetchCurrentUser();

      set({
        isAuthenticated: true,
        token: response.token,
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      delete apiClient.defaults.headers.common["Authorization"];

      // Clear wallet type
      const { clear: clearWalletType } = useWalletTypeStore.getState();
      await clearWalletType();

      await Promise.all([ExpoSecureStoreAdapter.removeItem("custodial_token"), ExpoSecureStoreAdapter.removeItem("custodial_user")]);

      set({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = "Failed to logout. Please try again.";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  clearError: () => set({ error: null })
}));
