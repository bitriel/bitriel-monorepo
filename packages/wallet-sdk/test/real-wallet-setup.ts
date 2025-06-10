#!/usr/bin/env ts-node

/**
 * Real Wallet Setup for Live Testing
 *
 * This script generates a real wallet with actual mnemonic and addresses
 * for live transaction testing across multiple networks.
 *
 * SECURITY NOTE: This generates real keys - handle with care!
 */

import { BitrielWalletSDK } from "../src/sdk";
import { SUBSTRATE_NETWORKS, EVM_NETWORKS } from "../src/config/networks";

interface WalletInfo {
    mnemonic: string;
    addresses: {
        substrate: Record<string, string>;
        evm: Record<string, string>;
    };
}

class RealWalletSetup {
    async generateRealWallet(): Promise<WalletInfo> {
        console.log("🔐 Generating Real Wallet for Live Transaction Testing");
        console.log("=".repeat(60));
        console.log("⚠️  WARNING: This generates REAL private keys!");
        console.log("   - Keep your mnemonic secure");
        console.log("   - Never share or commit to version control");
        console.log("   - Use only for testing purposes");
        console.log("=".repeat(60));

        // Generate a new mnemonic for real testing
        const mnemonic = BitrielWalletSDK.createMnemonic();
        console.log("\n🔑 Generated Real Mnemonic:");
        console.log(`"${mnemonic}"`);

        const sdk = new BitrielWalletSDK(mnemonic);
        const walletInfo: WalletInfo = {
            mnemonic,
            addresses: {
                substrate: {},
                evm: {},
            },
        };

        console.log("\n📍 Derived Addresses:");
        console.log("-".repeat(40));

        // Generate Substrate addresses
        console.log("\n🔗 Substrate Networks:");
        for (const network of SUBSTRATE_NETWORKS) {
            try {
                await sdk.connect(network.chainId.toString());
                const walletState = await sdk.getWalletState();
                walletInfo.addresses.substrate[network.name] = walletState.address;
                console.log(`   ${network.name}: ${walletState.address}`);
                await sdk.disconnect();
            } catch (error) {
                console.warn(`   ⚠️  Failed to generate address for ${network.name}: ${error}`);
            }
        }

        // Generate EVM addresses
        console.log("\n⚡ EVM Networks:");
        for (const network of EVM_NETWORKS) {
            try {
                await sdk.connect(network.chainId.toString());
                const walletState = await sdk.getWalletState();
                walletInfo.addresses.evm[network.name] = walletState.address;
                console.log(`   ${network.name}: ${walletState.address}`);
                await sdk.disconnect();
            } catch (error) {
                console.warn(`   ⚠️  Failed to generate address for ${network.name}: ${error}`);
            }
        }

        return walletInfo;
    }

    async checkBalances(walletInfo: WalletInfo): Promise<void> {
        console.log("\n💰 Checking Wallet Balances");
        console.log("-".repeat(40));

        const sdk = new BitrielWalletSDK(walletInfo.mnemonic);
        let totalFunded = 0;

        // Check Substrate balances
        console.log("\n🔗 Substrate Network Balances:");
        for (const network of SUBSTRATE_NETWORKS) {
            try {
                await sdk.connect(network.chainId.toString());
                const walletState = await sdk.getWalletState();
                const balance = BigInt(walletState.balances.native);

                if (balance > BigInt(0)) {
                    const detailedBalance = await sdk.getDetailedBalance();
                    console.log(
                        `   ✅ ${network.name}: ${detailedBalance.formatted.total} ${network.nativeCurrency.symbol}`
                    );
                    totalFunded++;
                } else {
                    console.log(`   ⚠️  ${network.name}: 0 ${network.nativeCurrency.symbol} (needs funding)`);
                }
                await sdk.disconnect();
            } catch (error) {
                console.warn(`   ❌ ${network.name}: Connection failed`);
            }
        }

        // Check EVM balances
        console.log("\n⚡ EVM Network Balances:");
        for (const network of EVM_NETWORKS) {
            try {
                await sdk.connect(network.chainId.toString());
                const walletState = await sdk.getWalletState();
                const balance = BigInt(walletState.balances.native);

                if (balance > BigInt(0)) {
                    const formatted = sdk.formatTokenBalance(balance.toString(), network.nativeCurrency.decimals, {
                        precision: 6,
                    });
                    console.log(`   ✅ ${network.name}: ${formatted} ${network.nativeCurrency.symbol}`);
                    totalFunded++;
                } else {
                    console.log(`   ⚠️  ${network.name}: 0 ${network.nativeCurrency.symbol} (needs funding)`);
                }
                await sdk.disconnect();
            } catch (error) {
                console.warn(`   ❌ ${network.name}: Connection failed`);
            }
        }

        console.log(
            `\n📊 Summary: ${totalFunded} networks funded out of ${SUBSTRATE_NETWORKS.length + EVM_NETWORKS.length} total`
        );
    }

