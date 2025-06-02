import axios from "axios";

export const GetCoinTickers = async (symbol: string) => {
  try {
    const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=90`);

    const historicalData = response.data["Data"]["Data"];

    return historicalData;
  } catch (error) {
    console.error("Error api get historicalData", error);
    throw error;
  }
};
