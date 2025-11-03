import * as React from 'react';
import {
  ScrollView,
  View,
  Pressable,
  Modal,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
  FadeIn,
  FadeInUp,
  SlideInDown,
  FadeOut,
} from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';
import { Icon } from '@/components/nativewindui/Icon';
import { Button } from '@/components/nativewindui/Button';
import { useColorScheme } from '@/lib/useColorScheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48; // 24px padding on each side
const CARD_SPACING = 12;

// Promo cards data
const PROMO_CARDS = [
  {
    id: '1',
    title: 'Get 50,000 KHR Bonus',
    description: 'Invite friends and both earn rewards',
    icon: 'gift.fill',
    iconColor: '#8E44AD',
    gradient: ['#8E44AD', '#9B59B6'],
    action: 'Invite Now',
    route: '/(wallet)/earn',
  },
  {
    id: '2',
    title: 'Earn 6.01% APY',
    description: 'Start saving and watch your money grow',
    icon: 'chart.line.uptrend.xyaxis',
    iconColor: '#0385FF',
    gradient: ['#0385FF', '#0EA5E9'],
    action: 'Start Saving',
    route: '/(wallet)/earn/savings',
  },
  {
    id: '3',
    title: 'Up to 5% Cashback',
    description: 'Shop at loyalty merchants and earn back',
    icon: 'creditcard.fill',
    iconColor: '#00C853',
    gradient: ['#00C853', '#10B981'],
    action: 'Browse Merchants',
    route: '/(wallet)/earn/merchants',
  },
  {
    id: '4',
    title: 'Swap Points to Cash',
    description: 'Convert loyalty points to KHR or USDT',
    icon: 'arrow.left.arrow.right',
    iconColor: '#FF9500',
    gradient: ['#FF9500', '#F59E0B'],
    action: 'Swap Now',
    route: '/(wallet)/earn/swap-points',
  },
];

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDarkColorScheme, colors } = useColorScheme();
  const [showActionSheet, setShowActionSheet] = React.useState(false);
  const [showPromoCards, setShowPromoCards] = React.useState(true);
  const [activePromoIndex, setActivePromoIndex] = React.useState(0);

  const balanceKHR = 50420000; // Balance in Riel (KHR)
  const exchangeRate = 4050; // 1 USD = 4050 KHR (approximate)
  const balanceUSD = balanceKHR / exchangeRate;
  const hasBalance = balanceKHR > 0;

  return (
    <View className="flex-1" style={{ backgroundColor: isDarkColorScheme ? '#000000' : '#FFFFFF' }}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top + 16 }} className="px-6 mb-6">
          <Text variant="largeTitle" className="font-bold">
            Wallet
          </Text>
        </View>

        {/* Balance Card */}
        <View className="px-6 mb-8">
          <Animated.View entering={FadeIn.duration(400)}>
            <View
              className="rounded-3xl p-6"
              style={{
                backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
                borderWidth: 1,
                borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDarkColorScheme ? 0 : 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              {/* Header with USD Badge */}
              <View className="flex-row items-center justify-between mb-4">
                <Text variant="subhead" className="text-muted-foreground font-medium">
                  Total Balance
                </Text>
                <View
                  style={{
                    backgroundColor: isDarkColorScheme
                      ? 'rgba(0, 200, 83, 0.15)'
                      : 'rgba(0, 200, 83, 0.1)',
                    borderWidth: 1,
                    borderColor: isDarkColorScheme ? '#00C85340' : '#00C85320',
                  }}
                  className="rounded-full px-3 py-1.5"
                >
                  <Text variant="caption1" className="text-green-500 font-semibold">
                    ≈ ${balanceUSD.toFixed(2)} USD
                  </Text>
                </View>
              </View>

              {/* Main Balance */}
              <View className="flex-row items-baseline gap-2 mb-2">
                <Text variant="largeTitle" className="font-bold">
                  {hasBalance ? balanceKHR.toLocaleString('en-US') : '0'}
                </Text>
                <Text variant="title1" className="font-semibold text-muted-foreground">
                  KHR
                </Text>
              </View>

              {/* Currency Label */}
              <Text variant="callout" className="text-muted-foreground">
                Cambodian Riel
              </Text>
            </View>
          </Animated.View>

          {/* Empty State or Receive Button */}
          {!hasBalance && (
            <Animated.View
              entering={FadeInDown.delay(200).duration(400)}
              className="items-center my-8"
            >
              <Text variant="title3" className="font-semibold mb-2">
                There is nothing here yet
              </Text>
              <Text variant="subhead" className="text-muted-foreground text-center mb-6">
                Add funds to your wallet to start{'\n'}using Bitriel
              </Text>
              <Button
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/(wallet)/add-funds');
                }}
                className="bg-foreground rounded-full px-8"
              >
                <Icon name={'plus.circle.fill' as any} size={20} color={colors.background} />
                <Text className="font-semibold" style={{ color: colors.background }}>
                  Add Funds
                </Text>
              </Button>
            </Animated.View>
          )}
        </View>

        {/* Feature Cards Grid */}
        <View className="px-6 mb-8">
          <View className="flex-row gap-4 mb-4">
            <Animated.View entering={FadeInDown.delay(100).duration(400)} className="flex-1">
              <FeatureCard
                icon={'qrcode' as any}
                iconColor="#0385FF"
                title="Bakong Pay"
                subtitle="Scan QR to pay"
                isDarkColorScheme={isDarkColorScheme}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/(wallet)/scan-qr');
                }}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(150).duration(400)} className="flex-1">
              <FeatureCard
                icon="creditcard.fill"
                iconColor="#FF9500"
                title="Add Funds"
                subtitle="Card or Crypto"
                isDarkColorScheme={isDarkColorScheme}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/(wallet)/add-funds');
                }}
              />
            </Animated.View>
          </View>
          <View className="flex-row gap-4">
            <Animated.View entering={FadeInDown.delay(200).duration(400)} className="flex-1">
              <FeatureCard
                icon="chart.bar.fill"
                iconColor="#8E44AD"
                title="Earn"
                subtitle="Cashback & Loyalty"
                isDarkColorScheme={isDarkColorScheme}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/(wallet)/earn');
                }}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(250).duration(400)} className="flex-1">
              <FeatureCard
                icon="building.columns.fill"
                iconColor={isDarkColorScheme ? '#FFFFFF' : '#1a1a1a'}
                title="My Cards"
                subtitle="Manage cards"
                isDarkColorScheme={isDarkColorScheme}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/(wallet)/my-cards');
                }}
              />
            </Animated.View>
          </View>
        </View>

        {/* Tourist Services */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text variant="title3" className="font-semibold">
              Tourist Services
            </Text>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(wallet)/services');
              }}
              className="active:opacity-70"
            >
              <Text variant="subhead" className="text-primary">
                See All
              </Text>
            </Pressable>
          </View>
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <ServiceCard
                icon="cart.fill"
                iconColor="#FF3B57"
                title="Shopping"
                subtitle="Local markets"
                isDarkColorScheme={isDarkColorScheme}
                onPress={() => router.push('/(wallet)/services')}
              />
            </View>
            <View className="flex-1">
              <ServiceCard
                icon="ticket.fill"
                iconColor="#0385FF"
                title="Tickets"
                subtitle="Tours & attractions"
                isDarkColorScheme={isDarkColorScheme}
                onPress={() => router.push('/(wallet)/services')}
              />
            </View>
          </View>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <ServiceCard
                icon="fork.knife"
                iconColor="#FF9500"
                title="Dining"
                subtitle="Restaurants"
                isDarkColorScheme={isDarkColorScheme}
                onPress={() => router.push('/(wallet)/services')}
              />
            </View>
            <View className="flex-1">
              <ServiceCard
                icon="mappin.and.ellipse"
                iconColor="#8E44AD"
                title="Experiences"
                subtitle="Local activities"
                isDarkColorScheme={isDarkColorScheme}
                onPress={() => router.push('/(wallet)/services')}
              />
            </View>
          </View>
        </Animated.View>

        {/* Promo Cards Carousel */}
        {showPromoCards ? (
          <Animated.View entering={FadeInDown.delay(350).duration(400)} className="mb-8">
            <View className="flex-row items-center justify-between px-6 mb-4">
              <Text variant="title3" className="font-semibold">
                For You
              </Text>
              <Pressable
                onPress={() => {
                  setShowPromoCards(false);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className="active:opacity-70"
              >
                <Icon name="xmark.circle.fill" size={24} className="text-muted-foreground" />
              </Pressable>
            </View>

            <ScrollView
              horizontal
              pagingEnabled={false}
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={CARD_WIDTH + CARD_SPACING}
              snapToAlignment="start"
              contentInset={{
                left: 24,
                right: 24,
              }}
              contentContainerStyle={{
                paddingLeft: 24,
                paddingRight: 24,
              }}
              onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                const offset = e.nativeEvent.contentOffset.x;
                const index = Math.round(offset / (CARD_WIDTH + CARD_SPACING));
                if (index !== activePromoIndex) {
                  setActivePromoIndex(index);
                }
              }}
              scrollEventThrottle={16}
            >
              {PROMO_CARDS.map((card, index) => (
                <PromoCard
                  key={card.id}
                  card={card}
                  isDarkColorScheme={isDarkColorScheme}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push(card.route as any);
                  }}
                  style={{
                    width: CARD_WIDTH,
                    marginRight: index < PROMO_CARDS.length - 1 ? CARD_SPACING : 0,
                  }}
                />
              ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View className="flex-row justify-center gap-2 mt-4">
              {PROMO_CARDS.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: index === activePromoIndex ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor:
                      index === activePromoIndex
                        ? isDarkColorScheme
                          ? '#FFFFFF'
                          : '#000000'
                        : isDarkColorScheme
                        ? 'rgba(255,255,255,0.3)'
                        : 'rgba(0,0,0,0.2)',
                  }}
                />
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(350).duration(400)} className="px-6 mb-8">
            <Pressable
              onPress={() => {
                setShowPromoCards(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="active:opacity-70 items-center py-6 rounded-2xl"
              style={{
                backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
                borderWidth: 1,
                borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
                borderStyle: 'dashed',
              }}
            >
              <Icon name="eye" size={24} className="text-muted-foreground mb-2" />
              <Text variant="subhead" className="text-muted-foreground">
                Tap to see promotions
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <View style={{ paddingBottom: insets.bottom + 16 }} className="absolute bottom-0 right-6">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setShowActionSheet(true);
          }}
          className="active:scale-95"
        >
          <View className="w-16 h-16 rounded-full bg-foreground items-center justify-center shadow-xl">
            <Icon name="plus" size={32} color={colors.background} />
          </View>
        </Pressable>
      </View>

      {/* Action Sheet Modal */}
      <Modal
        visible={showActionSheet}
        transparent
        animationType="none"
        onRequestClose={() => setShowActionSheet(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowActionSheet(false);
          }}
        >
          <View className="flex-1 justify-end">
            <Animated.View
              entering={SlideInDown.duration(300)}
              exiting={FadeOut.duration(200)}
              className="bg-background rounded-t-3xl"
              style={{ paddingBottom: insets.bottom + 16 }}
            >
              <View className="px-6 pt-6 pb-4">
                <ActionSheetItem
                  icon={'qrcode' as any}
                  iconColor="#0385FF"
                  label="Scan QR"
                  onPress={() => {
                    setShowActionSheet(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/(wallet)/scan-qr');
                  }}
                />
                <ActionSheetItem
                  icon="arrow.down.circle.fill"
                  iconColor="#00C853"
                  label="Receive"
                  onPress={() => {
                    setShowActionSheet(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/(wallet)/receive' as any);
                  }}
                />
                <ActionSheetItem
                  icon="arrow.up.circle.fill"
                  iconColor="#FF9500"
                  label="Send Money"
                  onPress={() => {
                    setShowActionSheet(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/(wallet)/send');
                  }}
                  isLast
                />
              </View>
            </Animated.View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// Promo Card Component
function PromoCard({
  card,
  isDarkColorScheme,
  onPress,
  style,
}: {
  card: (typeof PROMO_CARDS)[0];
  isDarkColorScheme: boolean;
  onPress: () => void;
  style?: any;
}) {
  return (
    <Pressable onPress={onPress} className="active:opacity-95" style={style}>
      <View
        className="rounded-3xl p-6 overflow-hidden"
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
        {/* Gradient Background Overlay */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: card.gradient[0],
            opacity: isDarkColorScheme ? 0.15 : 0.08,
            transform: [{ translateX: 60 }, { translateY: -60 }],
          }}
        />

        {/* Content */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1">
            <View
              style={{ backgroundColor: card.iconColor }}
              className="w-14 h-14 rounded-2xl items-center justify-center mb-4"
            >
              <Icon name={card.icon as any} size={28} color="#FFFFFF" />
            </View>

            <Text variant="title2" className="font-bold mb-2">
              {card.title}
            </Text>
            <Text variant="subhead" className="text-muted-foreground">
              {card.description}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <View className="flex-row items-center justify-between mt-4">
          <View
            className="flex-row items-center gap-2 px-4 py-2.5 rounded-full"
            style={{
              backgroundColor: isDarkColorScheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            }}
          >
            <Text variant="callout" className="font-semibold">
              {card.action}
            </Text>
            <Icon name="arrow.right" size={16} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// Feature Card Component (2x2 Grid) with Dashed Border
function FeatureCard({
  icon,
  iconColor,
  title,
  subtitle,
  isDarkColorScheme,
  onPress,
}: {
  icon: any;
  iconColor: string;
  title: string;
  subtitle: string;
  isDarkColorScheme: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="active:opacity-70">
      <View
        className="rounded-3xl p-5 aspect-square justify-between"
        style={{
          //   backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDarkColorScheme ? 0 : 0.05,
          shadowRadius: 3,
        }}
      >
        <View
          style={{ backgroundColor: iconColor }}
          className="w-14 h-14 rounded-2xl items-center justify-center"
        >
          <Icon name={icon} size={28} color="#FFFFFF" />
        </View>
        <View>
          <Text variant="callout" className="font-semibold mb-1">
            {title}
          </Text>
          <Text variant="caption1" className="text-muted-foreground">
            {subtitle}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// Service Card Component (Simpler)
function ServiceCard({
  icon,
  iconColor,
  title,
  subtitle,
  isDarkColorScheme,
  onPress,
}: {
  icon: any;
  iconColor: string;
  title: string;
  subtitle: string;
  isDarkColorScheme: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="active:opacity-70">
      <View
        className="rounded-2xl p-4"
        style={{
          backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#F9F9F9',
          borderWidth: 1,
          borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDarkColorScheme ? 0 : 0.05,
          shadowRadius: 2,
        }}
      >
        <View
          style={{ backgroundColor: iconColor }}
          className="w-12 h-12 rounded-xl items-center justify-center mb-3"
        >
          <Icon name={icon} size={24} color="#FFFFFF" />
        </View>
        <Text variant="callout" className="font-semibold mb-1">
          {title}
        </Text>
        <Text variant="caption1" className="text-muted-foreground">
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

// Action Sheet Item
function ActionSheetItem({
  icon,
  iconColor,
  label,
  onPress,
  isLast,
}: {
  icon: any;
  iconColor: string;
  label: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between py-4 active:opacity-70 ${
        !isLast ? 'border-b border-border' : ''
      }`}
    >
      <Text variant="title3" className="font-semibold">
        {label}
      </Text>
      <View
        style={{ backgroundColor: iconColor }}
        className="w-10 h-10 rounded-full items-center justify-center"
      >
        <Icon name={icon} size={20} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}
