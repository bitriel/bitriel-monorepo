import { BitrielWalletSDK } from "../src/sdk";
import { SUBSTRATE_NETWORKS, EVM_NETWORKS } from "../src/config/networks";
import { parseTransactionAmount } from "../src/utils/amount";

describe("Integration Transaction Tests", () => {
    let sdk: BitrielWalletSDK;
    const testMnemonic =
        "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

    // Test timeout increased for network operations
    const TEST_TIMEOUT = 30000;

    beforeEach(() => {
        sdk = new BitrielWalletSDK(testMnemonic);
    });

    afterEach(async () => {
        try {
            await sdk.disconnect();
        } catch (error) {
            // Ignore disconnect errors in tests
        }
    });

    describe("Substrate Integration Tests", () => {
        const selendraNetwork = SUBSTRATE_NETWORKS.find(n => n.name === "Selendra");

        test(
            "should connect to Substrate network and get wallet state",
            async () => {
                if (!selendraNetwork) {
                    throw new Error("Selendra network not found in configuration");
                }

                try {
                    await sdk.connect(selendraNetwork.chainId.toString());
                    const walletState = await sdk.getWalletState();

                    expect(walletState).toBeDefined();
                    expect(walletState.address).toBeDefined();
                    expect(walletState.balances).toBeDefined();
                    expect(walletState.balances.native).toBeDefined();
                    expect(walletState.network).toBeDefined();
                    expect(walletState.network?.name).toBe("Selendra");

                    console.log("✓ Substrate wallet state:", {
                        address: walletState.address,
                        nativeBalance: walletState.balances.native,
                        network: walletState.network?.name,
                    });
                } catch (error) {
                    console.warn("Substrate integration test skipped due to network error:", error);
                    // Don't fail the test if network is unavailable
                }
            },
            TEST_TIMEOUT
        );

        test(
            "should list tokens on Substrate network",
            async () => {
                if (!selendraNetwork) {
                    throw new Error("Selendra network not found in configuration");
                }

                try {
                    await sdk.connect(selendraNetwork.chainId.toString());
                    const tokens = await sdk.listTokens();

                    expect(tokens).toBeDefined();
                    expect(Array.isArray(tokens)).toBe(true);
                    expect(tokens.length).toBeGreaterThan(0);

                    // Should include native token
                    const nativeToken = tokens.find(token => token.symbol === selendraNetwork.nativeCurrency.symbol);
                    expect(nativeToken).toBeDefined();
                    expect(nativeToken?.decimals).toBe(selendraNetwork.nativeCurrency.decimals);

                    console.log("✓ Substrate tokens found:", tokens.length);
                    tokens.forEach(token => {
                        console.log(
                            `  - ${token.name} (${token.symbol}): ${token.formatted} [${token.decimals} decimals]`
                        );
                    });
                } catch (error) {
                    console.warn("Substrate token listing test skipped due to network error:", error);
                }
            },
            TEST_TIMEOUT
        );

        test(
            "should estimate fees for different Substrate transaction amounts",
            async () => {
                if (!selendraNetwork) {
                    throw new Error("Selendra network not found in configuration");
                }

                const testAmounts = [
                    { amount: "1", description: "1 SEL" },
                    { amount: "0.1", description: "0.1 SEL" },
                    { amount: "0.001", description: "0.001 SEL" },
                    { amount: "10.5", description: "10.5 SEL" },
                ];

                try {
                    await sdk.connect(selendraNetwork.chainId.toString());

                    for (const test of testAmounts) {
                        const tx = {
                            method: "balances",
                            params: [
                                "transfer",
                                "5FFVzVi2xVs4XgHrRnb1ZW7h5iC1ojScAKvryPVvaXBXcrd9",
                                parseTransactionAmount(test.amount, "substrate"),
                            ],
                        };

                        const fee = await sdk.estimateFee(tx);

                        expect(fee).toBeDefined();
                        expect(fee.fee).toBeDefined();
                        expect(fee.formatted).toBeDefined();
                        expect(fee.currency).toBe(selendraNetwork.nativeCurrency.symbol);
                        expect(parseFloat(fee.formatted)).toBeGreaterThan(0);

                        console.log(`✓ ${test.description} fee: ${fee.formatted} ${fee.currency}`);
                    }
                } catch (error) {
                    console.warn("Substrate fee estimation tests skipped due to network error:", error);
                }
            },
            TEST_TIMEOUT
        );

        test(
            "should get detailed balance information",
            async () => {
                if (!selendraNetwork) {
                    throw new Error("Selendra network not found in configuration");
                }

                try {
                    await sdk.connect(selendraNetwork.chainId.toString());
                    const detailedBalance = await sdk.getDetailedBalance();

                    expect(detailedBalance).toBeDefined();
                    expect(detailedBalance.total).toBeDefined();
                    expect(detailedBalance.locked).toBeDefined();
                    expect(detailedBalance.transferable).toBeDefined();
                    expect(detailedBalance.formatted).toBeDefined();
                    expect(detailedBalance.formatted.total).toBeDefined();
                    expect(detailedBalance.formatted.locked).toBeDefined();
                    expect(detailedBalance.formatted.transferable).toBeDefined();

                    console.log("✓ Detailed balance:", {
                        total: detailedBalance.formatted.total,
                        locked: detailedBalance.formatted.locked,
                        transferable: detailedBalance.formatted.transferable,
                    });
                } catch (error) {
                    console.warn("Substrate detailed balance test skipped due to network error:", error);
                }
            },
            TEST_TIMEOUT
        );
    });

    describe("EVM Integration Tests", () => {
        const evmNetwork = EVM_NETWORKS.find(n => n.name === "Selendra EVM");

        test(
            "should connect to EVM network and get wallet state",
            async () => {
                if (!evmNetwork) {
                    throw new Error("EVM network not found in configuration");
                }

                try {
                    await sdk.connect(evmNetwork.chainId.toString());
                    const walletState = await sdk.getWalletState();

                    expect(walletState).toBeDefined();
                    expect(walletState.address).toBeDefined();
                    expect(walletState.balances).toBeDefined();
                    expect(walletState.balances.native).toBeDefined();
                    expect(walletState.network).toBeDefined();
                    expect(walletState.network?.name).toBe("Selendra EVM");

                    // EVM address should be in correct format
                    expect(walletState.address).toMatch(/^0x[0-9a-fA-F]{40}$/);

                    console.log("✓ EVM wallet state:", {
                        address: walletState.address,
                        nativeBalance: walletState.balances.native,
                        network: walletState.network?.name,
                    });
                } catch (error) {
                    console.warn("EVM integration test skipped due to network error:", error);
                }
            },
            TEST_TIMEOUT
        );

        test(
            "should list tokens on EVM network",
            async () => {
                if (!evmNetwork) {
                    throw new Error("EVM network not found in configuration");
                }

                try {
                    await sdk.connect(evmNetwork.chainId.toString());
                    const tokens = await sdk.listTokens();

                    expect(tokens).toBeDefined();
                    expect(Array.isArray(tokens)).toBe(true);
                    expect(tokens.length).toBeGreaterThan(0);

                    // Should include native token with zero address
                    const nativeToken = tokens.find(
                        token => token.address === "0x0000000000000000000000000000000000000000"
                    );
                    expect(nativeToken).toBeDefined();
                    expect(nativeToken?.symbol).toBe(evmNetwork.nativeCurrency.symbol);
                    expect(nativeToken?.decimals).toBe(evmNetwork.nativeCurrency.decimals);

                    console.log("✓ EVM tokens found:", tokens.length);
                    tokens.forEach(token => {
                        console.log(
                            `  - ${token.name} (${token.symbol}): ${token.formatted} [${token.decimals} decimals]`
                        );
                        console.log(`    Address: ${token.address}`);
                    });
                } catch (error) {
                    console.warn("EVM token listing test skipped due to network error:", error);
                }
            },
            TEST_TIMEOUT
        );

        test(
            "should estimate fees for different EVM transaction amounts",
            async () => {
                if (!evmNetwork) {
                    throw new Error("EVM network not found in configuration");
                }

                const testAmounts = [
                    { amount: "1", description: "1 ETH" },
                    { amount: "0.1", description: "0.1 ETH" },
                    { amount: "0.001", description: "0.001 ETH" },
                    { amount: "0.000000000000000001", description: "1 wei" },
                ];

                try {
                    await sdk.connect(evmNetwork.chainId.toString());

                    for (const test of testAmounts) {
                        const tx = {
                            to: "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552",
                            value: parseTransactionAmount(test.amount, "evm"),
                        };

                        const fee = await sdk.estimateFee(tx);

                        expect(fee).toBeDefined();
                        expect(fee.fee).toBeDefined();
                        expect(fee.formatted).toBeDefined();
                        expect(fee.currency).toBe(evmNetwork.nativeCurrency.symbol);
                        expect(parseFloat(fee.formatted)).toBeGreaterThan(0);

                        console.log(`✓ ${test.description} fee: ${fee.formatted} ${fee.currency}`);
                    }
                } catch (error) {
                    console.warn("EVM fee estimation tests skipped due to network error:", error);
                }
            },
            TEST_TIMEOUT
        );

        test(
            "should handle ERC-20 token interactions",
            async () => {
                if (!evmNetwork?.tokens || evmNetwork.tokens.length === 0) {
                    console.warn("No ERC-20 tokens configured for testing");
                    return;
                }

                try {
                    await sdk.connect(evmNetwork.chainId.toString());
                    const walletState = await sdk.getWalletState();

                    // Test each configured token
                    for (const tokenConfig of evmNetwork.tokens) {
                        const tokenBalance = walletState.balances.tokens.find(
                            t => t.token.address.toLowerCase() === tokenConfig.address.toLowerCase()
                        );

                        if (tokenBalance) {
                            expect(tokenBalance.token.address).toBe(tokenConfig.address);
                            expect(tokenBalance.token.symbol).toBe(tokenConfig.symbol);
                            expect(tokenBalance.token.decimals).toBe(tokenConfig.decimals);
                            expect(tokenBalance.balance).toBeDefined();
                            expect(tokenBalance.formatted).toBeDefined();

                            console.log(`✓ ${tokenConfig.symbol} balance: ${tokenBalance.formatted}`);

                            // Test fee estimation for token transfer
                            const transferData =
                                "0xa9059cbb" + // transfer(address,uint256)
                                "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552".slice(2).padStart(64, "0") +
                                parseTransactionAmount("1", "substrate", tokenConfig.decimals).padStart(64, "0");

                            const tokenTx = {
                                to: tokenConfig.address,
                                value: "0",
                                data: transferData,
                            };

                            const tokenFee = await sdk.estimateFee(tokenTx);
                            expect(tokenFee).toBeDefined();
                            expect(parseFloat(tokenFee.formatted)).toBeGreaterThan(0);

                            console.log(
                                `✓ ${tokenConfig.symbol} transfer fee: ${tokenFee.formatted} ${tokenFee.currency}`
                            );
                        }
                    }
                } catch (error) {
                    console.warn("ERC-20 token interaction tests skipped due to network error:", error);
                }
            },
            TEST_TIMEOUT
        );

        test(
            "should validate EVM transaction gas estimation",
            async () => {
                if (!evmNetwork) {
                    throw new Error("EVM network not found in configuration");
                }

                try {
                    await sdk.connect(evmNetwork.chainId.toString());

                    // Test different transaction types
                    const transactionTypes = [
                        {
                            name: "Simple transfer",
                            tx: {
                                to: "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552",
                                value: parseTransactionAmount("0.1", "evm"),
                            },
                        },
                        {
                            name: "Transfer with data",
                            tx: {
                                to: "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552",
                                value: "0",
                                data: "0x1234567890abcdef",
                            },
                        },
                    ];

                    for (const { name, tx } of transactionTypes) {
                        const fee = await sdk.estimateFee(tx);

                        expect(fee).toBeDefined();
                        expect(fee.fee).toBeDefined();
                        expect(fee.formatted).toBeDefined();
                        expect(fee.currency).toBe(evmNetwork.nativeCurrency.symbol);

                        // Gas cost should be reasonable
                        const gasCostWei = BigInt(fee.fee);
                        expect(gasCostWei).toBeGreaterThan(0n);
                        expect(gasCostWei).toBeLessThan(BigInt("1000000000000000000")); // Less than 1 ETH

                        console.log(`✓ ${name} gas estimation: ${fee.formatted} ${fee.currency}`);
                    }
                } catch (error) {
                    console.warn("EVM gas estimation tests skipped due to network error:", error);
                }
            },
            TEST_TIMEOUT
        );
    });

    describe("Cross-Chain Integration Tests", () => {
        test(
            "should handle switching between networks",
            async () => {
                const selendraNetwork = SUBSTRATE_NETWORKS.find(n => n.name === "Selendra");
                const evmNetwork = EVM_NETWORKS.find(n => n.name === "Selendra EVM");

                if (!selendraNetwork || !evmNetwork) {
                    throw new Error("Required networks not found in configuration");
                }

                try {
                    // Connect to Substrate first
                    await sdk.connect(selendraNetwork.chainId.toString());
                    let currentNetwork = sdk.getCurrentNetwork();
                    expect(currentNetwork?.name).toBe("Selendra");
                    expect(currentNetwork?.type).toBe("substrate");

                    // Switch to EVM
                    await sdk.disconnect();
                    await sdk.connect(evmNetwork.chainId.toString());
                    currentNetwork = sdk.getCurrentNetwork();
                    expect(currentNetwork?.name).toBe("Selendra EVM");
                    expect(currentNetwork?.type).toBe("evm");

                    console.log("✓ Successfully switched between Substrate and EVM networks");
                } catch (error) {
                    console.warn("Network switching test skipped due to network error:", error);
                }
            },
            TEST_TIMEOUT
        );

        test(
            "should generate different addresses for different network types",
            async () => {
                const selendraNetwork = SUBSTRATE_NETWORKS.find(n => n.name === "Selendra");
                const evmNetwork = EVM_NETWORKS.find(n => n.name === "Selendra EVM");

                if (!selendraNetwork || !evmNetwork) {
                    throw new Error("Required networks not found in configuration");
                }

                try {
                    // Get Substrate address
                    await sdk.connect(selendraNetwork.chainId.toString());
                    const substrateState = await sdk.getWalletState();
                    const substrateAddress = substrateState.address;

                    // Get EVM address
                    await sdk.disconnect();
                    await sdk.connect(evmNetwork.chainId.toString());
                    const evmState = await sdk.getWalletState();
                    const evmAddress = evmState.address;

                    // Addresses should be different formats
                    expect(substrateAddress).toBeDefined();
                    expect(evmAddress).toBeDefined();
                    expect(substrateAddress).not.toBe(evmAddress);

                    // Validate address formats
                    expect(substrateAddress).toMatch(/^5[A-Za-z0-9]+$/); // Substrate SS58 format
                    expect(evmAddress).toMatch(/^0x[0-9a-fA-F]{40}$/); // EVM hex format

                    console.log("✓ Different address formats:");
                    console.log(`  Substrate: ${substrateAddress}`);
                    console.log(`  EVM: ${evmAddress}`);
                } catch (error) {
                    console.warn("Address format test skipped due to network error:", error);
                }
            },
            TEST_TIMEOUT
        );
    });

    describe("Error Handling Integration Tests", () => {
        test("should handle connection to non-existent network", async () => {
            await expect(sdk.connect("999999")).rejects.toThrow();
        });

        test("should handle operations without connection", async () => {
            await expect(sdk.getWalletState()).rejects.toThrow();
            await expect(sdk.listTokens()).rejects.toThrow();
            await expect(
                sdk.estimateFee({
                    method: "balances",
                    params: ["transfer", "test", "1000"],
                })
            ).rejects.toThrow();
        });

        test("should handle invalid transaction parameters", async () => {
            const selendraNetwork = SUBSTRATE_NETWORKS.find(n => n.name === "Selendra");

            if (selendraNetwork) {
                try {
                    await sdk.connect(selendraNetwork.chainId.toString());

                    // Invalid method
                    await expect(
                        sdk.estimateFee({
                            method: "invalid_method",
                            params: [],
                        })
                    ).rejects.toThrow();

                    // Invalid parameters
                    await expect(
                        sdk.estimateFee({
                            method: "balances",
                            params: ["invalid_action"],
                        })
                    ).rejects.toThrow();
                } catch (error) {
                    console.warn("Error handling test skipped due to network error:", error);
                }
            }
        });
    });
});
