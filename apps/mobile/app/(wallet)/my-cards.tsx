import * as React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { Icon } from '@/components/nativewindui/Icon';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';

const SAVED_CARDS = [
  {
    id: '1',
    type: 'VISA',
    last4: '4242',
    expiryDate: '12/25',
    isDefault: true,
    color: '#0385FF',
  },
  {
    id: '2',
    type: 'MASTERCARD',
    last4: '5555',
    expiryDate: '08/26',
    isDefault: false,
    color: '#FF9500',
  },
];

export default function MyCardsScreen() {
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
            className="active:opacity-70">
            <Icon name="chevron.left" size={28} color={colors.foreground} />
          </Pressable>
          <Text variant="title3" className="font-semibold">
            My Cards
          </Text>
          <View className="w-7" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Saved Cards */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-8">
          <Text variant="title3" className="font-semibold mb-4">
            Saved Payment Cards
          </Text>
          
          <View className="gap-4">
            {SAVED_CARDS.map((card, index) => (
              <Animated.View
                key={card.id}
                entering={FadeInDown.delay(150 + index * 50).duration(400)}>
                <SavedCard card={card} />
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Add New Card */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(wallet)/payment/card');
            }}
            className="active:opacity-70">
            <View className="bg-card rounded-3xl p-6 border-2 border-dashed border-border items-center">
              <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-3">
                <Icon name={"plus.circle.fill" as any} size={32} className="text-primary" />
              </View>
              <Text variant="callout" className="font-semibold mb-1">
                Add New Card
              </Text>
              <Text variant="caption1" className="text-muted-foreground text-center">
                Save a new credit or debit card
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function SavedCard({ card }: { card: (typeof SAVED_CARDS)[number] }) {
  const { colors } = useColorScheme();

  return (
    <Pressable
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      className="active:opacity-70">
      <View
        className="rounded-3xl p-6 aspect-[1.586]"
        style={{ backgroundColor: card.color }}>
        <View className="flex-1 justify-between">
          {/* Card Header */}
          <View className="flex-row justify-between items-start">
            <View>
              {card.isDefault && (
                <View className="bg-white/20 rounded-full px-3 py-1 mb-2">
                  <Text variant="caption2" className="text-white font-semibold">
                    Default
                  </Text>
                </View>
              )}
              <Icon name="creditcard.fill" size={36} color="rgba(255,255,255,0.9)" />
            </View>
            <View className="bg-white rounded-lg px-3 py-1.5">
              <Text variant="caption1" className="font-bold" style={{ color: card.color }}>
                {card.type}
              </Text>
            </View>
          </View>

          {/* Card Details */}
          <View>
            <Text variant="title2" className="text-white tracking-widest mb-3 font-mono">
              •••• •••• •••• {card.last4}
            </Text>
            <View className="flex-row justify-between items-end">
              <View>
                <Text variant="caption2" className="text-white/60 mb-1">
                  Expires
                </Text>
                <Text variant="callout" className="text-white font-semibold">
                  {card.expiryDate}
                </Text>
              </View>
              <Pressable
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                className="active:opacity-70">
                <View className="bg-white/20 rounded-full p-2">
                  <Icon name="ellipsis" size={20} color="#FFFFFF" />
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

