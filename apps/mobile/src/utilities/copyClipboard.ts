import * as Clipboard from "expo-clipboard";

const copyAddress = (
    address: string,
    showToast?: (message: string, type?: "success" | "error" | "info" | "warning", title?: string) => void
) => {
    Clipboard.setStringAsync(address);

    if (showToast) {
        showToast("Address copied to clipboard", "success", "Success");
    }
};

export default copyAddress;
