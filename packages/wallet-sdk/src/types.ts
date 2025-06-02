import { Chain } from "@covalenthq/client-sdk";

type Network = Chain | "selendra-mainnet" | "selendra-testnet";

export interface NetworkItem {
    networkName: string;
    networkUrl?: string;
    imageUrl: string;
    networkChain?: Network;
    chainId?: number;
}
