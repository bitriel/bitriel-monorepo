import { NetworkConfig } from "../config/networks";
import { SubmittableExtrinsic } from "@polkadot/api/types";

export interface TokenInfo {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI?: string;
    balance?: string;
    formatted?: string;
}

export interface FeeEstimate {
    fee: string;
    formatted: string;
    currency: string;
}

export interface WalletProvider {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getAddress(): Promise<string>;
    signMessage(message: string): Promise<string>;
    getBalance(): Promise<string>;
    sendTransaction(tx: TransactionRequest): Promise<string>;
    getTokenBalance(tokenAddress: string): Promise<string>;
    isConnected(): boolean;
    listTokens(): Promise<TokenInfo[]>;
    estimateFee(tx: TransactionRequest): Promise<FeeEstimate>;
    /**
     * Export the public key for the current account (if supported)
     */
    exportPublicKey?(): Promise<string>;
    /**
     * Export the private key for the current account (if supported, use with extreme caution)
     */
    exportPrivateKey?(): Promise<string>;
}

export interface TokenBalance {
    token: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
        logoURI?: string;
    };
    balance: string;
    formatted: string;
}

export interface DetailedBalance {
    total: string;
    locked: string;
    transferable: string;
    formatted: {
        total: string;
        locked: string;
        transferable: string;
    };
}

export interface WalletBalances {
    native: string;
    tokens: TokenBalance[];
    detailed?: DetailedBalance;
}

export interface WalletState {
    address: string;
    balances: WalletBalances;
    network:
        | (NetworkConfig & {
              type: "substrate" | "evm";
          })
        | null;
}

export interface PolkadotTransactionRequest {
    method: string;
    params: (string | number | boolean | Uint8Array | null)[];
}

export interface EVMTransactionRequest {
    to: string;
    value: string;
    data?: string;
    gasLimit?: string;
    gasPrice?: string;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    nonce?: number;
}

export type TransactionRequest = PolkadotTransactionRequest | EVMTransactionRequest;

export interface SubstrateTransactionResult {
    isFinalized: boolean;
    txHash: {
        toString: () => string;
    };
}

export interface SubstrateAccountInfo {
    data: {
        free: {
            toString: () => string;
        };
        frozen: {
            toString: () => string;
        };
    };
}

export interface SubstrateExtrinsic {
    signAndSend(signer: unknown, callback: (result: SubstrateTransactionResult) => void): Promise<() => void>;
}

export interface SubstrateTxModule {
    [key: string]: (...args: (string | number | boolean | Uint8Array | null)[]) => SubmittableExtrinsic<"promise">;
}

export interface SubstrateApi {
    tx: {
        [key: string]: SubstrateTxModule;
    };
    query: {
        system: {
            account: (address: string) => Promise<SubstrateAccountInfo>;
        };
    };
    disconnect(): Promise<void>;
}
