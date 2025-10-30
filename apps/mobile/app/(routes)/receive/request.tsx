import * as React from 'react';
import { View, Pressable, StatusBar, Share } from 'react-native';
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
  ['', '0', 'backspace'],
];

export default function RequestCryptoScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDarkColorScheme } = useColorScheme();

  const symbol = (params.symbol as string) || 'SOL';
  const icon = (params.icon as string) || '🌊';
  const address = (params.address as string) || '';

  const [amount, setAmount] = React.useState('6745');
  const [solValue, setSolValue] = React.useState('0.00097');

  // Mock price - should come from API
  const solPrice = 138.52; // USD per SOL

  const handleNumberPress = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (value === 'backspace') {
      setAmount((prev) => {
        const newAmount = prev.slice(0, -1) || '0';
        updateSolValue(newAmount);
        return newAmount;
      });
    } else if (value) {
      setAmount((prev) => {
        const newAmount = prev === '0' ? value : prev + value;
        updateSolValue(newAmount);
        return newAmount;
      });
    }
  };

  const updateSolValue = (usdAmount: string) => {
    const numericAmount = parseFloat(usdAmount);
    if (!isNaN(numericAmount)) {
      const sol = (numericAmount / solPrice).toFixed(5);
      setSolValue(sol);
    }
  };

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/(routes)/receive/share' as any,
      params: { symbol, icon, address, amount, solValue },
    });
  };

  const handleSwapCurrency = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement currency swap (USD <-> SOL)
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
          <Text className="text-lg font-semibold">Request crypto</Text>
          <View className="size-10" />
        </View>
      </View>

      {/* Amount Display */}
      <View className="flex-1 items-center justify-center px-5">
        <View className="items-center gap-2">
          <Text className="text-6xl font-bold" style={{ color: '#FF8A3D' }}>
            {amount} USD
          </Text>
          <Text className="text-xl opacity-60">
            {solValue} {symbol}
          </Text>
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

      {/* Asset Selector */}
      <View className="px-5">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // TODO: Open asset selector
          }}
          className="mb-6 flex-row items-center justify-between rounded-2xl p-4 active:opacity-90"
          style={{ backgroundColor: colors.card }}
        >
          <View className="flex-row items-center gap-3">
            <Text className="text-2xl">{icon}</Text>
            <View>
              <Text className="text-base font-semibold">{symbol}</Text>
              <Text className="text-sm opacity-60">Solana</Text>
            </View>
          </View>
          <Icon name="chevron.right" size={20} color={colors.foreground} />
        </Pressable>
      </View>

      {/* Numpad */}
      <View className="px-5 pb-6" style={{ paddingBottom: insets.bottom + 24 }}>
        <View className="gap-3">
          {NUMPAD_BUTTONS.map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row gap-3">
              {row.map((button, btnIndex) => (
                <Pressable
                  key={`${rowIndex}-${btnIndex}`}
                  onPress={() => button && handleNumberPress(button)}
                  disabled={!button}
                  className="flex-1 items-center justify-center rounded-2xl py-4 active:opacity-70"
                  style={{
                    backgroundColor: button ? colors.grey6 : 'transparent',
                  }}
                >
                  {button === 'backspace' ? (
                    <Icon name="delete.left" size={28} color={colors.foreground} />
                  ) : button ? (
                    <Text className="text-2xl font-medium">{button}</Text>
                  ) : null}
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
