import {
    formatTokenBalance,
    formatTokenAmount,
    parseTokenBalance,
    TokenBalanceFormatOptions,
} from "../src/utils/tokenFormatters";

describe("Token Formatting Utilities", () => {
    describe("formatTokenBalance", () => {
        test("should format basic token balances correctly", () => {
            const testCases = [
                { input: "1000000000000000000", decimals: 18, expected: "1" },
                { input: "1100000000000000000", decimals: 18, expected: "1.1" },
                { input: "1000000", decimals: 6, expected: "1" },
                { input: "1500000", decimals: 6, expected: "1.5" },
            ];

            testCases.forEach(({ input, decimals, expected }) => {
                const result = formatTokenBalance(input, decimals);
                expect(result).toBe(expected);
            });
        });

        test("should handle zero balances", () => {
            expect(formatTokenBalance("0", 18)).toBe("0");
            expect(formatTokenBalance("0", 6)).toBe("0");
        });

        test("should handle large balances", () => {
            const largeBalance = "1000000000000000000000"; // 1000 tokens
            expect(formatTokenBalance(largeBalance, 18)).toBe("1,000");
        });

        test("should handle small balances", () => {
            const smallBalance = "1000000000000000"; // 0.001 tokens
            expect(formatTokenBalance(smallBalance, 18)).toBe("0.001");
        });

        test("should handle invalid inputs gracefully", () => {
            expect(formatTokenBalance("invalid", 18)).toBe("invalid");
            expect(formatTokenBalance("", 18)).toBe("0");
        });
    });

    describe("formatTokenAmount", () => {
        test("should format token amounts with symbols", () => {
            const result = formatTokenAmount("1000000000000000000", 18, "ETH");
            expect(result).toContain("1");
            expect(result).toContain("ETH");
        });

        test("should respect precision settings", () => {
            const options: TokenBalanceFormatOptions = {
                precision: 2,
            };

            const result = formatTokenAmount("1500000000000000000", 18, "ETH", options);
            expect(result).toContain("1.5");
            expect(result).toContain("ETH");
        });
    });

    describe("parseTokenBalance", () => {
        test("should parse token balances correctly", () => {
            const testCases = [
                { input: "1.0", decimals: 18, expected: "1000000000000000000" },
                { input: "1.5", decimals: 6, expected: "1500000" },
                { input: "0.001", decimals: 18, expected: "1000000000000000" },
            ];

            testCases.forEach(({ input, decimals, expected }) => {
                const result = parseTokenBalance(input, decimals);
                expect(result).toBe(expected);
            });
        });

        test("should handle edge cases", () => {
            expect(parseTokenBalance("0", 18)).toBe("0");
            expect(parseTokenBalance("1000", 18)).toBe("1000000000000000000000");
        });
    });
});
