import { DetailedBalance } from "@bitriel/wallet-sdk";

export function formatDetailedBalance(
    balance: DetailedBalance | null,
    type: "total" | "transferable" | "locked" = "total"
): string {
    if (!balance) return "0";

    const value = balance.formatted[type];
    if (!value) return "0";

    // Split into integer and decimal parts
    const [integerPart, decimalPart = ""] = value.split(".");

    // Format integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Combine with decimal part if it exists
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

export function formatRawBalance(rawBalance: string, decimals: number): string {
    if (!rawBalance) return "0";

    // Pad the raw balance with leading zeros if needed
    const paddedBalance = rawBalance.padStart(decimals + 1, "0");

    // Split into integer and decimal parts
    const integerPart = paddedBalance.slice(0, -decimals) || "0";
    const decimalPart = paddedBalance.slice(-decimals);

    // Format integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Combine with decimal part
    return `${formattedInteger}.${decimalPart}`;
}
