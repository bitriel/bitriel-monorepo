import { ImageSourcePropType } from "react-native";

export interface CustomSelEvmTokenData {
    contractAddress: string;
    tokenName: string;
    tokenSymbol: string;
    tokenBalance: string;
    logo: ImageSourcePropType;
}
