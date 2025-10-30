import * as React from 'react';
import { View, Pressable, StatusBar, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Icon } from '@/components/nativewindui/Icon';
import { Text } from '@/components/nativewindui/Text';
import { useColorScheme } from '@/lib/useColorScheme';

const NUMPAD_BUTTONS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'backspace'],
];

export default function SendAmountScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDarkColorScheme } = useColorScheme();

  const asset = (params.asset as string) || 'SOL';
  const address = params.address as string;
  const recipientName = params.recipientName as string;

  const [amount, setAmount] = React.useState('10');
  const [usdValue, setUsdValue] = React.useState('1385.2');

  // Mock balance - should come from wallet state
  const availableBalance = '329.27';
  const solPrice = 138.52; // USD per SOL

  const handleNumberPress = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (value === 'backspace') {
      setAmount((prev) => {
        const newAmount = prev.slice(0, -1) || '0';
        updateUsdValue(newAmount);
        return newAmount;
      });
    } else if (value === '.') {
      if (!amount.includes('.')) {
        const newAmount = amount + '.';
        setAmount(newAmount);
        updateUsdValue(newAmount);
      }
    } else {
      setAmount((prev) => {
        const newAmount = prev === '0' ? value : prev + value;
        updateUsdValue(newAmount);
        return newAmount;
      });
    }
  };

  const updateUsdValue = (solAmount: string) => {
    const numericAmount = parseFloat(solAmount);
    if (!isNaN(numericAmount)) {
      const usd = (numericAmount * solPrice).toFixed(1);
      setUsdValue(usd);
    }
  };

  const handleMax = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAmount(availableBalance);
    updateUsdValue(availableBalance);
  };

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/(routes)/send/review' as any,
      params: { asset, address, recipientName, amount, usdValue },
    });
  };

  const handleSwapCurrency = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement currency swap (SOL <-> USD)
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkColorScheme ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 16,
          backgroundColor: colors.root,
        }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            className="size-10 items-center justify-center active:opacity-70"
          >
            <Icon name="chevron.left" size={24} color={colors.foreground} />
          </Pressable>
          <Text className="text-lg font-semibold">Send {asset}</Text>
          <View className="size-10" />
        </View>
      </View>

      {/* Recipient Info */}
      <View className="px-5 pt-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-sm opacity-60">To</Text>
          <View
            className="flex-row items-center gap-2 rounded-full px-3 py-1"
            style={{ backgroundColor: colors.grey6 }}
          >
            <Icon name="person.fill" size={12} color={colors.foreground} />
            <Text className="text-xs">{recipientName}</Text>
          </View>
        </View>
      </View>

      {/* Balance Info */}
      <View className="flex-row items-center justify-between px-5 pt-3">
        <Text className="text-sm opacity-60">
          Available balance{'\n'}
          <Text className="text-sm opacity-60">
            {availableBalance} {asset}
          </Text>
        </Text>
        <Pressable
          onPress={handleMax}
          className="rounded-lg px-3 py-1 active:opacity-70"
          style={{ backgroundColor: '#FF8A3D' }}
        >
          <Text className="text-sm font-semibold text-white">Max</Text>
        </Pressable>
      </View>

      {/* Amount Display */}
      <View className="flex-1 items-center justify-center px-5">
        <View className="items-center gap-2">
          <Text className="text-6xl font-bold">
            {amount} {asset}
          </Text>
          <Text className="text-3xl opacity-60">${usdValue}</Text>
        </View>

        {/* Swap Currency Button */}
        <Pressable
          onPress={handleSwapCurrency}
          className="mt-6 size-10 items-center justify-center rounded-full active:opacity-70"
          style={{ backgroundColor: colors.grey6 }}
        >
          <Icon name="repeat" size={20} color={colors.foreground} />
        </Pressable>
      </View>

      {/* Numpad */}
      <View className="px-5 pb-6" style={{ paddingBottom: insets.bottom + 24 }}>
        <View className="gap-3">
          {NUMPAD_BUTTONS.map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-3">
              {row.map((button) => (
                <Pressable
                  key={button}
                  onPress={() => handleNumberPress(button)}
                  className="flex-1 items-center justify-center rounded-2xl py-4 active:opacity-70"
                  style={{ backgroundColor: colors.grey6 }}
                >
                  {button === 'backspace' ? (
                    <Icon name="delete.left" size={28} color={colors.foreground} />
                  ) : (
                    <Text className="text-2xl font-medium">{button}</Text>
                  )}
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        {/* Confirm Button */}
        <Pressable
          onPress={handleConfirm}
          className="mt-4 items-center justify-center rounded-2xl py-4 active:opacity-90"
          style={{ backgroundColor: '#FF8A3D' }}
        >
          <Text className="text-lg font-semibold text-white">Confirm</Text>
        </Pressable>
      </View>
    </View>
  );
}
