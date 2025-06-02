function formatBigInt(bigIntValue: bigint, decimals: number): string {
    const scaledValue: string = bigIntValue.toString().padStart(decimals + 1, "0");
    const integerPart: string = scaledValue.slice(0, -decimals) || "0";
    const decimalPart: string = scaledValue.slice(-decimals);
    const formattedIntegerPart: string = parseInt(integerPart).toLocaleString("en-US"); // Format integer part
    const formattedValue: string = formattedIntegerPart + "." + decimalPart;

    return formattedValue;
}

export default formatBigInt;
