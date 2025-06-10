import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Animated,
    Image,
    TextInput,
    Modal,
} from "react-native";
import Share from "react-native-share";
import Colors from "~/src/constants/Colors";
import QRCode from "react-native-qrcode-svg";
import ViewShot, { captureRef } from "react-native-view-shot";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { alert as TingAlert } from "@baronha/ting";
import copyAddress from "~/src/utilities/copyClipboard";
import { Iconify } from "react-native-iconify";
import { useWalletStore } from "~/src/store/useWalletStore";

const saveQrToImage = async (qrRef: React.RefObject<View>) => {
    try {
        if (!qrRef.current) {
            throw new Error("QR Code ref is null");
        }

        const uri = await captureRef(qrRef, {
            format: "png",
            quality: 1,
        });

        return uri;
    } catch (error) {
        console.error("Error saving QR code to image:", error);

        Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: "Error saving QR code to image. Please check storage permissions.",
            button: "Close",
        });

        throw error;
    }
};

const shareQRCode = async (qrRef: React.RefObject<View>, address: string, amount: string, symbol: string) => {
    try {
        const uri = await saveQrToImage(qrRef);

        let message = `My Public Address to Receive: ${address}`;

        if (amount && amount !== "0") {
            message += `\n\nScan the QR Code to send me ${amount} ${symbol}.`;
        } else {
            message += `\n\nScan the QR Code to send me ${symbol}.`;
        }

        message += "\n\nDownload Bitriel Wallet: https://bitriel.com/ \n\n#BitrielWallet #Selendra #SEL #Bitriel";

        const shareOptions = {
            failOnCancel: false,
            title: "Bitriel Rewards",
            message: message,
            url: uri,
            filename: "QR's Bitriel Rewards", // only for base64 file in Android
        };

        await Share.open(shareOptions);
    } catch (error) {
        Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: "An error occurred while sharing the QR Code",
            button: "Close",
        });

        console.error(error);
    }
};

const HeaderWarnMsg = ({ networkName }: { networkName: string }) => {
    return (
        <View>
            <View className="bg-primary/10 p-3 justify-between flex-row items-center rounded-xl">
                <View className="flex-row">
                    <Iconify icon="solar:danger-circle-line-duotone" size={18} color={Colors.secondary} />
                    <Text className="text-secondary break-all w-11/12 ml-1 font-SpaceGroteskMedium bottom-[2px]">
                        Only send {networkName} network to this address. Other assets will be lost forever.
                    </Text>
                </View>
            </View>
        </View>
    );
};

const TokenDisplay = ({ logo, name }: { logo: string; name: string }) => {
    return (
        <>
            <View className="my-5 flex-row justify-center items-center">
                <Image
                    source={{ uri: logo }}
                    className="w-10 h-10 rounded-full bg-white"
                    style={{ objectFit: "contain" }}
                />
                <Text className="ml-1 text-center font-SpaceGroteskSemiBold text-sm text-black">{name}</Text>
            </View>
        </>
    );
};

