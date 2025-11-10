import * as React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { ChevronLeft, Clock, Star, CreditCard, TrendingUp, Star as StarIcon, Building2, Gift, Store } from 'lucide-react-native';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';

export default function EarnScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDarkColorScheme } = useColorScheme();

  // Mock data
  const totalEarned = 124500; // KHR
  const totalEarnedUSD = totalEarned / 4050;
  const savingsBalance = 850000; // KHR
  const savingsBalanceUSD = savingsBalance / 4050;
  const currentCashback = 45000; // KHR pending
  const currentCashbackUSD = currentCashback / 4050;

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
            Earn & Save
          </Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(wallet)/earn/history');
            }}
            className="active:opacity-70"
          >
            <Clock size={24} color={colors.foreground} />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Total Earned Card */}
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
                  Total Earned (Lifetime)
                </Text>
                <View className="flex-row items-baseline gap-2">
                  <Text variant="largeTitle" className="font-bold text-4xl">
                    {totalEarned.toLocaleString('en-US')}
                  </Text>
                  <Text variant="title2" className="font-semibold text-muted-foreground">
                    KHR
                  </Text>
                </View>
                <Text variant="caption1" className="text-muted-foreground mt-1">
                  ≈ ${totalEarnedUSD.toFixed(2)} USD
                </Text>
              </View>
              <View className="w-16 h-16 rounded-full bg-green-500/10 items-center justify-center">
                <Star size={32} color="#22c55e" />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Quick Stats */}
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
                Pending Cashback
              </Text>
              <Text variant="title3" className="font-bold">
                {currentCashback.toLocaleString('en-US')} KHR
              </Text>
              <Text variant="caption2" className="text-green-500 font-semibold mt-1">
                ${currentCashbackUSD.toFixed(2)}
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
                Savings Balance
              </Text>
              <Text variant="title3" className="font-bold">
                {savingsBalance.toLocaleString('en-US')} KHR
              </Text>
              <Text variant="caption2" className="text-primary font-semibold mt-1">
                ${savingsBalanceUSD.toFixed(2)}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Earn Features */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-8">
          <Text variant="title3" className="font-semibold mb-4">
            How to Earn
          </Text>

          <View className="gap-3">
            <EarnFeatureCard
              icon={CreditCard}
              iconColor="#00C853"
              title="Cashback Rewards"
              description="Get up to 5% back on every purchase"
              badge="Up to 5%"
              isDarkColorScheme={isDarkColorScheme}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(wallet)/earn/cashback');
              }}
            />

            <EarnFeatureCard
              icon={TrendingUp}
              iconColor="#0385FF"
              title="Savings Account"
              description="Earn 6.01% APY on your savings"
              badge="6.01% APY"
              isDarkColorScheme={isDarkColorScheme}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(wallet)/earn/savings');
              }}
            />

            <EarnFeatureCard
              icon={StarIcon}
              iconColor="#FFD700"
              title="Loyalty Points"
              description="Swap & use points across merchants"
              badge="58 pts"
              isDarkColorScheme={isDarkColorScheme}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(wallet)/earn/points' as any);
              }}
            />

            <EarnFeatureCard
              icon={Building2}
              iconColor="#FF9500"
              title="Loyalty Merchants"
              description="Shop at partner merchants for extra rewards"
              badge="Bonus Rewards"
              isDarkColorScheme={isDarkColorScheme}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(wallet)/earn/merchants');
              }}
            />

            <EarnFeatureCard
              icon={Gift}
              iconColor="#8E44AD"
              title="Referral Bonus"
              description="Invite friends and earn together"
              badge="50,000 KHR per referral"
              isDarkColorScheme={isDarkColorScheme}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
          </View>
        </Animated.View>

        {/* Cashback Tiers */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Text variant="title3" className="font-semibold mb-4">
            Cashback Tiers
          </Text>

          <View
            className="rounded-3xl p-5"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <CashbackTier
              category="🍴 Dining"
              percentage="5%"
              description="Restaurants & Cafes"
              isLast={false}
            />
            <CashbackTier
              category="🛒 Shopping"
              percentage="3%"
              description="Retail & Markets"
              isLast={false}
            />
            <CashbackTier
              category="🎫 Entertainment"
              percentage="4%"
              description="Tours & Attractions"
              isLast={false}
            />
            <CashbackTier
              category="🚗 Transport"
              percentage="2%"
              description="Rides & Travel"
              isLast={false}
            />
            <CashbackTier
              category="💰 All Others"
              percentage="1%"
              description="General Purchases"
              isLast={true}
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
            Browse Loyalty Merchants
          </Text>
        </Button>
      </View>
    </View>
  );
}

function EarnFeatureCard({
  icon,
  iconColor,
  title,
  description,
  badge,
  isDarkColorScheme,
  onPress,
}: {
  icon: React.ComponentType<{ size: number; color: string }>;
  iconColor: string;
  title: string;
  description: string;
  badge: string;
  isDarkColorScheme: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="active:opacity-70">
      <View
        className="rounded-2xl p-4"
        style={{
          backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
          borderWidth: 1,
          borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
        }}
      >
        <View className="flex-row items-center gap-4">
          <View
            style={{ backgroundColor: iconColor }}
            className="w-12 h-12 rounded-xl items-center justify-center"
          >
            {React.createElement(icon, { size: 24, color: '#FFFFFF' })}
          </View>
          <View className="flex-1">
            <Text variant="callout" className="font-semibold mb-0.5">
              {title}
            </Text>
            <Text variant="caption1" className="text-muted-foreground">
              {description}
            </Text>
          </View>
          <View className="bg-green-500/10 rounded-full px-3 py-1.5">
            <Text variant="caption2" className="text-green-500 font-semibold">
              {badge}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function CashbackTier({
  category,
  percentage,
  description,
  isLast,
}: {
  category: string;
  percentage: string;
  description: string;
  isLast: boolean;
}) {
  return (
    <View className={`py-3 ${!isLast ? 'border-b border-border' : ''}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text variant="callout" className="font-semibold mb-0.5">
            {category}
          </Text>
          <Text variant="caption1" className="text-muted-foreground">
            {description}
          </Text>
        </View>
        <Text variant="title3" className="font-bold text-green-500">
          {percentage}
        </Text>
      </View>
    </View>
  );
}

