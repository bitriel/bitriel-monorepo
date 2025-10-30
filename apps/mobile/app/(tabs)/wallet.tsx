import * as React from 'react';
import { View, ScrollView, Pressable, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Icon } from '@/components/nativewindui/Icon';
import { Text } from '@/components/nativewindui/Text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/nativewindui/Avatar';
import { useColorScheme } from '@/lib/useColorScheme';

type AssetItem = {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  balance: string;
  balanceUSD: string;
  price: string;
  changePercent: string;
  changeDirection: 'up' | 'down';
};

const MOCK_ASSETS: AssetItem[] = [
  {
    id: '1',
    name: 'USDT',
    symbol: 'USDT',
    icon: '💵',
    balance: '1723.56',
    balanceUSD: '$1723.56',
    price: '$0.99',
    changePercent: '0.001%',
    changeDirection: 'up',
  },
  {
    id: '2',
    name: 'SOL',
    symbol: 'SOL',
    icon: '🌊',
    balance: '9.83',
    balanceUSD: '$2401.89',
    price: '$146.76',
    changePercent: '6.2%',
    changeDirection: 'down',
  },
  {
    id: '3',
    name: 'Ton',
    symbol: 'TON',
    icon: '💎',
    balance: '220',
    balanceUSD: '$1586.24',
    price: '$146.76',
    changePercent: '4.01%',
    changeDirection: 'down',
  },
  {
    id: '4',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '⟠',
    balance: '0.23',
    balanceUSD: '$2123.78',
    price: '0 ETH',
    changePercent: '4.01%',
    changeDirection: 'up',
  },
  {
    id: '5',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '₿',
    balance: '0.0207',
    balanceUSD: '$1005.81',
    price: '0 ETH',
    changePercent: '4.01%',
    changeDirection: 'down',
  },
];

type ActionButton = {
  id: string;
  label: string;
  iconName: any; // Allow any icon name for flexibility
  onPress: () => void;
};

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDarkColorScheme } = useColorScheme();

  const actionButtons: ActionButton[] = [
    {
      id: 'buy',
      label: 'Buy',
      iconName: 'plus',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log('Buy pressed');
      },
    },
    {
      id: 'send',
      label: 'Send',
      iconName: 'arrow.up',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/(routes)/send/SOL' as any);
      },
    },
    {
      id: 'exchange',
      label: 'Exchange',
      iconName: 'repeat',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log('Exchange pressed');
      },
    },
    {
      id: 'receive',
      label: 'Receive',
      iconName: 'arrow.down',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/(routes)/receive' as any);
      },
    },
    {
      id: 'withdraw',
      label: 'Withdraw',
      iconName: 'bank.building',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log('Withdraw pressed');
      },
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkColorScheme ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: colors.root,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
              <View
                className="size-7 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.root }}
              >
                <View className="size-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
              </View>
            </View>
            <Text className="text-base font-medium">ifeanyiachi.nimbus.com</Text>
            <Icon name="chevron.down" size={16} color={colors.foreground} />
          </View>
          <View className="flex-row gap-3">
            <Pressable
              className="size-10 items-center justify-center rounded-full active:opacity-70"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Icon name="qrcode" size={24} color={colors.foreground} />
            </Pressable>
            <Pressable
              className="size-10 items-center justify-center rounded-full active:opacity-70"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Icon name="headphones" size={24} color={colors.foreground} />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* Balance Section */}
        <View className="px-5 py-6">
          <Text className="mb-2 text-sm opacity-60">Total asset balance</Text>
          <Text className="mb-6 text-5xl font-bold">$8,840.28</Text>

          {/* Action Buttons */}
          <View className="flex-row justify-between">
            {actionButtons.map((button) => (
              <Pressable
                key={button.id}
                onPress={button.onPress}
                className="items-center gap-2 active:opacity-70"
              >
                <View
                  className="size-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors.grey6 }}
                >
                  <Icon name={button.iconName} size={24} color={colors.foreground} />
                </View>
                <Text className="text-xs font-medium">{button.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* My Assets Section */}
        <View className="px-5">
          <Text className="mb-4 text-2xl font-semibold">My assets</Text>

          {/* Assets List */}
          <View className="gap-3">
            {MOCK_ASSETS.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </View>

          {/* Manage Assets Button */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            className="mt-6 flex-row items-center justify-center gap-2 rounded-2xl py-4 active:opacity-70"
            style={{ backgroundColor: colors.grey6 }}
          >
            <Icon name="plus" size={20} color={colors.foreground} />
            <Text className="text-base font-medium">Manage assets</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function AssetCard({ asset }: { asset: AssetItem }) {
  const { colors } = useColorScheme();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/(routes)/send/${asset.symbol}` as any);
      }}
      className="flex-row items-center justify-between rounded-2xl p-4 active:opacity-70"
      style={{ backgroundColor: colors.card }}
    >
      <View className="flex-row items-center gap-3">
        {/* Asset Icon */}
        <View
          className="size-12 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.grey6 }}
        >
          <Text className="text-2xl">{asset.icon}</Text>
        </View>

        {/* Asset Info */}
        <View className="gap-1">
          <Text className="text-base font-semibold">{asset.name}</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm opacity-60">{asset.price}</Text>
            <Text
              className="text-xs font-medium"
              style={{
                color: asset.changeDirection === 'up' ? '#10B981' : '#EF4444',
              }}
            >
              {asset.changePercent}
            </Text>
          </View>
        </View>
      </View>

      {/* Balance */}
      <View className="items-end gap-1">
        <Text className="text-base font-semibold">{asset.balanceUSD}</Text>
        <Text className="text-sm opacity-60">{asset.balance}</Text>
      </View>
    </Pressable>
  );
}
