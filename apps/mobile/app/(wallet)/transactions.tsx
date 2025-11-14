import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  UtensilsCrossed,
  ArrowDownCircle,
  Ticket,
  ShoppingCart,
  Star,
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/nativewindui/Text';
import { useColorScheme } from '@/lib/useColorScheme';

const TRANSACTIONS = [
  {
    id: '1',
    type: 'payment',
    title: 'Local Restaurant',
    description: 'Thai Street Food',
    amount: -45.32,
    date: '2024-11-03',
    icon: UtensilsCrossed,
    color: '#FF9500',
  },
  {
    id: '2',
    type: 'receive',
    title: 'Received',
    description: 'From John Doe',
    amount: 120.0,
    date: '2024-11-02',
    icon: ArrowDownCircle,
    color: '#00C853',
  },
  {
    id: '3',
    type: 'payment',
    title: 'Tour Booking',
    description: 'City Heritage Walk',
    amount: -89.99,
    date: '2024-11-01',
    icon: Ticket,
    color: '#0385FF',
  },
  {
    id: '4',
    type: 'payment',
    title: 'Shopping',
    description: 'Local Market',
    amount: -23.45,
    date: '2024-10-31',
    icon: ShoppingCart,
    color: '#FF3B57',
  },
  {
    id: '5',
    type: 'earn',
    title: 'Cashback Reward',
    description: 'Monthly rewards',
    amount: 12.5,
    date: '2024-10-30',
    icon: Star,
    color: '#FFD700',
  },
];

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useColorScheme();

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
            Transactions
          </Text>
          <View className="w-7" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        <View className="gap-3">
          {TRANSACTIONS.map((transaction, index) => (
            <Animated.View
              key={transaction.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
              <TransactionCard transaction={transaction} />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function TransactionCard({ transaction }: { transaction: (typeof TRANSACTIONS)[number] }) {
  return (
    <Pressable
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      className="active:opacity-70"
    >
      <View className="bg-card rounded-2xl p-4 border border-border shadow-sm flex-row items-center gap-4">
        <View
          style={{ backgroundColor: transaction.color }}
          className="w-12 h-12 rounded-full items-center justify-center"
        >
          <transaction.icon size={24} color="#FFFFFF" />
        </View>
        <View className="flex-1">
          <Text variant="callout" className="font-semibold mb-0.5">
            {transaction.title}
          </Text>
          <Text variant="caption1" className="text-muted-foreground">
            {transaction.description}
          </Text>
          <Text variant="caption2" className="text-muted-foreground mt-1">
            {new Date(transaction.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
        <Text
          variant="callout"
          className={`font-semibold ${transaction.amount > 0 ? 'text-green-500' : 'text-foreground'}`}
        >
          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
}
