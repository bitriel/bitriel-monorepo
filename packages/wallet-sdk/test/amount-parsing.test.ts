import { parseTransactionAmount } from "../src/utils/amount";

describe("Amount Parsing and Decimal Handling Tests", () => {
    describe("Substrate Amount Parsing", () => {
        test("should parse integer amounts correctly", () => {
            const testCases = [
                { input: "1", expected: "1000000000000000000" },
                { input: "10", expected: "10000000000000000000" },
                { input: "100", expected: "100000000000000000000" },
                { input: "1000", expected: "1000000000000000000000" },
            ];

            testCases.forEach(({ input, expected }) => {
                const result = parseTransactionAmount(input, "substrate");
                expect(result).toBe(expected);
            });
        });

        test("should parse decimal amounts correctly", () => {
            const testCases = [
                { input: "0.1", expected: "100000000000000000" },
                { input: "0.01", expected: "10000000000000000" },
                { input: "0.001", expected: "1000000000000000" },
                { input: "0.0001", expected: "100000000000000" },
                { input: "0.00001", expected: "10000000000000" },
                { input: "0.000001", expected: "1000000000000" },
                { input: "0.0000001", expected: "100000000000" },
                { input: "0.00000001", expected: "10000000000" },
                { input: "0.000000001", expected: "1000000000" },
                { input: "0.0000000001", expected: "100000000" },
                { input: "0.00000000001", expected: "10000000" },
                { input: "0.000000000001", expected: "1000000" },
                { input: "0.0000000000001", expected: "100000" },
                { input: "0.00000000000001", expected: "10000" },
                { input: "0.000000000000001", expected: "1000" },
                { input: "0.0000000000000001", expected: "100" },
                { input: "0.00000000000000001", expected: "10" },
                { input: "0.000000000000000001", expected: "1" },
            ];

            testCases.forEach(({ input, expected }) => {
                const result = parseTransactionAmount(input, "substrate");
                expect(result).toBe(expected);
            });
        });

        test("should parse mixed integer and decimal amounts", () => {
            const testCases = [
                { input: "1.5", expected: "1500000000000000000" },
                { input: "2.25", expected: "2250000000000000000" },
                { input: "10.123", expected: "10123000000000000000" },
                { input: "100.456789", expected: "100456789000000000000" },
                { input: "1.123456789", expected: "1123456789000000000" },
                { input: "5.123456789123456789", expected: "5123456789123456789" },
            ];

            testCases.forEach(({ input, expected }) => {
                const result = parseTransactionAmount(input, "substrate");
                expect(result).toBe(expected);
            });
        });

        test("should handle custom decimal places for substrate", () => {
            const testCases = [
                { input: "1", decimals: 6, expected: "1000000" },
                { input: "1.5", decimals: 6, expected: "1500000" },
                { input: "1.123456", decimals: 6, expected: "1123456" },
                { input: "1", decimals: 8, expected: "100000000" },
                { input: "1.12345678", decimals: 8, expected: "112345678" },
                { input: "1", decimals: 0, expected: "1" },
                { input: "1.5", decimals: 0, expected: "1" }, // Should truncate
                { input: "1", decimals: 3, expected: "1000" },
                { input: "1.123", decimals: 3, expected: "1123" },
            ];

            testCases.forEach(({ input, decimals, expected }) => {
                const result = parseTransactionAmount(input, "substrate", decimals);
                expect(result).toBe(expected);
            });
        });
    });

    describe("EVM Amount Parsing", () => {
        test("should parse integer amounts correctly", () => {
            const testCases = [
                { input: "1", expected: "1000000000000000000" },
                { input: "10", expected: "10000000000000000000" },
                { input: "100", expected: "100000000000000000000" },
                { input: "1000", expected: "1000000000000000000000" },
            ];

            testCases.forEach(({ input, expected }) => {
                const result = parseTransactionAmount(input, "evm");
                expect(result).toBe(expected);
            });
        });

        test("should parse decimal amounts correctly", () => {
            const testCases = [
                { input: "0.1", expected: "100000000000000000" },
                { input: "0.01", expected: "10000000000000000" },
                { input: "0.001", expected: "1000000000000000" },
                { input: "0.0001", expected: "100000000000000" },
                { input: "0.00001", expected: "10000000000000" },
                { input: "0.000001", expected: "1000000000000" },
                { input: "0.0000001", expected: "100000000000" },
                { input: "0.00000001", expected: "10000000000" },
                { input: "0.000000001", expected: "1000000000" },
                { input: "0.0000000001", expected: "100000000" },
                { input: "0.00000000001", expected: "10000000" },
                { input: "0.000000000001", expected: "1000000" },
                { input: "0.0000000000001", expected: "100000" },
                { input: "0.00000000000001", expected: "10000" },
                { input: "0.000000000000001", expected: "1000" },
                { input: "0.0000000000000001", expected: "100" },
                { input: "0.00000000000000001", expected: "10" },
                { input: "0.000000000000000001", expected: "1" },
            ];

            testCases.forEach(({ input, expected }) => {
                const result = parseTransactionAmount(input, "evm");
                expect(result).toBe(expected);
            });
        });

        test("should parse mixed integer and decimal amounts", () => {
            const testCases = [
                { input: "1.5", expected: "1500000000000000000" },
                { input: "2.25", expected: "2250000000000000000" },
                { input: "10.123", expected: "10123000000000000000" },
                { input: "100.456789", expected: "100456789000000000000" },
                { input: "1.123456789", expected: "1123456789000000000" },
                { input: "5.123456789123456789", expected: "5123456789123456789" },
            ];

            testCases.forEach(({ input, expected }) => {
                const result = parseTransactionAmount(input, "evm");
                expect(result).toBe(expected);
            });
        });

        test("should handle maximum precision (18 decimals)", () => {
            const testCases = [
                { input: "1.123456789012345678", expected: "1123456789012345678" },
                { input: "0.123456789012345678", expected: "123456789012345678" },
                { input: "10.123456789012345678", expected: "10123456789012345678" },
            ];

            testCases.forEach(({ input, expected }) => {
                const result = parseTransactionAmount(input, "evm");
                expect(result).toBe(expected);
            });
        });
    });

    describe("Cross-Chain Consistency", () => {
        test("should produce same results for substrate and EVM with 18 decimals", () => {
            const testAmounts = ["1", "0.1", "0.01", "0.001", "1.5", "10.123456789", "0.123456789012345678"];

            testAmounts.forEach(amount => {
                const substrateResult = parseTransactionAmount(amount, "substrate", 18);
                const evmResult = parseTransactionAmount(amount, "evm");
                expect(substrateResult).toBe(evmResult);
            });
        });

        test("should handle different decimal precisions consistently", () => {
            const amount = "1.123456789";

            const precisionTests = [
                { decimals: 0, expected: "1" },
                { decimals: 1, expected: "11" },
                { decimals: 2, expected: "112" },
                { decimals: 3, expected: "1123" },
                { decimals: 4, expected: "11234" },
                { decimals: 5, expected: "112345" },
                { decimals: 6, expected: "1123456" },
                { decimals: 7, expected: "11234567" },
                { decimals: 8, expected: "112345678" },
                { decimals: 9, expected: "1123456789" },
                { decimals: 10, expected: "11234567890" },
                { decimals: 18, expected: "1123456789000000000" },
            ];

            precisionTests.forEach(({ decimals, expected }) => {
                const result = parseTransactionAmount(amount, "substrate", decimals);
                expect(result).toBe(expected);
            });
        });
    });

    describe("Edge Cases and Error Handling", () => {
        test("should handle zero amounts", () => {
            expect(parseTransactionAmount("0", "substrate")).toBe("0");
            expect(parseTransactionAmount("0", "evm")).toBe("0");
            expect(parseTransactionAmount("0.0", "substrate")).toBe("0");
            expect(parseTransactionAmount("0.000000000000000000", "evm")).toBe("0");
        });

        test("should handle very large numbers", () => {
            const largeNumber = "999999999999999999.999999999999999999";
            const substrateResult = parseTransactionAmount(largeNumber, "substrate");
            const evmResult = parseTransactionAmount(largeNumber, "evm");

            expect(substrateResult).toBeDefined();
            expect(evmResult).toBeDefined();
            expect(typeof substrateResult).toBe("string");
            expect(typeof evmResult).toBe("string");
        });

        test("should throw error for null/undefined inputs", () => {
            expect(() => parseTransactionAmount(null, "substrate")).toThrow();
            expect(() => parseTransactionAmount(undefined as any, "substrate")).toThrow();
            expect(() => parseTransactionAmount(null, "evm")).toThrow();
            expect(() => parseTransactionAmount(undefined as any, "evm")).toThrow();
        });

        test("should handle string inputs", () => {
            const stringInputs = ["1", "1.5", "0.001"];

            stringInputs.forEach(input => {
                const substrateResult = parseTransactionAmount(input, "substrate");
                const evmResult = parseTransactionAmount(input, "evm");

                expect(typeof substrateResult).toBe("string");
                expect(typeof evmResult).toBe("string");
                expect(substrateResult).toBeDefined();
                expect(evmResult).toBeDefined();
            });
        });

        test("should handle number inputs", () => {
            const numberInputs = [1, 1.5, 0.001];

            numberInputs.forEach(input => {
                const substrateResult = parseTransactionAmount(input, "substrate");
                const evmResult = parseTransactionAmount(input, "evm");

                expect(typeof substrateResult).toBe("string");
                expect(typeof evmResult).toBe("string");
                expect(substrateResult).toBeDefined();
                expect(evmResult).toBeDefined();
            });
        });

        test("should handle excessive decimal places", () => {
            // More than 18 decimal places - should truncate
            const excessiveDecimals = "1.1234567890123456789012345";
            const result = parseTransactionAmount(excessiveDecimals, "evm");
            expect(result).toBe("1123456789012345678"); // Truncated to 18 decimals
        });

        test("should handle leading zeros", () => {
            const testCases = [
                { input: "01", expected: "1000000000000000000" },
                { input: "01.5", expected: "1500000000000000000" },
                { input: "0.01", expected: "10000000000000000" },
                { input: "00.01", expected: "10000000000000000" },
            ];

            testCases.forEach(({ input, expected }) => {
                const result = parseTransactionAmount(input, "evm");
                expect(result).toBe(expected);
            });
        });

        test("should handle trailing zeros", () => {
            const testCases = [
                { input: "1.0", expected: "1000000000000000000" },
                { input: "1.50", expected: "1500000000000000000" },
                { input: "1.100", expected: "1100000000000000000" },
                { input: "1.000000000000000000", expected: "1000000000000000000" },
            ];

            testCases.forEach(({ input, expected }) => {
                const result = parseTransactionAmount(input, "evm");
                expect(result).toBe(expected);
            });
        });
    });

    describe("Token Decimal Precision Tests", () => {
        test("should handle common token decimals", () => {
            const commonTokens = [
                { name: "Bitcoin", decimals: 8, amount: "1.12345678" },
                { name: "USDT", decimals: 6, amount: "100.123456" },
                { name: "USDC", decimals: 6, amount: "50.987654" },
                { name: "Ethereum", decimals: 18, amount: "1.123456789012345678" },
                { name: "Binance Coin", decimals: 18, amount: "10.5" },
                { name: "Chainlink", decimals: 18, amount: "25.123" },
            ];

            commonTokens.forEach(token => {
                const result = parseTransactionAmount(token.amount, "substrate", token.decimals);
                expect(result).toBeDefined();
                expect(typeof result).toBe("string");
                expect(result).not.toBe("0");

                console.log(`${token.name} (${token.decimals} decimals): ${token.amount} -> ${result}`);
            });
        });

        test("should validate decimal truncation", () => {
            const amount = "1.123456789";

            // Test truncation at different decimal places
            const truncationTests = [
                { decimals: 2, expected: "112" }, // 1.12
                { decimals: 4, expected: "11234" }, // 1.1234
                { decimals: 6, expected: "1123456" }, // 1.123456
                { decimals: 8, expected: "112345678" }, // 1.12345678
            ];

            truncationTests.forEach(({ decimals, expected }) => {
                const result = parseTransactionAmount(amount, "substrate", decimals);
                expect(result).toBe(expected);
            });
        });

        test("should handle minimum representable amounts", () => {
            // Test smallest unit for different decimal precisions
            const minAmountTests = [
                { decimals: 6, minAmount: "0.000001" },
                { decimals: 8, minAmount: "0.00000001" },
                { decimals: 18, minAmount: "0.000000000000000001" },
            ];

            minAmountTests.forEach(({ decimals, minAmount }) => {
                const result = parseTransactionAmount(minAmount, "substrate", decimals);
                expect(result).toBe("1");
            });
        });
    });

    describe("Performance Tests", () => {
        test("should handle large batch of amount parsing efficiently", () => {
            const batchSize = 1000;
            const startTime = Date.now();

            for (let i = 0; i < batchSize; i++) {
                const amount = (Math.random() * 1000).toFixed(9);
                parseTransactionAmount(amount, "substrate");
                parseTransactionAmount(amount, "evm");
            }

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(1000); // Should complete within 1 second
            console.log(`Parsed ${batchSize * 2} amounts in ${duration}ms`);
        });

        test("should maintain precision across multiple operations", () => {
            const testAmount = "1.123456789123456789";
            const iterations = 100;

            for (let i = 0; i < iterations; i++) {
                const substrateResult = parseTransactionAmount(testAmount, "substrate");
                const evmResult = parseTransactionAmount(testAmount, "evm");

                expect(substrateResult).toBe("1123456789123456789");
                expect(evmResult).toBe("1123456789123456789");
            }
        });
    });

    describe("Real-world Scenarios", () => {
        test("should handle typical transaction amounts", () => {
            const realWorldAmounts = [
                "0.1", // Small payment
                "1.0", // Medium payment
                "10.5", // Larger payment
                "100.25", // Business payment
                "1000.0", // Large transfer
                "0.001", // Micro payment
                "0.00001", // Very small payment
                "5.123456", // Precise amount
                "999.999999999999999999", // Near maximum precision
            ];

            realWorldAmounts.forEach(amount => {
                const substrateResult = parseTransactionAmount(amount, "substrate");
                const evmResult = parseTransactionAmount(amount, "evm");

                expect(substrateResult).toBeDefined();
                expect(evmResult).toBeDefined();
                expect(typeof substrateResult).toBe("string");
                expect(typeof evmResult).toBe("string");

                // Results should be the same for 18 decimal tokens
                expect(substrateResult).toBe(evmResult);
            });
        });

        test("should handle stablecoin amounts with 6 decimals", () => {
            const stablecoinAmounts = [
                { amount: "1.00", expected: "1000000" }, // 1 USDT
                { amount: "10.50", expected: "10500000" }, // 10.5 USDT
                { amount: "100.123456", expected: "100123456" }, // 100.123456 USDT
                { amount: "0.01", expected: "10000" }, // 1 cent
                { amount: "0.000001", expected: "1" }, // Minimum unit
            ];

            stablecoinAmounts.forEach(({ amount, expected }) => {
                const result = parseTransactionAmount(amount, "substrate", 6);
                expect(result).toBe(expected);
            });
        });

        test("should handle DeFi token amounts with various decimals", () => {
            const defiTokens = [
                { symbol: "WBTC", decimals: 8, amount: "0.12345678" },
                { symbol: "LINK", decimals: 18, amount: "25.123456789012345678" },
                { symbol: "UNI", decimals: 18, amount: "100.5" },
                { symbol: "AAVE", decimals: 18, amount: "5.25" },
                { symbol: "COMP", decimals: 18, amount: "1.123" },
            ];

            defiTokens.forEach(token => {
                const result = parseTransactionAmount(token.amount, "substrate", token.decimals);
                expect(result).toBeDefined();
                expect(typeof result).toBe("string");
                expect(result).not.toBe("0");

                console.log(`${token.symbol}: ${token.amount} -> ${result} (${token.decimals} decimals)`);
            });
        });
    });
});
