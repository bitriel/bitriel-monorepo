import * as React from 'react';
import { ScrollView, View, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { Icon } from '@/components/nativewindui/Icon';
import { useColorScheme } from '@/lib/useColorScheme';

const LOYALTY_MERCHANTS = [
  {
    id: '1',
    name: 'Khmer Kitchen',
    category: 'Dining',
    cashback: '5%',
    icon: '🍴',
    description: 'Traditional Cambodian cuisine',
    color: '#FF9500',
    featured: true,
  },
  {
    id: '2',
    name: 'Angkor Market',
    category: 'Shopping',
    cashback: '3%',
    icon: '🛒',
    description: 'Local crafts and souvenirs',
    color: '#FF3B57',
    featured: true,
  },
  {
    id: '3',
    name: 'Smile Tours',
    category: 'Entertainment',
    cashback: '4%',
    icon: '🎫',
    description: 'Temple tours and experiences',
    color: '#0385FF',
    featured: false,
  },
  {
    id: '4',
    name: 'TukTuk Express',
    category: 'Transport',
    cashback: '2%',
    icon: '🚗',
    description: 'Quick city rides',
    color: '#8E44AD',
    featured: false,
  },
  {
    id: '5',
    name: 'Royal Coffee',
    category: 'Dining',
    cashback: '5%',
    icon: '☕',
    description: 'Premium coffee and pastries',
    color: '#FF9500',
    featured: true,
  },
  {
    id: '6',
    name: 'Silk & Spice',
    category: 'Shopping',
    cashback: '3%',
    icon: '👗',
    description: 'Traditional textiles',
    color: '#FF3B57',
    featured: false,
  },
];

export default function LoyaltyMerchantsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDarkColorScheme } = useColorScheme();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredMerchants = searchQuery
    ? LOYALTY_MERCHANTS.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : LOYALTY_MERCHANTS;

  const featuredMerchants = filteredMerchants.filter((m) => m.featured);
  const otherMerchants = filteredMerchants.filter((m) => !m.featured);

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
            <Icon name="chevron.left" size={28} color={colors.foreground} />
          </Pressable>
          <Text variant="title3" className="font-semibold">
            Loyalty Merchants
          </Text>
          <View className="w-7" />
        </View>

        {/* Search Bar */}
        <View
          className="flex-row items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
            borderWidth: 1,
            borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
          }}
        >
          <Icon name="magnifyingglass" size={20} className="text-muted-foreground" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search merchants..."
            className="flex-1 text-base"
            style={{ color: colors.foreground }}
            placeholderTextColor={colors.muted}
          />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Info Banner */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-6">
          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <View className="flex-row gap-3">
              <Icon name="star.fill" size={20} className="text-green-500 mt-0.5" />
              <View className="flex-1">
                <Text variant="callout" className="font-semibold mb-1">
                  Earn Extra Cashback
                </Text>
                <Text variant="caption1" className="text-muted-foreground">
                  Shop at these loyalty merchants to earn cashback on every purchase automatically
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Featured Merchants */}
        {featuredMerchants.length > 0 && (
          <>
            <Text variant="title3" className="font-semibold mb-4">
              Featured Partners
            </Text>
            <View className="gap-3 mb-8">
              {featuredMerchants.map((merchant, index) => (
                <Animated.View
                  key={merchant.id}
                  entering={FadeInDown.delay(200 + index * 50).duration(400)}
                >
                  <MerchantCard merchant={merchant} isDarkColorScheme={isDarkColorScheme} />
                </Animated.View>
              ))}
            </View>
          </>
        )}

        {/* All Merchants */}
        {otherMerchants.length > 0 && (
          <>
            <Text variant="title3" className="font-semibold mb-4">
              All Merchants
            </Text>
            <View className="gap-3">
              {otherMerchants.map((merchant, index) => (
                <Animated.View
                  key={merchant.id}
                  entering={FadeInDown.delay(300 + index * 50).duration(400)}
                >
                  <MerchantCard merchant={merchant} isDarkColorScheme={isDarkColorScheme} />
                </Animated.View>
              ))}
            </View>
          </>
        )}

        {filteredMerchants.length === 0 && (
          <View className="items-center py-12">
            <Icon name="magnifyingglass" size={48} className="text-muted-foreground mb-3" />
            <Text variant="title3" className="font-semibold mb-1">
              No merchants found
            </Text>
            <Text variant="subhead" className="text-muted-foreground text-center">
              Try a different search term
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function MerchantCard({
  merchant,
  isDarkColorScheme,
}: {
  merchant: (typeof LOYALTY_MERCHANTS)[number];
  isDarkColorScheme: boolean;
}) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      className="active:opacity-70"
    >
      <View
        className="rounded-2xl p-4"
        style={{
          backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
          borderWidth: 1,
          borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
        }}
      >
        <View className="flex-row items-center gap-4">
          {/* Icon */}
          <View
            style={{ backgroundColor: merchant.color }}
            className="w-14 h-14 rounded-full items-center justify-center"
          >
            <Text className="text-3xl">{merchant.icon}</Text>
          </View>

          {/* Info */}
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-0.5">
              <Text variant="callout" className="font-semibold">
                {merchant.name}
              </Text>
              {merchant.featured && (
                <View className="bg-yellow-500/10 rounded-full px-2 py-0.5">
                  <Text variant="caption2" className="text-yellow-600 font-semibold">
                    ⭐ Featured
                  </Text>
                </View>
              )}
            </View>
            <Text variant="caption1" className="text-muted-foreground mb-1">
              {merchant.description}
            </Text>
            <View
              className="self-start rounded-full px-2 py-0.5"
              style={{
                backgroundColor: isDarkColorScheme
                  ? 'rgba(0, 200, 83, 0.15)'
                  : 'rgba(0, 200, 83, 0.1)',
              }}
            >
              <Text variant="caption2" className="text-green-500 font-semibold">
                {merchant.cashback} Cashback
              </Text>
            </View>
          </View>

          {/* Arrow */}
          <Icon name="chevron.right" size={20} className="text-muted-foreground" />
        </View>
      </View>
    </Pressable>
  );
}

