#!/usr/bin/env ts-node

/**
 * Simple Real Transaction Demo
 * A basic test to verify SDK functionality with real networks
 */

import { BitrielWalletSDK } from "../src/sdk";

async function runSimpleDemo() {
    console.log("🚀 Simple Real Transaction Demo");
    console.log("=".repeat(40));

    try {
        // Initialize SDK with test mnemonic
        const mnemonic =
            "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
        const sdk = new BitrielWalletSDK(mnemonic);
        console.log("✅ SDK initialized successfully");

        // Generate addresses for different networks
        console.log("\n📍 Generating addresses...");

        // Substrate addresses
        const substrateAddress = sdk.generateSubstrateAddress("selendra");
        console.log(`Selendra (Substrate): ${substrateAddress}`);

        // EVM addresses
        const evmAddress = sdk.generateEVMAddress();
        console.log(`EVM Address: ${evmAddress}`);

        console.log("\n🎉 Demo completed successfully!");
        console.log("\nNext steps:");
        console.log("1. Fund the addresses above with test tokens");
        console.log("2. Run the complete demo with: npm run demo:testnet");
        console.log("3. Check real transaction tests with: npm run test:real-jest");
    } catch (error) {
        console.error("❌ Demo failed:", error);
        process.exit(1);
    }
}

// Run the demo
runSimpleDemo().catch(console.error);
