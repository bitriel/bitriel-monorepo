#!/usr/bin/env ts-node

/**
 * Real Transaction Wallet Test Script
 *
 * This script performs real transactions on both Substrate Selendra and EVM networks
 * including Ethereum testnet. It's designed for manual testing and demonstration.
 *
 * Usage: npm run test:real-transactions
 *
 * IMPORTANT SECURITY NOTES:
 * - Replace the test mnemonic with your own
 * - Ensure you have sufficient testnet funds
 * - Never commit real private keys or mnemonics to version control
 * - Use testnet networks for testing
 */

import { BitrielWalletSDK } from "../src/sdk";
import { SUBSTRATE_NETWORKS, EVM_NETWORKS } from "../src/config/networks";
import { parseTransactionAmount } from "../src/utils/amount";
import { TransactionRequest } from "../src/wallet/types";

// Configuration
const CONFIG = {
    // WARNING: Replace with your own test mnemonic - DO NOT commit real mnemonics
    testMnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",

    // Test recipient addresses (replace with your own test addresses)
    recipients: {
        substrate: {
            selendra: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Alice
            selendraTestnet: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        },
        evm: {
            selendra: "0x8ba1f109551bD432803012645Hac136c46F570d6",
            selendraTestnet: "0x8ba1f109551bD432803012645Hac136c46F570d6",
            ethereumSepolia: "0x8ba1f109551bD432803012645Hac136c46F570d6",
        },
    },

    // Transaction amounts (in native currency units)
    amounts: {
        mainnet: "0.001", // 0.001 for mainnet (smaller amounts)
        testnet: "0.01", // 0.01 for testnet (larger amounts for testing)
    },
};

class RealTransactionTester {
    private sdk: BitrielWalletSDK;

    constructor() {
        this.sdk = new BitrielWalletSDK(CONFIG.testMnemonic);
    }

    async run(): Promise<void> {
        console.log("🚀 Starting Real Transaction Tests");
        console.log("=".repeat(50));

        try {
            // Test Substrate Selendra
            await this.testSubstrateSelendra();

            // Test Substrate Selendra Testnet
            await this.testSubstrateSelendraTestnet();

            // Test EVM Selendra
            await this.testEVMSelendra();

            // Test EVM Selendra Testnet
            await this.testEVMSelendraTestnet();

            // Test Ethereum Sepolia Testnet
            await this.testEthereumSepolia();

            // Test Token Operations
            await this.testTokenOperations();

            // Test Cross-Chain Address Generation
            await this.testCrossChainAddresses();

            console.log("\n✅ All tests completed successfully!");
        } catch (error) {
            console.error("\n❌ Test failed:", error);
            throw error;
        }
    }

    private async testSubstrateSelendra(): Promise<void> {
        console.log("\n🔗 Testing Substrate Selendra Mainnet");
        console.log("-".repeat(40));

        const network = SUBSTRATE_NETWORKS.find(n => n.name === "Selendra");
        if (!network) {
            console.warn("⚠️  Selendra network not found, skipping");
            return;
        }

        try {
            await this.sdk.connect(network.chainId.toString());

            // Get wallet state
            const walletState = await this.sdk.getWalletState();
            console.log("📊 Wallet Info:");
            console.log(`   Address: ${walletState.address}`);
            console.log(`   Balance: ${walletState.balances.native} (raw)`);
            console.log(`   Network: ${walletState.network?.name}`);

            // Get detailed balance
            const detailedBalance = await this.sdk.getDetailedBalance();
            console.log("💰 Detailed Balance:");
            console.log(`   Total: ${detailedBalance.formatted.total} SEL`);
            console.log(`   Locked: ${detailedBalance.formatted.locked} SEL`);
            console.log(`   Transferable: ${detailedBalance.formatted.transferable} SEL`);

            // Check if we have sufficient balance
            const balance = BigInt(walletState.balances.native);
            const amount = parseTransactionAmount(CONFIG.amounts.mainnet, "substrate");

            if (balance === 0n) {
                console.warn("⚠️  Zero balance detected. Please fund the wallet:");
                console.warn(`   Address: ${walletState.address}`);
                console.warn(`   Network: Selendra Mainnet`);
                return;
            }

            // Prepare transaction
            const tx = {
                method: "balances",
                params: ["transfer", CONFIG.recipients.substrate.selendra, amount],
            };

            // Estimate fee
            console.log("⚡ Estimating transaction fee...");
            const feeEstimate = await this.sdk.estimateFee(tx);
            console.log(`💸 Estimated fee: ${feeEstimate.formatted} ${feeEstimate.currency}`);

            // Check if balance is sufficient for transaction + fee
            const requiredAmount = BigInt(amount) + BigInt(feeEstimate.fee);
            if (balance < requiredAmount) {
                console.warn(
                    `⚠️  Insufficient balance. Required: ${requiredAmount.toString()}, Available: ${balance.toString()}`
                );
                console.warn("⚠️  Skipping transaction to prevent failure");
                return;
            }

            // Send transaction
            console.log("🚀 Sending transaction...");
            const txHash = await this.sdk.sendTransaction(tx);
            console.log(`✅ Transaction sent! Hash: ${txHash}`);

            // Test message signing
            const message = "Hello from Selendra!";
            const signature = await this.sdk.signMessage(message);
            console.log(`✍️  Message signed: ${signature.substring(0, 20)}...`);
        } catch (error) {
            console.error("❌ Selendra test failed:", error);
        } finally {
            await this.sdk.disconnect();
        }
    }

