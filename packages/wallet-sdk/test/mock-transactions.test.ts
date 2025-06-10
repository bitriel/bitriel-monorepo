import { BitrielWalletSDK } from "../src/sdk";
import { SUBSTRATE_NETWORKS, EVM_NETWORKS } from "../src/config/networks";
import { parseTransactionAmount } from "../src/utils/amount";

describe("Mock Transaction Tests", () => {
    let sdk: BitrielWalletSDK;
    const testMnemonic =
        "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

    beforeEach(() => {
        sdk = new BitrielWalletSDK(testMnemonic);
    });

    afterEach(async () => {
        await sdk.disconnect();
    });

    describe("Substrate Mock Transactions", () => {
        test("should create mock substrate transactions with various amounts", () => {
            const mockTransactions = [
                {
                    description: "Integer amount - 1 SEL",
                    amount: "1",
                    expected: "1000000000000000000",
                },
                {
                    description: "Decimal amount - 0.5 SEL",
                    amount: "0.5",
                    expected: "500000000000000000",
                },
                {
                    description: "Small decimal - 0.001 SEL",
                    amount: "0.001",
                    expected: "1000000000000000",
                },
                {
                    description: "High precision - 0.123456789 SEL",
                    amount: "0.123456789",
                    expected: "123456789000000000",
                },
                {
                    description: "Large amount - 1000 SEL",
                    amount: "1000",
                    expected: "1000000000000000000000",
                },
            ];

            mockTransactions.forEach(({ description, amount, expected }) => {
                const parsed = parseTransactionAmount(amount, "substrate");
                expect(parsed).toBe(expected);
                console.log(`✓ ${description}: ${amount} SEL -> ${parsed} planck`);
            });
        });

        test("should validate substrate transaction structure", () => {
            const recipientAddress = "5FFVzVi2xVs4XgHrRnb1ZW7h5iC1ojScAKvryPVvaXBXcrd9";
            const amount = parseTransactionAmount("1.5", "substrate");

            const transaction = {
                method: "balances",
                params: ["transfer", recipientAddress, amount],
            };

            expect(transaction.method).toBe("balances");
            expect(transaction.params).toHaveLength(3);
            expect(transaction.params[0]).toBe("transfer");
            expect(transaction.params[1]).toBe(recipientAddress);
            expect(transaction.params[2]).toBe("1500000000000000000");
        });

        test("should handle substrate custom token scenarios", () => {
            // Mock different substrate token scenarios
            const scenarios = [
                {
                    name: "Native SEL Transfer",
                    method: "balances",
                    action: "transfer",
                    amount: "1.0",
                },
                {
                    name: "Small amount transfer",
                    method: "balances",
                    action: "transfer",
                    amount: "0.000001",
                },
            ];

            scenarios.forEach(scenario => {
                const amount = parseTransactionAmount(scenario.amount, "substrate");
                const tx = {
                    method: scenario.method,
                    params: [scenario.action, "5Test...", amount],
                };

                expect(tx.method).toBe(scenario.method);
                expect(tx.params[0]).toBe(scenario.action);
                expect(typeof tx.params[2]).toBe("string");
                expect(tx.params[2]).not.toBe("0");

                console.log(`✓ ${scenario.name}: ${scenario.amount} -> ${amount}`);
            });
        });
    });

    describe("EVM Mock Transactions", () => {
        test("should create mock EVM transactions with various amounts", () => {
            const mockTransactions = [
                {
                    description: "Integer amount - 1 ETH",
                    amount: "1",
                    expected: "1000000000000000000",
                },
                {
                    description: "Decimal amount - 0.5 ETH",
                    amount: "0.5",
                    expected: "500000000000000000",
                },
                {
                    description: "Small decimal - 0.001 ETH",
                    amount: "0.001",
                    expected: "1000000000000000",
                },
                {
                    description: "High precision - 0.123456789123456789 ETH",
                    amount: "0.123456789123456789",
                    expected: "123456789123456789",
                },
                {
                    description: "Very small - 1 wei",
                    amount: "0.000000000000000001",
                    expected: "1",
                },
                {
                    description: "Large amount - 1000 ETH",
                    amount: "1000",
                    expected: "1000000000000000000000",
                },
            ];

            mockTransactions.forEach(({ description, amount, expected }) => {
                const parsed = parseTransactionAmount(amount, "evm");
                expect(parsed).toBe(expected);
                console.log(`✓ ${description}: ${amount} ETH -> ${parsed} wei`);
            });
        });

        test("should validate EVM transaction structure", () => {
            const recipientAddress = "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552";
            const amount = parseTransactionAmount("1.5", "evm");

            const transaction = {
                to: recipientAddress,
                value: amount,
            };

            expect(transaction.to).toBe(recipientAddress);
            expect(transaction.value).toBe("1500000000000000000");
            expect(transaction.to).toMatch(/^0x[0-9a-fA-F]{40}$/);
        });

        test("should handle ERC-20 token transaction scenarios", () => {
            const tokenScenarios = [
                {
                    name: "USDT Transfer (6 decimals)",
                    decimals: 6,
                    amount: "100.5",
                    contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                },
                {
                    name: "USDC Transfer (6 decimals)",
                    decimals: 6,
                    amount: "50.123456",
                    contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                },
                {
                    name: "Custom Token (18 decimals)",
                    decimals: 18,
                    amount: "1.123456789123456789",
                    contractAddress: "0x1234567890123456789012345678901234567890",
                },
            ];

            tokenScenarios.forEach(scenario => {
                // Mock ERC-20 transfer function call data
                const transferSelector = "0xa9059cbb"; // transfer(address,uint256)
                const recipient = "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552";
                const amount = parseTransactionAmount(scenario.amount, "substrate", scenario.decimals);

                const data = transferSelector + recipient.slice(2).padStart(64, "0") + amount.padStart(64, "0");

                const tx = {
                    to: scenario.contractAddress,
                    value: "0", // No ETH sent for ERC-20 transfers
                    data: data,
                };

                expect(tx.to).toBe(scenario.contractAddress);
                expect(tx.value).toBe("0");
                expect(tx.data).toContain(transferSelector);
                expect(tx.data.length).toBe(138); // 10 chars for selector + 128 chars for params

                console.log(`✓ ${scenario.name}: ${scenario.amount} tokens`);
            });
        });

        test("should handle various EVM gas configurations", () => {
            const gasConfigurations = [
                {
                    name: "Legacy gas pricing",
                    gasPrice: "20000000000", // 20 gwei
                    gasLimit: "21000",
                },
                {
                    name: "EIP-1559 gas pricing",
                    maxFeePerGas: "30000000000", // 30 gwei
                    maxPriorityFeePerGas: "2000000000", // 2 gwei
                    gasLimit: "21000",
                },
                {
                    name: "High gas limit for contract interaction",
                    gasPrice: "25000000000", // 25 gwei
                    gasLimit: "200000",
                },
            ];

            gasConfigurations.forEach(config => {
                const tx = {
                    to: "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552",
                    value: parseTransactionAmount("1", "evm"),
                    ...config,
                };

                expect(tx.to).toBeDefined();
                expect(tx.value).toBeDefined();
                expect(tx.gasLimit).toBeDefined();

                if (config.gasPrice) {
                    expect(tx.gasPrice).toBe(config.gasPrice);
                }

                if (config.maxFeePerGas) {
                    expect(tx.maxFeePerGas).toBe(config.maxFeePerGas);
                    expect(tx.maxPriorityFeePerGas).toBe(config.maxPriorityFeePerGas);
                }

                console.log(`✓ ${config.name}: Gas limit ${config.gasLimit}`);
            });
        });
    });

    describe("Cross-Chain Amount Comparison", () => {
        test("should produce consistent results for same amounts across chains", () => {
            const testAmounts = ["1", "0.5", "0.001", "10.123"];

            testAmounts.forEach(amount => {
                const substrateAmount = parseTransactionAmount(amount, "substrate");
                const evmAmount = parseTransactionAmount(amount, "evm");

                // Both should produce the same result for 18 decimal tokens
                expect(substrateAmount).toBe(evmAmount);
                console.log(`✓ ${amount}: Substrate=${substrateAmount}, EVM=${evmAmount}`);
            });
        });

        test("should handle different decimal precisions correctly", () => {
            const amount = "1.123456";

            const precisionTests = [
                { decimals: 6, expected: "1123456" },
                { decimals: 8, expected: "112345600" },
                { decimals: 18, expected: "1123456000000000000" },
            ];

            precisionTests.forEach(test => {
                const result = parseTransactionAmount(amount, "substrate", test.decimals);
                expect(result).toBe(test.expected);
                console.log(`✓ ${amount} with ${test.decimals} decimals: ${result}`);
            });
        });
    });

    describe("Edge Cases and Validation", () => {
        test("should handle zero amounts", () => {
            expect(parseTransactionAmount("0", "substrate")).toBe("0");
            expect(parseTransactionAmount("0", "evm")).toBe("0");
            expect(parseTransactionAmount("0.0", "substrate")).toBe("0");
            expect(parseTransactionAmount("0.000000000000000000", "evm")).toBe("0");
        });

        test("should handle maximum precision", () => {
            // Test with maximum 18 decimal places
            const maxPrecision = "1.123456789012345678";
            const substrateResult = parseTransactionAmount(maxPrecision, "substrate");
            const evmResult = parseTransactionAmount(maxPrecision, "evm");

            expect(substrateResult).toBe("1123456789012345678");
            expect(evmResult).toBe("1123456789012345678");
        });

        test("should handle very large numbers", () => {
            const largeAmount = "999999999999999999";
            const substrateResult = parseTransactionAmount(largeAmount, "substrate");
            const evmResult = parseTransactionAmount(largeAmount, "evm");

            expect(substrateResult).toBeDefined();
            expect(evmResult).toBeDefined();
            expect(substrateResult).toBe(evmResult);
        });

        test("should reject invalid inputs", () => {
            const invalidInputs = [null, undefined];

            invalidInputs.forEach(input => {
                expect(() => parseTransactionAmount(input as any, "substrate")).toThrow();
                expect(() => parseTransactionAmount(input as any, "evm")).toThrow();
            });
        });

        test("should handle string number inputs", () => {
            const stringNumbers = ["1", "1.5", "0.001"];

            stringNumbers.forEach(str => {
                const substrateResult = parseTransactionAmount(str, "substrate");
                const evmResult = parseTransactionAmount(str, "evm");

                expect(typeof substrateResult).toBe("string");
                expect(typeof evmResult).toBe("string");
                expect(substrateResult).not.toBe("0");
                expect(evmResult).not.toBe("0");
            });
        });
    });

    describe("Performance and Memory Tests", () => {
        test("should handle batch transaction creation efficiently", () => {
            const batchSize = 100;
            const transactions = [];

            const startTime = Date.now();

            for (let i = 0; i < batchSize; i++) {
                const amount = (Math.random() * 100).toFixed(6);
                const substrateAmount = parseTransactionAmount(amount, "substrate");
                const evmAmount = parseTransactionAmount(amount, "evm");

                transactions.push({
                    substrate: {
                        method: "balances",
                        params: ["transfer", "5Test...", substrateAmount],
                    },
                    evm: {
                        to: "0x1234567890123456789012345678901234567890",
                        value: evmAmount,
                    },
                });
            }

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(transactions).toHaveLength(batchSize);
            expect(duration).toBeLessThan(1000); // Should complete within 1 second

            console.log(`✓ Created ${batchSize} transactions in ${duration}ms`);
        });

        test("should maintain precision across multiple operations", () => {
            let amount = "1.123456789123456789";

            // Perform multiple parsing operations
            for (let i = 0; i < 10; i++) {
                const parsed = parseTransactionAmount(amount, "evm");
                expect(parsed).toBe("1123456789123456789");

                // Verify consistency
                const reparsed = parseTransactionAmount(amount, "evm");
                expect(parsed).toBe(reparsed);
            }
        });
    });
});
