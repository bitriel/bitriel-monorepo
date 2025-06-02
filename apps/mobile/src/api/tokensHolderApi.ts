import { Chain, CovalentClient } from "@covalenthq/client-sdk";

const COVALENT_CLIENT_KEY = process.env.EXPO_PUBLIC_COVALENT_CLIENT_KEY;

export const TokenHolderApi = async (networkChain: Chain, address: string) => {
    const client = new CovalentClient(COVALENT_CLIENT_KEY!);
    const res = await client.BalanceService.getTokenBalancesForWalletAddress(networkChain, address, {
        quoteCurrency: "USD",
    });

    return res.data;
};
