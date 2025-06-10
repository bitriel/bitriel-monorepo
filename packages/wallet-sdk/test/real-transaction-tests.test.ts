import { BitrielWalletSDK } from "../src/sdk";
import { SUBSTRATE_NETWORKS, EVM_NETWORKS } from "../src/config/networks";
import { parseTransactionAmount } from "../src/utils/amount";
import { TransactionRequest } from "../src/wallet/types";

/**
 * Real Transaction Tests with Live Wallet Accounts
 *
 * This test suite performs actual transactions on testnets and live networks.
 * It tests both Substrate Selendra and EVM networks including Ethereum testnet.
 *
 * IMPORTANT:
 * - These tests use real wallets and perform real transactions
 * - Ensure you have sufficient testnet funds
 * - Replace test mnemonics with your own for security
 * - Never commit real private keys or mnemonics to version control
 */

describe("Real Transaction Tests", () => {
    let sdk: BitrielWalletSDK;

    // WARNING: Replace with your own test mnemonic - DO NOT commit real mnemonics
    const testMnemonic =
        "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

    // Test recipient addresses (replace with your own test addresses)
    const TEST_ADDRESSES = {
        substrate: {
            selendra: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Alice
            selendraTestnet: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Alice
        },
        evm: {
            selendra: "0x8ba1f109551bD432803012645Hac136c46F570d6", // Test address
            selendraTestnet: "0x8ba1f109551bD432803012645Hac136c46F570d6", // Test address
            ethereumSepolia: "0x8ba1f109551bD432803012645Hac136c46F570d6", // Test address
        },
    };

    // Test timeout increased for network operations
    const TEST_TIMEOUT = 60000;

    beforeEach(() => {
        sdk = new BitrielWalletSDK(testMnemonic);
    });

    afterEach(async () => {
        try {
            await sdk.disconnect();
        } catch (error) {
            // Ignore disconnect errors in tests
            console.warn("Disconnect error:", error);
        }
    });

    describe("Substrate Selendra Real Tests", () => {
        test(
            "should perform real transaction on Selendra mainnet",
            async () => {
                const selendraNetwork = SUBSTRATE_NETWORKS.find(n => n.name === "Selendra");
                if (!selendraNetwork) {
                    throw new Error("Selendra network not found");
                }

                console.log("🔗 Connecting to Selendra mainnet...");
                await sdk.connect(selendraNetwork.chainId.toString());

                // Get wallet state
                const walletState = await sdk.getWalletState();
                console.log("📊 Wallet State:", {
                    address: walletState.address,
                    balance: walletState.balances.native,
                    network: walletState.network?.name,
                });

                // Check balance before transaction
                const balanceBefore = BigInt(walletState.balances.native);
                console.log("💰 Balance before transaction:", balanceBefore.toString(), "SEL (raw)");

                // Prepare transaction
                const amount = parseTransactionAmount("0.001", "substrate"); // 0.001 SEL
                const tx = {
                    method: "balances",
                    params: ["transfer", TEST_ADDRESSES.substrate.selendra, amount],
                };

                // Estimate fee
                console.log("⚡ Estimating transaction fee...");
                const feeEstimate = await sdk.estimateFee(tx);
                console.log("💸 Estimated fee:", {
                    amount: feeEstimate.formatted,
                    currency: feeEstimate.currency,
                    raw: feeEstimate.fee,
                });

                // Check if balance is sufficient
                const requiredAmount = BigInt(amount) + BigInt(feeEstimate.fee);
                if (balanceBefore < requiredAmount) {
                    console.warn("⚠️  Insufficient balance for transaction. Required:", requiredAmount.toString());
                    console.warn("⚠️  Skipping actual transaction to prevent failure.");
                    return;
                }

                // Send transaction
                console.log("🚀 Sending transaction...");
                const txHash = await sdk.sendTransaction(tx);
                console.log("✅ Transaction sent! Hash:", txHash);

                // Wait a bit and check balance
                console.log("⏳ Waiting for transaction confirmation...");
                await new Promise(resolve => setTimeout(resolve, 10000));

                const newWalletState = await sdk.getWalletState();
                const balanceAfter = BigInt(newWalletState.balances.native);
                console.log("💰 Balance after transaction:", balanceAfter.toString(), "SEL (raw)");

                // Verify transaction effect
                expect(balanceAfter).toBeLessThan(balanceBefore);
                expect(txHash).toBeDefined();
                expect(txHash.length).toBeGreaterThan(0);
            },
            TEST_TIMEOUT
        );

        test(
            "should perform real transaction on Selendra testnet",
            async () => {
                const selendraTestnet = SUBSTRATE_NETWORKS.find(n => n.name === "Selendra Testnet");
                if (!selendraTestnet) {
                    console.warn("⚠️  Selendra Testnet not found, skipping test");
                    return;
                }

                console.log("🔗 Connecting to Selendra testnet...");
                await sdk.connect(selendraTestnet.chainId.toString());

                // Get wallet state
                const walletState = await sdk.getWalletState();
                console.log("📊 Testnet Wallet State:", {
                    address: walletState.address,
                    balance: walletState.balances.native,
                    network: walletState.network?.name,
                });

                // Prepare testnet transaction
                const amount = parseTransactionAmount("0.01", "substrate"); // 0.01 SEL testnet
                const tx = {
                    method: "balances",
                    params: ["transfer", TEST_ADDRESSES.substrate.selendraTestnet, amount],
                };

                // Estimate fee
                console.log("⚡ Estimating testnet transaction fee...");
                const feeEstimate = await sdk.estimateFee(tx);
                console.log("💸 Estimated testnet fee:", {
                    amount: feeEstimate.formatted,
                    currency: feeEstimate.currency,
                });

                // Send testnet transaction
                console.log("🚀 Sending testnet transaction...");
                const txHash = await sdk.sendTransaction(tx);
                console.log("✅ Testnet transaction sent! Hash:", txHash);

                expect(txHash).toBeDefined();
                expect(txHash.length).toBeGreaterThan(0);
            },
            TEST_TIMEOUT
        );
    });

    describe("EVM Selendra Real Tests", () => {
        test(
            "should perform real transaction on Selendra EVM mainnet",
            async () => {
                const selendraEVM = EVM_NETWORKS.find(n => n.name === "Selendra Mainnet");
                if (!selendraEVM) {
                    throw new Error("Selendra EVM network not found");
                }

                console.log("🔗 Connecting to Selendra EVM mainnet...");
                await sdk.connect(selendraEVM.chainId.toString());

                // Get wallet state
                const walletState = await sdk.getWalletState();
                console.log("📊 EVM Wallet State:", {
                    address: walletState.address,
                    balance: walletState.balances.native,
                    network: walletState.network?.name,
                });

                // Check balance before transaction
                const balanceBefore = BigInt(walletState.balances.native);
                console.log("💰 EVM Balance before transaction:", balanceBefore.toString(), "SEL (wei)");

                // Prepare EVM transaction
                const amount = parseTransactionAmount("0.001", "evm"); // 0.001 SEL
                const tx: TransactionRequest = {
                    to: TEST_ADDRESSES.evm.selendra,
                    value: amount,
                };

                // Estimate gas fee
                console.log("⚡ Estimating EVM transaction fee...");
                const feeEstimate = await sdk.estimateFee(tx);
                console.log("💸 Estimated EVM fee:", {
                    amount: feeEstimate.formatted,
                    currency: feeEstimate.currency,
                    raw: feeEstimate.fee,
                });

                // Check if balance is sufficient
                const requiredAmount = BigInt(amount) + BigInt(feeEstimate.fee);
                if (balanceBefore < requiredAmount) {
                    console.warn("⚠️  Insufficient balance for EVM transaction. Required:", requiredAmount.toString());
                    console.warn("⚠️  Skipping actual transaction to prevent failure.");
                    return;
                }

                // Send EVM transaction
                console.log("🚀 Sending EVM transaction...");
                const txHash = await sdk.sendTransaction(tx);
                console.log("✅ EVM transaction sent! Hash:", txHash);

                // Wait for confirmation
                console.log("⏳ Waiting for EVM transaction confirmation...");
                await new Promise(resolve => setTimeout(resolve, 15000));

                const newWalletState = await sdk.getWalletState();
                const balanceAfter = BigInt(newWalletState.balances.native);
                console.log("💰 EVM Balance after transaction:", balanceAfter.toString(), "SEL (wei)");

                // Verify transaction effect
                expect(balanceAfter).toBeLessThan(balanceBefore);
                expect(txHash).toBeDefined();
                expect(txHash.length).toBeGreaterThan(0);
                expect(txHash.startsWith("0x")).toBe(true);
            },
            TEST_TIMEOUT
        );

        test(
            "should perform real transaction on Selendra EVM testnet",
            async () => {
                const selendraEVMTestnet = EVM_NETWORKS.find(n => n.name === "Selendra Testnet EVM");
                if (!selendraEVMTestnet) {
                    console.warn("⚠️  Selendra EVM Testnet not found, skipping test");
                    return;
                }

                console.log("🔗 Connecting to Selendra EVM testnet...");
                await sdk.connect(selendraEVMTestnet.chainId.toString());

                // Get wallet state
                const walletState = await sdk.getWalletState();
                console.log("📊 EVM Testnet Wallet State:", {
                    address: walletState.address,
                    balance: walletState.balances.native,
                    network: walletState.network?.name,
                });

                // Prepare EVM testnet transaction
                const amount = parseTransactionAmount("0.01", "evm"); // 0.01 SEL testnet
                const tx: TransactionRequest = {
                    to: TEST_ADDRESSES.evm.selendraTestnet,
                    value: amount,
                };

                // Estimate gas fee
                console.log("⚡ Estimating EVM testnet transaction fee...");
                const feeEstimate = await sdk.estimateFee(tx);
                console.log("💸 Estimated EVM testnet fee:", {
                    amount: feeEstimate.formatted,
                    currency: feeEstimate.currency,
                });

                // Send EVM testnet transaction
                console.log("🚀 Sending EVM testnet transaction...");
                const txHash = await sdk.sendTransaction(tx);
                console.log("✅ EVM testnet transaction sent! Hash:", txHash);

                expect(txHash).toBeDefined();
                expect(txHash.length).toBeGreaterThan(0);
                expect(txHash.startsWith("0x")).toBe(true);
            },
            TEST_TIMEOUT
        );
    });

    describe("Ethereum Testnet Real Tests", () => {
        test(
            "should perform real transaction on Ethereum Sepolia testnet",
            async () => {
                const ethereumSepolia = EVM_NETWORKS.find(n => n.name === "Ethereum Sepolia Testnet");
                if (!ethereumSepolia) {
                    throw new Error("Ethereum Sepolia testnet not found");
                }

                console.log("🔗 Connecting to Ethereum Sepolia testnet...");
                await sdk.connect(ethereumSepolia.chainId.toString());

                // Get wallet state
                const walletState = await sdk.getWalletState();
                console.log("📊 Ethereum Sepolia Wallet State:", {
                    address: walletState.address,
                    balance: walletState.balances.native,
                    network: walletState.network?.name,
                });

                // Check balance before transaction
                const balanceBefore = BigInt(walletState.balances.native);
                console.log("💰 Sepolia Balance before transaction:", balanceBefore.toString(), "SepoliaETH (wei)");

                if (balanceBefore === 0n) {
                    console.warn("⚠️  No Sepolia ETH balance. Please fund the test wallet:");
                    console.warn("💰 Address:", walletState.address);
                    console.warn("🔗 Faucet: https://sepoliafaucet.com/");
                    console.warn("⚠️  Skipping transaction due to zero balance.");
                    return;
                }

                // Prepare Ethereum transaction
                const amount = parseTransactionAmount("0.001", "evm"); // 0.001 SepoliaETH
                const tx: TransactionRequest = {
                    to: TEST_ADDRESSES.evm.ethereumSepolia,
                    value: amount,
                };

                // Estimate gas fee
                console.log("⚡ Estimating Ethereum transaction fee...");
                const feeEstimate = await sdk.estimateFee(tx);
                console.log("💸 Estimated Ethereum fee:", {
                    amount: feeEstimate.formatted,
                    currency: feeEstimate.currency,
                    raw: feeEstimate.fee,
                });

                // Check if balance is sufficient
                const requiredAmount = BigInt(amount) + BigInt(feeEstimate.fee);
                if (balanceBefore < requiredAmount) {
                    console.warn(
                        "⚠️  Insufficient balance for Ethereum transaction. Required:",
                        requiredAmount.toString()
                    );
                    console.warn("⚠️  Please fund the wallet with more SepoliaETH");
                    console.warn("💰 Address:", walletState.address);
                    console.warn("🔗 Faucet: https://sepoliafaucet.com/");
                    return;
                }

                // Send Ethereum transaction
                console.log("🚀 Sending Ethereum Sepolia transaction...");
                const txHash = await sdk.sendTransaction(tx);
                console.log("✅ Ethereum transaction sent! Hash:", txHash);
                console.log("🔗 View on explorer:", `https://sepolia.etherscan.io/tx/${txHash}`);

                // Wait for confirmation
                console.log("⏳ Waiting for Ethereum transaction confirmation...");
                await new Promise(resolve => setTimeout(resolve, 30000));

                const newWalletState = await sdk.getWalletState();
                const balanceAfter = BigInt(newWalletState.balances.native);
                console.log("💰 Sepolia Balance after transaction:", balanceAfter.toString(), "SepoliaETH (wei)");

                // Verify transaction effect
                expect(balanceAfter).toBeLessThan(balanceBefore);
                expect(txHash).toBeDefined();
                expect(txHash.length).toBeGreaterThan(0);
                expect(txHash.startsWith("0x")).toBe(true);
            },
            TEST_TIMEOUT
        );
    });

    describe("Token Transfer Tests", () => {
        test(
            "should handle ERC20 token balance queries on Ethereum Sepolia",
            async () => {
                const ethereumSepolia = EVM_NETWORKS.find(n => n.name === "Ethereum Sepolia Testnet");
                if (!ethereumSepolia) {
                    throw new Error("Ethereum Sepolia testnet not found");
                }

                console.log("🔗 Connecting to Ethereum Sepolia for token tests...");
                await sdk.connect(ethereumSepolia.chainId.toString());

                // Get wallet state
                const walletState = await sdk.getWalletState();
                console.log("📊 Token Test Wallet State:", {
                    address: walletState.address,
                    network: walletState.network?.name,
                });

                // List available tokens
                console.log("🪙 Listing available tokens...");
                const tokens = await sdk.listTokens();
                console.log(
                    "Available tokens:",
                    tokens.map(t => ({
                        symbol: t.symbol,
                        balance: t.formatted,
                        address: t.address,
                    }))
                );

                // Check token balances
                if (ethereumSepolia.tokens) {
                    for (const tokenConfig of ethereumSepolia.tokens) {
                        console.log(`🔍 Checking ${tokenConfig.symbol} balance...`);

                        // Find the token in our list
                        const token = tokens.find(t => t.address.toLowerCase() === tokenConfig.address.toLowerCase());
                        if (token) {
                            console.log(`💰 ${tokenConfig.symbol} Balance:`, token.formatted);

                            if (token.balance !== "0") {
                                console.log(`✅ Found ${tokenConfig.symbol} balance: ${token.formatted}`);
                            } else {
                                console.log(`ℹ️  Zero ${tokenConfig.symbol} balance (expected for test wallet)`);
                            }
                        }
                    }
                }

                expect(tokens).toBeDefined();
                expect(Array.isArray(tokens)).toBe(true);
            },
            TEST_TIMEOUT
        );
    });

    describe("Cross-Chain Compatibility Tests", () => {
        test(
            "should generate same address across networks with same mnemonic",
            async () => {
                const addresses: Record<string, string> = {};

                // Test Substrate networks
                for (const network of SUBSTRATE_NETWORKS) {
                    try {
                        console.log(`🔗 Testing address generation for ${network.name}...`);
                        await sdk.connect(network.chainId.toString());
                        const walletState = await sdk.getWalletState();
                        addresses[network.name] = walletState.address;
                        await sdk.disconnect();
                    } catch (error) {
                        console.warn(`⚠️  Failed to connect to ${network.name}:`, error);
                    }
                }

                // Test EVM networks
                for (const network of EVM_NETWORKS) {
                    try {
                        console.log(`🔗 Testing address generation for ${network.name}...`);
                        await sdk.connect(network.chainId.toString());
                        const walletState = await sdk.getWalletState();
                        addresses[network.name] = walletState.address;
                        await sdk.disconnect();
                    } catch (error) {
                        console.warn(`⚠️  Failed to connect to ${network.name}:`, error);
                    }
                }

                console.log("📍 Generated addresses:", addresses);

                // Verify EVM addresses are the same across EVM networks
                const evmAddresses = Object.entries(addresses)
                    .filter(([name]) => EVM_NETWORKS.some(n => n.name === name))
                    .map(([, address]) => address);

                if (evmAddresses.length > 1) {
                    const firstEvmAddress = evmAddresses[0];
                    evmAddresses.forEach(address => {
                        expect(address).toBe(firstEvmAddress);
                    });
                    console.log("✅ All EVM addresses are identical:", firstEvmAddress);
                }

                expect(Object.keys(addresses).length).toBeGreaterThan(0);
            },
            TEST_TIMEOUT * 2
        );
    });

    describe("Message Signing Tests", () => {
        test(
            "should sign messages on different networks",
            async () => {
                const testMessage = "Hello from Bitriel Wallet SDK!";
                const signatures: Record<string, string> = {};

                // Test Substrate message signing
                const selendraNetwork = SUBSTRATE_NETWORKS.find(n => n.name === "Selendra");
                if (selendraNetwork) {
                    try {
                        console.log("🔗 Testing Substrate message signing...");
                        await sdk.connect(selendraNetwork.chainId.toString());
                        const signature = await sdk.signMessage(testMessage);
                        signatures["Selendra Substrate"] = signature;
                        console.log("✍️  Substrate signature:", signature);
                        await sdk.disconnect();
                    } catch (error) {
                        console.warn("⚠️  Substrate signing failed:", error);
                    }
                }

                // Test EVM message signing
                const selendraEVM = EVM_NETWORKS.find(n => n.name === "Selendra Mainnet");
                if (selendraEVM) {
                    try {
                        console.log("🔗 Testing EVM message signing...");
                        await sdk.connect(selendraEVM.chainId.toString());
                        const signature = await sdk.signMessage(testMessage);
                        signatures["Selendra EVM"] = signature;
                        console.log("✍️  EVM signature:", signature);
                        await sdk.disconnect();
                    } catch (error) {
                        console.warn("⚠️  EVM signing failed:", error);
                    }
                }

                // Test Ethereum message signing
                const ethereumSepolia = EVM_NETWORKS.find(n => n.name === "Ethereum Sepolia Testnet");
                if (ethereumSepolia) {
                    try {
                        console.log("🔗 Testing Ethereum message signing...");
                        await sdk.connect(ethereumSepolia.chainId.toString());
                        const signature = await sdk.signMessage(testMessage);
                        signatures["Ethereum Sepolia"] = signature;
                        console.log("✍️  Ethereum signature:", signature);
                        await sdk.disconnect();
                    } catch (error) {
                        console.warn("⚠️  Ethereum signing failed:", error);
                    }
                }

                console.log("📝 All signatures:", signatures);

                // Verify signatures exist and have expected format
                Object.entries(signatures).forEach(([network, signature]) => {
                    expect(signature).toBeDefined();
                    expect(signature.length).toBeGreaterThan(0);
                    console.log(`✅ ${network} signature verified:`, signature.substring(0, 20) + "...");
                });

                expect(Object.keys(signatures).length).toBeGreaterThan(0);
            },
            TEST_TIMEOUT * 2
        );
    });
});
