import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import {
    WalletProvider,
    PolkadotTransactionRequest,
    SubstrateApi,
    SubstrateAccountInfo,
    SubstrateTransactionResult,
    SubstrateTxModule,
    TokenInfo,
    FeeEstimate,
} from "./types";
import { SubstrateNetworkConfig } from "../config/networks";
import { KeyringPair } from "@polkadot/keyring/types";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { formatTokenBalance } from "../utils/tokenFormatters";

export class SubstrateWalletProvider implements WalletProvider {
    private api: SubstrateApi | null = null;
    private keyring: Keyring | null = null;
    private pair: KeyringPair | null = null;
    private network: SubstrateNetworkConfig;
    private mnemonic: string;

    constructor(network: SubstrateNetworkConfig, mnemonic: string) {
        this.network = network;
        this.mnemonic = mnemonic;
    }

    async connect(): Promise<void> {
        try {
            const provider = new WsProvider(this.network.rpcUrl as string);
            const api = await ApiPromise.create({
                provider,
                types: {
                    // Add any custom types needed for Selendra
                    // This is where you would add Selendra-specific types
                },
            });
            this.api = api as unknown as SubstrateApi;

            // Initialize keyring with the correct ss58Format
            this.keyring = new Keyring({
                type: "sr25519",
                ss58Format: this.network.ss58Format || 42, // Default to 42 for Selendra
            });

            // Use the provided mnemonic to create the key pair
            this.pair = this.keyring.addFromMnemonic(this.mnemonic);
        } catch (error) {
            throw new Error(`Failed to connect to Substrate network: ${error}`);
        }
    }

    async disconnect(): Promise<void> {
        if (this.api) {
            await this.api.disconnect();
            this.api = null;
        }
        this.keyring = null;
        this.pair = null;
    }

    async getAddress(): Promise<string> {
        if (!this.pair) {
            throw new Error("Wallet not connected");
        }
        return this.pair.address;
    }

    async signMessage(message: string): Promise<string> {
        if (!this.pair) {
            throw new Error("Wallet not connected");
        }
        const signature = this.pair.sign(message);
        return Buffer.from(signature).toString("hex");
    }

    async getBalance(): Promise<string> {
        if (!this.api || !this.pair) {
            throw new Error("Wallet not connected");
        }
        const accountInfo = (await this.api.query.system.account(this.pair.address)) as SubstrateAccountInfo;
        return accountInfo.data.free.toString();
    }

    /**
     * Get detailed account information including locked balance
     * @returns Account information
     */
    async getAccountInfo(): Promise<SubstrateAccountInfo> {
        if (!this.api || !this.pair) {
            throw new Error("Wallet not connected");
        }
        return (await this.api.query.system.account(this.pair.address)) as SubstrateAccountInfo;
    }

    async sendTransaction(tx: PolkadotTransactionRequest): Promise<string> {
        if (!this.api || !this.pair) {
            throw new Error("Wallet not connected");
        }

        const { method, params } = tx;
        let extrinsic: SubmittableExtrinsic<"promise">;

        if (this.network.name === "Selendra") {
            // Handle Selendra transactions using the balances pallet
            if (method === "balances") {
                const [action, recipient, amount] = params;
                if (action === "transfer") {
                    // Use the correct method name for the balances pallet
                    extrinsic = this.api.tx.balances.transferAllowDeath(recipient, amount);
                } else {
                    throw new Error(`Unsupported balances action: ${action}`);
                }
            } else {
                throw new Error(`Unsupported transaction method for Selendra: ${method}`);
            }
        } else {
            // Default handling for other Substrate chains
            const txModule = this.api.tx[method] as SubstrateTxModule;
            if (!txModule) {
                throw new Error(`Transaction method ${method} not found`);
            }
            const txMethod = txModule[params[0] as string];
            if (!txMethod) {
                throw new Error(`Transaction method ${params[0]} not found in module ${method}`);
            }
            extrinsic = txMethod(...params.slice(1));
        }

        return new Promise((resolve, reject) => {
            extrinsic
                .signAndSend(this.pair as KeyringPair, (result: SubstrateTransactionResult) => {
                    if (result.isFinalized) {
                        resolve(result.txHash.toString());
                    }
                })
                .catch(reject);
        });
    }

