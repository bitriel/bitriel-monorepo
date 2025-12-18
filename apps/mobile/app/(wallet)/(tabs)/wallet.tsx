import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Wallet as WalletIcon,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  CreditCard,
  ArrowDown,
  Send,
  ArrowLeftRight,
} from 'lucide-react-native';
import { View, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/nativewindui/Text';
import { ExpandableFAB } from '@/components/navigation/ExpandableFAB';
import { usePayment } from '@/context/PaymentContext';
import { useColorScheme } from '@/lib/useColorScheme';

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDarkColorScheme, colors } = useColorScheme();
  const { balance } = usePayment();

  const balanceKHR = balance.khr;
  const balanceUSD = balance.usd;

  const fabActions = [
    {
      icon: ArrowLeftRight,
      label: 'Swap',
      color: '#007AFF',
      onPress: () => router.push('/(wallet)/earn/swap-points'),
    },
    {
      icon: Send,
      label: 'Send',
      color: '#8E44AD',
      onPress: () => router.push('/(wallet)/send'),
    },
    {
      icon: ArrowDown,
      label: 'Receive',
      color: '#FF9500',
      onPress: () => router.push('/(wallet)/receive'),
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top + 16 }} className="px-6 mb-6">
          <Text variant="largeTitle" className="font-bold">
            Wallet
          </Text>
        </View>

        {/* Balance Section */}
        <Animated.View entering={FadeIn.duration(400)} className="px-6 mb-8">
          <View
            className="rounded-3xl p-6"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                <WalletIcon size={24} color="#007AFF" />
              </View>
              <Text variant="title3" className="font-semibold">
                Total Balance
              </Text>
            </View>

            <Text className="text-4xl font-bold mb-1">
              {balanceKHR.toLocaleString('en-US')} KHR
            </Text>
            <Text variant="subhead" className="text-muted-foreground">
              ≈ ${balanceUSD.toFixed(2)} USD
            </Text>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="px-6 mb-8">
          <Text variant="title3" className="font-semibold mb-4">
            Quick Actions
          </Text>
          <View className="flex-row gap-4">
            <QuickActionButton
              icon={ArrowDownCircle}
              label="Receive"
              color="#00C853"
              isDarkColorScheme={isDarkColorScheme}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(wallet)/receive');
              }}
            />
            <QuickActionButton
              icon={ArrowUpCircle}
              label="Send"
              color="#FF9500"
              isDarkColorScheme={isDarkColorScheme}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(wallet)/send');
              }}
            />
            <QuickActionButton
              icon={History}
              label="History"
              color="#8E44AD"
              isDarkColorScheme={isDarkColorScheme}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(wallet)/transactions');
              }}
            />
            <QuickActionButton
              icon={CreditCard}
              label="Cards"
              color="#0385FF"
              isDarkColorScheme={isDarkColorScheme}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(wallet)/my-cards');
              }}
            />
          </View>
        </Animated.View>

        {/* Recent Transactions */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="px-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text variant="title3" className="font-semibold">
              Recent Transactions
            </Text>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(wallet)/transactions');
              }}
              className="active:opacity-70"
            >
              <Text variant="subhead" className="text-primary">
                See All
              </Text>
            </Pressable>
          </View>

          <View
            className="rounded-2xl p-6 items-center"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <History size={48} color={colors.mutedForeground} />
            <Text variant="body" className="text-muted-foreground mt-4 text-center">
              No transactions yet
            </Text>
            <Text variant="caption1" className="text-muted-foreground text-center mt-1">
              Your transaction history will appear here
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Expandable FAB */}
      <ExpandableFAB actions={fabActions} />
    </View>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  color,
  isDarkColorScheme,
  onPress,
}: {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  color: string;
  isDarkColorScheme: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-1 active:opacity-70">
      <View
        className="rounded-2xl p-4 items-center"
        style={{
          backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
          borderWidth: 1,
          borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
        }}
      >
        <View
          style={{ backgroundColor: color }}
          className="w-12 h-12 rounded-full items-center justify-center mb-2"
        >
          <Icon size={24} color="#FFFFFF" />
        </View>
        <Text variant="caption1" className="font-medium">
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
