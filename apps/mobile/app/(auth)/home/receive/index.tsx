import React from "react";
import { ReceiveScreen } from "~/components/Receive/ReceiveScreen";
import { useWalletStore } from "~/src/store/useWalletStore";
import { useCustodialAuthStore } from "~/src/store/useCustodialAuthStore";
import { useWalletTypeStore } from "~/src/store/useWalletTypeStore";
export default function ReceiveScreenWrapper() {
    const { walletState } = useWalletStore();
    const { walletType } = useWalletTypeStore();
    const { user } = useCustodialAuthStore();

    return (
        <ReceiveScreen
            address={walletType === "custodial" ? user?.address! : walletState?.address!}
            networkName={walletState?.network?.name!}
            symbol={walletState?.network?.nativeCurrency.symbol!}
        />
    );
}
