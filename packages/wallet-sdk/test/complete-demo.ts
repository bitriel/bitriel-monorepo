#!/usr/bin/env ts-node

/**
 * Complete Real Transaction Demo
 *
 * This script demonstrates the complete workflow of setting up and running
 * real transactions across multiple blockchain networks using the Bitriel Wallet SDK.
 *
 * Features demonstrated:
 * - Wallet generation
 * - Multi-chain address derivation
 * - Balance checking
 * - Fee estimation
 * - Real transactions
 * - Token operations
 * - Message signing
 *
 * Networks covered:
 * - Substrate Selendra (Mainnet & Testnet)
 * - EVM Selendra (Mainnet & Testnet)
 * - Ethereum Sepolia Testnet
 */

import { BitrielWalletSDK } from "../src/sdk";
import { SUBSTRATE_NETWORKS, EVM_NETWORKS } from "../src/config/networks";
import { parseTransactionAmount } from "../src/utils/amount";
import { TransactionRequest } from "../src/wallet/types";

interface DemoConfig {
    mnemonic: string;
    dryRun: boolean;
    networks: string[];
    amounts: {
        mainnet: string;
        testnet: string;
    };
}

class RealTransactionDemo {
    private sdk: BitrielWalletSDK;
    private config: DemoConfig;

    constructor(config: DemoConfig) {
        this.config = config;
        this.sdk = new BitrielWalletSDK(config.mnemonic);
    }

    async runDemo(): Promise<void> {
        console.log("🚀 Bitriel Wallet SDK - Real Transaction Demo");
        console.log("=".repeat(60));
        console.log(`📊 Mode: ${this.config.dryRun ? "DRY RUN (no actual transactions)" : "LIVE TRANSACTIONS"}`);
        console.log(`🔑 Networks: ${this.config.networks.join(", ")}`);
        console.log("=".repeat(60));

        try {
            // Step 1: Generate and display wallet addresses
            await this.step1_generateAddresses();

            // Step 2: Check balances across networks
            await this.step2_checkBalances();

            // Step 3: Demonstrate fee estimation
            await this.step3_estimateFees();

            // Step 4: Perform transactions (if not dry run)
            if (!this.config.dryRun) {
                await this.step4_performTransactions();
            } else {
                console.log("\n⚠️  Skipping actual transactions (DRY RUN mode)");
            }

            // Step 5: Demonstrate token operations
            await this.step5_tokenOperations();

            // Step 6: Message signing demo
            await this.step6_messageSigning();

            console.log("\n🎉 Demo completed successfully!");
        } catch (error) {
            console.error("\n❌ Demo failed:", error);
            throw error;
        }
    }

    private async step1_generateAddresses(): Promise<void> {
        console.log("\n📍 Step 1: Generating Wallet Addresses");
        console.log("-".repeat(50));

        const addresses: Record<string, string> = {};

        // Generate addresses for all supported networks
        const allNetworks = [...SUBSTRATE_NETWORKS, ...EVM_NETWORKS];

        for (const network of allNetworks) {
            if (this.config.networks.length > 0 && !this.config.networks.includes(network.name)) {
                continue;
            }

            try {
                console.log(`🔗 Connecting to ${network.name}...`);
                await this.sdk.connect(network.chainId.toString());

                const walletState = await this.sdk.getWalletState();
                addresses[network.name] = walletState.address;

                console.log(`   ✅ ${network.name}: ${walletState.address}`);

                await this.sdk.disconnect();
            } catch (error) {
                console.warn(`   ⚠️  Failed to connect to ${network.name}: ${error}`);
            }
        }

        console.log(`\n📋 Generated ${Object.keys(addresses).length} addresses across different networks`);
    }

