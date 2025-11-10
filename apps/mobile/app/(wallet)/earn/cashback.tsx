import * as React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { ChevronLeft, Clock, Store } from 'lucide-react-native';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';

const RECENT_CASHBACK = [
  {
    id: '1',
    merchant: 'Khmer Kitchen',
    amount: 12500,
    percentage: '5%',
    date: '2024-11-03',
    icon: '🍴',
    color: '#FF9500',
  },
  {
    id: '2',
    merchant: 'Angkor Market',
    amount: 8400,
    percentage: '3%',
    date: '2024-11-02',
    icon: '🛒',
    color: '#FF3B57',
  },
  {
    id: '3',
    merchant: 'Smile Tours',
    amount: 18000,
    percentage: '4%',
    date: '2024-11-01',
    icon: '🎫',
    color: '#0385FF',
  },
  {
    id: '4',
    merchant: 'Royal Coffee',
    amount: 5600,
    percentage: '5%',
    date: '2024-10-31',
    icon: '☕',
    color: '#FF9500',
  },
];

export default function CashbackScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDarkColorScheme } = useColorScheme();

  const pendingCashback = 45000; // KHR
  const pendingCashbackUSD = pendingCashback / 4050;
  const totalEarned = 124500;
  const totalEarnedUSD = totalEarned / 4050;

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: isDarkColorScheme ? '#000000' : '#FFFFFF' }}
    >
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
            Cashback Rewards
          </Text>
          <View className="w-7" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Pending Cashback */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-6">
          <View
            className="rounded-3xl p-6"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text variant="subhead" className="text-muted-foreground mb-2">
                  Pending Cashback
                </Text>
                <View className="flex-row items-baseline gap-2">
                  <Text variant="largeTitle" className="font-bold text-4xl">
                    {pendingCashback.toLocaleString('en-US')}
                  </Text>
                  <Text variant="title2" className="font-semibold text-muted-foreground">
                    KHR
                  </Text>
                </View>
                <Text variant="caption1" className="text-muted-foreground mt-1">
                  ≈ ${pendingCashbackUSD.toFixed(2)} USD
                </Text>
              </View>
              <View className="w-16 h-16 rounded-full bg-green-500/10 items-center justify-center">
                <Clock size={32} color="#22c55e" />
              </View>
            </View>
            <View
              className="rounded-2xl p-3"
              style={{
                backgroundColor: isDarkColorScheme
                  ? 'rgba(0, 200, 83, 0.1)'
                  : 'rgba(0, 200, 83, 0.05)',
              }}
            >
              <Text variant="caption1" className="text-green-500 text-center">
                Will be credited to your wallet in 3-5 business days
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-8">
          <View className="flex-row gap-3">
            <View
              className="flex-1 rounded-2xl p-4"
              style={{
                backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
                borderWidth: 1,
                borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
              }}
            >
              <Text variant="caption1" className="text-muted-foreground mb-1">
                Total Earned
              </Text>
              <Text variant="title3" className="font-bold">
                {totalEarned.toLocaleString('en-US')} KHR
              </Text>
              <Text variant="caption2" className="text-green-500 font-semibold mt-1">
                ${totalEarnedUSD.toFixed(2)}
              </Text>
            </View>
            <View
              className="flex-1 rounded-2xl p-4"
              style={{
                backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
                borderWidth: 1,
                borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
              }}
            >
              <Text variant="caption1" className="text-muted-foreground mb-1">
                This Month
              </Text>
              <Text variant="title3" className="font-bold">
                {RECENT_CASHBACK.reduce((sum, cb) => sum + cb.amount, 0).toLocaleString('en-US')} KHR
              </Text>
              <Text variant="caption2" className="text-primary font-semibold mt-1">
                {RECENT_CASHBACK.length} purchases
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Recent Cashback */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-8">
          <Text variant="title3" className="font-semibold mb-4">
            Recent Cashback
          </Text>
          <View className="gap-3">
            {RECENT_CASHBACK.map((cashback) => (
              <CashbackItem
                key={cashback.id}
                cashback={cashback}
                isDarkColorScheme={isDarkColorScheme}
              />
            ))}
          </View>
        </Animated.View>

        {/* How It Works */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Text variant="title3" className="font-semibold mb-4">
            How It Works
          </Text>
          <View
            className="rounded-3xl p-5"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <HowItWorksStep
              number="1"
              title="Shop at Loyalty Merchants"
              description="Make purchases at participating merchants"
            />
            <HowItWorksStep
              number="2"
              title="Earn Automatically"
              description="Cashback is calculated and added to pending"
            />
            <HowItWorksStep
              number="3"
              title="Get Credited"
              description="Receive cashback in your wallet in 3-5 days"
              isLast
            />
          </View>
        </Animated.View>
      </ScrollView>

      {/* CTA Button */}
      <View
        style={{ paddingBottom: insets.bottom + 16 }}
        className="px-6 pt-4 border-t border-border"
      >
        <Button
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/(wallet)/earn/merchants');
          }}
          className="bg-primary"
        >
          <Store size={20} color="#FFFFFF" />
          <Text className="text-primary-foreground font-semibold text-base">
            Find Merchants
          </Text>
        </Button>
      </View>
    </View>
  );
}

function CashbackItem({
  cashback,
  isDarkColorScheme,
}: {
  cashback: (typeof RECENT_CASHBACK)[number];
  isDarkColorScheme: boolean;
}) {
  const amountUSD = cashback.amount / 4050;

  return (
    <View
      className="rounded-2xl p-4"
      style={{
        backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
        borderWidth: 1,
        borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
      }}
    >
      <View className="flex-row items-center gap-3">
        <View
          style={{ backgroundColor: cashback.color }}
          className="w-12 h-12 rounded-full items-center justify-center"
        >
          <Text className="text-2xl">{cashback.icon}</Text>
        </View>
        <View className="flex-1">
          <Text variant="callout" className="font-semibold mb-0.5">
            {cashback.merchant}
          </Text>
          <Text variant="caption1" className="text-muted-foreground">
            {new Date(cashback.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
        <View className="items-end">
          <Text variant="callout" className="font-bold text-green-500">
            +{cashback.amount.toLocaleString('en-US')} KHR
          </Text>
          <Text variant="caption2" className="text-muted-foreground">
            {cashback.percentage} back
          </Text>
        </View>
      </View>
    </View>
  );
}

function HowItWorksStep({
  number,
  title,
  description,
  isLast,
}: {
  number: string;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  return (
    <View className={`flex-row gap-3 ${!isLast ? 'mb-4 pb-4 border-b border-border' : ''}`}>
      <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
        <Text variant="callout" className="text-white font-bold">
          {number}
        </Text>
      </View>
      <View className="flex-1">
        <Text variant="callout" className="font-semibold mb-0.5">
          {title}
        </Text>
        <Text variant="caption1" className="text-muted-foreground">
          {description}
        </Text>
      </View>
    </View>
  );
}

