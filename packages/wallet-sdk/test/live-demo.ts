#!/usr/bin/env ts-node

/**
 * Focused Live Demo with Real Funded Wallet
 *
 * This demo focuses on specific networks for targeted testing:
 * - Selendra Substrate (mainnet only)
 * - Selendra EVM (mainnet only)
 * - Ethereum Sepolia (testnet only)
 *
 * IMPORTANT: This uses a REAL funded wallet - handle with care!
 */

import { BitrielWalletSDK } from "../src/sdk";
import { SUBSTRATE_NETWORKS, EVM_NETWORKS } from "../src/config/networks";
import { parseTransactionAmount } from "../src/utils/amount";
import { TransactionRequest } from "../src/wallet/types";

// REAL FUNDED WALLET CONFIGURATION
// ⚠️  WARNING: This is a real wallet with actual funds!
const FUNDED_WALLET_CONFIG = {
    // Real mnemonic with small amounts of tokens for testing
    // REPLACE WITH YOUR OWN FUNDED WALLET FOR PERSONAL USE
    mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",

    // Real addresses derived from the mnemonic above
    addresses: {
        substrate: {
            selendra: "5EkFVKkrvyVhhCWXs6sfri22zXkP5BgenDEHyuL9vaHt78XW",
        },
        evm: {
            selendra: "0x57A3d3f848E52CAdf6D0A6789708FD26ee078780",
            ethereumSepolia: "0x57A3d3f848E52CAdf6D0A6789708FD26ee078780",
        },
    },

    // Different recipient addresses for testing transfers
    recipients: {
        substrate: {
            selendra: "5DWespGr297iRHFDUijgnbYaxqhTNtesWRLXpJ5xFL8XdLGt",
        },
        evm: {
            selendra: "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552",
            ethereumSepolia: "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552",
        },
    },
};

class LiveDemo {
    private sdk: BitrielWalletSDK;

    constructor() {
        this.sdk = new BitrielWalletSDK(FUNDED_WALLET_CONFIG.mnemonic);
    }

    async runLiveDemo(): Promise<void> {
        console.log("🔥 Focused Live Demo - Specific Networks Only");
        console.log("=".repeat(50));
        console.log("🎯 Testing Networks:");
        console.log("   • Selendra Substrate (mainnet)");
        console.log("   • Selendra EVM (mainnet)");
        console.log("   • Ethereum Sepolia (testnet)");
        console.log("=".repeat(50));
        console.log("⚠️  WARNING: This uses REAL FUNDS and performs REAL TRANSACTIONS!");
        console.log("⚠️  Only small amounts will be transferred for testing");
        console.log("=".repeat(50));

        try {
            // Step 1: Check all wallet balances
            await this.checkAllBalances();

            // Step 2: Demonstrate Substrate transactions
            await this.demoSubstrateTransactions();

            // Step 3: Demonstrate EVM transactions
            await this.demoEVMTransactions();

            // Step 4: Demonstrate message signing
            await this.demoMessageSigning();

            // Step 5: Check final balances
            await this.checkFinalBalances();

            console.log("\n🎉 Live demo completed successfully!");
        } catch (error) {
            console.error("\n❌ Live demo failed:", error);
            throw error;
        }
    }

    private async checkAllBalances(): Promise<void> {
        console.log("\n💰 Step 1: Checking Current Wallet Balances");
        console.log("-".repeat(45));

        // Check Selendra Substrate mainnet balance
        console.log("\n🔗 Substrate Networks:");
        const selendraSubstrate = SUBSTRATE_NETWORKS.find(n => n.name === "Selendra");
        if (selendraSubstrate) {
            try {
                await this.sdk.connect(selendraSubstrate.chainId.toString());
                const walletState = await this.sdk.getWalletState();

                console.log(`\n   ${selendraSubstrate.name}:`);
                console.log(`   Address: ${walletState.address}`);

                if (walletState.balances.native === "0") {
                    console.log(`   Balance: 0 ${selendraSubstrate.nativeCurrency.symbol} ⚠️  (needs funding)`);
                } else {
                    const detailedBalance = await this.sdk.getDetailedBalance();
                    console.log(
                        `   Balance: ${detailedBalance.formatted.total} ${selendraSubstrate.nativeCurrency.symbol} ✅`
                    );
                    console.log(
                        `   Transferable: ${detailedBalance.formatted.transferable} ${selendraSubstrate.nativeCurrency.symbol}`
                    );
                }

                await this.sdk.disconnect();
            } catch (error) {
                console.warn(`   ❌ ${selendraSubstrate.name}: Connection failed - ${error}`);
            }
        }

        // Check EVM balances (Selendra mainnet and Ethereum testnet)
        console.log("\n⚡ EVM Networks:");
        const targetEVMNetworks = EVM_NETWORKS.filter(
            n => n.name === "Selendra Mainnet" || n.name === "Ethereum Sepolia Testnet"
        );

        for (const network of targetEVMNetworks) {
            try {
                await this.sdk.connect(network.chainId.toString());
                const walletState = await this.sdk.getWalletState();

                console.log(`\n   ${network.name}:`);
                console.log(`   Address: ${walletState.address}`);

                if (walletState.balances.native === "0") {
                    console.log(`   Balance: 0 ${network.nativeCurrency.symbol} ⚠️  (needs funding)`);
                } else {
                    const balance = BigInt(walletState.balances.native);
                    const formatted = this.sdk.formatTokenBalance(balance.toString(), network.nativeCurrency.decimals, {
                        precision: 6,
                    });
                    console.log(`   Balance: ${formatted} ${network.nativeCurrency.symbol} ✅`);
                }

                await this.sdk.disconnect();
            } catch (error) {
                console.warn(`   ❌ ${network.name}: Connection failed - ${error}`);
            }
        }
    }