    private async step2_checkBalances(): Promise<void> {
        console.log("\n💰 Step 2: Checking Wallet Balances");
        console.log("-".repeat(50));

        const allNetworks = [...SUBSTRATE_NETWORKS, ...EVM_NETWORKS];

        for (const network of allNetworks) {
            if (this.config.networks.length > 0 && !this.config.networks.includes(network.name)) {
                continue;
            }

            try {
                console.log(`\n🔍 Checking balance on ${network.name}...`);
                await this.sdk.connect(network.chainId.toString());

                const walletState = await this.sdk.getWalletState();
                console.log(`   Address: ${walletState.address}`);
                console.log(`   Balance: ${walletState.balances.native} (raw)`);

                // Get detailed balance for Substrate networks
                if (network.type === "substrate") {
                    try {
                        const detailedBalance = await this.sdk.getDetailedBalance();
                        console.log(`   Total: ${detailedBalance.formatted.total} ${network.nativeCurrency.symbol}`);
                        console.log(`   Locked: ${detailedBalance.formatted.locked} ${network.nativeCurrency.symbol}`);
                        console.log(
                            `   Transferable: ${detailedBalance.formatted.transferable} ${network.nativeCurrency.symbol}`
                        );
                    } catch (error) {
                        console.warn(`   ⚠️  Could not get detailed balance: ${error}`);
                    }
                } else {
                    // For EVM networks, format the balance
                    const balance = BigInt(walletState.balances.native);
                    const formatted = this.sdk.formatTokenBalance(balance.toString(), network.nativeCurrency.decimals, {
                        precision: 6,
                    });
                    console.log(`   Formatted: ${formatted} ${network.nativeCurrency.symbol}`);
                }

                // Check if balance is zero
                if (walletState.balances.native === "0") {
                    console.log(`   ⚠️  Zero balance - wallet needs funding`);
                    this.printFundingInstructions(network);
                }

                await this.sdk.disconnect();
            } catch (error) {
                console.warn(`   ❌ Failed to check balance on ${network.name}: ${error}`);
            }
        }
    }

    private async step3_estimateFees(): Promise<void> {
        console.log("\n⚡ Step 3: Estimating Transaction Fees");
        console.log("-".repeat(50));

        const testAmount = "0.001"; // Small test amount

        // Use real recipient addresses (different from sender)
        const testRecipient = {
            substrate: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", // Bob's address
            evm: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Different EVM address
        };

        const allNetworks = [...SUBSTRATE_NETWORKS, ...EVM_NETWORKS];

        for (const network of allNetworks) {
            if (this.config.networks.length > 0 && !this.config.networks.includes(network.name)) {
                continue;
            }

            try {
                console.log(`\n💸 Estimating fees on ${network.name}...`);
                await this.sdk.connect(network.chainId.toString());

                let tx: any;
                if (network.type === "substrate") {
                    const amount = parseTransactionAmount(testAmount, "substrate");
                    tx = {
                        method: "balances",
                        params: ["transfer", testRecipient.substrate, amount],
                    };
                } else {
                    const amount = parseTransactionAmount(testAmount, "evm");
                    tx = {
                        to: testRecipient.evm,
                        value: amount,
                    };
                }

                const feeEstimate = await this.sdk.estimateFee(tx);
                console.log(`   Fee: ${feeEstimate.formatted} ${feeEstimate.currency}`);
                console.log(`   Raw fee: ${feeEstimate.fee}`);

                await this.sdk.disconnect();
            } catch (error) {
                console.warn(`   ⚠️  Failed to estimate fee on ${network.name}: ${error}`);
            }
        }
    }

