import * as React from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { ChevronLeft, CheckCircle2, Shield } from 'lucide-react-native';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';

export default function ConfirmPaymentScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useColorScheme();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const amountUSD = 50.0;
  const amountKHR = amountUSD * 4050;

  const handleConfirm = () => {
    setIsProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Auto navigate back to wallet after success
      setTimeout(() => {
        router.push('/wallet');
      }, 2000);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Animated.View entering={FadeIn.duration(600)} className="items-center">
          <View className="w-24 h-24 rounded-full bg-green-500/20 items-center justify-center mb-6">
            <CheckCircle2 size={80} color="#22c55e" />
          </View>
          <Text variant="title1" className="font-bold mb-2">
            Payment Successful!
          </Text>
          <Text variant="subhead" className="text-muted-foreground text-center mb-8">
            {amountKHR.toLocaleString('en-US')} KHR has been added to your wallet
          </Text>
          <View className="bg-card rounded-2xl p-4 border border-border w-full">
            <View className="flex-row justify-between mb-2">
              <Text variant="subhead" className="text-muted-foreground">
                Amount
              </Text>
              <Text variant="subhead" className="font-semibold">
                ${amountUSD.toFixed(2)} USD
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text variant="subhead" className="text-muted-foreground">
                New Balance
              </Text>
              <Text variant="subhead" className="font-semibold">
                {(50420000 + amountKHR).toLocaleString('en-US')} KHR
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  if (isProcessing) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Animated.View entering={FadeIn.duration(400)} className="items-center">
          <ActivityIndicator size="large" color={colors.primary} className="mb-6" />
          <Text variant="title2" className="font-bold mb-2">
            Processing Payment...
          </Text>
          <Text variant="subhead" className="text-muted-foreground text-center">
            Please wait while we process your transaction
          </Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="px-6 pb-4 border-b border-border">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            className="active:opacity-70"
          >
            <ChevronLeft size={28} color={colors.foreground} />
          </Pressable>
          <Text variant="title3" className="font-semibold">
            Confirm Payment
          </Text>
          <View className="w-7" />
        </View>
      </View>

      <View className="flex-1 px-6 pt-8">
        {/* Amount Display */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          className="items-center mb-12"
        >
          <Text variant="subhead" className="text-muted-foreground mb-2">
            Amount to Add
          </Text>
          <View className="flex-row items-baseline gap-2 mb-2">
            <Text variant="largeTitle" className="font-bold text-5xl">
              {amountKHR.toLocaleString('en-US')}
            </Text>
            <Text variant="title1" className="font-semibold text-muted-foreground">
              KHR
            </Text>
          </View>
          <View className="bg-muted/20 rounded-full px-4 py-1.5">
            <Text variant="subhead" className="text-muted-foreground">
              ≈ ${amountUSD.toFixed(2)} USD
            </Text>
          </View>
        </Animated.View>

        {/* Transaction Details */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-8">
          <View className="bg-card rounded-3xl border border-border overflow-hidden">
            <DetailRow label="Payment Method" value="Credit Card" />
            <DetailRow label="Card Number" value="•••• 4242" />
            <DetailRow label="Exchange Rate" value="1 USD = 4,050 KHR" />
            <DetailRow label="Processing Fee" value="Free" />
            <DetailRow
              label="Total"
              value={`${amountKHR.toLocaleString('en-US')} KHR`}
              isLast
              highlighted
            />
          </View>
        </Animated.View>

        {/* Security Info */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View className="bg-primary/10 rounded-2xl p-4">
            <View className="flex-row gap-3">
              <Shield size={20} color={colors.primary} />
              <View className="flex-1">
                <Text variant="caption1" className="text-muted-foreground">
                  Your payment is secured and encrypted. Funds will be instantly available in your
                  Bitriel wallet.
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Confirm Button */}
      <View
        style={{ paddingBottom: insets.bottom + 16 }}
        className="px-6 pt-4 border-t border-border"
      >
        <Button onPress={handleConfirm} className="bg-primary mb-3">
          <CheckCircle2 size={20} color="#FFFFFF" />
          <Text className="text-primary-foreground font-semibold text-base">
            Confirm & Pay {amountKHR.toLocaleString('en-US')} KHR
          </Text>
        </Button>
        <Button onPress={() => router.back()} className="bg-transparent border border-border">
          <Text className="text-foreground font-semibold">Cancel</Text>
        </Button>
      </View>
    </View>
  );
}

function DetailRow({
  label,
  value,
  isLast,
  highlighted,
}: {
  label: string;
  value: string;
  isLast?: boolean;
  highlighted?: boolean;
}) {
  return (
    <View className={`px-5 py-4 ${!isLast ? 'border-b border-border' : ''}`}>
      <View className="flex-row justify-between items-center">
        <Text variant="subhead" className={highlighted ? 'font-semibold' : 'text-muted-foreground'}>
          {label}
        </Text>
        <Text variant="subhead" className={`font-semibold ${highlighted ? 'text-primary' : ''}`}>
          {value}
        </Text>
      </View>
    </View>
  );
}
