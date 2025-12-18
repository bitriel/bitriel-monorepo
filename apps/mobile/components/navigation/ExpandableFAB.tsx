import React, { useMemo, useCallback } from 'react';
import { View, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  SharedValue,
  Easing,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

import { Text } from '@/components/nativewindui/Text';

interface FABAction {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  color: string;
  onPress: () => void;
}

interface ExpandableFABProps {
  actions: FABAction[];
}

// Optimized spring config for snappy but smooth animations
const SPRING_CONFIG = {
  damping: 18,
  stiffness: 250,
  mass: 0.6,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

// Lighter spring for menu items (more bounce)
const MENU_ITEM_SPRING = {
  damping: 14,
  stiffness: 200,
  mass: 0.5,
};

// Timing config for overlay
const TIMING_CONFIG = {
  duration: 280,
  easing: Easing.bezier(0.32, 0.72, 0, 1), // iOS-like easing
};

// Menu animation thresholds
const MENU_STAGGER_DELAY_MS = 35; // Milliseconds between each item
const MENU_INTERACTIVE_THRESHOLD = 0.4;

// FAB positioning
const FAB_SIZE = 56;
const MENU_ITEM_SIZE = 56;
const MENU_ITEM_SPACING = 16;
const FAB_BOTTOM = 30;
const FAB_RIGHT = 20;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ExpandableFAB({ actions }: ExpandableFABProps) {
  const isExpanded = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  const triggerHaptic = useCallback((style: Haptics.ImpactFeedbackStyle) => {
    Haptics.impactAsync(style);
  }, []);

  const openMenu = useCallback(() => {
    'worklet';
    if (isAnimating.value) return;
    isAnimating.value = true;
    runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Medium);
    isExpanded.value = withSpring(1, SPRING_CONFIG, (finished) => {
      if (finished) {
        isAnimating.value = false;
      }
    });
  }, [isExpanded, isAnimating, triggerHaptic]);

  const closeMenu = useCallback(() => {
    'worklet';
    if (isAnimating.value) return;
    isAnimating.value = true;
    runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Light);
    isExpanded.value = withSpring(0, SPRING_CONFIG, (finished) => {
      if (finished) {
        isAnimating.value = false;
      }
    });
  }, [isExpanded, isAnimating, triggerHaptic]);

  const toggleMenu = useCallback(() => {
    if (isExpanded.value < 0.5) {
      openMenu();
    } else {
      closeMenu();
    }
  }, [isExpanded, openMenu, closeMenu]);

  const handleOverlayPress = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      isExpanded.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      pointerEvents: isExpanded.value > 0.1 ? 'auto' : 'none',
    };
  });

  const fabButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      isExpanded.value,
      [0, 0.3],
      [1, 0],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      isExpanded.value,
      [0, 0.3],
      [1, 0.8],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }],
      pointerEvents: isExpanded.value < 0.2 ? 'auto' : 'none',
    };
  });

  return (
    <>
      {/* Blur overlay backdrop */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleOverlayPress}>
          <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} />
        </Pressable>
      </Animated.View>

      {/* FAB Container */}
      <View style={styles.container}>
        {/* Menu items - stacked from bottom */}
        {[...actions].reverse().map((action, index) => (
          <FABMenuItem
            key={action.label}
            action={action}
            index={index}
            totalActions={actions.length}
            isExpanded={isExpanded}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // Immediately close the menu
              isExpanded.value = withSpring(0, SPRING_CONFIG);
              // Execute action after brief delay for smooth transition
              setTimeout(() => {
                action.onPress();
              }, 100);
            }}
          />
        ))}

        {/* Main FAB button */}
        <Animated.View style={[styles.fabButtonWrapper, fabButtonStyle]}>
          <Pressable onPress={toggleMenu} style={styles.mainButton}>
            <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
        </Animated.View>
      </View>
    </>
  );
}

const FABMenuItem = React.memo(function FABMenuItem({
  action,
  index,
  totalActions,
  isExpanded,
  onPress,
}: {
  action: FABAction;
  index: number;
  totalActions: number;
  isExpanded: SharedValue<number>;
  onPress: () => void;
}) {
  const Icon = action.icon;
  // Reverse index so bottom item (index 0 after reverse) animates first
  const reverseIndex = totalActions - 1 - index;
  const delayMs = reverseIndex * MENU_STAGGER_DELAY_MS;

  const animatedStyle = useAnimatedStyle(() => {
    // Stagger the animation based on item position
    const staggeredProgress = interpolate(
      isExpanded.value,
      [0, 0.3, 1],
      [0, 0, 1],
      Extrapolation.CLAMP
    );

    const itemProgress = withDelay(
      delayMs,
      withSpring(staggeredProgress, MENU_ITEM_SPRING)
    );

    const opacity = interpolate(
      isExpanded.value,
      [0, 0.2, 0.6],
      [0, 0, 1],
      Extrapolation.CLAMP
    );

    // Items slide up with spring
    const translateY = withSpring(
      interpolate(isExpanded.value, [0, 1], [30, 0], Extrapolation.CLAMP),
      {
        ...MENU_ITEM_SPRING,
        // Add slight delay based on position
        stiffness: MENU_ITEM_SPRING.stiffness - reverseIndex * 10,
      }
    );

    const scale = withSpring(
      interpolate(isExpanded.value, [0, 0.5, 1], [0.3, 0.9, 1], Extrapolation.CLAMP),
      MENU_ITEM_SPRING
    );

    return {
      opacity,
      transform: [{ translateY }, { scale }],
      pointerEvents: isExpanded.value > MENU_INTERACTIVE_THRESHOLD ? 'auto' : 'none',
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      isExpanded.value,
      [0, 0.5, 0.8],
      [0, 0, 1],
      Extrapolation.CLAMP
    );
    const translateX = withSpring(
      interpolate(isExpanded.value, [0, 1], [20, 0], Extrapolation.CLAMP),
      MENU_ITEM_SPRING
    );
    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const scale = withSpring(
      interpolate(isExpanded.value, [0, 0.6, 1], [0.5, 0.95, 1], Extrapolation.CLAMP),
      MENU_ITEM_SPRING
    );
    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.menuItemWrapper, animatedStyle]}>
      <AnimatedPressable
        onPress={onPress}
        style={styles.menuItem}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={action.label}
      >
        <Animated.Text style={[styles.menuLabel, labelStyle]}>
          {action.label}
        </Animated.Text>
        <Animated.View
          style={[
            styles.menuIconContainer,
            { backgroundColor: action.color },
            iconStyle
          ]}
        >
          <Icon size={24} color="#FFFFFF" />
        </Animated.View>
      </AnimatedPressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    zIndex: 90,
  },
  container: {
    position: 'absolute',
    bottom: FAB_BOTTOM,
    right: FAB_RIGHT,
    alignItems: 'flex-end',
    zIndex: 100,
  },
  menuItemWrapper: {
    height: MENU_ITEM_SIZE + MENU_ITEM_SPACING,
    justifyContent: 'flex-start',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: MENU_ITEM_SIZE,
  },
  menuIconContainer: {
    width: MENU_ITEM_SIZE,
    height: MENU_ITEM_SIZE,
    borderRadius: MENU_ITEM_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    // Add shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  menuLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  fabButtonWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  mainButton: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    // Add shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
