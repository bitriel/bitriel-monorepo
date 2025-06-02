import axios from "axios";
import { apiClient } from "./client";

export interface TokenTransferRequest {
    tokenAddress: string;
    toAddress: string;
    amount: number;
}

export interface StablecoinTransferRequest {
    addresses: string;
    amount: number;
}

export interface SwapRequest {
    tokenAddress: string;
    amount: number;
}

export interface Token {
    _id: string;
    name: string;
    symbol: string;
    token_address: string | null;
    owner_id: string;
    status: "PENDING" | "CREATED" | "REJECTED";
    rejected_reason: string | null;
    stable_coin_amount: number;
    ratio: number;
    createdAt: string;
    updatedAt: string;
}

export const swapApi = {
    // Get all created tokens
    getCreatedTokens: async (): Promise<Token[]> => {
        const response = await apiClient.get<Token[]>("/api/tokens/created");
        return response.data;
    },

    // Token Transfer
    transferToken: async (data: TokenTransferRequest) => {
        const response = await apiClient.post("/api/contract/token/transfer", data);
        return response.data;
    },

    // Check Token Total Supply
    getTokenTotalSupply: async (tokenAddress: string) => {
        const response = await apiClient.get(`/api/contract/token/supply/${tokenAddress}`);

        console.log("response getTokenTotalSupply", response.data);

        return response.data;
    },

    // Check Token Balance
    getTokenBalance: async (tokenAddress: string, address: string) => {
        const response = await apiClient.get(`/api/contract/token/balance/${tokenAddress}/${address}`);

        console.log("response getTokenBalance", response.data);
        return response.data;
    },

    // Transfer KHR (Stablecoin)
    transferStablecoin: async (data: StablecoinTransferRequest) => {
        const response = await apiClient.post("/api/contract/stablecoin/transfer", data);
        return response.data;
    },

    // Check KHR Balance
    getStablecoinBalance: async (address: string) => {
        const response = await apiClient.get(`/api/contract/stablecoin/balance/${address}`);

        console.log("response getStablecoinBalance", response.data);
        return response.data;
    },

    // Check KHR Total Supply
    getStablecoinTotalSupply: async () => {
        const response = await apiClient.get("/api/contract/stablecoin/total-supply");

        console.log("response getStablecoinTotalSupply", response.data);
        return response.data;
    },

    // Swap Token to Stablecoin
    swapTokenToStablecoin: async (data: SwapRequest) => {
        const response = await apiClient.post("/api/contract/swapper/swap_token_to_stable_coin", data);
        return response.data;
    },

    // Swap Stablecoin to Token
    swapStablecoinToToken: async (data: SwapRequest) => {
        const response = await apiClient.post("/api/contract/swapper/swap_stable_coin_to_token", data);
        return response.data;
    },
};
