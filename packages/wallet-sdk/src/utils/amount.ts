import { BN } from "@polkadot/util";
import { ethers } from "ethers";

/**
 * Parses amount for both Substrate and EVM chains
 * @param amount The amount to convert (can be string, number, boolean, Uint8Array, or null)
 * @param chainType The type of chain ('substrate' or 'evm')
 * @param decimals Number of decimal places (default: 18)
 * @returns The amount in base units as string
 */
export function parseTransactionAmount(
    amount: string | number | boolean | Uint8Array<ArrayBufferLike> | null,
    chainType: "substrate" | "evm",
    decimals: number = 18
): string {
    // Handle null or undefined
    if (amount === null || amount === undefined) {
        throw new Error("Amount cannot be null or undefined");
    }

    const amountStr = amount.toString();

    if (chainType === "evm") {
        try {
            // Handle excessive decimal places by truncating to the specified decimals
            const [whole, fraction = ""] = amountStr.split(".");
            if (fraction.length > decimals) {
                const truncatedAmount = `${whole}.${fraction.slice(0, decimals)}`;
                return ethers.parseUnits(truncatedAmount, decimals).toString();
            }
            return ethers.parseUnits(amountStr, decimals).toString();
        } catch (error) {
            throw new Error(`Failed to parse EVM amount: ${amountStr}. ${error}`);
        }
    } else {
        // For Substrate, we need to handle decimal numbers properly
        const [whole, fraction = ""] = amountStr.split(".");
        const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
        const fullNumber = whole + paddedFraction;
        return new BN(fullNumber).toString();
    }
}
