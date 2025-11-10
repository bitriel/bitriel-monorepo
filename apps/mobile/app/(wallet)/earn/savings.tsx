import * as React from 'react';
import { ScrollView, View, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import {
  ChevronLeft,
  TrendingUp,
  Sparkles,
  Shield,
  ArrowUpDown,
  Calendar,
} from 'lucide-react-native';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';

export default function SavingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDarkColorScheme } = useColorScheme();
  const [depositAmount, setDepositAmount] = React.useState('');

  const savingsBalance = 850000; // KHR
  const savingsBalanceUSD = savingsBalance / 4050;
  const apr = 6.01;
  const monthlyEarnings = (savingsBalance * (apr / 100)) / 12;
  const monthlyEarningsUSD = monthlyEarnings / 4050;

  const depositAmountKHR = depositAmount ? parseFloat(depositAmount) * 4050 : 0;

  return (
    <View className="flex-1" style={{ backgroundColor: isDarkColorScheme ? '#000000' : '#FFFFFF' }}>
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
            Savings Account
          </Text>
          <View className="w-7" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Savings Balance */}
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
                  Savings Balance
                </Text>
                <View className="flex-row items-baseline gap-2">
                  <Text variant="largeTitle" className="font-bold text-4xl">
                    {savingsBalance.toLocaleString('en-US')}
                  </Text>
                  <Text variant="title2" className="font-semibold text-muted-foreground">
                    KHR
                  </Text>
                </View>
                <Text variant="caption1" className="text-muted-foreground mt-1">
                  ≈ ${savingsBalanceUSD.toFixed(2)} USD
                </Text>
              </View>
              <View className="w-16 h-16 rounded-full bg-blue-500/10 items-center justify-center">
                <TrendingUp size={32} color={colors.primary} />
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="subhead" className="text-muted-foreground">
                Monthly Earnings (Est.)
              </Text>
              <Text variant="callout" className="font-bold text-green-500">
                +{monthlyEarnings.toLocaleString('en-US', { maximumFractionDigits: 0 })} KHR
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* APY Badge */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-8">
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
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text variant="title2" className="font-bold text-primary mb-1">
                  {apr}% APY
                </Text>
                <Text variant="caption1" className="text-muted-foreground">
                  Annual Percentage Yield
                </Text>
              </View>
              <Sparkles size={32} color={colors.primary} />
            </View>
          </View>
        </Animated.View>

        {/* Deposit Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-8">
          <Text variant="title3" className="font-semibold mb-4">
            Add to Savings
          </Text>

          <View
            className="rounded-3xl p-6 mb-4"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <Text variant="subhead" className="text-muted-foreground mb-2">
              Amount in USD
            </Text>
            <View className="flex-row items-center">
              <Text variant="largeTitle" className="font-bold text-4xl">
                $
              </Text>
              <TextInput
                value={depositAmount}
                onChangeText={setDepositAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                className="flex-1 text-4xl font-bold ml-2"
                style={{ color: colors.foreground }}
                placeholderTextColor={colors.muted}
              />
            </View>
            {depositAmount && (
              <Text variant="subhead" className="text-muted-foreground mt-3">
                ≈ {depositAmountKHR.toLocaleString('en-US')} KHR
              </Text>
            )}
          </View>

          <Button
            onPress={() => {
              if (!depositAmount) return;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/(wallet)/payment/confirm');
            }}
            disabled={!depositAmount}
            className={`${!depositAmount ? 'opacity-50' : ''} bg-primary`}
          >
            <Text className="text-primary-foreground font-semibold text-base">
              Transfer to Savings
            </Text>
          </Button>
        </Animated.View>

        {/* Benefits */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Text variant="title3" className="font-semibold mb-4">
            Savings Benefits
          </Text>
          <View
            className="rounded-3xl p-5"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <BenefitItem
              icon={TrendingUp}
              title="High APY"
              description="Earn 6.01% annual yield on your savings"
              isLast={false}
            />
            <BenefitItem
              icon={Shield}
              title="Secure & Protected"
              description="Your funds are protected and insured"
              isLast={false}
            />
            <BenefitItem
              icon={ArrowUpDown}
              title="Flexible Withdrawals"
              description="Withdraw anytime with no penalties"
              isLast={false}
            />
            <BenefitItem
              icon={Calendar}
              title="Daily Accrual"
              description="Interest calculated and added daily"
              isLast={true}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function BenefitItem({
  icon,
  title,
  description,
  isLast,
}: {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  description: string;
  isLast: boolean;
}) {
  const { colors } = useColorScheme();

  const IconComponent = icon;
  return (
    <View className={`flex-row gap-3 ${!isLast ? 'mb-4 pb-4 border-b border-border' : ''}`}>
      <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
        <IconComponent size={20} color={colors.primary} />
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
