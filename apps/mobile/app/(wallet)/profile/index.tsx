import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  User as UserIcon,
  Mail,
  Phone,
  Wallet,
  MessageCircle,
  Copy,
  LogOut,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, View, Pressable, Alert } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import { useAuth } from '@/hooks/useAuth';
import { useUser, useUserDisplayName } from '@/hooks/useUser';
import { useColorScheme } from '@/lib/useColorScheme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDarkColorScheme, colors } = useColorScheme();
  const { handleLogout } = useAuth();
  const user = useUser();
  const displayName = useUserDisplayName();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, fieldName: string) => {
    await Clipboard.setStringAsync(text);
    setCopiedField(fieldName);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text variant="body" className="text-muted-foreground">
          No user data available
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top + 16 }} className="px-6 mb-6">
          <View className="flex-row items-center gap-4 mb-2">
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              className="active:opacity-70"
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{
                  backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F5F5F5',
                }}
              >
                <ArrowLeft size={20} color={colors.foreground} />
              </View>
            </Pressable>
            <Text variant="largeTitle" className="font-bold flex-1">
              Profile
            </Text>
          </View>
        </View>

        {/* Profile Card */}
        <Animated.View entering={FadeIn.duration(400)} className="px-6 mb-6">
          <View
            className="rounded-3xl p-6 items-center"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#FFFFFF',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDarkColorScheme ? 0 : 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            {/* Profile Picture */}
            <View className="mb-4">
              {user.profile ? (
                <Image
                  source={{ uri: user.profile }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: isDarkColorScheme ? '#2C2C2E' : '#F5F5F5',
                  }}
                  contentFit="cover"
                />
              ) : (
                <View
                  className="items-center justify-center"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: '#0385FF',
                  }}
                >
                  <UserIcon size={48} color="#FFFFFF" />
                </View>
              )}
            </View>

            {/* User Name */}
            <Text variant="title1" className="font-bold mb-1">
              {displayName}
            </Text>

            {/* Username */}
            {user.username && (
              <Text variant="subhead" className="text-muted-foreground mb-4">
                @{user.username}
              </Text>
            )}
          </View>
        </Animated.View>

        {/* User Information */}
        <View className="px-6 mb-6">
          <Text variant="title3" className="font-semibold mb-4">
            Information
          </Text>

          {/* Email */}
          {user.email && (
            <Animated.View entering={FadeInDown.delay(50).duration(400)}>
              <InfoCard
                icon={Mail}
                iconColor="#0385FF"
                label="Email"
                value={user.email}
                isDarkColorScheme={isDarkColorScheme}
                onCopy={() => handleCopy(user.email!, 'email')}
                isCopied={copiedField === 'email'}
              />
            </Animated.View>
          )}

          {/* Phone */}
          {user.phone && (
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              <InfoCard
                icon={Phone}
                iconColor="#00C853"
                label="Phone"
                value={user.phone}
                isDarkColorScheme={isDarkColorScheme}
                onCopy={() => handleCopy(user.phone!, 'phone')}
                isCopied={copiedField === 'phone'}
              />
            </Animated.View>
          )}

          {/* Wallet Address */}
          {user.walletAddress && (
            <Animated.View entering={FadeInDown.delay(150).duration(400)}>
              <InfoCard
                icon={Wallet}
                iconColor="#8E44AD"
                label="Wallet Address"
                value={user.walletAddress}
                isDarkColorScheme={isDarkColorScheme}
                onCopy={() => handleCopy(user.walletAddress!, 'wallet')}
                isCopied={copiedField === 'wallet'}
                truncate
              />
            </Animated.View>
          )}

          {/* Telegram ID */}
          {user.telegramId && (
            <Animated.View entering={FadeInDown.delay(200).duration(400)}>
              <InfoCard
                icon={MessageCircle}
                iconColor="#0088CC"
                label="Telegram ID"
                value={user.telegramId.toString()}
                isDarkColorScheme={isDarkColorScheme}
                onCopy={() => handleCopy(user.telegramId!.toString(), 'telegram')}
                isCopied={copiedField === 'telegram'}
              />
            </Animated.View>
          )}
        </View>

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)} className="px-6 mb-6">
          <Button
            size="lg"
            variant="plain"
            className="w-full rounded-2xl"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#FFFFFF',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleLogout();
            }}
          >
            <LogOut size={20} color="#FF3B30" />
            <Text className="font-semibold" style={{ color: '#FF3B30' }}>
              Logout
            </Text>
          </Button>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// Info Card Component
function InfoCard({
  icon: Icon,
  iconColor,
  label,
  value,
  isDarkColorScheme,
  onCopy,
  isCopied,
  truncate = false,
}: {
  icon: React.ComponentType<{ size: number; color: string }>;
  iconColor: string;
  label: string;
  value: string;
  isDarkColorScheme: boolean;
  onCopy: () => void;
  isCopied: boolean;
  truncate?: boolean;
}) {
  const displayValue = truncate && value.length > 20 ? `${value.slice(0, 8)}...${value.slice(-8)}` : value;

  return (
    <View
      className="rounded-2xl p-4 mb-3 flex-row items-center justify-between"
      style={{
        backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
        borderWidth: 1,
        borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
      }}
    >
      <View className="flex-row items-center flex-1">
        <View
          style={{ backgroundColor: iconColor }}
          className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        >
          <Icon size={20} color="#FFFFFF" />
        </View>
        <View className="flex-1">
          <Text variant="caption1" className="text-muted-foreground mb-0.5">
            {label}
          </Text>
          <Text variant="callout" className="font-medium" numberOfLines={1}>
            {displayValue}
          </Text>
        </View>
      </View>

      {/* Copy Button */}
      <Pressable
        onPress={onCopy}
        className="active:opacity-70 ml-2"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{
            backgroundColor: isCopied
              ? '#00C853'
              : isDarkColorScheme
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.05)',
          }}
        >
          {isCopied ? (
            <CheckCircle size={18} color="#FFFFFF" />
          ) : (
            <Copy size={16} color={isDarkColorScheme ? '#FFFFFF' : '#000000'} />
          )}
        </View>
      </Pressable>
    </View>
  );
}
