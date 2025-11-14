import * as React from 'react';
import { ScrollView, View, Pressable, Alert, ActionSheetIOS, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { ChevronLeft, PlusCircle, CreditCard, MoreHorizontal, Trash2, Star, Edit3 } from 'lucide-react-native';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';
import { usePayment } from '@/context/PaymentContext';
import { useToast } from '@/context/ToastContext';
import { SavedCard } from '@/services/mockData';

export default function MyCardsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useColorScheme();
  const { savedCards, removeCard, setDefaultCard } = usePayment();
  const { success, error } = useToast();

  const handleCardOptions = (card: SavedCard) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const options = [
      card.isDefault ? 'Default Card' : 'Set as Default',
      'Remove Card',
      'Cancel',
    ];

    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex,
          cancelButtonIndex,
          title: `${card.type} •••• ${card.last4}`,
          message: 'Choose an action',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            // Set as Default
            if (!card.isDefault) {
              setDefaultCard(card.id);
              success(`${card.type} •••• ${card.last4} set as default`);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          } else if (buttonIndex === 1) {
            // Remove Card
            handleRemoveCard(card);
          }
        }
      );
    } else {
      // Android Alert
      Alert.alert(
        'Card Options',
        `${card.type} •••• ${card.last4}`,
        [
          {
            text: card.isDefault ? 'Default Card' : 'Set as Default',
            onPress: () => {
              if (!card.isDefault) {
                setDefaultCard(card.id);
                success(`${card.type} •••• ${card.last4} set as default`);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            },
            style: card.isDefault ? 'cancel' : 'default',
          },
          {
            text: 'Remove Card',
            onPress: () => handleRemoveCard(card),
            style: 'destructive',
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const handleRemoveCard = (card: SavedCard) => {
    Alert.alert(
      'Remove Card',
      `Are you sure you want to remove ${card.type} ending in ${card.last4}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeCard(card.id);
            success('Card removed successfully');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

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
            <ChevronLeft size={28} color={colors.foreground} />
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

          {savedCards.length === 0 ? (
            <View className="bg-card rounded-3xl p-8 border border-dashed border-border items-center">
              <CreditCard size={64} color={colors.muted} className="mb-4" />
              <Text variant="callout" className="font-semibold mb-2">
                No Saved Cards
              </Text>
              <Text variant="caption1" className="text-muted-foreground text-center">
                Add a card to make payments faster and easier
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {savedCards.map((card, index) => (
                <Animated.View
                  key={card.id}
                  entering={FadeInDown.delay(150 + index * 50).duration(400)}>
                  <SavedCardItem card={card} onOptions={handleCardOptions} />
                </Animated.View>
              ))}
            </View>
          )}
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
                <PlusCircle size={32} color={colors.primary} />
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

function SavedCardItem({
  card,
  onOptions,
}: {
  card: SavedCard;
  onOptions: (card: SavedCard) => void;
}) {
  const { colors } = useColorScheme();
  const [showQuickActions, setShowQuickActions] = React.useState(false);

  return (
    <View>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowQuickActions(!showQuickActions);
        }}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onOptions(card);
        }}
        className="active:opacity-70">
        <View className="rounded-3xl p-6 aspect-[1.586]" style={{ backgroundColor: card.color }}>
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
                <CreditCard size={36} color="rgba(255,255,255,0.9)" />
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
                  onPress={() => onOptions(card)}
                  className="active:opacity-70">
                  <View className="bg-white/20 rounded-full p-2">
                    <MoreHorizontal size={20} color="#FFFFFF" />
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Pressable>

      {/* Quick Actions - Shows on tap */}
      {showQuickActions && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          className="mt-2 flex-row gap-2">
          <Pressable
            onPress={() => {
              onOptions(card);
              setShowQuickActions(false);
            }}
            className="flex-1 active:opacity-70">
            <View className="bg-card border border-border rounded-2xl p-3 flex-row items-center justify-center gap-2">
              <Edit3 size={16} color={colors.primary} />
              <Text variant="callout" className="font-semibold text-primary">
                Manage
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

