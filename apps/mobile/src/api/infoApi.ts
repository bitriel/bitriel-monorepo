import axios from "axios";

const EXPO_PUBLIC_COINMARKETCAP_API_KEY = process.env.EXPO_PUBLIC_COINMARKETCAP_API_KEY;

export const GetListingCoinsInfo = async (id: string) => {
  console.log("GetListingCoinsInfo", id);

  const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${id}`, {
    headers: {
      "X-CMC_PRO_API_KEY": EXPO_PUBLIC_COINMARKETCAP_API_KEY
    }
  });

  const coinInfoData = response.data["data"];

  return coinInfoData;
};
