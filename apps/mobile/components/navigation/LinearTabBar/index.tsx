import { DummyTab } from './helpers/DummyTab';
import { ANIMATION_DURATION, WIDTH } from './constants';
import { styles } from './styles';
import { triggerHaptics } from './utils';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-reanimated';
import { AnimatedTab } from './helpers/AnimatedTab';
import { ExpandedMenuItems } from './helpers/ExpandedMenuItem';
import { LinearTabBarProps, ExtendedTabNavigationOptions } from './types';

/**
 * Extended tab navigation options for Expo Router compatibility
 */
interface ExpoTabNavigationOptions extends ExtendedTabNavigationOptions {
  href?: string | null;
}

export const LinearTabBar: React.FC<LinearTabBarProps> = ({
  state,
  descriptors,
  navigation,
  onLinearTabPress = () => {},
  onMenuItemPress = () => {},
  customAnimationProgress,
  menuItems,
  activeColor = '#007AFF',
  inactiveColor = '#FFFFFF',
}) => {
  const internalAnimationProgress = useSharedValue(0);
  const animationProgress = customAnimationProgress || internalAnimationProgress;
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number>(0);

  const startY = useSharedValue(0);
  const translationY = useSharedValue(0);

  useEffect(() => {
    triggerHaptics();
  }, [selectedMenuIndex]);

  // Sync selectedMenuIndex with the current active route
  useEffect(() => {
    const currentRoute = state.routes[state.index];
    if (currentRoute) {
      const menuItemIndex = menuItems.findIndex((item) => item.route === currentRoute.name);
      if (menuItemIndex !== -1) {
        setSelectedMenuIndex(menuItemIndex);
      }
    }
  }, [state.index, state.routes, menuItems]);

  const updateSelectedIndex = useCallback((index: number): void => {
    setSelectedMenuIndex(index);
  }, []);

  const navigateToRoute = useCallback(
    (route: string) => {
      navigation.navigate(route);
    },
    [navigation]
  );

  const panGesture = Gesture.Pan()
    .onStart(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    })
    .onUpdate((event) => {
      translationY.value = event.translationY;

      if (animationProgress.value > 0.8) {
        const menuHeight = 400;

        // Check if gesture is within the menu bounds
        if (event.y >= 0 && event.y <= menuHeight) {
          const itemHeight = menuHeight / menuItems.length;
          const relativeY = event.y;

          let newIndex = Math.floor(relativeY / itemHeight);
          newIndex = Math.max(0, Math.min(menuItems.length - 1, newIndex));

          runOnJS(updateSelectedIndex)(newIndex);
        }
      }
    })
    .onEnd((event) => {
      const velocity = event.velocityY;
      const threshold = 500;
      const currentSelectedIndex = selectedMenuIndex;
      const route = menuItems[currentSelectedIndex]?.route;

      if (animationProgress.value > 0.8 && route) {
        // If menu was open
        runOnJS(onMenuItemPress)(currentSelectedIndex);
        runOnJS(navigateToRoute)(route);
      }

      if (velocity < -threshold && animationProgress.value === 0) {
        animationProgress.value = withTiming(1, {
          duration: ANIMATION_DURATION,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      } else if (velocity > threshold && animationProgress.value === 1) {
        animationProgress.value = withTiming(0, {
          duration: ANIMATION_DURATION,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      } else if (animationProgress.value > 0.8) {
        animationProgress.value = withTiming(0, {
          duration: ANIMATION_DURATION,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      }
      runOnJS(triggerHaptics)('soft');
      translationY.value = 0;
    });

  const animatedTabBarStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [1, 0.5, 1],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [0, -10, -20],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  const animatedFloatingBarStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animationProgress.value,
      [0, 0.4, 0.7, 1],
      [50, 50, 250, 400],
      Extrapolation.CLAMP
    );

    const borderRadius = interpolate(
      animationProgress.value,
      [0, 0.2, 1],
      [25, 100, 40],
      Extrapolation.CLAMP
    );

    return {
      height,
      borderRadius,
      width: WIDTH - 150,
    };
  });

  const animatedOriginalTabBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.25, 0.4],
      [1, 0.2, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      pointerEvents: animationProgress.value > 0.25 ? 'none' : 'auto',
    };
  });

  const handleMenuItemPress = useCallback(
    (index: number): void => {
      if (index < 0 || index >= menuItems.length) return;

      onMenuItemPress(index);
      const selectedItem = menuItems[index];
      setSelectedMenuIndex(index);

      // Use router.push() for absolute routes (starting with "/"),
      // otherwise use navigation.navigate() for relative routes
      if (selectedItem.route.startsWith('/')) {
        router.push(selectedItem.route as any);
      } else {
        navigation.navigate(selectedItem.route);
      }

      animationProgress.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    },
    [menuItems, navigation, onMenuItemPress, animationProgress]
  );

  const filteredRouteTabs = state.routes.filter((route) => {
    const { options } = descriptors[route.key];
    // Only show tabs that have an icon and are not hidden
    const routerOptions = options as ExpoTabNavigationOptions;
    return options?.tabBarIcon !== undefined && routerOptions?.href !== null;
  });

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.container}>
          <Animated.View
            style={[styles.floatingBarWrapper, animatedFloatingBarStyle, animatedTabBarStyle]}
          >
            <BlurView tint="systemThickMaterialDark" style={styles.blurView}>
              <View style={styles.expandedMenu}>
                {menuItems.map((item, index) => (
                  <ExpandedMenuItems
                    key={index}
                    item={item}
                    index={index}
                    animationProgress={animationProgress}
                    totalItems={menuItems.length}
                    isSelected={selectedMenuIndex === index}
                    onPress={() => handleMenuItemPress(index)}
                  />
                ))}
              </View>

              <Animated.View style={[styles.floatingBar, animatedOriginalTabBarStyle]}>
                {filteredRouteTabs.map((route, index) => {
                  const { options } = descriptors[route.key];
                  const routeIndex = state.routes.indexOf(route);
                  const isFocused = state.index === routeIndex;

                  const onPress = (): void => {
                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                      navigation.navigate(route.name, route.params);
                      // Sync menu selection with the clicked tab
                      const menuItemIndex = menuItems.findIndex(
                        (item) => item.route === route.name
                      );
                      if (menuItemIndex !== -1) {
                        setSelectedMenuIndex(menuItemIndex);
                      }
                    }
                  };

                  const onLongPress = (): void => {
                    navigation.emit({
                      type: 'tabLongPress',
                      target: route.key,
                    });
                  };

                  return (
                    <AnimatedTab
                      key={route.key}
                      isFocused={isFocused}
                      options={options as ExtendedTabNavigationOptions}
                      activeColor={activeColor}
                      inactiveColor={inactiveColor}
                      onPress={onPress}
                      onLongPress={onLongPress}
                      animationProgress={animationProgress}
                      index={index}
                    />
                  );
                })}

                <DummyTab onPress={onLinearTabPress} animationProgress={animationProgress} />
              </Animated.View>
            </BlurView>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export { AnimatedTab } from './helpers/AnimatedTab';
export {
  AVATAR_SIZE,
  AVATAR_BORDER_RADIUS,
  AVATAR_BORDER_WIDTH_FOCUSED,
  AVATAR_BORDER_WIDTH_UNFOCUSED,
  AVATAR_BORDER_OPACITY,
} from './constants';
export type { ExpandedMenuItem, LinearTabBarProps } from './types';
