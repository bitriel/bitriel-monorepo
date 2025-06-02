import {
  formatTokenBalance,
  formatTokenAmount,
  parseTokenBalance,
  TokenBalanceFormatOptions,
} from "../src/utils/tokenFormatters";

async function main() {
  try {
    console.log("=== Testing Token Formatting Utilities ===\n");

    // Test 1: Basic Token Balance Formatting
    console.log("Test 1: Basic Token Balance Formatting");
    const basicTests = [
      { input: "1000000000000000000", decimals: 18, expected: "1.00000" },
      { input: "1100000000000000000", decimals: 18, expected: "1.10000" },
      { input: "1000000", decimals: 6, expected: "1.00000" },
    ];

    for (const test of basicTests) {
      const result = formatTokenBalance(test.input, test.decimals);
      console.log(`Input: ${test.input}`);
      console.log(`Expected: ${test.expected}`);
      console.log(`Result: ${result}`);
      console.log(`Pass: ${result === test.expected ? "✓" : "✗"}`);
      console.log("---");
    }
    console.log("\n");

    // Test 2: Zero Values
    console.log("Test 2: Zero Values");
    const zeroTests = [
      { input: "0", decimals: 18, expected: "0" },
      { input: "0", decimals: 6, expected: "0" },
    ];

    for (const test of zeroTests) {
      const result = formatTokenBalance(test.input, test.decimals);
      console.log(`Input: ${test.input}`);
      console.log(`Expected: ${test.expected}`);
      console.log(`Result: ${result}`);
      console.log(`Pass: ${result === test.expected ? "✓" : "✗"}`);
      console.log("---");
    }
    console.log("\n");

    // Test 3: Large Numbers with Thousand Separators
    console.log("Test 3: Large Numbers with Thousand Separators");
    const largeTests = [
      {
        input: "1234567890000000000000",
        decimals: 18,
        expected: "1,234.56789",
      },
      {
        input: "1000000000000000000000",
        decimals: 18,
        expected: "1,000.00000",
      },
    ];

    for (const test of largeTests) {
      const result = formatTokenBalance(test.input, test.decimals);
      console.log(`Input: ${test.input}`);
      console.log(`Expected: ${test.expected}`);
      console.log(`Result: ${result}`);
      console.log(`Pass: ${result === test.expected ? "✓" : "✗"}`);
      console.log("---");
    }
    console.log("\n");

    // Test 4: Custom Formatting Options
    console.log("Test 4: Custom Formatting Options");

    // Test 4.1: Custom Precision
    const options1: TokenBalanceFormatOptions = { precision: 2 };
    console.log("Testing custom precision (2 decimals):");
    const precisionResult = formatTokenBalance(
      "1234567890000000000",
      18,
      options1,
    );
    console.log(`Expected: "1.23"`);
    console.log(`Result: "${precisionResult}"`);
    console.log(`Pass: ${precisionResult === "1.23" ? "✓" : "✗"}`);
    console.log("---\n");

    // Test 4.2: Disable Thousand Separator
    const options2: TokenBalanceFormatOptions = {
      useThousandSeparator: false,
    };
    console.log("Testing disabled thousand separator:");
    const noSepResult = formatTokenBalance(
      "1234567890000000000000",
      18,
      options2,
    );
    console.log(`Expected: "1234.56789"`);
    console.log(`Result: "${noSepResult}"`);
    console.log(`Pass: ${noSepResult === "1234.56789" ? "✓" : "✗"}`);
    console.log("---\n");

    // Test 5: Token Amount Formatting
    console.log("Test 5: Token Amount Formatting");
    const amountTests = [
      {
        input: "1000000000000000000",
        decimals: 18,
        symbol: "ETH",
        expected: "1.00000 ETH",
      },
      {
        input: "1000000",
        decimals: 6,
        symbol: "USDT",
        expected: "1.00000 USDT",
      },
    ];

    for (const test of amountTests) {
      const result = formatTokenAmount(test.input, test.decimals, test.symbol);
      console.log(`Input: ${test.input} (${test.symbol})`);
      console.log(`Expected: ${test.expected}`);
      console.log(`Result: ${result}`);
      console.log(`Pass: ${result === test.expected ? "✓" : "✗"}`);
      console.log("---");
    }
    console.log("\n");

    // Test 6: Parse Token Balance
    console.log("Test 6: Parse Token Balance");
    const parseTests = [
      { input: "1.0", decimals: 18, expected: "1000000000000000000" },
      { input: "1.5", decimals: 6, expected: "1500000" },
      {
        input: "1,234.5678",
        decimals: 18,
        expected: "1234567800000000000",
      },
    ];

    for (const test of parseTests) {
      const result = parseTokenBalance(test.input, test.decimals);
      console.log(`Input: ${test.input}`);
      console.log(`Expected: ${test.expected}`);
      console.log(`Result: ${result}`);
      console.log(`Pass: ${result === test.expected ? "✓" : "✗"}`);
      console.log("---");
    }
    console.log("\n");

    // Test 7: Error Handling
    console.log("Test 7: Error Handling");
    const errorTests = [
      { input: "invalid", decimals: 18 },
      { input: "", decimals: 18 },
    ];

    for (const test of errorTests) {
      const result = formatTokenBalance(test.input, test.decimals);
      console.log(`Input: "${test.input}"`);
      console.log(`Result: "${result}"`);
      console.log(`Pass: ${result === test.input ? "✓" : "✗"}`);
      console.log("---");
    }

    console.log("\n=== All token formatting tests completed successfully ===");
  } catch (error: unknown) {
    console.error("\nError during test execution:");
    if (error instanceof Error) {
      console.error("Error Name:", error.name);
      console.error("Error Message:", error.message);
      console.error("Error Stack:", error.stack);
    } else {
      console.error("Unexpected error type:", error);
    }
  }
}

// Run the test
main().catch(console.error);
