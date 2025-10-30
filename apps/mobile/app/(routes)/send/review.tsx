import * as React from 'react';
import {
  View,
  Pressable,
  StatusBar,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Icon } from '@/components/nativewindui/Icon';
import { Text } from '@/components/nativewindui/Text';
import { useColorScheme } from '@/lib/useColorScheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDE_THRESHOLD = SCREEN_WIDTH * 0.7;

export default function SendReviewScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDarkColorScheme } = useColorScheme();

  const asset = (params.asset as string) || 'SOL';
  const address = params.address as string;
  const recipientName = params.recipientName as string;
  const amount = params.amount as string;
  const usdValue = params.usdValue as string;

  const [showReviewModal, setShowReviewModal] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const slideAnim = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0 && gestureState.dx < SCREEN_WIDTH - 100) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SLIDE_THRESHOLD) {
          // Slide completed
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Animated.timing(slideAnim, {
            toValue: SCREEN_WIDTH - 100,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            handleConfirmTransaction();
          });
        } else {
          // Reset slide
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleOpenReview = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowReviewModal(true);
  };

  const handleCloseReview = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowReviewModal(false);
    slideAnim.setValue(0);
  };

  const handleConfirmTransaction = () => {
    setIsConfirming(true);
    // Simulate transaction processing
    setTimeout(() => {
      setIsConfirming(false);
      setShowReviewModal(false);
      setShowSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  };

  const handleDone = () => {
    router.replace('/(tabs)/wallet' as any);
  };

  const handleViewExplorer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Open blockchain explorer
    console.log('View on explorer');
  };

  const networkFee = '0.005';
  const total = (parseFloat(amount) + parseFloat(networkFee)).toFixed(3);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkColorScheme ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 16,
          backgroundColor: colors.root,
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
          <Text className="text-lg font-semibold">Send {asset}</Text>
          <View className="size-10" />
        </View>
      </View>

      {/* Recipient Info */}
      <View className="px-5 pt-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-sm opacity-60">To</Text>
          <View
            className="flex-row items-center gap-2 rounded-full px-3 py-1"
            style={{ backgroundColor: colors.grey6 }}
          >
            <Icon name="person.fill" size={12} color={colors.foreground} />
            <Text className="text-xs">{recipientName}</Text>
          </View>
        </View>
      </View>

      {/* Balance Info */}
      <View className="px-5 pt-3">
        <Text className="text-sm opacity-60">
          Available balance{'\n'}
          <Text className="text-sm opacity-60">329.27 {asset}</Text>
        </Text>
        <Pressable
          className="absolute right-5 top-3 rounded-lg px-3 py-1"
          style={{ backgroundColor: '#FF8A3D' }}
        >
          <Text className="text-sm font-semibold text-white">Max</Text>
        </Pressable>
      </View>

      {/* Amount Display */}
      <View className="flex-1 items-center justify-center px-5">
        <View className="items-center gap-2">
          <Text className="text-6xl font-bold opacity-40">
            {amount} {asset}
          </Text>
        </View>
      </View>

      {/* Review Transfer Button */}
      <View className="px-5 pb-6" style={{ paddingBottom: insets.bottom + 24 }}>
        <Pressable
          onPress={handleOpenReview}
          className="items-center justify-center rounded-2xl py-4 active:opacity-90"
          style={{ backgroundColor: '#FF8A3D' }}
        >
          <Text className="text-lg font-semibold text-white">Review transfer</Text>
        </Pressable>
      </View>

      {/* Review Modal */}
      <Modal
        visible={showReviewModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseReview}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="rounded-t-3xl px-5 pt-6 pb-8" style={{ backgroundColor: colors.grey5 }}>
            {/* Modal Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-xl font-semibold">Review transfer</Text>
              <Pressable
                onPress={handleCloseReview}
                className="size-8 items-center justify-center active:opacity-70"
              >
                <Icon name="xmark" size={20} color={colors.foreground} />
              </Pressable>
            </View>

            {/* Amount */}
            <View className="mb-6 items-center gap-2">
              <Text className="text-sm opacity-60">You are sending</Text>
              <Text className="text-4xl font-bold">
                {amount} {asset}
              </Text>
              <Text className="text-xl opacity-60">${usdValue}</Text>
            </View>

            {/* Transaction Details */}
            <View
              className="mb-6 gap-3 rounded-2xl p-4"
              style={{ backgroundColor: colors.background }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="opacity-60">Recipient</Text>
                <Text className="font-medium">{recipientName}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="opacity-60">Send time</Text>
                <Text className="font-medium">est. about 2 minutes</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1">
                  <Text className="opacity-60">Network fee</Text>
                  <Icon name="info.circle" size={14} color={colors.grey} />
                </View>
                <Text className="font-medium">
                  {networkFee} {asset}
                </Text>
              </View>
              <View className="my-1 h-px" style={{ backgroundColor: colors.border }} />
              <View className="flex-row items-center justify-between">
                <Text className="font-semibold">Total</Text>
                <Text className="font-semibold">
                  {total} {asset}
                </Text>
              </View>
            </View>

            {/* Slide to Confirm */}
            <View
              className="relative h-16 items-center justify-center overflow-hidden rounded-2xl"
              style={{ backgroundColor: colors.grey6 }}
            >
              {/* Slider Track */}
              <Animated.View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: SCREEN_WIDTH - 40,
                  backgroundColor: '#FF8A3D',
                  borderRadius: 16,
                  transform: [
                    {
                      translateX: slideAnim.interpolate({
                        inputRange: [0, SCREEN_WIDTH - 100],
                        outputRange: [-(SCREEN_WIDTH - 120), 0],
                      }),
                    },
                  ],
                }}
              />

              {/* Slider Button */}
              <Animated.View
                {...panResponder.panHandlers}
                style={{
                  position: 'absolute',
                  left: 4,
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  backgroundColor: 'white',
                  transform: [{ translateX: slideAnim }],
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Icon name="arrow.right" size={24} color="#FF8A3D" />
              </Animated.View>

              {/* Label */}
              <Text
                className="text-base font-medium"
                style={{
                  color: isConfirming ? 'white' : colors.foreground,
                }}
              >
                {isConfirming ? 'Confirming...' : 'Slide to confirm'}
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={handleDone}>
        <View
          className="flex-1 items-center justify-center px-5"
          style={{ backgroundColor: colors.background }}
        >
          {/* Success Icon */}
          <View className="mb-8">
            <View
              className="size-32 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.grey6 }}
            >
              <View
                className="size-28 items-center justify-center rounded-full"
                style={{ borderColor: '#10B981', borderWidth: 4 }}
              >
                <Icon name="checkmark" size={48} color="#10B981" />
              </View>
            </View>
          </View>

          <Text className="mb-4 text-3xl font-bold">Successful!</Text>
          <Text className="mb-12 text-center text-base opacity-60">
            You successfully sent {amount} {asset}. It will be{'\n'}
            deposited in the recipient wallet shortly
          </Text>

          {/* Buttons */}
          <View className="w-full gap-3">
            <Pressable
              onPress={handleDone}
              className="items-center justify-center rounded-2xl py-4 active:opacity-90"
              style={{ backgroundColor: '#FF8A3D' }}
            >
              <Text className="text-lg font-semibold text-white">Done</Text>
            </Pressable>
            <Pressable
              onPress={handleViewExplorer}
              className="items-center justify-center rounded-2xl py-4 active:opacity-90"
              style={{ backgroundColor: colors.card }}
            >
              <Text className="text-lg font-semibold">View on explorer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
