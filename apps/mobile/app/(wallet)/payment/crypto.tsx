import * as React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { ChevronLeft, Bitcoin, DollarSign, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';

const CRYPTO_OPTIONS = [
  {
    id: 'usdc',
    name: 'USDC',
    fullName: 'USD Coin',
    icon: DollarSign,
    color: '#0385FF',
    network: 'Solana',
    rate: '1 USDC = 4,050 KHR',
  },
  {
    id: 'usdt',
    name: 'USDT',
    fullName: 'Tether',
    icon: DollarSign,
    color: '#00C853',
    network: 'Solana',
    rate: '1 USDT = 4,050 KHR',
  },
  {
    id: 'sol',
    name: 'SOL',
    fullName: 'Solana',
    icon: Sparkles,
    color: '#9945FF',
    network: 'Solana',
    rate: '1 SOL = 607,500 KHR',
  },
  {
    id: 'btc',
    name: 'BTC',
    fullName: 'Bitcoin',
    icon: Bitcoin,
    color: '#FF9500',
    network: 'Bitcoin',
    rate: '1 BTC = 283,500,000 KHR',
  },
];

export default function CryptoPaymentScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useColorScheme();
  const [selectedCrypto, setSelectedCrypto] = React.useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedCrypto) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(wallet)/payment/confirm');
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
            Pay with Crypto
          </Text>
          <View className="w-7" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Info Banner */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-6">
          <View className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
            <View className="flex-row gap-3">
              <Bitcoin size={24} color={colors.primary} />
              <View className="flex-1">
                <Text variant="callout" className="font-semibold mb-1">
                  Crypto to Riel Conversion
                </Text>
                <Text variant="caption1" className="text-muted-foreground">
                  Your cryptocurrency will be automatically converted to Cambodian Riel at the
                  current market rate
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Crypto Options */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-8">
          <Text variant="title3" className="font-semibold mb-4">
            Select Cryptocurrency
          </Text>

          <View className="gap-3">
            {CRYPTO_OPTIONS.map((crypto) => (
              <Pressable
                key={crypto.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCrypto(crypto.id);
                }}
                className="active:opacity-70"
              >
                <View
                  className={`bg-card rounded-2xl p-4 border-2 ${
                    selectedCrypto === crypto.id ? 'border-primary' : 'border-border'
                  }`}
                >
                  <View className="flex-row items-center gap-4">
                    <View
                      style={{ backgroundColor: crypto.color }}
                      className="w-14 h-14 rounded-full items-center justify-center"
                    >
                      <crypto.icon size={28} color="#FFFFFF" />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text variant="callout" className="font-bold">
                          {crypto.name}
                        </Text>
                        <View className="bg-muted/20 rounded-full px-2 py-0.5">
                          <Text variant="caption2" className="text-muted-foreground">
                            {crypto.network}
                          </Text>
                        </View>
                      </View>
                      <Text variant="caption1" className="text-muted-foreground mb-1">
                        {crypto.fullName}
                      </Text>
                      <Text variant="caption1" className="text-primary font-semibold">
                        {crypto.rate}
                      </Text>
                    </View>
                    {selectedCrypto === crypto.id && (
                      <CheckCircle2 size={28} color={colors.primary} />
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Wallet Connection Info */}
        {selectedCrypto && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <View className="bg-card rounded-2xl p-4 border border-border">
              <Text variant="callout" className="font-semibold mb-3">
                How it works
              </Text>
              <View className="gap-3">
                <View className="flex-row gap-3">
                  <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                    <Text variant="caption2" className="text-white font-bold">
                      1
                    </Text>
                  </View>
                  <Text variant="subhead" className="flex-1 text-muted-foreground">
                    Connect your crypto wallet or send to our address
                  </Text>
                </View>
                <View className="flex-row gap-3">
                  <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                    <Text variant="caption2" className="text-white font-bold">
                      2
                    </Text>
                  </View>
                  <Text variant="subhead" className="flex-1 text-muted-foreground">
                    We convert your crypto to KHR at market rate
                  </Text>
                </View>
                <View className="flex-row gap-3">
                  <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                    <Text variant="caption2" className="text-white font-bold">
                      3
                    </Text>
                  </View>
                  <Text variant="subhead" className="flex-1 text-muted-foreground">
                    Funds credited to your Bitriel wallet instantly
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View
        style={{ paddingBottom: insets.bottom + 16 }}
        className="px-6 pt-4 border-t border-border"
      >
        <Button
          onPress={handleContinue}
          disabled={!selectedCrypto}
          className={`${!selectedCrypto ? 'opacity-50' : ''} bg-primary`}
        >
          <Text className="text-primary-foreground font-semibold text-base">
            Continue to Payment
          </Text>
        </Button>
      </View>
    </View>
  );
}
