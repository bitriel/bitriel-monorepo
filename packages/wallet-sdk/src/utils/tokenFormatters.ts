/**
 * Options for formatting token balances
 */
export interface TokenBalanceFormatOptions {
    /** Number of decimal places to show in the formatted output */
    precision?: number;
    /** Whether to add thousand separators (commas) to the whole number part */
    useThousandSeparator?: boolean;
    /** Custom thousand separator character */
    thousandSeparator?: string;
    /** Whether to trim trailing zeros in the decimal part */
    trimTrailingZeros?: boolean;
}

/**
 * Default options for token balance formatting
 */
const DEFAULT_FORMAT_OPTIONS: TokenBalanceFormatOptions = {
    precision: 5,
    useThousandSeparator: true,
    thousandSeparator: ",",
    trimTrailingZeros: true,
};

/**
 * Formats a token balance string with the specified number of decimal places and formatting options
 * @param balance - The token balance as a string
 * @param decimals - The number of decimals for the token
 * @param options - Formatting options
 * @returns Formatted balance string
 */
export function formatTokenBalance(balance: string, decimals: number, options: TokenBalanceFormatOptions = {}): string {
    const { precision, useThousandSeparator, thousandSeparator, trimTrailingZeros } = {
        ...DEFAULT_FORMAT_OPTIONS,
        ...options,
    };

    try {
        const balanceBigInt = BigInt(balance);
        const divisor = BigInt(10) ** BigInt(decimals);
        let wholePart = (balanceBigInt / divisor).toString();
        let fractionalPart = (balanceBigInt % divisor).toString().padStart(decimals, "0");

        // Add thousand separators if enabled
        if (useThousandSeparator) {
            wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator || ",");
        }

        // Handle decimal precision and trailing zeros
        if (precision !== undefined && precision >= 0) {
            fractionalPart = fractionalPart.slice(0, precision);
        }

        if (trimTrailingZeros) {
            fractionalPart = fractionalPart.replace(/0+$/, "");
        }

        // Return formatted string, omitting decimal point if no fractional part
        return fractionalPart ? `${wholePart}.${fractionalPart}` : wholePart;
    } catch (error) {
        console.warn("Failed to format token balance:", error);
        return balance;
    }
}

/**
 * Parses a formatted token balance string back to its raw form
 * @param formattedBalance - The formatted balance string
 * @param decimals - The number of decimals for the token
 * @returns Raw balance string
 */
export function parseTokenBalance(formattedBalance: string, decimals: number): string {
    try {
        // Remove thousand separators and handle both . and , as decimal separators
        const cleanedBalance = formattedBalance.replace(/,/g, "");
        const [wholePart, fractionalPart = ""] = cleanedBalance.split(/[.,]/);

        // Pad or truncate fractional part to match decimals
        const paddedFractional = fractionalPart.padEnd(decimals, "0");
        const finalFractional = paddedFractional.slice(0, decimals);

        // Combine parts and return
        return wholePart + finalFractional;
    } catch (error) {
        console.warn("Failed to parse token balance:", error);
        return formattedBalance;
    }
}

/**
 * Formats a token amount for display with symbol
 * @param amount - The token amount as a string
 * @param decimals - The number of decimals for the token
 * @param symbol - The token symbol
 * @param options - Formatting options
 * @returns Formatted amount with symbol
 */
export function formatTokenAmount(
    amount: string,
    decimals: number,
    symbol: string,
    options: TokenBalanceFormatOptions = {}
): string {
    const formattedAmount = formatTokenBalance(amount, decimals, options);
    return `${formattedAmount} ${symbol}`;
}
