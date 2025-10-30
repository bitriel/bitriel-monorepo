import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/nativewindui/Text';
import { useColorScheme } from '@/lib/useColorScheme';

export default function HistoryScreen() {
  const { colors } = useColorScheme();

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}
    >
      <Text variant="title2">History</Text>
      <Text className="mt-2 opacity-60">Coming soon</Text>
    </View>
  );
}
