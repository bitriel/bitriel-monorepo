import React, { useState, useEffect, useRef } from "react";
import { View, Text, StatusBar, TouchableOpacity, Dimensions } from "react-native";
import { CameraView, BarcodeScanningResult, Camera } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { Linking } from "react-native";
import QRIndicator from "~/components/Camera/QRIndicator";
import QRFooterButton from "~/components/Camera/QRFooterButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const QRScanner: React.FC = () => {
    const { from } = useLocalSearchParams<{ from: string }>();
    const { top, bottom } = useSafeAreaInsets();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const cameraRef = useRef<CameraView>(null);
    const [isLit, setLit] = React.useState(false);

    useEffect(() => {
        const checkPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };
        checkPermission();
    }, []);

    const handleOpenSettings = () => Linking.openSettings();

    const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
        setScanned(true);
        console.log("Scanned Data: ", data);
        if (data) {
            if (from === "send") {
                router.back();
                router.setParams({ scannedData: data });
            } else if (from === "home") {
                router.back();
                router.push({ pathname: "/(auth)/home/send", params: { scannedData: data } });
            }
        }
    };

    if (hasPermission === null) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="font-SpaceGroteskSemiBold">Requesting for camera permission...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="font-SpaceGroteskSemiBold text-center mx-12">
                    Camera permission denied. Please enable it in your device settings.
                </Text>
                <TouchableOpacity onPress={handleOpenSettings} className="mt-5">
                    <Text className="text-white font-bold">Request Camera</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <CameraView
                ref={cameraRef}
                className="absolute inset-0"
                facing="back"
                enableTorch={isLit}
                flash={isLit ? "on" : "off"}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />

            <View className="absolute left-0 right-0 items-center" style={{ top: top + 40 }}>
                <Hint>Scan a Bitriel QR code</Hint>
            </View>

            <View className="absolute inset-0 w-full h-full flex items-center justify-center">
                <QRIndicator />
            </View>

            <View
                className="absolute left-0 right-0 flex-row justify-between items-center px-10"
                style={{ bottom: bottom + 30 }}
            >
                <QRFooterButton onPress={() => setLit(prev => !prev)} isActive={isLit} iconName="flashlight" />
                <QRFooterButton onPress={() => router.back()} iconName="close" iconSize={48} />
            </View>
        </View>
    );
};

function Hint({ children }: { children: string }) {
    return (
        <BlurView className="px-4 py-5 rounded-lg items-center justify-center" intensity={100} tint="dark">
            <Text className="text-white text-center text-base font-SpaceGroteskSemiBold">{children}</Text>
        </BlurView>
    );
}

export default QRScanner;