    private async testSubstrateSelendraTestnet(): Promise<void> {
        console.log("\n🔗 Testing Substrate Selendra Testnet");
        console.log("-".repeat(40));

        const network = SUBSTRATE_NETWORKS.find(n => n.name === "Selendra Testnet");
        if (!network) {
            console.warn("⚠️  Selendra Testnet not found, skipping");
            return;
        }

        try {
            await this.sdk.connect(network.chainId.toString());

            const walletState = await this.sdk.getWalletState();
            console.log("📊 Testnet Wallet Info:");
            console.log(`   Address: ${walletState.address}`);
            console.log(`   Balance: ${walletState.balances.native} (raw)`);
            console.log(`   Network: ${walletState.network?.name}`);

            const balance = BigInt(walletState.balances.native);
            if (balance === 0n) {
                console.warn("⚠️  Zero testnet balance. Please request testnet tokens:");
                console.warn(`   Address: ${walletState.address}`);
                console.warn(`   Telegram: https://t.me/selendranetwork`);
                return;
            }

            // Prepare testnet transaction
            const amount = parseTransactionAmount(CONFIG.amounts.testnet, "substrate");
            const tx = {
                method: "balances",
                params: ["transfer", CONFIG.recipients.substrate.selendraTestnet, amount],
            };

            // Send testnet transaction
            console.log("🚀 Sending testnet transaction...");
            const txHash = await this.sdk.sendTransaction(tx);
            console.log(`✅ Testnet transaction sent! Hash: ${txHash}`);
        } catch (error) {
            console.error("❌ Selendra Testnet test failed:", error);
        } finally {
            await this.sdk.disconnect();
        }
    }

    private async testEVMSelendra(): Promise<void> {
        console.log("\n🔗 Testing EVM Selendra Mainnet");
        console.log("-".repeat(40));

        const network = EVM_NETWORKS.find(n => n.name === "Selendra Mainnet");
        if (!network) {
            console.warn("⚠️  Selendra EVM network not found, skipping");
            return;
        }

        try {
            await this.sdk.connect(network.chainId.toString());

            const walletState = await this.sdk.getWalletState();
            console.log("📊 EVM Wallet Info:");
            console.log(`   Address: ${walletState.address}`);
            console.log(`   Balance: ${walletState.balances.native} (wei)`);
            console.log(`   Network: ${walletState.network?.name}`);

            const balance = BigInt(walletState.balances.native);
            if (balance === 0n) {
                console.warn("⚠️  Zero EVM balance. Please fund the wallet:");
                console.warn(`   Address: ${walletState.address}`);
                return;
            }

            // Prepare EVM transaction
            const amount = parseTransactionAmount(CONFIG.amounts.mainnet, "evm");
            const tx: TransactionRequest = {
                to: CONFIG.recipients.evm.selendra,
                value: amount,
            };

            // Estimate gas fee
            console.log("⚡ Estimating gas fee...");
            const feeEstimate = await this.sdk.estimateFee(tx);
            console.log(`💸 Estimated gas fee: ${feeEstimate.formatted} ${feeEstimate.currency}`);

            // Check if balance is sufficient
            const requiredAmount = BigInt(amount) + BigInt(feeEstimate.fee);
            if (balance < requiredAmount) {
                console.warn(
                    `⚠️  Insufficient EVM balance. Required: ${requiredAmount.toString()}, Available: ${balance.toString()}`
                );
                return;
            }

            // Send EVM transaction
            console.log("🚀 Sending EVM transaction...");
            const txHash = await this.sdk.sendTransaction(tx);
            console.log(`✅ EVM transaction sent! Hash: ${txHash}`);
            console.log(`🔗 Explorer: http://explorer.selendra.org/tx/${txHash}`);

            // Test message signing
            const message = "Hello from Selendra EVM!";
            const signature = await this.sdk.signMessage(message);
            console.log(`✍️  EVM message signed: ${signature.substring(0, 20)}...`);
        } catch (error) {
            console.error("❌ Selendra EVM test failed:", error);
        } finally {
            await this.sdk.disconnect();
        }
    }