    private async demoSubstrateTransactions(): Promise<void> {
        console.log("\n🔗 Step 2: Substrate Transaction Demo");
        console.log("-".repeat(45));

        // Focus on Selendra mainnet only
        const selendraMainnet = SUBSTRATE_NETWORKS.find(n => n.name === "Selendra");
        if (selendraMainnet) {
            await this.performSubstrateTransaction(selendraMainnet, "1"); // Small amount for mainnet
        } else {
            console.log("⚠️  Selendra mainnet not found in configuration");
        }
    }

    private async performSubstrateTransaction(network: any, amount: string): Promise<void> {
        try {
            console.log(`\n💫 Testing ${network.name} transaction...`);
            await this.sdk.connect(network.chainId.toString());

            // Check balance
            const walletState = await this.sdk.getWalletState();
            const balance = BigInt(walletState.balances.native);

            if (balance === BigInt(0)) {
                console.log(`   ⚠️  Zero balance on ${network.name}, skipping transaction`);
                await this.sdk.disconnect();
                return;
            }

            // Prepare transaction
            const amountParsed = parseTransactionAmount(amount, "substrate");
            const recipient = FUNDED_WALLET_CONFIG.recipients.substrate.selendra;

            const tx = {
                method: "balances",
                params: ["transfer", recipient, amountParsed],
            };

            // Estimate fee
            const feeEstimate = await this.sdk.estimateFee(tx);
            console.log(`   📊 Transaction details:`);
            console.log(`      Amount: ${amount} ${network.nativeCurrency.symbol}`);
            console.log(`      Recipient: ${recipient}`);
            console.log(`      Estimated fee: ${feeEstimate.formatted} ${feeEstimate.currency}`);

            // Check if balance is sufficient
            const requiredAmount = BigInt(amountParsed) + BigInt(feeEstimate.fee);
            if (balance < requiredAmount) {
                console.log(
                    `   ⚠️  Insufficient balance. Required: ${requiredAmount.toString()}, Available: ${balance.toString()}`
                );
                await this.sdk.disconnect();
                return;
            }

            // Confirm transaction
            console.log(`   🚀 Sending transaction...`);
            const txHash = await this.sdk.sendTransaction(tx);
            console.log(`   ✅ Transaction sent! Hash: ${txHash}`);

            if (network.explorerUrl) {
                console.log(`   🔗 Explorer: ${network.explorerUrl}/extrinsic/${txHash}`);
            }

            await this.sdk.disconnect();
        } catch (error) {
            console.error(`   ❌ Transaction failed on ${network.name}: ${error}`);
        }
    }

    private async demoEVMTransactions(): Promise<void> {
        console.log("\n⚡ Step 3: EVM Transaction Demo");
        console.log("-".repeat(45));

        // Test Ethereum Sepolia testnet
        const sepolia = EVM_NETWORKS.find(n => n.name === "Ethereum Sepolia Testnet");
        if (sepolia) {
            await this.performEVMTransaction(sepolia, "0.001"); // Testnet amount
        }

        // Test Selendra mainnet with small amount
        const selendraMainnet = EVM_NETWORKS.find(n => n.name === "Selendra Mainnet");
        if (selendraMainnet) {
            await this.performEVMTransaction(selendraMainnet, "0.0001"); // Small amount for mainnet
        }
    }

