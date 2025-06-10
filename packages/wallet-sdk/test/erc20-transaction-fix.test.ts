import { parseTransactionAmount } from "../src/utils/amount";
import { ethers } from "ethers";

describe("ERC-20 Transaction Fix Tests", () => {
    describe("parseTransactionAmount with EVM and custom decimals", () => {
        test("should correctly parse USDT amounts (6 decimals)", () => {
            const testCases = [
                { amount: "1", expected: "1000000" },
                { amount: "100.5", expected: "100500000" },
                { amount: "0.000001", expected: "1" }, // Minimum unit
                { amount: "0.123456", expected: "123456" },
            ];

            testCases.forEach(({ amount, expected }) => {
                const result = parseTransactionAmount(amount, "evm", 6);
                expect(result).toBe(expected);
            });
        });

        test("should correctly parse WBTC amounts (8 decimals)", () => {
            const testCases = [
                { amount: "1", expected: "100000000" },
                { amount: "0.12345678", expected: "12345678" },
                { amount: "0.00000001", expected: "1" }, // Minimum unit (1 satoshi)
            ];

            testCases.forEach(({ amount, expected }) => {
                const result = parseTransactionAmount(amount, "evm", 8);
                expect(result).toBe(expected);
            });
        });

        test("should correctly parse ETH amounts (18 decimals)", () => {
            const testCases = [
                { amount: "1", expected: "1000000000000000000" },
                { amount: "0.000000000000000001", expected: "1" }, // 1 wei
                { amount: "1.123456789012345678", expected: "1123456789012345678" },
            ];

            testCases.forEach(({ amount, expected }) => {
                const result = parseTransactionAmount(amount, "evm", 18);
                expect(result).toBe(expected);
            });
        });

        test("should handle truncation for excessive decimal places", () => {
            // More decimals than token supports should be truncated
            const excessiveDecimals = "1.1234567890"; // 10 decimal places
            const result = parseTransactionAmount(excessiveDecimals, "evm", 6);
            expect(result).toBe("1123456"); // Truncated to 6 decimals
        });
    });

    describe("ERC-20 transaction data encoding", () => {
        test("should create valid ERC-20 transfer transaction data", () => {
            const recipient = "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552";
            const amount = "100.5"; // 100.5 USDT
            const decimals = 6;

            // Parse amount with correct decimals
            const parsedAmount = parseTransactionAmount(amount, "evm", decimals);
            expect(parsedAmount).toBe("100500000");

            // Create ERC-20 transfer data
            const transferSelector = "0xa9059cbb"; // transfer(address,uint256)
            const paddedRecipient = recipient.slice(2).padStart(64, "0");
            const paddedAmount = parsedAmount.padStart(64, "0");
            const data = transferSelector + paddedRecipient + paddedAmount;

            // Validate data structure
            expect(data.length).toBe(138); // 10 chars for selector + 128 chars for params
            expect(data.startsWith("0xa9059cbb")).toBe(true);
            expect(data).toContain(recipient.slice(2).padStart(64, "0"));
            expect(data).toContain(parsedAmount.padStart(64, "0"));
        });

        test("should handle different token scenarios", () => {
            const tokenScenarios = [
                {
                    name: "USDT (6 decimals)",
                    decimals: 6,
                    amount: "100.123456",
                    expected: "100123456",
                },
                {
                    name: "WBTC (8 decimals)",
                    decimals: 8,
                    amount: "0.12345678",
                    expected: "12345678",
                },
                {
                    name: "Custom Token (18 decimals)",
                    decimals: 18,
                    amount: "1.123456789012345678",
                    expected: "1123456789012345678",
                },
            ];

            tokenScenarios.forEach(scenario => {
                const parsedAmount = parseTransactionAmount(scenario.amount, "evm", scenario.decimals);
                expect(parsedAmount).toBe(scenario.expected);

                // Ensure the parsed amount can be used in transaction data
                const transferSelector = "0xa9059cbb";
                const dummyRecipient = "0x0000000000000000000000000000000000000000".slice(2).padStart(64, "0");
                const paddedAmount = parsedAmount.padStart(64, "0");
                const data = transferSelector + dummyRecipient + paddedAmount;

                expect(data.length).toBe(138);
                expect(data.startsWith("0xa9059cbb")).toBe(true);
            });
        });
    });

    describe("Consistency with ethers.js", () => {
        test("should match ethers.parseUnits results", () => {
            const testCases = [
                { amount: "1", decimals: 6 },
                { amount: "100.5", decimals: 6 },
                { amount: "0.12345678", decimals: 8 },
                { amount: "1.123456789012345678", decimals: 18 },
            ];

            testCases.forEach(({ amount, decimals }) => {
                const ourResult = parseTransactionAmount(amount, "evm", decimals);
                const ethersResult = ethers.parseUnits(amount, decimals).toString();
                expect(ourResult).toBe(ethersResult);
            });
        });
    });
});