    private async testEVMSelendraTestnet(): Promise<void> {
        console.log("\n🔗 Testing EVM Selendra Testnet");
        console.log("-".repeat(40));

        const network = EVM_NETWORKS.find(n => n.name === "Selendra Testnet EVM");
        if (!network) {
            console.warn("⚠️  Selendra EVM Testnet not found, skipping");
            return;
        }

        try {
            await this.sdk.connect(network.chainId.toString());

            const walletState = await this.sdk.getWalletState();
            console.log("📊 EVM Testnet Wallet Info:");
            console.log(`   Address: ${walletState.address}`);
            console.log(`   Balance: ${walletState.balances.native} (wei)`);
            console.log(`   Network: ${walletState.network?.name}`);

            const balance = BigInt(walletState.balances.native);
            if (balance === 0n) {
                console.warn("⚠️  Zero EVM testnet balance. Please request testnet tokens:");
                console.warn(`   Address: ${walletState.address}`);
                return;
            }

            // Prepare EVM testnet transaction
            const amount = parseTransactionAmount(CONFIG.amounts.testnet, "evm");
            const tx: TransactionRequest = {
                to: CONFIG.recipients.evm.selendraTestnet,
                value: amount,
            };

            // Send EVM testnet transaction
            console.log("🚀 Sending EVM testnet transaction...");
            const txHash = await this.sdk.sendTransaction(tx);
            console.log(`✅ EVM testnet transaction sent! Hash: ${txHash}`);
        } catch (error) {
            console.error("❌ Selendra EVM Testnet test failed:", error);
        } finally {
            await this.sdk.disconnect();
        }
    }

    private async testEthereumSepolia(): Promise<void> {
        console.log("\n🔗 Testing Ethereum Sepolia Testnet");
        console.log("-".repeat(40));

        const network = EVM_NETWORKS.find(n => n.name === "Ethereum Sepolia Testnet");
        if (!network) {
            console.warn("⚠️  Ethereum Sepolia not found, skipping");
            return;
        }

        try {
            await this.sdk.connect(network.chainId.toString());

            const walletState = await this.sdk.getWalletState();
            console.log("📊 Ethereum Sepolia Wallet Info:");
            console.log(`   Address: ${walletState.address}`);
            console.log(`   Balance: ${walletState.balances.native} (wei)`);
            console.log(`   Network: ${walletState.network?.name}`);

            const balance = BigInt(walletState.balances.native);
            if (balance === 0n) {
                console.warn("⚠️  Zero Sepolia ETH balance. Please get testnet ETH:");
                console.warn(`   Address: ${walletState.address}`);
                console.warn(`   Faucet: https://sepoliafaucet.com/`);
                console.warn(`   Alternative: https://sepolia-faucet.pk910.de/`);
                return;
            }

            // Prepare Ethereum transaction
            const amount = parseTransactionAmount(CONFIG.amounts.testnet, "evm");
            const tx: TransactionRequest = {
                to: CONFIG.recipients.evm.ethereumSepolia,
                value: amount,
            };

            // Estimate gas fee
            console.log("⚡ Estimating Ethereum gas fee...");
            const feeEstimate = await this.sdk.estimateFee(tx);
            console.log(`💸 Estimated gas fee: ${feeEstimate.formatted} ${feeEstimate.currency}`);

            // Check if balance is sufficient
            const requiredAmount = BigInt(amount) + BigInt(feeEstimate.fee);
            if (balance < requiredAmount) {
                console.warn(
                    `⚠️  Insufficient Sepolia ETH. Required: ${requiredAmount.toString()}, Available: ${balance.toString()}`
                );
                console.warn("💰 Please get more testnet ETH from the faucet");
                return;
            }

            // Send Ethereum transaction
            console.log("🚀 Sending Ethereum transaction...");
            const txHash = await this.sdk.sendTransaction(tx);
            console.log(`✅ Ethereum transaction sent! Hash: ${txHash}`);
            console.log(`🔗 Etherscan: https://sepolia.etherscan.io/tx/${txHash}`);

            // Test message signing
            const message = "Hello from Ethereum Sepolia!";
            const signature = await this.sdk.signMessage(message);
            console.log(`✍️  Ethereum message signed: ${signature.substring(0, 20)}...`);
        } catch (error) {
            console.error("❌ Ethereum Sepolia test failed:", error);
        } finally {
            await this.sdk.disconnect();
        }
    }

