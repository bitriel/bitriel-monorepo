import * as React from 'react';
import { ScrollView, View, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { ChevronLeft, CreditCard, Check, Shield } from 'lucide-react-native';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';
import { usePayment } from '@/context/PaymentContext';
import { useToast } from '@/context/ToastContext';
import { getCardType, formatCardNumber } from '@/services/mockData';

export default function CardPaymentScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useColorScheme();
  const { addCard, selectCard } = usePayment();
  const { success } = useToast();

  const [cardNumber, setCardNumber] = React.useState('');
  const [expiryDate, setExpiryDate] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [cardholderName, setCardholderName] = React.useState('');
  const [saveCard, setSaveCard] = React.useState(true);

  // Auto-format card number with spaces
  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    if (cleaned.length <= 16) {
      setCardNumber(formatCardNumber(cleaned));
    }
  };

  // Auto-format expiry date
  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\//g, '');
    if (cleaned.length <= 4) {
      if (cleaned.length >= 2) {
        setExpiryDate(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
      } else {
        setExpiryDate(cleaned);
      }
    }
  };

  const isFormValid =
    cardNumber.replace(/\s/g, '').length >= 15 &&
    expiryDate.length === 5 &&
    cvv.length >= 3 &&
    cardholderName.length > 0;

  const handlePayment = () => {
    if (!isFormValid) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const detectedCardType = getCardType(cardNumber);
    const last4 = cardNumber.replace(/\s/g, '').slice(-4);

    // Handle UNKNOWN card type by defaulting to VISA
    const cardType: 'VISA' | 'MASTERCARD' | 'AMEX' =
      detectedCardType === 'UNKNOWN' ? 'VISA' : detectedCardType;

    // Generate card color based on type
    const cardColors = {
      VISA: '#0385FF',
      MASTERCARD: '#FF9500',
      AMEX: '#006FCF',
    };

    const newCard = {
      type: cardType,
      last4,
      expiryDate,
      cardholderName,
      isDefault: false,
      color: cardColors[cardType],
      fullNumber: cardNumber,
    };

    if (saveCard) {
      // Add card to saved cards
      addCard(newCard);
      success('Card saved successfully!');
    }

    // Select this card for the current payment
    selectCard({
      id: `temp_${Date.now()}`, // Temporary ID, will be replaced by addCard
      ...newCard,
    });

    // Navigate to confirmation
    router.push('/(wallet)/payment/confirm');
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
            Card Payment
          </Text>
          <View className="w-7" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Card Preview */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-8">
          <View
            className="bg-gradient-to-br rounded-3xl p-6 aspect-[1.586]"
            style={{ backgroundColor: '#667eea' }}
          >
            <View className="flex-1 justify-between">
              <View className="flex-row justify-between items-start">
                <CreditCard size={40} color="#FFFFFF" />
                <Text variant="caption1" className="text-white/80 font-semibold">
                  VISA/MASTERCARD
                </Text>
              </View>
              <View>
                <Text variant="title3" className="text-white tracking-widest mb-4 font-mono">
                  {cardNumber || '•••• •••• •••• ••••'}
                </Text>
                <View className="flex-row justify-between">
                  <View>
                    <Text variant="caption2" className="text-white/60 mb-1">
                      Cardholder
                    </Text>
                    <Text variant="callout" className="text-white font-semibold">
                      {cardholderName || 'YOUR NAME'}
                    </Text>
                  </View>
                  <View>
                    <Text variant="caption2" className="text-white/60 mb-1">
                      Expires
                    </Text>
                    <Text variant="callout" className="text-white font-semibold">
                      {expiryDate || 'MM/YY'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Card Details Form */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="gap-4 mb-8">
          <View>
            <Text variant="subhead" className="font-semibold mb-2">
              Card Number
            </Text>
            <View className="bg-card border border-border rounded-2xl px-4 py-3.5">
              <TextInput
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                keyboardType="number-pad"
                maxLength={19}
                className="text-base"
                style={{ color: colors.foreground }}
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text variant="subhead" className="font-semibold mb-2">
                Expiry Date
              </Text>
              <View className="bg-card border border-border rounded-2xl px-4 py-3.5">
                <TextInput
                  value={expiryDate}
                  onChangeText={handleExpiryChange}
                  placeholder="MM/YY"
                  keyboardType="number-pad"
                  maxLength={5}
                  className="text-base"
                  style={{ color: colors.foreground }}
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>

            <View className="flex-1">
              <Text variant="subhead" className="font-semibold mb-2">
                CVV
              </Text>
              <View className="bg-card border border-border rounded-2xl px-4 py-3.5">
                <TextInput
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                  className="text-base"
                  style={{ color: colors.foreground }}
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>
          </View>

          <View>
            <Text variant="subhead" className="font-semibold mb-2">
              Cardholder Name
            </Text>
            <View className="bg-card border border-border rounded-2xl px-4 py-3.5">
              <TextInput
                value={cardholderName}
                onChangeText={setCardholderName}
                placeholder="John Doe"
                autoCapitalize="words"
                className="text-base"
                style={{ color: colors.foreground }}
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>
        </Animated.View>

        {/* Save Card Option */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-8">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSaveCard(!saveCard);
            }}
            className="active:opacity-70"
          >
            <View className="flex-row items-center gap-3">
              <View
                className={`w-6 h-6 rounded-md border-2 items-center justify-center ${
                  saveCard ? 'bg-primary border-primary' : 'border-border'
                }`}
              >
                {saveCard && <Check size={16} color="#FFFFFF" />}
              </View>
              <Text variant="subhead" className="flex-1">
                Save card for future payments
              </Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* Security Info */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <View className="bg-muted/10 rounded-2xl p-4">
            <View className="flex-row gap-3">
              <Shield size={20} color={colors.primary} />
              <View className="flex-1">
                <Text variant="callout" className="font-semibold mb-1">
                  Secure Payment
                </Text>
                <Text variant="caption1" className="text-muted-foreground">
                  Your card information is encrypted and secured. We never store your full card
                  details.
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Pay Button */}
      <View
        style={{ paddingBottom: insets.bottom + 16 }}
        className="px-6 pt-4 border-t border-border"
      >
        <Button
          onPress={handlePayment}
          disabled={!isFormValid}
          className={`${!isFormValid ? 'opacity-50' : ''} bg-primary`}
        >
          <Shield size={20} color="#FFFFFF" />
          <Text className="text-primary-foreground font-semibold text-base">Pay Securely</Text>
        </Button>
      </View>
    </View>
  );
}