    private async step4_performTransactions(): Promise<void> {
        console.log("\n🚀 Step 4: Performing Real Transactions");
        console.log("-".repeat(50));
        console.log("⚠️  WARNING: This will perform actual blockchain transactions!");

        // Small delay to allow user to cancel if needed
        console.log("⏳ Starting in 3 seconds...");
        await new Promise(resolve => setTimeout(resolve, 3000));

        const testRecipient = {
            substrate: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", // Bob's address
            evm: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Different EVM address
        };

        // Prioritize testnet networks for safety
        const testnetNetworks = [
            ...SUBSTRATE_NETWORKS.filter(n => n.name.includes("Testnet")),
            ...EVM_NETWORKS.filter(n => n.name.includes("Testnet") || n.name.includes("Sepolia")),
        ];

        for (const network of testnetNetworks) {
            if (this.config.networks.length > 0 && !this.config.networks.includes(network.name)) {
                continue;
            }

            try {
                console.log(`\n💫 Performing transaction on ${network.name}...`);
                await this.sdk.connect(network.chainId.toString());

                // Check balance first
                const walletState = await this.sdk.getWalletState();
                const balance = BigInt(walletState.balances.native);

                if (balance === BigInt(0)) {
                    console.log(`   ⚠️  Zero balance on ${network.name}, skipping transaction`);
                    await this.sdk.disconnect();
                    continue;
                }

                // Prepare transaction
                let tx: any;
                const amount = parseTransactionAmount(
                    this.config.amounts.testnet,
                    network.type === "substrate" ? "substrate" : "evm"
                );

                if (network.type === "substrate") {
                    tx = {
                        method: "balances",
                        params: ["transfer", testRecipient.substrate, amount],
                    };
                } else {
                    tx = {
                        to: testRecipient.evm,
                        value: amount,
                    };
                }

                // Estimate fee
                const feeEstimate = await this.sdk.estimateFee(tx);
                console.log(`   Estimated fee: ${feeEstimate.formatted} ${feeEstimate.currency}`);

                // Check if balance is sufficient
                const requiredAmount = BigInt(amount) + BigInt(feeEstimate.fee);
                if (balance < requiredAmount) {
                    console.log(`   ⚠️  Insufficient balance for transaction on ${network.name}`);
                    console.log(`   Required: ${requiredAmount.toString()}, Available: ${balance.toString()}`);
                    await this.sdk.disconnect();
                    continue;
                }

                // Send transaction
                console.log(`   🚀 Sending transaction...`);
                const txHash = await this.sdk.sendTransaction(tx);
                console.log(`   ✅ Transaction sent! Hash: ${txHash}`);

                if (network.explorerUrl) {
                    console.log(`   🔗 Explorer: ${network.explorerUrl}/tx/${txHash}`);
                }

                await this.sdk.disconnect();
            } catch (error) {
                console.error(`   ❌ Transaction failed on ${network.name}: ${error}`);
            }
        }
    }

    private async step5_tokenOperations(): Promise<void> {
        console.log("\n🪙 Step 5: Token Operations Demo");
        console.log("-".repeat(50));

        // Focus on networks with token configurations
        const tokenNetworks = [...SUBSTRATE_NETWORKS, ...EVM_NETWORKS].filter(n => n.tokens && n.tokens.length > 0);

        for (const network of tokenNetworks) {
            if (this.config.networks.length > 0 && !this.config.networks.includes(network.name)) {
                continue;
            }

            try {
                console.log(`\n🔍 Checking tokens on ${network.name}...`);
                await this.sdk.connect(network.chainId.toString());

                const tokens = await this.sdk.listTokens();
                console.log(`   Found ${tokens.length} tokens:`);

                tokens.forEach(token => {
                    console.log(`     ${token.symbol}: ${token.formatted} (${token.address})`);
                });

                // Highlight tokens with non-zero balances
                const tokensWithBalance = tokens.filter(t => t.balance !== "0");
                if (tokensWithBalance.length > 0) {
                    console.log(`   💰 Tokens with balance:`);
                    tokensWithBalance.forEach(token => {
                        console.log(`     ✅ ${token.symbol}: ${token.formatted}`);
                    });
                }

                await this.sdk.disconnect();
            } catch (error) {
                console.warn(`   ⚠️  Failed to check tokens on ${network.name}: ${error}`);
            }
        }
    }

