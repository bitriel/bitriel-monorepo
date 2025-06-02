import { BitrielWalletSDK } from "../src/sdk";
import { SUBSTRATE_NETWORKS, EVM_NETWORKS } from "../src/config/networks";
import { TransactionRequest } from "../src/wallet/types";
import { parseTransactionAmount } from "../src/utils/amount";

async function main() {
    // Test mnemonic (replace with your test mnemonic)
    const mnemonic = "REPLACE_WITH_YOUR_TEST_MNEMONIC"; // DO NOT commit real mnemonics to version control

    // Initialize the SDK with mnemonic
    const sdk = new BitrielWalletSDK(mnemonic);

    try {
        // Test Substrate Chain (Selendra)
        console.log("\n=== Testing Selendra Network ===");
        const selendraNetwork = SUBSTRATE_NETWORKS.find(n => n.name === "Selendra");
        if (selendraNetwork) {
            console.log("Connecting to Selendra network...");
            await sdk.connect(selendraNetwork.chainId.toString());

            // Get wallet state
            const selendraState = await sdk.getWalletState();
            if (!selendraState.network) {
                throw new Error("Failed to get Selendra network state");
            }
            console.log("Selendra Wallet State:", {
                address: selendraState.address,
                balance: selendraState.balances.native,
                network: selendraState.network.name,
            });

            // List tokens
            console.log("\nListing Selendra tokens...");
            const selendraTokens = await sdk.listTokens();
            console.log("Selendra Tokens:", selendraTokens);

            // Test transaction
            const recipientAddress = "5FFVzVi2xVs4XgHrRnb1ZW7h5iC1ojScAKvryPVvaXBXcrd9";
            const substrateTx = {
                method: "balances",
                params: ["transfer", recipientAddress, parseTransactionAmount("0.001", "substrate")], // 0.001 SEL
            };

            // Estimate fee before sending transaction
            console.log("\nEstimating Selendra transaction fee...");
            const selendraFee = await sdk.estimateFee(substrateTx);
            console.log("Selendra Transaction Fee:", {
                amount: selendraFee.formatted,
                currency: selendraFee.currency,
            });

            console.log("\nSending Selendra transaction...");
            const selendraTxHash = await sdk.sendTransaction(substrateTx);
            console.log("Selendra Transaction Hash:", selendraTxHash);

            // Test message signing
            const message = "Hello, Selendra!";
            const selendraSignature = await sdk.signMessage(message);
            console.log("Selendra Message Signature:", selendraSignature);

            // Disconnect from Selendra
            await sdk.disconnect();
        }

        // Test EVM Chain (Selendra)
        console.log("\n=== Testing Selendra EVM Network ===");
        const ethereumNetwork = EVM_NETWORKS.find(n => n.name === "Selendra Mainnet");
        if (ethereumNetwork) {
            console.log("Connecting to Selendra EVM network...");
            await sdk.connect(ethereumNetwork.chainId.toString());

            // Get wallet state
            const ethereumState = await sdk.getWalletState();
            if (!ethereumState.network) {
                throw new Error("Failed to get Selendra EVM network state");
            }
            console.log("Selendra EVM Wallet State:", {
                address: ethereumState.address,
                balance: ethereumState.balances.native,
                network: ethereumState.network.name,
            });

            // List tokens
            console.log("\nListing Selendra EVM tokens...");
            const evmTokens = await sdk.listTokens();
            console.log("Selendra EVM Tokens:", evmTokens);

            // Test transaction
            const recipientAddress = "0x2eF0990f509Ff5b68CC95A5f064BB052daf23552";
            const evmTx: TransactionRequest = {
                to: recipientAddress,
                value: parseTransactionAmount("0.001", "evm"), // 0.001 SEL
            };

            // Estimate fee before sending transaction
            console.log("\nEstimating Selendra EVM transaction fee...");
            const evmFee = await sdk.estimateFee(evmTx);
            console.log("Selendra EVM Transaction Fee:", {
                amount: evmFee.formatted,
                currency: evmFee.currency,
            });

            console.log("\nSending Selendra EVM transaction...");
            const ethereumTxHash = await sdk.sendTransaction(evmTx);
            console.log("Selendra EVM Transaction Hash:", ethereumTxHash);

            // Test message signing
            const message = "Hello, Selendra EVM!";
            const ethereumSignature = await sdk.signMessage(message);
            console.log("Selendra EVM Message Signature:", ethereumSignature);

            // Test token balance only if tokens are configured
            if (ethereumState.network.tokens && ethereumState.network.tokens.length > 0) {
                console.log("\nChecking ERC20 token balances...");
                for (const token of ethereumState.network.tokens) {
                    const balance = await sdk.getWalletState();
                    if (!balance.network) {
                        throw new Error("Failed to get network state for token balance");
                    }
                    console.log(
                        `${token.symbol} Balance:`,
                        balance.balances.tokens.find(t => t.token.symbol === token.symbol)?.balance
                    );
                }
            } else {
                console.log("\nNo tokens configured for this network, skipping token balance checks.");
            }

            // Disconnect from Selendra EVM
            await sdk.disconnect();
        }
    } catch (error) {
        console.error("\nError during execution:", error);

        // Detailed error logging
        if (error instanceof Error) {
            console.error("Error Name:", error.name);
            console.error("Error Message:", error.message);
            console.error("Error Stack:", error.stack);
        }
    }
}

// Run the test
main().catch(console.error);