    private async testTokenOperations(): Promise<void> {
        console.log("\n🪙 Testing Token Operations");
        console.log("-".repeat(40));

        // Test tokens on Ethereum Sepolia
        const network = EVM_NETWORKS.find(n => n.name === "Ethereum Sepolia Testnet");
        if (!network) {
            console.warn("⚠️  Ethereum Sepolia not found for token testing");
            return;
        }

        try {
            await this.sdk.connect(network.chainId.toString());

            const walletState = await this.sdk.getWalletState();
            console.log(`📊 Token test on ${walletState.network?.name}`);
            console.log(`   Address: ${walletState.address}`);

            // List all tokens
            console.log("🔍 Listing available tokens...");
            const tokens = await this.sdk.listTokens();

            console.log("📋 Token List:");
            tokens.forEach(token => {
                console.log(`   ${token.symbol}: ${token.formatted} (${token.address})`);
            });

            // Check specific token balances
            if (network.tokens) {
                console.log("\n🔍 Checking configured token balances...");
                for (const tokenConfig of network.tokens) {
                    const token = tokens.find(t => t.address.toLowerCase() === tokenConfig.address.toLowerCase());
                    if (token) {
                        console.log(`   ${tokenConfig.symbol}: ${token.formatted}`);
                        if (token.balance !== "0") {
                            console.log(`   ✅ Found ${tokenConfig.symbol} balance!`);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("❌ Token operations test failed:", error);
        } finally {
            await this.sdk.disconnect();
        }
    }

    private async testCrossChainAddresses(): Promise<void> {
        console.log("\n🌐 Testing Cross-Chain Address Generation");
        console.log("-".repeat(40));

        const addresses: Record<string, string> = {};

        // Test a few key networks
        const testNetworks = [
            ...SUBSTRATE_NETWORKS.slice(0, 2), // First 2 substrate networks
            ...EVM_NETWORKS.slice(0, 3), // First 3 EVM networks
        ];

        for (const network of testNetworks) {
            try {
                console.log(`🔗 Generating address for ${network.name}...`);
                await this.sdk.connect(network.chainId.toString());
                const walletState = await this.sdk.getWalletState();
                addresses[network.name] = walletState.address;
                console.log(`   ${network.name}: ${walletState.address}`);
                await this.sdk.disconnect();
            } catch (error) {
                console.warn(`⚠️  Failed to generate address for ${network.name}:`, error);
            }
        }

        // Analyze address consistency
        console.log("\n📍 Address Analysis:");
        const evmAddresses = Object.entries(addresses)
            .filter(([name]) => EVM_NETWORKS.some(n => n.name === name))
            .map(([name, address]) => ({ name, address }));

        const substrateAddresses = Object.entries(addresses)
            .filter(([name]) => SUBSTRATE_NETWORKS.some(n => n.name === name))
            .map(([name, address]) => ({ name, address }));

        if (evmAddresses.length > 1) {
            const firstEvmAddress = evmAddresses[0].address;
            const allEvmSame = evmAddresses.every(({ address }) => address === firstEvmAddress);
            console.log(`   EVM addresses consistent: ${allEvmSame ? "✅" : "❌"}`);
        }

        if (substrateAddresses.length > 1) {
            console.log(`   Substrate addresses: ${substrateAddresses.length} generated`);
            substrateAddresses.forEach(({ name, address }) => {
                console.log(`     ${name}: ${address}`);
            });
        }
    }
}

// Main execution
async function main(): Promise<void> {
    console.log("🧪 Bitriel Wallet SDK - Real Transaction Tests");
    console.log("=".repeat(60));
    console.log("⚠️  WARNING: This script performs real transactions!");
    console.log("📝 Make sure you have:");
    console.log("   - Replaced test mnemonic with your own");
    console.log("   - Funded wallets with testnet tokens");
    console.log("   - Updated recipient addresses");
    console.log("=".repeat(60));

    const tester = new RealTransactionTester();

    try {
        await tester.run();
        console.log("\n🎉 All tests completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("\n💥 Tests failed:", error);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

export { RealTransactionTester, CONFIG };
