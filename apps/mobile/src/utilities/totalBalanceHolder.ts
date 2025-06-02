export function totalBalanceTokenHolder(quotes: number[]): number {
    let total: number = 0;
    quotes.forEach(quote => {
        const amount: number = quote;
        total += amount;
    });

    console.log("total", total);

    return total;
}
