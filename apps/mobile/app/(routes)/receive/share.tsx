import * as React from 'react';
import { View, Pressable, StatusBar, Share, Clipboard, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Icon } from '@/components/nativewindui/Icon';
import { Text } from '@/components/nativewindui/Text';
import { useColorScheme } from '@/lib/useColorScheme';

export default function ReceiveShareScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDarkColorScheme } = useColorScheme();

  const symbol = (params.symbol as string) || 'SOL';
  const icon = (params.icon as string) || '🌊';
  const address =
    (params.address as string) ||
    'EpjjinDshvinwshvnhudsnjuhufijuuvnJjdIjJIswhIsuuwshvuswvushuwwwsw';
  const amount = (params.amount as string) || '249';
  const solValue = (params.solValue as string) || '0.00097';

  // Calculate USD value
  const usdValue = (parseFloat(solValue) * 138.52).toFixed(2);

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `Send me ${solValue} ${symbol} (${amount} USD) to:\n${address}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyAddress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Clipboard.setString(address);
    Alert.alert('Copied!', 'Address copied to clipboard');
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
          backgroundColor: colors.background,
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
          <View className="size-10" />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center px-5">
        {/* Asset Icon */}
        <View
          className="mb-8 size-20 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.card }}
        >
          <Text className="text-4xl">{icon}</Text>
        </View>

        {/* Warning Text */}
        <Text className="mb-8 text-center text-base opacity-80">
          Only send Solana network tokens to this{'\n'}address
        </Text>

        {/* Address Card with QR */}
        <View
          className="mb-8 w-full items-center rounded-3xl p-6"
          style={{ backgroundColor: colors.card }}
        >
          {/* Address */}
          <View className="mb-6 w-full flex-row items-center justify-between">
            <Text className="flex-1 text-sm" style={{ color: colors.foreground }}>
              {address}
            </Text>
            <Pressable onPress={handleCopyAddress} className="ml-3 active:opacity-70">
              <Icon name="doc.on.doc" size={20} color={colors.foreground} />
            </Pressable>
          </View>

          {/* QR Code Placeholder */}
          <View
            className="mb-6 size-52 items-center justify-center rounded-2xl"
            style={{ backgroundColor: 'white' }}
          >
            <View className="size-48 items-center justify-center bg-black/10">
              <Icon name="qrcode" size={120} color="#000" />
              <Text className="mt-2 text-xs text-black/60">QR Code</Text>
            </View>
          </View>

          {/* Amount Display */}
          <View className="items-center gap-1">
            <Text className="text-3xl font-bold">
              {solValue} {symbol}
            </Text>
            <Text className="text-lg opacity-60">${usdValue}</Text>
          </View>
        </View>

        {/* Share Button */}
        <View className="w-full">
          <Pressable
            onPress={handleShare}
            className="flex-row items-center justify-center gap-2 rounded-full py-4 active:opacity-90"
            style={{ backgroundColor: colors.grey6 }}
          >
            <Icon name="square.and.arrow.up" size={20} color={colors.foreground} />
            <Text className="text-base font-medium">Share</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
