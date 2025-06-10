import { BitrielWalletSDK } from "../src/sdk";
import { SUBSTRATE_NETWORKS, EVM_NETWORKS } from "../src/config/networks";
import { TransactionRequest, PolkadotTransactionRequest, EVMTransactionRequest } from "../src/wallet/types";
import { parseTransactionAmount } from "../src/utils/amount";

describe("Wallet SDK Transaction Tests", () => {
    let sdk: BitrielWalletSDK;
    const testMnemonic =
        "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

    beforeEach(() => {
        sdk = new BitrielWalletSDK(testMnemonic);
    });

    afterEach(async () => {
        await sdk.disconnect();
    });

    describe("Substrate Transactions", () => {
        const selendraNetwork = SUBSTRATE_NETWORKS.find(n => n.name === "Selendra");

        beforeEach(async () => {
            if (selendraNetwork) {
                await sdk.connect(selendraNetwork.chainId.toString());
            }
        });

        describe("Native Token Transactions", () => {
            const recipientAddress = "5FFVzVi2xVs4XgHrRnb1ZW7h5iC1ojScAKvryPVvaXBXcrd9";

            test("should estimate fee for native token transaction with integer amount", async () => {
                if (!selendraNetwork) {
                    throw new Error("Selendra network not found");
                }

                const tx: PolkadotTransactionRequest = {
                    method: "balances",
                    params: ["transfer", recipientAddress, parseTransactionAmount("1", "substrate")],
                };

                const fee = await sdk.estimateFee(tx);

                expect(fee).toBeDefined();
                expect(fee.fee).toBeDefined();
                expect(fee.formatted).toBeDefined();
                expect(fee.currency).toBe(selendraNetwork.nativeCurrency.symbol);
                expect(parseFloat(fee.formatted)).toBeGreaterThan(0);
            });

            test("should estimate fee for native token transaction with decimal amount", async () => {
                if (!selendraNetwork) {
                    throw new Error("Selendra network not found");
                }

                const tx: PolkadotTransactionRequest = {
                    method: "balances",
                    params: ["transfer", recipientAddress, parseTransactionAmount("0.001", "substrate")],
                };

                const fee = await sdk.estimateFee(tx);

                expect(fee).toBeDefined();
                expect(fee.fee).toBeDefined();
                expect(fee.formatted).toBeDefined();
                expect(fee.currency).toBe(selendraNetwork.nativeCurrency.symbol);
                expect(parseFloat(fee.formatted)).toBeGreaterThan(0);
            });

            test("should estimate fee for native token transaction with high precision decimal", async () => {
                if (!selendraNetwork) {
                    throw new Error("Selendra network not found");
                }

                const tx: PolkadotTransactionRequest = {
                    method: "balances",
                    params: ["transfer", recipientAddress, parseTransactionAmount("0.123456789", "substrate")],
                };

                const fee = await sdk.estimateFee(tx);

                expect(fee).toBeDefined();
                expect(fee.fee).toBeDefined();
                expect(fee.formatted).toBeDefined();
                expect(fee.currency).toBe(selendraNetwork.nativeCurrency.symbol);
                expect(parseFloat(fee.formatted)).toBeGreaterThan(0);
            });

            test("should create valid transaction with multiple decimal places", async () => {
                const amounts = ["1.5", "0.25", "10.123456", "0.000001"];

                for (const amount of amounts) {
                    const tx: PolkadotTransactionRequest = {
                        method: "balances",
                        params: ["transfer", recipientAddress, parseTransactionAmount(amount, "substrate")],
                    };

                    expect(tx.method).toBe("balances");
                    expect(tx.params[0]).toBe("transfer");
                    expect(tx.params[1]).toBe(recipientAddress);
                    expect(typeof tx.params[2]).toBe("string");
                    expect(tx.params[2]).not.toBe("0");
                }
            });

            test("should handle large integer amounts", async () => {
                const tx: PolkadotTransactionRequest = {
                    method: "balances",
                    params: ["transfer", recipientAddress, parseTransactionAmount("1000", "substrate")],
                };

                const fee = await sdk.estimateFee(tx);

                expect(fee).toBeDefined();
                expect(fee.fee).toBeDefined();
                expect(fee.formatted).toBeDefined();
                expect(fee.currency).toBe(selendraNetwork?.nativeCurrency.symbol);
            });
        });

        describe("Custom Token Transactions", () => {
            test("should handle token balance queries", async () => {
                const tokens = await sdk.listTokens();

                expect(tokens).toBeDefined();
                expect(Array.isArray(tokens)).toBe(true);

                // Check native token is included
                const nativeToken = tokens.find(token => token.symbol === selendraNetwork?.nativeCurrency.symbol);
                expect(nativeToken).toBeDefined();
                expect(nativeToken?.balance).toBeDefined();
                expect(nativeToken?.formatted).toBeDefined();
            });

            test("should validate token properties", async () => {
                const tokens = await sdk.listTokens();

                tokens.forEach(token => {
                    expect(token.address).toBeDefined();
                    expect(token.name).toBeDefined();
                    expect(token.symbol).toBeDefined();
                    expect(token.decimals).toBeDefined();
                    expect(typeof token.decimals).toBe("number");
                    expect(token.decimals).toBeGreaterThanOrEqual(0);
                    expect(token.balance).toBeDefined();
                    expect(token.formatted).toBeDefined();
                });
            });
        });
    });

    describe("EVM Transactions", () => {
        const evmNetwork = EVM_NETWORKS.find(n => n.name === "Selendra EVM");

        beforeEach(async () => {
            if (evmNetwork) {
                await sdk.connect(evmNetwork.chainId.toString());
            }
        });

        describe("Native Token Transactions", () => {
            const recipientAddress = "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552";

            test("should estimate fee for native token transaction with integer amount", async () => {
                if (!evmNetwork) {
                    throw new Error("EVM network not found");
                }

                const tx: EVMTransactionRequest = {
                    to: recipientAddress,
                    value: parseTransactionAmount("1", "evm"),
                };

                const fee = await sdk.estimateFee(tx);

                expect(fee).toBeDefined();
                expect(fee.fee).toBeDefined();
                expect(fee.formatted).toBeDefined();
                expect(fee.currency).toBe(evmNetwork.nativeCurrency.symbol);
                expect(parseFloat(fee.formatted)).toBeGreaterThan(0);
            });

            test("should estimate fee for native token transaction with decimal amount", async () => {
                if (!evmNetwork) {
                    throw new Error("EVM network not found");
                }

                const tx: EVMTransactionRequest = {
                    to: recipientAddress,
                    value: parseTransactionAmount("0.001", "evm"),
                };

                const fee = await sdk.estimateFee(tx);

                expect(fee).toBeDefined();
                expect(fee.fee).toBeDefined();
                expect(fee.formatted).toBeDefined();
                expect(fee.currency).toBe(evmNetwork.nativeCurrency.symbol);
                expect(parseFloat(fee.formatted)).toBeGreaterThan(0);
            });

            test("should estimate fee for native token transaction with high precision decimal", async () => {
                if (!evmNetwork) {
                    throw new Error("EVM network not found");
                }

                const tx: EVMTransactionRequest = {
                    to: recipientAddress,
                    value: parseTransactionAmount("0.123456789123456789", "evm"),
                };

                const fee = await sdk.estimateFee(tx);

                expect(fee).toBeDefined();
                expect(fee.fee).toBeDefined();
                expect(fee.formatted).toBeDefined();
                expect(fee.currency).toBe(evmNetwork.nativeCurrency.symbol);
                expect(parseFloat(fee.formatted)).toBeGreaterThan(0);
            });

            test("should create valid EVM transaction with multiple decimal places", async () => {
                const amounts = ["1.5", "0.25", "10.123456789123456789", "0.000000000000000001"];

                for (const amount of amounts) {
                    const tx: EVMTransactionRequest = {
                        to: recipientAddress,
                        value: parseTransactionAmount(amount, "evm"),
                    };

                    expect(tx.to).toBe(recipientAddress);
                    expect(typeof tx.value).toBe("string");
                    expect(tx.value).not.toBe("0");
                }
            });

            test("should handle large integer amounts", async () => {
                const tx: EVMTransactionRequest = {
                    to: recipientAddress,
                    value: parseTransactionAmount("1000", "evm"),
                };

                const fee = await sdk.estimateFee(tx);

                expect(fee).toBeDefined();
                expect(fee.fee).toBeDefined();
                expect(fee.formatted).toBeDefined();
                expect(fee.currency).toBe(evmNetwork?.nativeCurrency.symbol);
            });

            test("should handle very small amounts", async () => {
                const tx: EVMTransactionRequest = {
                    to: recipientAddress,
                    value: parseTransactionAmount("0.000000000000000001", "evm"), // 1 wei
                };

                const fee = await sdk.estimateFee(tx);

                expect(fee).toBeDefined();
                expect(fee.fee).toBeDefined();
                expect(fee.formatted).toBeDefined();
                expect(fee.currency).toBe(evmNetwork?.nativeCurrency.symbol);
            });
        });

        describe("Custom Token Transactions (ERC-20)", () => {
            test("should list ERC-20 tokens", async () => {
                const tokens = await sdk.listTokens();

                expect(tokens).toBeDefined();
                expect(Array.isArray(tokens)).toBe(true);
                expect(tokens.length).toBeGreaterThan(0);

                // Check native token is included
                const nativeToken = tokens.find(
                    token => token.address === "0x0000000000000000000000000000000000000000"
                );
                expect(nativeToken).toBeDefined();
                expect(nativeToken?.symbol).toBe(evmNetwork?.nativeCurrency.symbol);
            });

            test("should handle token balance queries for different decimal precisions", async () => {
                const tokens = await sdk.listTokens();

                tokens.forEach(token => {
                    expect(token.address).toBeDefined();
                    expect(token.name).toBeDefined();
                    expect(token.symbol).toBeDefined();
                    expect(token.decimals).toBeDefined();
                    expect(typeof token.decimals).toBe("number");
                    expect(token.balance).toBeDefined();
                    expect(token.formatted).toBeDefined();

                    // Validate decimal precision
                    expect(token.decimals).toBeGreaterThanOrEqual(0);
                    expect(token.decimals).toBeLessThanOrEqual(77); // Max decimals for ERC-20
                });
            });

            test("should handle tokens with different decimal places", async () => {
                if (!evmNetwork?.tokens) {
                    return; // Skip if no tokens configured
                }

                for (const tokenConfig of evmNetwork.tokens) {
                    const balance = await sdk.getWalletState();
                    const tokenBalance = balance.balances.tokens.find(
                        t => t.token.address.toLowerCase() === tokenConfig.address.toLowerCase()
                    );

                    if (tokenBalance) {
                        expect(tokenBalance.token.decimals).toBe(tokenConfig.decimals);
                        expect(tokenBalance.balance).toBeDefined();
                        expect(tokenBalance.formatted).toBeDefined();

                        // Validate that balance is properly formatted according to decimals
                        const formattedParts = tokenBalance.formatted.split(".");
                        if (formattedParts.length > 1 && tokenConfig.decimals > 0) {
                            expect(formattedParts[1].length).toBeLessThanOrEqual(5); // Default precision is 5
                        }
                    }
                }
            });

            test("should estimate gas for ERC-20 token transfer", async () => {
                if (!evmNetwork?.tokens || evmNetwork.tokens.length === 0) {
                    return; // Skip if no tokens configured
                }

                const tokenAddress = evmNetwork.tokens[0].address;
                const recipientAddress = "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552";

                // Simulate ERC-20 transfer data
                const transferData =
                    "0xa9059cbb" + // transfer(address,uint256) function selector
                    recipientAddress.slice(2).padStart(64, "0") + // recipient address
                    parseTransactionAmount("1", "evm").padStart(64, "0"); // amount

                const tx: EVMTransactionRequest = {
                    to: tokenAddress,
                    value: "0",
                    data: transferData,
                };

                const fee = await sdk.estimateFee(tx);

                expect(fee).toBeDefined();
                expect(fee.fee).toBeDefined();
                expect(fee.formatted).toBeDefined();
                expect(fee.currency).toBe(evmNetwork.nativeCurrency.symbol);
                expect(parseFloat(fee.formatted)).toBeGreaterThan(0);
            });
        });
    });

    describe("Amount Parsing Tests", () => {
        test("should parse integer amounts correctly for substrate", () => {
            const amounts = ["1", "10", "100", "1000"];

            amounts.forEach(amount => {
                const parsed = parseTransactionAmount(amount, "substrate");
                expect(parsed).toBeDefined();
                expect(typeof parsed).toBe("string");
                expect(parsed).not.toBe("0");
            });
        });

        test("should parse decimal amounts correctly for substrate", () => {
            const amounts = ["0.1", "0.01", "0.001", "1.5", "10.123456"];

            amounts.forEach(amount => {
                const parsed = parseTransactionAmount(amount, "substrate");
                expect(parsed).toBeDefined();
                expect(typeof parsed).toBe("string");
                expect(parsed).not.toBe("0");
            });
        });

        test("should parse integer amounts correctly for EVM", () => {
            const amounts = ["1", "10", "100", "1000"];

            amounts.forEach(amount => {
                const parsed = parseTransactionAmount(amount, "evm");
                expect(parsed).toBeDefined();
                expect(typeof parsed).toBe("string");
                expect(parsed).not.toBe("0");
            });
        });

        test("should parse decimal amounts correctly for EVM", () => {
            const amounts = ["0.1", "0.01", "0.001", "1.5", "10.123456789123456789"];

            amounts.forEach(amount => {
                const parsed = parseTransactionAmount(amount, "evm");
                expect(parsed).toBeDefined();
                expect(typeof parsed).toBe("string");
                expect(parsed).not.toBe("0");
            });
        });

        test("should handle edge cases", () => {
            // Test zero values
            expect(parseTransactionAmount("0", "substrate")).toBe("0");
            expect(parseTransactionAmount("0", "evm")).toBe("0");

            // Test very small values
            const smallSubstrate = parseTransactionAmount("0.000000000000000001", "substrate");
            const smallEvm = parseTransactionAmount("0.000000000000000001", "evm");
            expect(smallSubstrate).toBe("1");
            expect(smallEvm).toBe("1");
        });

        test("should throw error for null/undefined amounts", () => {
            expect(() => parseTransactionAmount(null, "substrate")).toThrow();
            expect(() => parseTransactionAmount(undefined as any, "substrate")).toThrow();
        });
    });

    describe("Precision and Formatting Tests", () => {
        test("should handle different token decimal precisions", async () => {
            // Test with common decimal precisions
            const precisions = [6, 8, 9, 18];

            precisions.forEach(decimals => {
                const amount = "1.123456789123456789";
                const substrateAmount = parseTransactionAmount(amount, "substrate", decimals);
                const evmAmount = parseTransactionAmount(amount, "evm");

                expect(substrateAmount).toBeDefined();
                expect(evmAmount).toBeDefined();
                expect(typeof substrateAmount).toBe("string");
                expect(typeof evmAmount).toBe("string");
            });
        });

        test("should maintain precision for high decimal tokens", () => {
            // Test with 18 decimal token (like ETH)
            const amount = "1.123456789123456789";
            const parsed = parseTransactionAmount(amount, "evm");

            // Should parse to correct wei amount
            expect(parsed).toBe("1123456789123456789");
        });

        test("should handle rounding for tokens with lower decimals", () => {
            // Test with 6 decimal token (like USDT)
            const amount = "1.123456789";
            const parsed = parseTransactionAmount(amount, "substrate", 6);

            // Should round/truncate to 6 decimals
            expect(parsed).toBe("1123456");
        });
    });

    describe("Transaction Validation", () => {
        test("should validate transaction request format for Substrate", () => {
            const validTx: PolkadotTransactionRequest = {
                method: "balances",
                params: ["transfer", "5FFVzVi2xVs4XgHrRnb1ZW7h5iC1ojScAKvryPVvaXBXcrd9", "1000000000000000000"],
            };

            expect(validTx.method).toBe("balances");
            expect(Array.isArray(validTx.params)).toBe(true);
            expect(validTx.params.length).toBe(3);
        });

        test("should validate transaction request format for EVM", () => {
            const validTx: EVMTransactionRequest = {
                to: "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552",
                value: "1000000000000000000",
            };

            expect(validTx.to).toMatch(/^0x[0-9a-fA-F]{40}$/);
            expect(typeof validTx.value).toBe("string");
        });

        test("should handle optional EVM transaction parameters", () => {
            const txWithData: EVMTransactionRequest = {
                to: "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552",
                value: "0",
                data: "0xa9059cbb",
                gasLimit: "21000",
                gasPrice: "20000000000",
            };

            expect(txWithData.data).toBeDefined();
            expect(txWithData.gasLimit).toBeDefined();
            expect(txWithData.gasPrice).toBeDefined();
        });
    });

    describe("Error Handling", () => {
        test("should handle network connection errors gracefully", async () => {
            const invalidSDK = new BitrielWalletSDK(testMnemonic);

            await expect(
                invalidSDK.estimateFee({
                    method: "balances",
                    params: ["transfer", "test", "1000"],
                })
            ).rejects.toThrow();
        });

        test("should handle invalid transaction parameters", async () => {
            if (selendraNetwork) {
                await sdk.connect(selendraNetwork.chainId.toString());

                const invalidTx: PolkadotTransactionRequest = {
                    method: "invalid",
                    params: [],
                };

                await expect(sdk.estimateFee(invalidTx)).rejects.toThrow();
            }
        });

        test("should handle invalid addresses", async () => {
            if (evmNetwork) {
                await sdk.connect(evmNetwork.chainId.toString());

                const invalidTx: EVMTransactionRequest = {
                    to: "invalid_address",
                    value: "1000000000000000000",
                };

                await expect(sdk.estimateFee(invalidTx)).rejects.toThrow();
            }
        });
    });
});
