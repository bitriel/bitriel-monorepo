import { Tabs, useRouter } from 'expo-router';
import { Home, Wallet, Settings, ArrowLeftRight, Send, ArrowDown } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { StyleSheet, View, Pressable } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { LinearTabBar, ExpandedMenuItem } from '@/components/navigation/LinearTabBar';
import { ANIMATION_DURATION } from '@/components/navigation/LinearTabBar/constants';
import { ExpandableFAB } from '@/components/navigation/ExpandableFAB';

// Define the menu items for the expanded menu
// These can navigate to both tab screens and stack routes
const MENU_ITEMS: ExpandedMenuItem[] = [
  {
    icon: Home,
    label: 'Home',
    route: 'index',
  },
  {
    icon: Wallet,
    label: 'Wallet',
    route: 'wallet',
  },
  {
    icon: Settings,
    label: 'Settings',
    route: 'settings',
  },
];

export default function TabLayout() {
  const animationProgress = useSharedValue(0);
  const router = useRouter();

  const closeMenu = () => {
    animationProgress.value = withTiming(0, { duration: ANIMATION_DURATION });
  };

  const fabActions = [
    {
      icon: ArrowLeftRight,
      label: 'Swap',
      color: '#007AFF',
      onPress: () => router.push('/(wallet)/earn/swap-points'),
    },
    {
      icon: Send,
      label: 'Send',
      color: '#8E44AD',
      onPress: () => router.push('/(wallet)/send'),
    },
    {
      icon: ArrowDown,
      label: 'Receive',
      color: '#FF9500',
      onPress: () => router.push('/(wallet)/receive'),
    },
  ];

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
        tabBar={(props) => (
          <LinearTabBar
            {...props}
            menuItems={MENU_ITEMS}
            customAnimationProgress={animationProgress}
            activeColor="#007AFF"
            inactiveColor="#FFFFFF"
          />
        )}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: 'Wallet',
            tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
          }}
        />
      </Tabs>

      {/* Blur overlay when menu is expanded */}
      <BlurOverlay animationProgress={animationProgress} onPress={closeMenu} />

      {/* Expandable FAB - rendered at layout level to overlay tab bar */}
      <ExpandableFAB actions={fabActions} />
    </View>
  );
}

function BlurOverlay({
  animationProgress,
  onPress,
}: {
  animationProgress: SharedValue<number>;
  onPress: () => void;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [0, 0.3, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      pointerEvents: animationProgress.value > 0.3 ? 'auto' : 'none',
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle, styles.overlay]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onPress}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    zIndex: 5,
  },
});
