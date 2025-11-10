import * as React from 'react';
import { ScrollView, View, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { ChevronLeft, QrCode, UserCircle, ChevronRight, Send } from 'lucide-react-native';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';

export default function SendMoneyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useColorScheme();

  const [amount, setAmount] = React.useState('');
  const [recipient, setRecipient] = React.useState('');
  const [note, setNote] = React.useState('');

  const exchangeRate = 4050;
  const amountKHR = amount ? parseFloat(amount) : 0;
  const amountUSD = amountKHR / exchangeRate;

  const isFormValid = amountKHR > 0 && recipient.length > 0;

  const handleSend = () => {
    if (!isFormValid) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
            Send Money
          </Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(wallet)/scan-qr');
            }}
            className="active:opacity-70"
          >
            <QrCode size={28} color={colors.foreground} />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Amount Input */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-8">
          <Text variant="title3" className="font-semibold mb-4">
            Amount
          </Text>

          <View className="bg-card rounded-3xl p-6 border border-border">
            <Text variant="subhead" className="text-muted-foreground mb-2">
              Amount in Riel (KHR)
            </Text>
            <View className="flex-row items-center gap-2">
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                keyboardType="decimal-pad"
                className="flex-1 text-4xl font-bold"
                style={{ color: colors.foreground }}
                placeholderTextColor={colors.muted}
              />
              <Text variant="title1" className="font-semibold text-muted-foreground">
                KHR
              </Text>
            </View>
            {amount && (
              <Text variant="subhead" className="text-muted-foreground mt-3">
                ≈ ${amountUSD.toFixed(2)} USD
              </Text>
            )}
          </View>
        </Animated.View>

        {/* Recipient Input */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-8">
          <Text variant="title3" className="font-semibold mb-4">
            Send To
          </Text>

          <View className="gap-4">
            <View>
              <Text variant="subhead" className="font-semibold mb-2">
                Phone Number or Bitriel ID
              </Text>
              <View className="bg-card border border-border rounded-2xl px-4 py-3.5 flex-row items-center gap-3">
                <UserCircle size={24} color={colors.mutedForeground} />
                <TextInput
                  value={recipient}
                  onChangeText={setRecipient}
                  placeholder="+855 12 345 678 or @username"
                  keyboardType="default"
                  className="flex-1 text-base"
                  style={{ color: colors.foreground }}
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>

            <View>
              <Text variant="subhead" className="font-semibold mb-2">
                Note (Optional)
              </Text>
              <View className="bg-card border border-border rounded-2xl px-4 py-3.5">
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="What's this for?"
                  className="text-base"
                  style={{ color: colors.foreground }}
                  placeholderTextColor={colors.muted}
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Recent Recipients */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Text variant="title3" className="font-semibold mb-4">
            Recent
          </Text>

          <View className="gap-3">
            {['John Doe', 'Sarah Smith', 'Mike Chen'].map((name, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setRecipient(`@${name.toLowerCase().replace(' ', '')}`);
                }}
                className="active:opacity-70"
              >
                <View className="bg-card rounded-2xl p-4 border border-border flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                    <Text variant="callout" className="font-bold text-primary">
                      {name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text variant="callout" className="font-semibold">
                      {name}
                    </Text>
                    <Text variant="caption1" className="text-muted-foreground">
                      @{name.toLowerCase().replace(' ', '')}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={colors.mutedForeground} />
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Send Button */}
      <View
        style={{ paddingBottom: insets.bottom + 16 }}
        className="px-6 pt-4 border-t border-border"
      >
        <Button
          onPress={handleSend}
          disabled={!isFormValid}
          className={`${!isFormValid ? 'opacity-50' : ''} bg-primary`}
        >
          <Send size={20} color="#FFFFFF" />
          <Text className="text-primary-foreground font-semibold text-base">Send Money</Text>
        </Button>
      </View>
    </View>
  );
}