    private async performEVMTransaction(network: any, amount: string): Promise<void> {
        try {
            console.log(`\n💫 Testing ${network.name} transaction...`);
            await this.sdk.connect(network.chainId.toString());

            // Check balance
            const walletState = await this.sdk.getWalletState();
            const balance = BigInt(walletState.balances.native);

            if (balance === BigInt(0)) {
                console.log(`   ⚠️  Zero balance on ${network.name}, skipping transaction`);
                await this.sdk.disconnect();
                return;
            }

            // Prepare transaction
            const amountParsed = parseTransactionAmount(amount, "evm");
            let recipientKey: keyof typeof FUNDED_WALLET_CONFIG.recipients.evm;

            if (network.name === "Ethereum Sepolia Testnet") {
                recipientKey = "ethereumSepolia";
            } else {
                recipientKey = "selendra"; // For Selendra Mainnet
            }

            const recipient = FUNDED_WALLET_CONFIG.recipients.evm[recipientKey];

            const tx: TransactionRequest = {
                to: recipient,
                value: amountParsed,
            };

            // Estimate gas
            const feeEstimate = await this.sdk.estimateFee(tx);
            console.log(`   📊 Transaction details:`);
            console.log(`      Amount: ${amount} ${network.nativeCurrency.symbol}`);
            console.log(`      Recipient: ${recipient}`);
            console.log(`      Estimated gas: ${feeEstimate.formatted} ${feeEstimate.currency}`);

            // Check if balance is sufficient
            const requiredAmount = BigInt(amountParsed) + BigInt(feeEstimate.fee);
            if (balance < requiredAmount) {
                console.log(
                    `   ⚠️  Insufficient balance. Required: ${requiredAmount.toString()}, Available: ${balance.toString()}`
                );
                await this.sdk.disconnect();
                return;
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

    private async demoMessageSigning(): Promise<void> {
        console.log("\n✍️  Step 4: Message Signing Demo");
        console.log("-".repeat(45));

        const testMessage = `Hello from Bitriel SDK Live Demo! Timestamp: ${Date.now()}`;
        console.log(`📝 Test message: "${testMessage}"`);

        // Test on specific networks only
        const testNetworks = [
            SUBSTRATE_NETWORKS.find(n => n.name === "Selendra"), // Selendra Substrate mainnet
            EVM_NETWORKS.find(n => n.name === "Selendra Mainnet"), // Selendra EVM mainnet
            EVM_NETWORKS.find(n => n.name === "Ethereum Sepolia Testnet"), // Ethereum testnet
        ].filter((network): network is NonNullable<typeof network> => network !== undefined);

        for (const network of testNetworks) {
            try {
                console.log(`\n🔏 Signing on ${network.name}...`);
                await this.sdk.connect(network.chainId.toString());

                const signature = await this.sdk.signMessage(testMessage);
                console.log(`   ✅ Signature: ${signature.substring(0, 40)}...`);
                console.log(`   📏 Length: ${signature.length} characters`);
                console.log(`   🔤 Type: ${network.type === "substrate" ? "Substrate (SR25519)" : "EVM (ECDSA)"}`);

                await this.sdk.disconnect();
            } catch (error) {
                console.warn(`   ⚠️  Failed to sign on ${network.name}: ${error}`);
            }
        }
    }

    private async checkFinalBalances(): Promise<void> {
        console.log("\n💰 Step 5: Final Balance Check");
        console.log("-".repeat(45));
        console.log("Checking balances after transactions...");

        // Balance check on specific networks we're testing
        const importantNetworks = [
            SUBSTRATE_NETWORKS.find(n => n.name === "Selendra"),
            EVM_NETWORKS.find(n => n.name === "Selendra Mainnet"),
            EVM_NETWORKS.find(n => n.name === "Ethereum Sepolia Testnet"),
        ].filter(Boolean);

        for (const network of importantNetworks) {
            try {
                await this.sdk.connect(network!.chainId.toString());
                const walletState = await this.sdk.getWalletState();

                if (network!.type === "substrate") {
                    const detailedBalance = await this.sdk.getDetailedBalance();
                    console.log(
                        `   ${network!.name}: ${detailedBalance.formatted.total} ${network!.nativeCurrency.symbol}`
                    );
                } else {
                    const balance = BigInt(walletState.balances.native);
                    const formatted = this.sdk.formatTokenBalance(
                        balance.toString(),
                        network!.nativeCurrency.decimals,
                        { precision: 6 }
                    );
                    console.log(`   ${network!.name}: ${formatted} ${network!.nativeCurrency.symbol}`);
                }

                await this.sdk.disconnect();
            } catch (error) {
                console.warn(`   ⚠️  ${network!.name}: Balance check failed`);
            }
        }
    }
}

async function main(): Promise<void> {
    console.log("🎯 Bitriel Wallet SDK - Focused Live Demo");
    console.log("=".repeat(60));
    console.log("🔍 Testing specific networks:");
    console.log("   - Selendra Substrate (mainnet only)");
    console.log("   - Selendra EVM (mainnet only)");
    console.log("   - Ethereum (Sepolia testnet only)");
    console.log("=".repeat(60));
    console.log("⚠️  CRITICAL WARNINGS:");
    console.log("   - This demo uses REAL cryptocurrency");
    console.log("   - Real transactions will be performed");
    console.log("   - Only small amounts will be transferred");
    console.log("   - Make sure wallet is funded before running");
    console.log("=".repeat(60));

    // Safety confirmation
    console.log("\n⏳ Starting in 5 seconds...");
    console.log("Press Ctrl+C to cancel if you don't want to proceed");
    await new Promise(resolve => setTimeout(resolve, 5000));

    const demo = new LiveDemo();

    try {
        await demo.runLiveDemo();
        console.log("\n🎉 Live demo completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("\n💥 Live demo failed:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

export { LiveDemo, FUNDED_WALLET_CONFIG };
