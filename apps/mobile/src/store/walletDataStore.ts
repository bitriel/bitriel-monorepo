import { create } from "zustand";

export interface WalletData {
  name: string;
  logo: string;
  privateKey: string;
  address: string;
}

interface WalletDataListState {
  walletList: WalletData[];
  setWalletList: (walletList: WalletData[]) => void;
  clearWalletDataListState: () => void;
}

export const useWalletDataListStore = create<WalletDataListState>((set) => ({
  walletList: [],
  setWalletList: (walletList: WalletData[]) => set({ walletList }),
  clearWalletDataListState: () => set({ walletList: [] })
}));