    async getTokenBalance(): Promise<string> {
        if (!this.api || !this.pair) {
            throw new Error("Wallet not connected");
        }

        // Handle token balances based on the network's token implementation
        if (this.network.name === "Selendra") {
            // Implement Selendra-specific token balance query
            // This might use a different pallet or method
            throw new Error("Token balance not supported for this implementation");
        } else {
            // Default implementation for other Substrate chains
            throw new Error("Token balance not supported for this implementation");
        }
    }

    async listTokens(): Promise<TokenInfo[]> {
        if (!this.api || !this.pair) {
            throw new Error("Wallet not connected");
        }

        const tokens: TokenInfo[] = [];

        // Add native token
        const nativeBalance = await this.getBalance();
        tokens.push({
            address: "0x0000000000000000000000000000000000000000", // Placeholder for native token
            name: this.network.nativeCurrency.name,
            symbol: this.network.nativeCurrency.symbol,
            decimals: this.network.nativeCurrency.decimals,
            balance: nativeBalance,
            formatted: this.formatTokenBalance(nativeBalance, this.network.nativeCurrency.decimals),
        });

        // Add configured tokens if any
        if (this.network.tokens) {
            for (const token of this.network.tokens) {
                try {
                    // For Substrate chains, we need to implement token-specific balance queries
                    // This is a placeholder for future implementation
                    tokens.push({
                        ...token,
                        balance: "0",
                        formatted: "0.0",
                    });
                } catch (error) {
                    console.warn(`Failed to get balance for token ${token.symbol}:`, error);
                    tokens.push({
                        ...token,
                        balance: "0",
                        formatted: "0.0",
                    });
                }
            }
        }

        return tokens;
    }

    private formatTokenBalance(balance: string, decimals: number, precision: number = 5): string {
        return formatTokenBalance(balance, decimals, { precision });
    }

    async estimateFee(tx: PolkadotTransactionRequest): Promise<FeeEstimate> {
        if (!this.api || !this.pair) {
            throw new Error("Wallet not connected");
        }

        try {
            const { method, params } = tx;
            let extrinsic: SubmittableExtrinsic<"promise">;

            if (this.network.name === "Selendra") {
                // Handle Selendra transactions using the balances pallet
                if (method === "balances") {
                    const [action, recipient, amount] = params;
                    if (action === "transfer") {
                        extrinsic = this.api.tx.balances.transferAllowDeath(recipient, amount);
                    } else {
                        throw new Error(`Unsupported balances action: ${action}`);
                    }
                } else {
                    throw new Error(`Unsupported transaction method for Selendra: ${method}`);
                }
            } else {
                // Default handling for other Substrate chains
                const txModule = this.api.tx[method] as SubstrateTxModule;
                if (!txModule) {
                    throw new Error(`Transaction method ${method} not found`);
                }
                const txMethod = txModule[params[0] as string];
                if (!txMethod) {
                    throw new Error(`Transaction method ${params[0]} not found in module ${method}`);
                }
                extrinsic = txMethod(...params.slice(1));
            }

            // Get the payment info for the transaction
            const paymentInfo = await extrinsic.paymentInfo(this.pair);
            const fee = paymentInfo.partialFee.toString();
            const formatted = this.formatTokenBalance(fee, this.network.nativeCurrency.decimals);

            return {
                fee,
                formatted,
                currency: this.network.nativeCurrency.symbol,
            };
        } catch (error) {
            console.error("Failed to estimate fee:", error);
            throw new Error(`Failed to estimate fee: ${error}`);
        }
    }

    /**
     * Export the public key for the current Substrate account
     */
    async exportPublicKey(): Promise<string> {
        if (!this.pair) {
            throw new Error("Wallet not connected");
        }
        // Return the hex-encoded public key
        return Buffer.from(this.pair.publicKey).toString("hex");
    }

    /**
     * Export the private key for the current Substrate account (use with extreme caution)
     */
    async exportPrivateKey(): Promise<string> {
        if (!this.pair) {
            throw new Error("Wallet not connected");
        }
        // Export as base64 (as provided by toJson), or decode to hex if needed
        const json = this.pair.toJson();
        // The 'encoded' field is base64, decode to hex for consistency
        const base64 = json.encoded;
        const buffer = Buffer.from(base64, "base64");
        return buffer.toString("hex");
    }

    isConnected(): boolean {
        return this.api !== null && this.pair !== null;
    }
}
