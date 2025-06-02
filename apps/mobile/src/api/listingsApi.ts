import axios from "axios";
import { Coins } from "~/src/interfaces/crypto";

const EXPO_PUBLIC_COINMARKETCAP_API_KEY = process.env.EXPO_PUBLIC_COINMARKETCAP_API_KEY;

export const GetListingCoins = async (): Promise<Coins[]> => {
    try {
        const limit = 100; // Assuming limit is a number

        const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`, {
            params: {
                start: 1,
                limit: limit,
                convert: "USD",
            },
            headers: {
                "X-CMC_PRO_API_KEY": EXPO_PUBLIC_COINMARKETCAP_API_KEY,
            },
        });

        const coinData: Coins[] = response.data["data"];

        return coinData;
    } catch (error) {
        console.error("Error api get coinData", error);
        throw error;
    }
};
