import * as React from 'react';
import { ScrollView, View, Pressable, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { Icon } from '@/components/nativewindui/Icon';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';

export default function ReceiveScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDarkColorScheme } = useColorScheme();

  // Mock data
  const walletAddress = 'bitriel://pay/tourist_user_123';
  const phoneNumber = '+855 12 345 678';
  const bitrielId = '@touristuser';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Send me money via Bitriel!\n\nBitriel ID: ${bitrielId}\nPhone: ${phoneNumber}\n\n${walletAddress}`,
        title: 'My Bitriel Wallet',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleCopy = (text: string, label: string) => {
    // In a real app, this would use Clipboard API
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Alert or toast: `${label} copied!`
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
            Receive Money
          </Text>
          <Pressable onPress={handleShare} className="active:opacity-70">
            <Icon name="square.and.arrow.up" size={24} color={colors.foreground} />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* QR Code Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-8">
          <View className="items-center mb-4">
            <Text variant="title3" className="font-semibold mb-2">
              Scan to Pay
            </Text>
            <Text variant="subhead" className="text-muted-foreground text-center">
              Share this QR code with anyone to receive money
            </Text>
          </View>

          {/* QR Code Placeholder */}
          <View
            className="rounded-3xl p-8 items-center"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <View
              className="w-64 h-64 rounded-2xl items-center justify-center"
              style={{
                backgroundColor: '#FFFFFF',
              }}
            >
              {/* QR Code would be generated here */}
              <View className="items-center">
                <Icon name="qrcode" size={200} color="#000000" />
                <Text variant="caption1" className="text-black mt-2">
                  Bakong QR
                </Text>
              </View>
            </View>
            <Text variant="callout" className="font-semibold mt-4">
              {bitrielId}
            </Text>
          </View>
        </Animated.View>

        {/* Receive Methods */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-8">
          <Text variant="title3" className="font-semibold mb-4">
            Or Share Your Details
          </Text>

          <View className="gap-3">
            {/* Bitriel ID */}
            <ReceiveMethodCard
              icon="at"
              iconColor="#0385FF"
              label="Bitriel ID"
              value={bitrielId}
              isDarkColorScheme={isDarkColorScheme}
              onCopy={() => handleCopy(bitrielId, 'Bitriel ID')}
            />

            {/* Phone Number */}
            <ReceiveMethodCard
              icon="phone.fill"
              iconColor="#00C853"
              label="Phone Number"
              value={phoneNumber}
              isDarkColorScheme={isDarkColorScheme}
              onCopy={() => handleCopy(phoneNumber, 'Phone number')}
            />

            {/* Wallet Address */}
            <ReceiveMethodCard
              icon="link"
              iconColor="#FF9500"
              label="Wallet Address"
              value={walletAddress}
              isDarkColorScheme={isDarkColorScheme}
              onCopy={() => handleCopy(walletAddress, 'Wallet address')}
            />
          </View>
        </Animated.View>

        {/* Info Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor: isDarkColorScheme
                ? 'rgba(0, 200, 83, 0.1)'
                : 'rgba(0, 200, 83, 0.05)',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#00C85340' : '#00C85320',
            }}
          >
            <View className="flex-row gap-3">
              <Icon name="info.circle.fill" size={20} className="text-green-500 mt-0.5" />
              <View className="flex-1">
                <Text variant="callout" className="font-semibold mb-1">
                  Instant Transfers
                </Text>
                <Text variant="caption1" className="text-muted-foreground">
                  Money sent to your Bitriel ID or phone number will be credited instantly to
                  your wallet in Cambodian Riel (KHR)
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Share Button */}
      <View
        style={{ paddingBottom: insets.bottom + 16 }}
        className="px-6 pt-4 border-t border-border"
      >
        <Button onPress={handleShare} className="bg-primary">
          <Icon name="square.and.arrow.up" size={20} color="#FFFFFF" />
          <Text className="text-primary-foreground font-semibold text-base">
            Share Payment Info
          </Text>
        </Button>
      </View>
    </View>
  );
}

function ReceiveMethodCard({
  icon,
  iconColor,
  label,
  value,
  isDarkColorScheme,
  onCopy,
}: {
  icon: string;
  iconColor: string;
  label: string;
  value: string;
  isDarkColorScheme: boolean;
  onCopy: () => void;
}) {
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
          style={{ backgroundColor: iconColor }}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <Icon name={icon as any} size={20} color="#FFFFFF" />
        </View>
        <View className="flex-1">
          <Text variant="caption1" className="text-muted-foreground mb-0.5">
            {label}
          </Text>
          <Text variant="callout" className="font-semibold">
            {value}
          </Text>
        </View>
        <Pressable onPress={onCopy} className="active:opacity-70">
          <View className="bg-primary/10 rounded-full p-2">
            <Icon name="doc.on.doc" size={18} color={iconColor} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

