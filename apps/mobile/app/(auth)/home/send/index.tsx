import { useLocalSearchParams } from "expo-router";
import { TransferScreen } from "~/components/Transfer/TransferScreen";
import { useWalletTypeStore } from "~/src/store/useWalletTypeStore";

export default function SendScreen() {
    const {
        scannedData,
        tokenName,
        tokenBalance,
        tokenContract,
        tokenImage,
        decimalChain,
        currentNetwork,
        tokenSymbol,
    } = useLocalSearchParams<{
        scannedData: string;
        tokenName: string;
        tokenBalance: string;
        tokenContract: string;
        tokenImage: string;
        decimalChain: string;
        currentNetwork: string;
        tokenSymbol: string;
    }>();

    const { walletType } = useWalletTypeStore();

    return (
        <TransferScreen
            tokenName={tokenName}
            tokenBalance={tokenBalance}
            tokenContract={tokenContract}
            tokenImage={tokenImage}
            tokenSymbol={tokenSymbol}
            decimalChain={decimalChain}
            currentNetwork={currentNetwork}
            scannedData={scannedData}
            isCustodial={walletType === "custodial"}
        />
    );
}
