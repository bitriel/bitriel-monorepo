// import { CustomSelEvmTokenData } from "~/src/interfaces/evmTokenContract";
// import { create } from "zustand";

// interface ContractState {
//   evmTokenData: string | null;
//   setEvmTokenData: (evmTokenData: string | null) => void;
//   clearState: () => void;
// }

// export const useContractStore = create<ContractState>()((set) => ({
//   evmTokenData: null,
//   setEvmTokenData: (evmTokenData) => set((state) => ({ ...state, evmTokenData })),
//   clearState: () => set(() => ({ evmTokenData: null }))
// }));

// export const useContract = () => {
//   const { evmTokenData, setEvmTokenData } = useContractStore();
//   return { evmTokenData, setEvmTokenData };
// };