const QrCode = ({ address, symbol }: { address: string; symbol: string }) => {
    const qrRef = useRef<View>(null);
    let logoFromFile = require("~Assets/icon.png");
    const [amount, setAmount] = useState("");
    const [textOpacity] = useState(new Animated.Value(0));
    const [textAnimited, setTextAnimated] = useState(false);
    const [visible, setVisible] = React.useState(false);

    const animateText = (animateValue: number) => {
        Animated.timing(textOpacity, {
            toValue: animateValue, // Animate to transparent
            duration: 500, // Animation duration in milliseconds
            useNativeDriver: true, // To improve animation performance
        }).start(() => {
            if (animateValue === 0) {
                setTextAnimated(false); // Reset text animation state
                setAmount("");
            }
        });
    };

    const handleConfirmAmount = (inputAmount: string) => {
        if (inputAmount === "" || parseFloat(inputAmount) === 0) {
            TingAlert({
                title: "Invalid Amount",
                message: "Please enter a valid amount greater than 0.",
                preset: "error",
            });
            return;
        }

        setAmount(inputAmount);
        setVisible(false);
        animateText(1);
        setTextAnimated(true);
    };

    const handleAmountChange = (text: any) => {
        const validInput = /^(\d+)?([,.]\d{0,4})?$/;
        if (validInput.test(text.replace(",", "."))) {
            setAmount(text);
            setTextAnimated(false);
        }
    };

    return (
        <>
            <ViewShot ref={qrRef}>
                <View className="w-2/3 self-center items-center mb-5 bg-white rounded-3xl shadow-md p-5">
                    {textAnimited && (
                        <Animated.View // Wrap your view with Animated.View to apply opacity animation
                            style={{
                                opacity: textOpacity, // Set opacity based on animated value
                                transform: [
                                    {
                                        translateY: textOpacity.interpolate({
                                            // Interpolate opacity to translate Y
                                            inputRange: [0, 1],
                                            outputRange: [50, 0],
                                        }),
                                    },
                                ],
                            }}
                        >
                            <View className="mb-2 mx-2 left-3 gap-2 flex-row justify-center items-center">
                                <Text className="text-center font-SpaceGroteskBold text-xl">
                                    {amount} {symbol}
                                </Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        animateText(0);
                                    }}
                                >
                                    <Iconify
                                        icon="solar:close-circle-line-duotone"
                                        size={20}
                                        color={Colors.secondary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    )}

                    <QRCode
                        value={`${address}?amount=${amount}`}
                        logo={logoFromFile}
                        logoBackgroundColor="white"
                        size={200}
                    />

                    <Text className="mt-5 text-center font-SpaceGroteskSemiBold">{address}</Text>
                </View>
            </ViewShot>

            <View className="flex-row justify-center gap-8">
                <View className="items-center">
                    <TouchableOpacity
                        className="bg-primary justify-center items-center w-12 h-12 rounded-3xl mx-1"
                        onPress={() => {
                            copyAddress(address!);
                        }}
                    >
                        <Iconify icon="solar:copy-bold" color={Colors.white} size={22} />
                    </TouchableOpacity>

                    <Text className="mt-2 font-SpaceGroteskMedium">Copy</Text>
                </View>

                <View className="items-center">
                    <TouchableOpacity
                        className="bg-primary justify-center items-center w-12 h-12 rounded-3xl mx-1"
                        onPress={() => setVisible(true)}
                    >
                        <Iconify icon="solar:hashtag-bold" color={Colors.white} size={22} />
                    </TouchableOpacity>

                    <Text className="mt-2 font-SpaceGroteskMedium">Set Amount</Text>
                </View>

                <View className="items-center">
                    <TouchableOpacity
                        className="bg-primary justify-center items-center w-12 h-12 rounded-3xl mx-1"
                        onPress={() => shareQRCode(qrRef, address!, amount, symbol)}
                    >
                        <Iconify icon="solar:square-share-line-bold" color={Colors.white} size={22} />
                    </TouchableOpacity>

                    <Text className="mt-2 font-SpaceGroteskMedium">Share</Text>
                </View>
            </View>

            <Modal
                visible={visible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                    textAnimited ? amount : setAmount("");
                    setVisible(false);
                }}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-2xl w-[80%] p-4">
                        <View className="gap-3">
                            <View>
                                <Text className="text-sm mb-1 text-gray-600 font-SpaceGroteskMedium">Amount</Text>
                                <TextInput
                                    value={amount}
                                    onChangeText={handleAmountChange}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="numeric"
                                    placeholder="Amount"
                                    className="border border-gray-200 rounded-lg p-3 font-SpaceGroteskMedium"
                                />
                            </View>

                            <TouchableOpacity
                                className="bg-primary p-3 rounded-lg"
                                onPress={() => handleConfirmAmount(amount)}
                            >
                                <Text className="text-center text-secondary font-SpaceGroteskBold">CONFIRM</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const ReceiveScreen = () => {
    const { walletState } = useWalletStore();

    return (
        <SafeAreaView className="flex-1">
            <View className="py-5 mx-3">
                <HeaderWarnMsg networkName={walletState?.network?.name!} />
                {/* <TokenDisplay logo={walletState?.balances.tokens.} name={networkName!} /> */}
                <QrCode address={walletState?.address!} symbol={walletState?.network?.nativeCurrency.symbol!} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});

export default ReceiveScreen;
