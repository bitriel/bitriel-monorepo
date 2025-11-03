import * as React from 'react';
import { ScrollView, View, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { Icon } from '@/components/nativewindui/Icon';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';

// Mock data
const MERCHANT_POINTS = [
  {
    id: '1',
    merchantName: 'Brown Coffee',
    merchantLogo: '☕',
    points: 20,
    pointValue: 1, // 1 point = $1
    category: 'Food & Beverage',
    color: '#8B4513',
  },
  {
    id: '2',
    merchantName: 'Zando Fashion',
    merchantLogo: '👔',
    points: 10,
    pointValue: 1,
    category: 'Fashion & Apparel',
    color: '#E91E63',
  },
  {
    id: '3',
    merchantName: 'Lucky Supermarket',
    merchantLogo: '🛒',
    points: 15,
    pointValue: 1,
    category: 'Retail',
    color: '#4CAF50',
  },
  {
    id: '4',
    merchantName: 'Angkor Petroleum',
    merchantLogo: '⛽',
    points: 8,
    pointValue: 1,
    category: 'Fuel & Transport',
    color: '#FF5722',
  },
  {
    id: '5',
    merchantName: 'Cinema Star',
    merchantLogo: '🎬',
    points: 5,
    pointValue: 1,
    category: 'Entertainment',
    color: '#9C27B0',
  },
];

export default function PointsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDarkColorScheme } = useColorScheme();

  const totalPoints = MERCHANT_POINTS.reduce((sum, merchant) => sum + merchant.points, 0);
  const totalValue = MERCHANT_POINTS.reduce(
    (sum, merchant) => sum + merchant.points * merchant.pointValue,
    0
  );

  // Currency balances for reference
  const walletBalance = {
    khr: 50420000,
    usdt: 245.50,
  };

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
            <Icon name="chevron.left" size={28} color={colors.foreground} />
          </Pressable>
          <Text variant="title3" className="font-semibold">
            Loyalty Points
          </Text>
          <View className="w-7" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Total Points Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-6">
          <View
            className="rounded-3xl p-6"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <View className="items-center">
              <Text variant="subhead" className="text-muted-foreground mb-2">
                Total Loyalty Points
              </Text>
              <Text variant="largeTitle" className="font-bold text-5xl mb-1">
                {totalPoints.toLocaleString()}
              </Text>
              <Text variant="title3" className="text-muted-foreground">
                ≈ {(totalValue * 4100).toLocaleString()} KHR (${totalValue})
              </Text>
            </View>

            <View className="flex-row gap-3 mt-6">
              <Button
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/(wallet)/earn/swap-points' as any);
                }}
                className="flex-1 bg-primary"
              >
                <Icon name="arrow.left.arrow.right" size={18} color="#FFFFFF" />
                <Text className="text-primary-foreground font-semibold">Swap Points</Text>
              </Button>
              <Button
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // Navigate to history
                }}
                className="flex-1"
                variant="secondary"
              >
                <Icon name="clock.fill" size={18} />
                <Text className="font-semibold">History</Text>
              </Button>
            </View>
          </View>
        </Animated.View>

        {/* Wallet Balance Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-6">
          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor: isDarkColorScheme
                ? 'rgba(0, 200, 83, 0.1)'
                : 'rgba(0, 200, 83, 0.05)',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#00C85340' : '#00C85320',
            }}
          >
            <Text variant="callout" className="font-semibold mb-3">
              Available for Conversion
            </Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text variant="subhead" className="text-muted-foreground">
                  Wallet Balance (KHR)
                </Text>
                <Text variant="subhead" className="font-semibold">
                  {walletBalance.khr.toLocaleString()} KHR
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text variant="subhead" className="text-muted-foreground">
                  Tether (USDT)
                </Text>
                <Text variant="subhead" className="font-semibold">
                  ${walletBalance.usdt.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Info Banner */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)} className="mb-6">
          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor: isDarkColorScheme
                ? 'rgba(3, 133, 255, 0.1)'
                : 'rgba(3, 133, 255, 0.05)',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#0385FF40' : '#0385FF20',
            }}
          >
            <View className="flex-row gap-3">
              <Icon name="info.circle.fill" size={20} className="text-blue-500 mt-0.5" />
              <View className="flex-1">
                <Text variant="callout" className="font-semibold mb-1">
                  Swap Points ⇄ Cash
                </Text>
                <Text variant="caption1" className="text-muted-foreground">
                  Exchange points between merchants, convert to cash (KHR, USDT, USD), or buy points with your wallet balance
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Merchant Points List */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Text variant="title3" className="font-semibold mb-4">
            Your Merchant Points
          </Text>

          <View className="gap-3">
            {MERCHANT_POINTS.map((merchant, index) => (
              <MerchantPointCard
                key={merchant.id}
                merchant={merchant}
                isDarkColorScheme={isDarkColorScheme}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // Could navigate to merchant detail
                }}
              />
            ))}
          </View>
        </Animated.View>

        {/* How It Works Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} className="mt-8 mb-4">
          <Text variant="title3" className="font-semibold mb-4">
            How Points Work
          </Text>

          <View className="gap-3">
            <InfoItem
              icon="star.fill"
              iconColor="#FFD700"
              title="Earn Points"
              description="Get loyalty points with every purchase at participating merchants"
              isDarkColorScheme={isDarkColorScheme}
            />
            <InfoItem
              icon="arrow.left.arrow.right"
              iconColor="#0385FF"
              title="Swap Points"
              description="Exchange points between merchants or convert to/from cash (KHR, USDT, USD)"
              isDarkColorScheme={isDarkColorScheme}
            />
            <InfoItem
              icon="creditcard.fill"
              iconColor="#00C853"
              title="Pay with Points"
              description="Use points to pay for purchases at any loyalty merchant"
              isDarkColorScheme={isDarkColorScheme}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function MerchantPointCard({
  merchant,
  isDarkColorScheme,
  onPress,
}: {
  merchant: (typeof MERCHANT_POINTS)[0];
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
        <View className="flex-row items-center">
          {/* Merchant Logo */}
          <View
            style={{ backgroundColor: merchant.color }}
            className="w-14 h-14 rounded-2xl items-center justify-center"
          >
            <Text style={{ fontSize: 28 }}>{merchant.merchantLogo}</Text>
          </View>

          {/* Merchant Info */}
          <View className="flex-1 ml-3">
            <Text variant="callout" className="font-semibold mb-0.5">
              {merchant.merchantName}
            </Text>
            <Text variant="caption1" className="text-muted-foreground">
              {merchant.category}
            </Text>
          </View>

          {/* Points */}
          <View className="items-end">
            <Text variant="title3" className="font-bold">
              {merchant.points.toLocaleString()}
            </Text>
            <Text variant="caption1" className="text-muted-foreground">
              pts · ${merchant.points * merchant.pointValue}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function InfoItem({
  icon,
  iconColor,
  title,
  description,
  isDarkColorScheme,
}: {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  isDarkColorScheme: boolean;
}) {
  return (
    <View className="flex-row gap-3">
      <View
        style={{ backgroundColor: iconColor }}
        className="w-10 h-10 rounded-full items-center justify-center flex-shrink-0"
      >
        <Icon name={icon as any} size={18} color="#FFFFFF" />
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

