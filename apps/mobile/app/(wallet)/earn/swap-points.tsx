import * as React from 'react';
import { ScrollView, View, Pressable, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { Icon } from '@/components/nativewindui/Icon';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';

// Mock merchant data
const MERCHANTS = [
  { id: '1', name: 'Brown Coffee', logo: '☕', points: 20, color: '#8B4513', type: 'merchant' as const },
  { id: '2', name: 'Zando Fashion', logo: '👔', points: 10, color: '#E91E63', type: 'merchant' as const },
  { id: '3', name: 'Lucky Supermarket', logo: '🛒', points: 15, color: '#4CAF50', type: 'merchant' as const },
  { id: '4', name: 'Angkor Petroleum', logo: '⛽', points: 8, color: '#FF5722', type: 'merchant' as const },
  { id: '5', name: 'Cinema Star', logo: '🎬', points: 5, color: '#9C27B0', type: 'merchant' as const },
];

// Currency options
const CURRENCIES = [
  { id: 'khr', name: 'Cambodian Riel', symbol: 'KHR', logo: '🇰🇭', balance: 50420000, color: '#0385FF', type: 'currency' as const, rate: 1 }, // 1 point = 1 KHR
  { id: 'khrt', name: 'Riel Token', symbol: 'KHRT', logo: '💎', balance: 12500, color: '#00C853', type: 'currency' as const, rate: 1 }, // 1 point = 1 KHRT
  { id: 'usdt', name: 'Tether USD', symbol: 'USDT', logo: '₮', balance: 245.50, color: '#26A17B', type: 'currency' as const, rate: 0.000247 }, // 1 point = $0.000247 (≈4050 KHR per USD)
  { id: 'usd', name: 'US Dollar', symbol: '$', logo: '💵', balance: 245.50, color: '#85BB65', type: 'currency' as const, rate: 0.000247 }, // 1 point = $0.000247
];

type SwapMode = 'points-to-points' | 'points-to-cash' | 'cash-to-points';
type SwapItem = typeof MERCHANTS[0] | typeof CURRENCIES[0];

export default function SwapPointsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDarkColorScheme } = useColorScheme();

  const [swapMode, setSwapMode] = React.useState<SwapMode>('points-to-points');
  const [fromItem, setFromItem] = React.useState<SwapItem | null>(null);
  const [toItem, setToItem] = React.useState<SwapItem | null>(null);
  const [amount, setAmount] = React.useState('');
  const [showFromPicker, setShowFromPicker] = React.useState(false);
  const [showToPicker, setShowToPicker] = React.useState(false);

  // Calculate exchange rate and receive amount
  const getExchangeRate = () => {
    if (swapMode === 'points-to-points') return 1;
    if (swapMode === 'points-to-cash' && toItem && 'rate' in toItem) {
      return toItem.rate;
    }
    if (swapMode === 'cash-to-points' && fromItem && 'rate' in fromItem) {
      return 1 / fromItem.rate;
    }
    return 1;
  };

  const exchangeRate = getExchangeRate();
  const receiveAmount = amount ? parseFloat(amount) * exchangeRate : 0;

  // Get available options based on mode
  const getFromOptions = (): SwapItem[] => {
    if (swapMode === 'points-to-points' || swapMode === 'points-to-cash') {
      return MERCHANTS;
    }
    return CURRENCIES;
  };

  const getToOptions = (): SwapItem[] => {
    if (swapMode === 'points-to-points') {
      return MERCHANTS.filter(m => m.id !== fromItem?.id);
    }
    if (swapMode === 'points-to-cash') {
      return CURRENCIES;
    }
    return MERCHANTS;
  };

  // Validation
  const canSwap = () => {
    if (!fromItem || !toItem || !amount || parseFloat(amount) <= 0) return false;
    
    if (swapMode === 'points-to-points') {
      return fromItem.id !== toItem.id && parseFloat(amount) <= (fromItem as typeof MERCHANTS[0]).points;
    }
    
    if (swapMode === 'points-to-cash') {
      return parseFloat(amount) <= (fromItem as typeof MERCHANTS[0]).points;
    }
    
    if (swapMode === 'cash-to-points') {
      return parseFloat(amount) <= (fromItem as typeof CURRENCIES[0]).balance;
    }
    
    return false;
  };

  const handleSwap = () => {
    if (!canSwap()) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    let message = '';
    if (swapMode === 'points-to-points') {
      message = `Swapped ${amount} points from ${fromItem?.name} to ${toItem?.name}`;
    } else if (swapMode === 'points-to-cash') {
      message = `Converted ${amount} points to ${receiveAmount.toFixed(2)} ${(toItem as typeof CURRENCIES[0])?.symbol}`;
    } else {
      message = `Converted ${amount} ${(fromItem as typeof CURRENCIES[0])?.symbol} to ${Math.floor(receiveAmount)} points`;
    }
    
    Alert.alert('Swap Successful!', message, [
      { text: 'View Points', onPress: () => router.back() },
      { text: 'Done', style: 'cancel' },
    ]);
  };

  const handleModeChange = (mode: SwapMode) => {
    setSwapMode(mode);
    setFromItem(null);
    setToItem(null);
    setAmount('');
    setShowFromPicker(false);
    setShowToPicker(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
            Swap & Convert
          </Text>
          <View className="w-7" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Swap Mode Selector */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-6">
          <View
            className="rounded-2xl p-1 flex-row"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <ModeTab
              label="Points ⇄ Points"
              isActive={swapMode === 'points-to-points'}
              onPress={() => handleModeChange('points-to-points')}
              isDarkColorScheme={isDarkColorScheme}
            />
            <ModeTab
              label="Points → Cash"
              isActive={swapMode === 'points-to-cash'}
              onPress={() => handleModeChange('points-to-cash')}
              isDarkColorScheme={isDarkColorScheme}
            />
            <ModeTab
              label="Cash → Points"
              isActive={swapMode === 'cash-to-points'}
              onPress={() => handleModeChange('cash-to-points')}
              isDarkColorScheme={isDarkColorScheme}
            />
          </View>
        </Animated.View>

        {/* From Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-4">
          <Text variant="subhead" className="text-muted-foreground mb-3">
            {swapMode === 'cash-to-points' ? 'From Currency' : 'From Merchant'}
          </Text>

          <Pressable
            onPress={() => {
              setShowFromPicker(!showFromPicker);
              setShowToPicker(false);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            className="active:opacity-70"
          >
            <View
              className="rounded-2xl p-4"
              style={{
                backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
                borderWidth: 2,
                borderColor: showFromPicker
                  ? '#0385FF'
                  : isDarkColorScheme
                    ? '#2C2C2E'
                    : '#E5E5EA',
              }}
            >
              {fromItem ? (
                <ItemDisplay item={fromItem} colors={colors} />
              ) : (
                <View className="flex-row items-center justify-between">
                  <Text variant="callout" className="text-muted-foreground">
                    Select {swapMode === 'cash-to-points' ? 'currency' : 'merchant'}
                  </Text>
                  <Icon name="chevron.down" size={20} color={colors.mutedForeground} />
                </View>
              )}
            </View>
          </Pressable>

          {/* From Picker */}
          {showFromPicker && (
            <ItemPicker
              items={getFromOptions()}
              selectedItem={fromItem}
              onSelect={(item) => {
                setFromItem(item);
                setShowFromPicker(false);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              isDarkColorScheme={isDarkColorScheme}
              colors={colors}
            />
          )}
        </Animated.View>

        {/* Swap Direction Button */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="items-center mb-4">
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 2,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <Icon name="arrow.down" size={24} color={colors.primary} />
          </View>
        </Animated.View>

        {/* To Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} className="mb-6">
          <Text variant="subhead" className="text-muted-foreground mb-3">
            {swapMode === 'points-to-cash' ? 'To Currency' : swapMode === 'cash-to-points' ? 'To Merchant' : 'To Merchant'}
          </Text>

          <Pressable
            onPress={() => {
              setShowToPicker(!showToPicker);
              setShowFromPicker(false);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            className="active:opacity-70"
          >
            <View
              className="rounded-2xl p-4"
              style={{
                backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
                borderWidth: 2,
                borderColor: showToPicker
                  ? '#0385FF'
                  : isDarkColorScheme
                    ? '#2C2C2E'
                    : '#E5E5EA',
              }}
            >
              {toItem ? (
                <ItemDisplay item={toItem} colors={colors} />
              ) : (
                <View className="flex-row items-center justify-between">
                  <Text variant="callout" className="text-muted-foreground">
                    Select {swapMode === 'points-to-cash' ? 'currency' : 'merchant'}
                  </Text>
                  <Icon name="chevron.down" size={20} color={colors.mutedForeground} />
                </View>
              )}
            </View>
          </Pressable>

          {/* To Picker */}
          {showToPicker && (
            <ItemPicker
              items={getToOptions()}
              selectedItem={toItem}
              onSelect={(item) => {
                setToItem(item);
                setShowToPicker(false);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              isDarkColorScheme={isDarkColorScheme}
              colors={colors}
            />
          )}
        </Animated.View>

        {/* Amount Input */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)} className="mb-6">
          <Text variant="subhead" className="text-muted-foreground mb-3">
            {swapMode === 'cash-to-points' ? 'Amount to Convert' : 'Points to Swap'}
          </Text>

          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 2,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="numeric"
              className="text-4xl font-bold"
              style={{ color: colors.foreground }}
            />
            {fromItem && (
              <View className="flex-row items-center justify-between mt-2">
                <Text variant="caption1" className="text-muted-foreground">
                  Available: {'points' in fromItem ? fromItem.points : fromItem.balance.toFixed(2)} {swapMode === 'cash-to-points' ? (fromItem as typeof CURRENCIES[0]).symbol : 'pts'}
                </Text>
                <Pressable
                  onPress={() => {
                    const max = 'points' in fromItem ? fromItem.points.toString() : fromItem.balance.toString();
                    setAmount(max);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="active:opacity-70"
                >
                  <Text variant="caption1" className="text-blue-500 font-semibold">
                    Use Max
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Exchange Summary */}
        {fromItem && toItem && amount && parseFloat(amount) > 0 && (
          <Animated.View entering={FadeInDown.delay(600).duration(400)} className="mb-6">
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
              <Text variant="callout" className="font-semibold mb-3">
                Exchange Summary
              </Text>

              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text variant="subhead" className="text-muted-foreground">
                    You send
                  </Text>
                  <Text variant="subhead" className="font-semibold">
                    {amount} {swapMode === 'cash-to-points' ? (fromItem as typeof CURRENCIES[0]).symbol : `pts (${fromItem.name})`}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text variant="subhead" className="text-muted-foreground">
                    Exchange rate
                  </Text>
                  <Text variant="subhead" className="font-semibold">
                    {exchangeRate === 1 ? '1:1' : `1:${exchangeRate.toFixed(6)}`}
                  </Text>
                </View>
                <View className="h-px bg-border my-1" />
                <View className="flex-row justify-between">
                  <Text variant="subhead" className="font-semibold">
                    You receive
                  </Text>
                  <Text variant="subhead" className="font-bold text-blue-500">
                    {swapMode === 'cash-to-points' 
                      ? `${Math.floor(receiveAmount)} pts (${toItem.name})`
                      : swapMode === 'points-to-cash'
                        ? `${receiveAmount.toFixed(6)} ${(toItem as typeof CURRENCIES[0]).symbol}`
                        : `${receiveAmount} pts (${toItem.name})`
                    }
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Info Note */}
        <Animated.View entering={FadeInDown.delay(700).duration(400)}>
          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <View className="flex-row gap-3">
              <Icon name="info.circle" size={20} color={colors.mutedForeground} />
              <View className="flex-1">
                <Text variant="caption1" className="text-muted-foreground">
                  {swapMode === 'points-to-points' 
                    ? 'Points are swapped instantly at a 1:1 ratio. This action cannot be undone.'
                    : swapMode === 'points-to-cash'
                      ? 'Convert points to cash instantly. Exchange rates are based on current market values (1 pt ≈ 1 KHR).'
                      : 'Buy loyalty points with your cash balance. Use points for exclusive merchant rewards and discounts.'
                  }
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Swap Button */}
      <View
        style={{ paddingBottom: insets.bottom + 16 }}
        className="px-6 pt-4 border-t border-border"
      >
        <Button
          onPress={handleSwap}
          disabled={!canSwap()}
          className={canSwap() ? 'bg-primary' : 'bg-muted'}
        >
          <Text
            className={`font-semibold text-base ${canSwap() ? 'text-primary-foreground' : 'text-muted-foreground'}`}
          >
            {!fromItem || !toItem
              ? 'Select Items'
              : !amount || parseFloat(amount) === 0
                ? 'Enter Amount'
                : swapMode === 'points-to-points' && parseFloat(amount) > (fromItem as typeof MERCHANTS[0])?.points
                  ? 'Insufficient Points'
                  : swapMode === 'cash-to-points' && parseFloat(amount) > (fromItem as typeof CURRENCIES[0])?.balance
                    ? 'Insufficient Balance'
                    : swapMode === 'points-to-cash'
                      ? 'Convert to Cash'
                      : swapMode === 'cash-to-points'
                        ? 'Buy Points'
                        : 'Swap Points'}
          </Text>
        </Button>
      </View>
    </View>
  );
}

function ModeTab({
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
    <Pressable onPress={onPress} className="flex-1 active:opacity-70">
      <View
        className="py-2.5 px-3 rounded-xl items-center justify-center"
        style={{
          backgroundColor: isActive
            ? isDarkColorScheme
              ? '#FFFFFF'
              : '#000000'
            : 'transparent',
        }}
      >
        <Text
          variant="caption1"
          className="font-semibold"
          style={{
            color: isActive
              ? isDarkColorScheme
                ? '#000000'
                : '#FFFFFF'
              : isDarkColorScheme
                ? '#8E8E93'
                : '#636366',
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function ItemDisplay({ item, colors }: { item: SwapItem; colors: any }) {
  const isCurrency = 'balance' in item;
  
  return (
    <View className="flex-row items-center">
      <View
        style={{ backgroundColor: item.color }}
        className="w-12 h-12 rounded-xl items-center justify-center"
      >
        <Text style={{ fontSize: 24 }}>{item.logo}</Text>
      </View>
      <View className="flex-1 ml-3">
        <Text variant="callout" className="font-semibold">
          {item.name}
        </Text>
        <Text variant="caption1" className="text-muted-foreground">
          {isCurrency 
            ? `${item.balance.toFixed(2)} ${item.symbol}`
            : `${item.points} points available`
          }
        </Text>
      </View>
      <Icon name="chevron.down" size={20} color={colors.mutedForeground} />
    </View>
  );
}

function ItemPicker({
  items,
  selectedItem,
  onSelect,
  isDarkColorScheme,
  colors,
}: {
  items: SwapItem[];
  selectedItem: SwapItem | null;
  onSelect: (item: SwapItem) => void;
  isDarkColorScheme: boolean;
  colors: any;
}) {
  return (
    <View
      className="mt-2 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
        borderWidth: 1,
        borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
      }}
    >
      {items.map((item, index) => {
        const isCurrency = 'balance' in item;
        
        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item)}
            className="active:opacity-70"
          >
            <View
              className="p-4 flex-row items-center"
              style={{
                borderBottomWidth: index < items.length - 1 ? 1 : 0,
                borderBottomColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
              }}
            >
              <View
                style={{ backgroundColor: item.color }}
                className="w-10 h-10 rounded-lg items-center justify-center"
              >
                <Text style={{ fontSize: 20 }}>{item.logo}</Text>
              </View>
              <View className="flex-1 ml-3">
                <Text variant="callout" className="font-semibold">
                  {item.name}
                </Text>
                <Text variant="caption1" className="text-muted-foreground">
                  {isCurrency 
                    ? `${item.balance.toFixed(2)} ${item.symbol}`
                    : `${item.points} pts`
                  }
                </Text>
              </View>
              {selectedItem?.id === item.id && (
                <Icon name="checkmark.circle.fill" size={24} className="text-blue-500" />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