    printFundingInstructions(walletInfo: WalletInfo): void {
        console.log("\n💰 Funding Instructions");
        console.log("-".repeat(40));

        console.log("\n🔗 Substrate Networks:");
        for (const [networkName, address] of Object.entries(walletInfo.addresses.substrate)) {
            console.log(`\n${networkName}:`);
            console.log(`   Address: ${address}`);
            if (networkName.includes("Testnet")) {
                console.log(`   💸 Get testnet tokens: https://t.me/selendranetwork`);
            } else {
                console.log(`   💸 Contact Selendra team for mainnet tokens`);
            }
        }

        console.log("\n⚡ EVM Networks:");
        for (const [networkName, address] of Object.entries(walletInfo.addresses.evm)) {
            console.log(`\n${networkName}:`);
            console.log(`   Address: ${address}`);
            if (networkName.includes("Sepolia")) {
                console.log(`   💸 Get Sepolia ETH: https://sepoliafaucet.com/`);
                console.log(`   💸 Alternative: https://sepolia-faucet.pk910.de/`);
            } else if (networkName.includes("Testnet")) {
                console.log(`   💸 Get testnet tokens: https://t.me/selendranetwork`);
            } else if (networkName.includes("Selendra")) {
                console.log(`   💸 Bridge from Substrate or acquire SEL tokens`);
            }
        }
    }

    generateTestConfig(walletInfo: WalletInfo): void {
        console.log("\n🔧 Test Configuration Code");
        console.log("-".repeat(40));
        console.log("Copy this configuration into your test files:");
        console.log("");
        console.log("```typescript");
        console.log("const REAL_WALLET_CONFIG = {");
        console.log(`    mnemonic: "${walletInfo.mnemonic}",`);
        console.log("    addresses: {");
        console.log("        substrate: {");
        Object.entries(walletInfo.addresses.substrate).forEach(([network, address]) => {
            const key = network.toLowerCase().replace(/\s+/g, "");
            console.log(`            ${key}: "${address}",`);
        });
        console.log("        },");
        console.log("        evm: {");
        Object.entries(walletInfo.addresses.evm).forEach(([network, address]) => {
            const key = network.toLowerCase().replace(/\s+/g, "");
            console.log(`            ${key}: "${address}",`);
        });
        console.log("        }");
        console.log("    }");
        console.log("};");
        console.log("```");
    }
}

async function main(): Promise<void> {
    const setup = new RealWalletSetup();

    try {
        // Generate real wallet
        const walletInfo = await setup.generateRealWallet();

        // Check current balances
        await setup.checkBalances(walletInfo);

        // Print funding instructions
        setup.printFundingInstructions(walletInfo);

        // Generate test configuration
        setup.generateTestConfig(walletInfo);

        console.log("\n🔒 Security Reminders:");
        console.log("   - Store your mnemonic securely");
        console.log("   - Never commit real keys to version control");
        console.log("   - Use only for testing purposes");
        console.log("   - Fund with small amounts only");

        console.log("\n✅ Real wallet setup complete!");
    } catch (error) {
        console.error("❌ Setup failed:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

export { RealWalletSetup };
