import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  CreditCard,
  PlusCircle,
  CheckCircle2,
  Shield,
  Trash2,
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, Pressable, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import { usePayment } from '@/context/PaymentContext';
import { useToast } from '@/context/ToastContext';
import { useColorScheme } from '@/lib/useColorScheme';
import { SavedCard } from '@/services/mockData';

export default function SelectCardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useColorScheme();
  const { savedCards, selectCard, paymentData, removeCard } = usePayment();
  const { success } = useToast();
  const [selectedCardId, setSelectedCardId] = React.useState<string | null>(
    paymentData.selectedCard?.id || savedCards.find((c) => c.isDefault)?.id || null
  );

  const handleCardSelect = (card: SavedCard) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCardId(card.id);
  };

  const handleDeleteCard = (card: SavedCard) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Alert.alert(
      'Delete Card',
      `Are you sure you want to remove ${card.type} ending in ${card.last4}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeCard(card.id);
            success('Card removed successfully');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // If deleted card was selected, clear selection
            if (selectedCardId === card.id) {
              setSelectedCardId(null);
            }
          },
        },
      ]
    );
  };

  const handleContinue = () => {
    if (!selectedCardId) return;

    const card = savedCards.find((c) => c.id === selectedCardId);
    if (!card) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    selectCard(card);
    router.push('/(wallet)/payment/confirm');
  };

  const handleAddNewCard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(wallet)/payment/card');
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
            className="active:opacity-70"
          >
            <ChevronLeft size={28} color={colors.foreground} />
          </Pressable>
          <Text variant="title3" className="font-semibold">
            Select Payment Card
          </Text>
          <View className="w-7" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Amount Summary */}
        {paymentData.amount > 0 && (
          <Animated.View entering={FadeInDown.delay(50).duration(400)} className="mb-6">
            <View className="bg-primary/10 rounded-2xl p-4">
              <Text variant="caption1" className="text-muted-foreground mb-1">
                Amount to Add
              </Text>
              <View className="flex-row items-baseline gap-2">
                <Text variant="title1" className="font-bold">
                  {paymentData.amountKHR.toLocaleString('en-US')}
                </Text>
                <Text variant="subhead" className="text-muted-foreground">
                  KHR
                </Text>
              </View>
              <Text variant="caption1" className="text-muted-foreground mt-1">
                ≈ ${paymentData.amount.toFixed(2)} USD
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Saved Cards */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-6">
          <Text variant="title3" className="font-semibold mb-4">
            Your Saved Cards
          </Text>

          {savedCards.length === 0 ? (
            <View className="bg-card rounded-2xl p-6 border border-border items-center">
              <CreditCard size={48} color={colors.muted} className="mb-3" />
              <Text variant="callout" className="text-muted-foreground text-center">
                No saved cards yet. Add a new card to get started.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {savedCards.map((card, index) => (
                <Animated.View
                  key={card.id}
                  entering={FadeInDown.delay(150 + index * 50).duration(400)}
                >
                  <SavedCardItem
                    card={card}
                    isSelected={selectedCardId === card.id}
                    onSelect={handleCardSelect}
                    onDelete={handleDeleteCard}
                  />
                </Animated.View>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Add New Card */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Pressable onPress={handleAddNewCard} className="active:opacity-70">
            <View className="bg-card rounded-2xl p-5 border-2 border-dashed border-border">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                  <PlusCircle size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text variant="callout" className="font-semibold mb-0.5">
                    Add New Card
                  </Text>
                  <Text variant="caption1" className="text-muted-foreground">
                    Save a new credit or debit card
                  </Text>
                </View>
                <ChevronLeft
                  size={20}
                  color={colors.muted}
                  style={{ transform: [{ rotate: '180deg' }] }}
                />
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* Security Info */}
        {savedCards.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400).duration(400)} className="mt-6">
            <View className="bg-muted/10 rounded-2xl p-4">
              <View className="flex-row gap-3">
                <Shield size={18} color={colors.primary} />
                <View className="flex-1">
                  <Text variant="caption1" className="text-muted-foreground">
                    Your card information is encrypted and secured. We never store your full card
                    details.
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Continue Button */}
      {savedCards.length > 0 && (
        <View
          style={{ paddingBottom: insets.bottom + 16 }}
          className="px-6 pt-4 border-t border-border"
        >
          <Button
            onPress={handleContinue}
            disabled={!selectedCardId}
            className={`${!selectedCardId ? 'opacity-50' : ''} bg-primary`}
          >
            <Text className="text-primary-foreground font-semibold text-base">
              Continue with Selected Card
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
}

function SavedCardItem({
  card,
  isSelected,
  onSelect,
  onDelete,
}: {
  card: SavedCard;
  isSelected: boolean;
  onSelect: (card: SavedCard) => void;
  onDelete: (card: SavedCard) => void;
}) {
  return (
    <View
      className={`rounded-2xl border-2 overflow-hidden ${
        isSelected ? 'border-primary' : 'border-border'
      }`}
    >
      {/* Card Visual */}
      <Pressable onPress={() => onSelect(card)} className="active:opacity-70">
        <View
          className="p-5 flex-row items-center gap-4"
          style={{ backgroundColor: `${card.color}15` }}
        >
          <View
            className="w-14 h-14 rounded-xl items-center justify-center"
            style={{ backgroundColor: card.color }}
          >
            <CreditCard size={28} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <Text variant="callout" className="font-semibold">
                {card.type}
              </Text>
              {card.isDefault && (
                <View className="bg-primary/20 rounded-full px-2 py-0.5">
                  <Text variant="caption2" className="text-primary font-semibold">
                    Default
                  </Text>
                </View>
              )}
            </View>
            <Text variant="subhead" className="text-muted-foreground font-mono tracking-wider">
              •••• •••• •••• {card.last4}
            </Text>
            <Text variant="caption1" className="text-muted-foreground mt-1">
              Expires {card.expiryDate}
            </Text>
          </View>
          {isSelected && (
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
              <CheckCircle2 size={20} color="#FFFFFF" />
            </View>
          )}
        </View>
      </Pressable>

      {/* Delete Button */}
      <View className="border-t border-border">
        <Pressable onPress={() => onDelete(card)} className="active:opacity-70">
          <View className="px-5 py-3 flex-row items-center justify-center gap-2">
            <Trash2 size={16} color="#EF4444" />
            <Text variant="callout" className="font-semibold" style={{ color: '#EF4444' }}>
              Remove Card
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
