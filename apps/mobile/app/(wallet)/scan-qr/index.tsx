import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  X,
  QrCode,
  Camera,
  Info,
  ShoppingCart,
  UtensilsCrossed,
  Ticket,
  Car,
} from 'lucide-react-native';
import * as React from 'react';
import { View, Pressable, Alert, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCAN_AREA_SIZE = SCREEN_WIDTH * 0.7;

export default function ScanQRScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isScanning, setIsScanning] = React.useState(true);

  // Simulate QR scanning
  const handleScan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsScanning(false);

    // Simulate processing
    setTimeout(() => {
      Alert.alert(
        'Bakong Payment Detected',
        'Merchant: Local Restaurant\nAmount: 45,320 KHR ($11.19 USD)\n\nProceed with payment?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setIsScanning(true),
          },
          {
            text: 'Pay Now',
            onPress: () => {
              router.push('/(wallet)/payment/confirm');
            },
          },
        ]
      );
    }, 1500);
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 16 }}
        className="px-6 pb-4 absolute top-0 left-0 right-0 z-10"
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            className="active:opacity-70 bg-black/50 rounded-full p-2"
          >
            <X size={24} color="#FFFFFF" />
          </Pressable>
          <View className="bg-black/50 rounded-full px-4 py-2">
            <Text variant="callout" className="text-white font-semibold">
              Scan QR Code
            </Text>
          </View>
          <View className="w-10" />
        </View>
      </View>

      {/* Camera View Placeholder */}
      <View className="flex-1 items-center justify-center">
        {/* Scan Frame */}
        <Animated.View entering={FadeIn.duration(600)}>
          <View
            style={{
              width: SCAN_AREA_SIZE,
              height: SCAN_AREA_SIZE,
            }}
            className="relative"
          >
            {/* Corner Borders */}
            <View className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-2xl" />
            <View className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-2xl" />
            <View className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-2xl" />
            <View className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-2xl" />

            {/* Center Icon */}
            <View className="flex-1 items-center justify-center">
              <QrCode size={80} color="rgba(255,255,255,0.5)" />
            </View>

            {/* Scanning Line Animation */}
            {/* {isScanning && <View className="absolute top-0 left-0 right-0 h-1 bg-primary" />} */}
          </View>
        </Animated.View>

        {/* Instructions */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mt-8 px-8">
          <Text variant="title3" className="text-white text-center font-semibold mb-2">
            {isScanning ? 'Position QR code in frame' : 'Processing...'}
          </Text>
          <Text variant="subhead" className="text-white/70 text-center">
            {isScanning
              ? 'Scan any Bakong QR code to make instant payments'
              : 'Please wait while we process the QR code'}
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Actions */}
      <View style={{ paddingBottom: insets.bottom + 24 }} className="px-6">
        <Animated.View entering={FadeInDown.delay(400).duration(400)} className="gap-3">
          {/* Demo Button */}
          <Button onPress={handleScan} className="bg-primary">
            <Camera size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold">Simulate Scan (Demo)</Text>
          </Button>

          {/* Info Card */}
          <View className="bg-white/10 rounded-2xl p-4">
            <View className="flex-row items-start gap-3">
              <Info size={20} color="rgba(255,255,255,0.7)" />
              <View className="flex-1">
                <Text variant="callout" className="text-white font-semibold mb-1">
                  Bakong Integration
                </Text>
                <Text variant="caption1" className="text-white/70">
                  Pay at any merchant that accepts Bakong QR payments across Cambodia
                </Text>
              </View>
            </View>
          </View>

          {/* Supported Services */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white/10 rounded-xl p-3 items-center">
              <ShoppingCart size={24} color="#FFFFFF" />
              <Text variant="caption2" className="text-white/70 text-center">
                Shops
              </Text>
            </View>
            <View className="flex-1 bg-white/10 rounded-xl p-3 items-center">
              <UtensilsCrossed size={24} color="#FFFFFF" />
              <Text variant="caption2" className="text-white/70 text-center">
                Restaurants
              </Text>
            </View>
            <View className="flex-1 bg-white/10 rounded-xl p-3 items-center">
              <Ticket size={24} color="#FFFFFF" />
              <Text variant="caption2" className="text-white/70 text-center">
                Services
              </Text>
            </View>
            <View className="flex-1 bg-white/10 rounded-xl p-3 items-center">
              <Car size={24} color="#FFFFFF" />
              <Text variant="caption2" className="text-white/70 text-center">
                Transport
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
