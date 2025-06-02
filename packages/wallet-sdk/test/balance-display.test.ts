import { BitrielWalletSDK } from "../src/sdk";
import { SUBSTRATE_NETWORKS, EVM_NETWORKS } from "../src/config/networks";
import { DetailedBalance } from "../src/wallet/types";

async function testBalanceDisplay() {
    // Test mnemonic (replace with your test mnemonic)
    const mnemonic = "REPLACE_WITH_YOUR_TEST_MNEMONIC"; // DO NOT commit real mnemonics to version control

    // Initialize the SDK with mnemonic
    const sdk = new BitrielWalletSDK(mnemonic);

    try {
        // Test Substrate Chain (Selendra)
        console.log("\n=== Testing Balance Display on Selendra Network ===");
        const selendraNetwork = SUBSTRATE_NETWORKS.find(n => n.name === "Selendra");
        if (selendraNetwork) {
            console.log("Connecting to Selendra network...");
            await sdk.connect(selendraNetwork.chainId.toString());

            // Get detailed balance information
            console.log("\nGetting detailed balance information...");
            const detailedBalance = await sdk.getDetailedBalance();

            // Display formatted balance information
            console.log("\nDetailed Balance Information:");
            console.log("Total Balance:", detailedBalance.formatted.total, selendraNetwork.nativeCurrency.symbol);
            console.log("Locked Balance:", detailedBalance.formatted.locked, selendraNetwork.nativeCurrency.symbol);
            console.log(
                "Transferable Balance:",
                detailedBalance.formatted.transferable,
                selendraNetwork.nativeCurrency.symbol
            );

            // Verify balance calculations
            console.log("\nVerifying balance calculations...");
            const totalBigInt = BigInt(detailedBalance.total);
            const lockedBigInt = BigInt(detailedBalance.locked);
            const transferableBigInt = BigInt(detailedBalance.transferable);

            console.log("Total (raw):", totalBigInt.toString());
            console.log("Locked (raw):", lockedBigInt.toString());
            console.log("Transferable (raw):", transferableBigInt.toString());

            // Verify that total = locked + transferable
            const calculatedTotal = lockedBigInt + transferableBigInt;
            console.log("\nVerifying total = locked + transferable:");
            console.log("Calculated Total:", calculatedTotal.toString());
            console.log("Actual Total:", totalBigInt.toString());
            console.log("Match:", calculatedTotal === totalBigInt);

            // Test balance formatting
            console.log("\nTesting balance formatting...");
            const formattedTotal = sdk.formatTokenBalance(
                detailedBalance.total,
                selendraNetwork.nativeCurrency.decimals,
                { precision: 2 }
            );
            console.log("Formatted with 2 decimal places:", formattedTotal);

            // Disconnect from Selendra
            await sdk.disconnect();
        }

        // Test EVM Chain
        console.log("\n=== Testing Balance Display on EVM Network ===");
        const evmNetwork = EVM_NETWORKS.find(n => n.name === "Selendra Mainnet");
        if (evmNetwork) {
            console.log("Connecting to EVM network...");
            await sdk.connect(evmNetwork.chainId.toString());

            // Get detailed balance information
            console.log("\nGetting detailed balance information...");
            const detailedBalance = await sdk.getDetailedBalance();

            // Display formatted balance information
            console.log("\nDetailed Balance Information:");
            console.log("Total Balance:", detailedBalance.formatted.total, evmNetwork.nativeCurrency.symbol);
            console.log("Locked Balance:", detailedBalance.formatted.locked, evmNetwork.nativeCurrency.symbol);
            console.log(
                "Transferable Balance:",
                detailedBalance.formatted.transferable,
                evmNetwork.nativeCurrency.symbol
            );

            // Verify EVM balance properties
            console.log("\nVerifying EVM balance properties...");
            console.log("Locked balance should be 0:", detailedBalance.locked === "0");
            console.log("Transferable should equal total:", detailedBalance.transferable === detailedBalance.total);

            // Disconnect from EVM
            await sdk.disconnect();
        }
    } catch (error) {
        console.error("\nError during balance display test:", error);

        // Detailed error logging
        if (error instanceof Error) {
            console.error("Error Name:", error.name);
            console.error("Error Message:", error.message);
            console.error("Error Stack:", error.stack);
        }
    }
}

// Run the test
testBalanceDisplay().catch(console.error);