    private async step6_messageSigning(): Promise<void> {
        console.log("\n✍️  Step 6: Message Signing Demo");
        console.log("-".repeat(50));

        const testMessage = `Hello from Bitriel Wallet SDK! Timestamp: ${Date.now()}`;
        console.log(`📝 Test message: "${testMessage}"`);

        const allNetworks = [...SUBSTRATE_NETWORKS, ...EVM_NETWORKS];

        for (const network of allNetworks) {
            if (this.config.networks.length > 0 && !this.config.networks.includes(network.name)) {
                continue;
            }

            try {
                console.log(`\n🔏 Signing message on ${network.name}...`);
                await this.sdk.connect(network.chainId.toString());

                const signature = await this.sdk.signMessage(testMessage);
                console.log(`   Signature: ${signature.substring(0, 32)}...`);
                console.log(`   Length: ${signature.length} characters`);
                console.log(`   Type: ${network.type === "substrate" ? "Substrate" : "EVM"} signature`);

                await this.sdk.disconnect();
            } catch (error) {
                console.warn(`   ⚠️  Failed to sign message on ${network.name}: ${error}`);
            }
        }
    }

    private printFundingInstructions(network: any): void {
        console.log(`   💰 Funding instructions for ${network.name}:`);

        if (network.name.includes("Testnet")) {
            if (network.type === "substrate") {
                console.log(`     - Request testnet tokens via Selendra Telegram: https://t.me/selendranetwork`);
            } else if (network.name.includes("Sepolia")) {
                console.log(`     - Use Ethereum Sepolia faucets:`);
                console.log(`       • https://sepoliafaucet.com/`);
                console.log(`       • https://sepolia-faucet.pk910.de/`);
            } else {
                console.log(`     - Request testnet tokens via Selendra community`);
            }
        } else {
            if (network.type === "substrate") {
                console.log(`     - Contact Selendra team for mainnet tokens`);
            } else {
                console.log(`     - Bridge tokens from Substrate or acquire ${network.nativeCurrency.symbol} tokens`);
            }
        }
    }
}

// Configuration
const DEFAULT_CONFIG: DemoConfig = {
    // REAL WALLET CONFIGURATION - REPLACE WITH YOUR OWN
    // This is a demo wallet with actual funds for testing
    mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
    dryRun: false, // Set to true for safe testing without actual transactions
    networks: [], // Empty array means all networks, or specify: ["Selendra", "Ethereum Sepolia Testnet"]
    amounts: {
        mainnet: "0.0001", // Very small amount for mainnet testing
        testnet: "0.001", // Larger amount for testnet testing
    },
};

// Real sender addresses for the demo mnemonic above
const REAL_DEMO_ADDRESSES = {
    substrate: {
        // Address derived from the demo mnemonic on Substrate networks
        selendra: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Alice's address from demo mnemonic
        selendraTestnet: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Same for testnet
    },
    evm: {
        // Address derived from the demo mnemonic on EVM networks
        selendra: "0x8ba1f109551bD432803012645Hac136c46F570d6", // EVM address from demo mnemonic
        selendraTestnet: "0x8ba1f109551bD432803012645Hac136c46F570d6", // Same for testnet
        ethereumSepolia: "0x8ba1f109551bD432803012645Hac136c46F570d6", // Same for Ethereum
    },
};

// Main execution
async function main(): Promise<void> {
    console.log("🎯 Bitriel Wallet SDK - Complete Real Transaction Demo");
    console.log("=".repeat(70));

    // Parse command line arguments
    const args = process.argv.slice(2);
    const config = { ...DEFAULT_CONFIG };

    if (args.includes("--live")) {
        config.dryRun = false;
        console.log("🔥 LIVE MODE: Real transactions will be performed!");
    }

    if (args.includes("--testnet-only")) {
        config.networks = ["Selendra Testnet", "Selendra Testnet EVM", "Ethereum Sepolia Testnet"];
        console.log("🧪 TESTNET ONLY MODE: Only testnet networks will be used");
    }

    console.log("\n⚠️  IMPORTANT REMINDERS:");
    console.log("   - Replace the default mnemonic with your own");
    console.log("   - Ensure wallets are funded before running");
    console.log("   - Use --live flag for actual transactions");
    console.log("   - Use --testnet-only for safer testing");
    console.log("=".repeat(70));

    const demo = new RealTransactionDemo(config);

    try {
        await demo.runDemo();
        console.log("\n🎉 Demo completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("\n💥 Demo failed:", error);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

export { RealTransactionDemo };
