import * as React from 'react';
import { ScrollView, View, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { ChevronLeft, CreditCard, Building2, Bitcoin, QrCode, CheckCircle2, Info } from 'lucide-react-native';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';
import { usePayment } from '@/context/PaymentContext';
import { PAYMENT_METHODS } from '@/services/mockData';

const PAYMENT_METHOD_ICONS = {
  'credit-card': CreditCard,
  'bank-transfer': Building2,
  'crypto': Bitcoin,
  'bakong': QrCode,
};

const QUICK_AMOUNTS = [10, 20, 50, 100, 200, 500];

export default function AddFundsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useColorScheme();
  const { setPaymentAmount, setPaymentMethod } = usePayment();
  const [amount, setAmount] = React.useState('');
  const [selectedMethod, setSelectedMethod] = React.useState<string | null>(null);

  const exchangeRate = 4050;
  const amountKHR = amount ? parseFloat(amount) * exchangeRate : 0;

  const handleContinue = () => {
    if (!selectedMethod || !amount) {
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Save amount and payment method to context
    setPaymentAmount(amountNum);
    setPaymentMethod(selectedMethod as any);

    // Navigate to specific payment flow
    switch (selectedMethod) {
      case 'credit-card':
        // Route to saved cards selection screen instead of directly to card form
        router.push('/(wallet)/payment/select-card');
        break;
      case 'bank-transfer':
        // Bank transfer - redirect to confirmation for now
        router.push('/(wallet)/payment/confirm' as any);
        break;
      case 'crypto':
        router.push('/(wallet)/payment/crypto');
        break;
      case 'bakong':
        router.push('/(wallet)/scan-qr');
        break;
    }
  };

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
            Add Funds
          </Text>
          <View className="w-7" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Amount Input Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-8">
          <Text variant="title3" className="font-semibold mb-4">
            Enter Amount
          </Text>

          <View className="bg-card rounded-3xl p-6 border border-border">
            <Text variant="subhead" className="text-muted-foreground mb-2">
              Amount in USD
            </Text>
            <View className="flex-row items-center">
              <Text variant="largeTitle" className="font-bold text-4xl">
                $
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                className="flex-1 text-4xl font-bold ml-2"
                style={{ color: colors.foreground }}
                placeholderTextColor={colors.muted}
              />
            </View>
            {amount && (
              <Text variant="subhead" className="text-muted-foreground mt-3">
                ≈ {amountKHR.toLocaleString('en-US')} KHR
              </Text>
            )}
          </View>

          {/* Quick Amount Buttons */}
          <View className="flex-row flex-wrap gap-3 mt-4">
            {QUICK_AMOUNTS.map((quickAmount) => (
              <Pressable
                key={quickAmount}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAmount(quickAmount.toString());
                }}
                className="active:opacity-70"
              >
                <View className="bg-muted/20 rounded-full px-5 py-2.5">
                  <Text variant="callout" className="font-semibold">
                    ${quickAmount}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Payment Methods */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-8">
          <Text variant="title3" className="font-semibold mb-4">
            Select Payment Method
          </Text>

          <View className="gap-3">
            {PAYMENT_METHODS.map((method, index) => {
              const IconComponent = PAYMENT_METHOD_ICONS[method.id as keyof typeof PAYMENT_METHOD_ICONS];
              return (
                <Pressable
                  key={method.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedMethod(method.id);
                  }}
                  className="active:opacity-70"
                >
                  <View
                    className={`bg-card rounded-2xl p-4 border-2 ${
                      selectedMethod === method.id ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <View className="flex-row items-center gap-4">
                      <View
                        style={{ backgroundColor: method.color }}
                        className="w-12 h-12 rounded-xl items-center justify-center"
                      >
                        <IconComponent size={24} color="#FFFFFF" />
                      </View>
                      <View className="flex-1">
                        <Text variant="callout" className="font-semibold mb-0.5">
                          {method.title}
                        </Text>
                        <Text variant="caption1" className="text-muted-foreground">
                          {method.subtitle}
                        </Text>
                      </View>
                      {selectedMethod === method.id && (
                        <CheckCircle2 size={24} color={colors.primary} />
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Info Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View className="bg-muted/10 rounded-2xl p-4">
            <View className="flex-row gap-3">
              <Info size={20} color={colors.primary} />
              <View className="flex-1">
                <Text variant="caption1" className="text-muted-foreground">
                  Funds will be converted to Cambodian Riel (KHR) and credited to your Bitriel
                  wallet. Exchange rate: 1 USD = 4,050 KHR
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Continue Button */}
      <View
        style={{ paddingBottom: insets.bottom + 16 }}
        className="px-6 pt-4 border-t border-border"
      >
        <Button
          onPress={handleContinue}
          disabled={!selectedMethod || !amount}
          className={`${!selectedMethod || !amount ? 'opacity-50' : ''} bg-primary`}
        >
          <Text className="text-primary-foreground font-semibold text-base">
            Continue to Payment
          </Text>
        </Button>
      </View>
    </View>
  );
}
