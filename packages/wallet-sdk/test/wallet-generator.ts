#!/usr/bin/env ts-node

/**
 * Wallet Generator for Real Transaction Tests
 *
 * This script generates test wallet addresses for different networks
 * and provides funding instructions.
 *
 * Usage: npm run generate:wallets
 */

import { BitrielWalletSDK } from "../src/sdk";
import { SUBSTRATE_NETWORKS, EVM_NETWORKS } from "../src/config/networks";

class WalletGenerator {
    async generateTestWallet(): Promise<void> {
        console.log("🔐 Generating Test Wallet for Real Transaction Tests");
        console.log("=".repeat(60));

        // Generate a new mnemonic
        const mnemonic = BitrielWalletSDK.createMnemonic();

        console.log("🔑 Generated Mnemonic:");
        console.log(`"${mnemonic}"`);
        console.log("\n⚠️  SECURITY WARNING:");
        console.log("   - This is a TEST wallet only");
        console.log("   - Never use this for mainnet funds");
        console.log("   - Replace in your test files");
        console.log("   - Never commit to version control");

        // Initialize SDK with the generated mnemonic
        const sdk = new BitrielWalletSDK(mnemonic);

        console.log("\n📍 Generated Addresses:");
        console.log("-".repeat(40));

        const addresses: Record<string, { address: string; network: string; type: string }> = {};

        // Generate Substrate addresses
        for (const network of SUBSTRATE_NETWORKS) {
            try {
                await sdk.connect(network.chainId.toString());
                const walletState = await sdk.getWalletState();
                addresses[`substrate_${network.name.toLowerCase().replace(/\s+/g, "_")}`] = {
                    address: walletState.address,
                    network: network.name,
                    type: "Substrate",
                };
                await sdk.disconnect();
            } catch (error) {
                console.warn(`⚠️  Failed to generate address for ${network.name}`);
            }
        }

        // Generate EVM addresses
        for (const network of EVM_NETWORKS) {
            try {
                await sdk.connect(network.chainId.toString());
                const walletState = await sdk.getWalletState();
                addresses[`evm_${network.name.toLowerCase().replace(/\s+/g, "_")}`] = {
                    address: walletState.address,
                    network: network.name,
                    type: "EVM",
                };
                await sdk.disconnect();
            } catch (error) {
                console.warn(`⚠️  Failed to generate address for ${network.name}`);
            }
        }

        // Display addresses organized by type
        console.log("\n🔗 Substrate Addresses:");
        Object.entries(addresses)
            .filter(([, info]) => info.type === "Substrate")
            .forEach(([, info]) => {
                console.log(`   ${info.network}: ${info.address}`);
            });

        console.log("\n🔗 EVM Addresses:");
        Object.entries(addresses)
            .filter(([, info]) => info.type === "EVM")
            .forEach(([, info]) => {
                console.log(`   ${info.network}: ${info.address}`);
            });

        // Generate configuration code
        console.log("\n📝 Configuration Code for Tests:");
        console.log("-".repeat(40));
        console.log("// Copy this into your test files:");
        console.log("");
        console.log("const CONFIG = {");
        console.log(`    testMnemonic: "${mnemonic}",`);
        console.log("    recipients: {");
        console.log("        substrate: {");

        const substrateAddresses = Object.entries(addresses).filter(([, info]) => info.type === "Substrate");
        substrateAddresses.forEach(([key, info]) => {
            const cleanKey = key.replace("substrate_", "").replace(/_/g, "");
            console.log(`            ${cleanKey}: "${info.address}",`);
        });

        console.log("        },");
        console.log("        evm: {");

        const evmAddresses = Object.entries(addresses).filter(([, info]) => info.type === "EVM");
        evmAddresses.forEach(([key, info]) => {
            const cleanKey = key.replace("evm_", "").replace(/_/g, "");
            console.log(`            ${cleanKey}: "${info.address}",`);
        });

        console.log("        }");
        console.log("    }");
        console.log("};");

        // Funding instructions
        console.log("\n💰 Funding Instructions:");
        console.log("-".repeat(40));

        console.log("\n🔗 Substrate Networks:");
        substrateAddresses.forEach(([, info]) => {
            console.log(`\n   ${info.network}:`);
            console.log(`   Address: ${info.address}`);
            if (info.network.includes("Testnet")) {
                console.log(`   Funding: Request testnet tokens via Selendra Telegram`);
                console.log(`   Link: https://t.me/selendranetwork`);
            } else {
                console.log(`   Funding: Contact Selendra team for mainnet tokens`);
            }
        });

        console.log("\n🔗 EVM Networks:");
        evmAddresses.forEach(([, info]) => {
            console.log(`\n   ${info.network}:`);
            console.log(`   Address: ${info.address}`);
            if (info.network.includes("Sepolia")) {
                console.log(`   Funding: Use Ethereum Sepolia faucets`);
                console.log(`   Faucets:`);
                console.log(`     - https://sepoliafaucet.com/`);
                console.log(`     - https://sepolia-faucet.pk910.de/`);
            } else if (info.network.includes("Testnet")) {
                console.log(`   Funding: Request testnet tokens via Selendra community`);
            } else {
                console.log(`   Funding: Bridge from Substrate or acquire SEL tokens`);
            }
        });

        console.log("\n✅ Wallet generation completed!");
        console.log("\n📋 Next Steps:");
        console.log("   1. Copy the mnemonic to a secure location");
        console.log("   2. Update your test files with the new addresses");
        console.log("   3. Fund the wallets using the provided instructions");
        console.log("   4. Run the real transaction tests");
    }
}

// Main execution
async function main(): Promise<void> {
    const generator = new WalletGenerator();
    try {
        await generator.generateTestWallet();
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to generate wallet:", error);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

export { WalletGenerator };
