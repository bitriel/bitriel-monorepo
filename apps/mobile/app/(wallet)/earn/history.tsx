import * as React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { ChevronLeft, Inbox } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';

const EARN_HISTORY = [
  {
    id: '1',
    type: 'cashback',
    merchant: 'Khmer Kitchen',
    amount: 12500,
    date: '2024-11-03',
    status: 'pending',
    icon: '🍴',
    color: '#FF9500',
  },
  {
    id: '2',
    type: 'savings',
    merchant: 'Savings Interest',
    amount: 4200,
    date: '2024-11-01',
    status: 'credited',
    icon: '💰',
    color: '#0385FF',
  },
  {
    id: '3',
    type: 'cashback',
    merchant: 'Angkor Market',
    amount: 8400,
    date: '2024-11-02',
    status: 'credited',
    icon: '🛒',
    color: '#FF3B57',
  },
  {
    id: '4',
    type: 'cashback',
    merchant: 'Smile Tours',
    amount: 18000,
    date: '2024-11-01',
    status: 'credited',
    icon: '🎫',
    color: '#0385FF',
  },
  {
    id: '5',
    type: 'referral',
    merchant: 'Referral Bonus',
    amount: 50000,
    date: '2024-10-30',
    status: 'credited',
    icon: '🎁',
    color: '#8E44AD',
  },
  {
    id: '6',
    type: 'savings',
    merchant: 'Savings Interest',
    amount: 4200,
    date: '2024-10-01',
    status: 'credited',
    icon: '💰',
    color: '#0385FF',
  },
];

export default function EarnHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDarkColorScheme } = useColorScheme();
  const [filter, setFilter] = React.useState<'all' | 'cashback' | 'savings'>('all');

  const filteredHistory =
    filter === 'all' ? EARN_HISTORY : EARN_HISTORY.filter((h) => h.type === filter);

  const totalEarned = EARN_HISTORY.reduce((sum, h) => sum + h.amount, 0);
  const totalEarnedUSD = totalEarned / 4050;

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: isDarkColorScheme ? '#000000' : '#FFFFFF' }}
    >
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="px-6 pb-4 border-b border-border">
        <View className="flex-row items-center justify-between mb-4">
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
            Earn History
          </Text>
          <View className="w-7" />
        </View>

        {/* Filter Tabs */}
        <View className="flex-row gap-2">
          <FilterTab
            label="All"
            isActive={filter === 'all'}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFilter('all');
            }}
            isDarkColorScheme={isDarkColorScheme}
          />
          <FilterTab
            label="Cashback"
            isActive={filter === 'cashback'}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFilter('cashback');
            }}
            isDarkColorScheme={isDarkColorScheme}
          />
          <FilterTab
            label="Savings"
            isActive={filter === 'savings'}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFilter('savings');
            }}
            isDarkColorScheme={isDarkColorScheme}
          />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Summary */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-6">
          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text variant="subhead" className="text-muted-foreground mb-1">
                  Total Earned
                </Text>
                <View className="flex-row items-baseline gap-2">
                  <Text variant="title2" className="font-bold">
                    {totalEarned.toLocaleString('en-US')}
                  </Text>
                  <Text variant="title3" className="font-semibold text-muted-foreground">
                    KHR
                  </Text>
                </View>
                <Text variant="caption1" className="text-muted-foreground mt-0.5">
                  ≈ ${totalEarnedUSD.toFixed(2)} USD
                </Text>
              </View>
              <View className="items-center">
                <Text variant="caption1" className="text-muted-foreground mb-1">
                  Transactions
                </Text>
                <Text variant="title2" className="font-bold text-green-500">
                  {EARN_HISTORY.length}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* History List */}
        <View className="gap-3">
          {filteredHistory.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(200 + index * 50).duration(400)}
            >
              <EarnHistoryItem item={item} isDarkColorScheme={isDarkColorScheme} />
            </Animated.View>
          ))}
        </View>

        {filteredHistory.length === 0 && (
          <View className="items-center py-12">
            <Inbox size={48} color={colors.mutedForeground} />
            <Text variant="title3" className="font-semibold mb-1">
              No earnings yet
            </Text>
            <Text variant="subhead" className="text-muted-foreground text-center">
              Start shopping at loyalty merchants to earn cashback
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function FilterTab({
  label,
  isActive,
  onPress,
  isDarkColorScheme,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  isDarkColorScheme: boolean;
}) {
  return (
    <Pressable onPress={onPress} className="active:opacity-70">
      <View
        className="px-4 py-2 rounded-full"
        style={{
          backgroundColor: isActive
            ? isDarkColorScheme
              ? '#0385FF'
              : '#0385FF'
            : isDarkColorScheme
              ? '#1C1C1E'
              : '#F9F9F9',
          borderWidth: 1,
          borderColor: isActive ? '#0385FF' : isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
        }}
      >
        <Text
          variant="callout"
          className={`font-semibold ${isActive ? 'text-white' : 'text-muted-foreground'}`}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function EarnHistoryItem({
  item,
  isDarkColorScheme,
}: {
  item: (typeof EARN_HISTORY)[number];
  isDarkColorScheme: boolean;
}) {
  const amountUSD = item.amount / 4050;

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
          style={{ backgroundColor: item.color }}
          className="w-12 h-12 rounded-full items-center justify-center"
        >
          <Text className="text-2xl">{item.icon}</Text>
        </View>
        <View className="flex-1">
          <Text variant="callout" className="font-semibold mb-0.5">
            {item.merchant}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text variant="caption1" className="text-muted-foreground">
              {new Date(item.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
            <View
              className="rounded-full px-2 py-0.5"
              style={{
                backgroundColor:
                  item.status === 'credited'
                    ? isDarkColorScheme
                      ? 'rgba(0, 200, 83, 0.15)'
                      : 'rgba(0, 200, 83, 0.1)'
                    : isDarkColorScheme
                      ? 'rgba(255, 149, 0, 0.15)'
                      : 'rgba(255, 149, 0, 0.1)',
              }}
            >
              <Text
                variant="caption2"
                className={`font-semibold ${item.status === 'credited' ? 'text-green-500' : 'text-orange-500'}`}
              >
                {item.status === 'credited' ? 'Credited' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>
        <View className="items-end">
          <Text variant="callout" className="font-bold text-green-500">
            +{item.amount.toLocaleString('en-US')} KHR
          </Text>
          <Text variant="caption2" className="text-muted-foreground">
            ${amountUSD.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

