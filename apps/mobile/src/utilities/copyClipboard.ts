import * as Clipboard from "expo-clipboard";
import { toast as TingToast } from "@baronha/ting";
import Colors from "../constants/Colors";

const copyAddress = (address: string) => {
    Clipboard.setStringAsync(address);

    TingToast({
        backgroundColor: Colors.offWhite,
        title: "Success",
        message: "Address copied to clipboard",
        preset: "done",
    });
};

export default copyAddress;
