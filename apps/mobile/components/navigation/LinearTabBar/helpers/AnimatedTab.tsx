import { styles } from '../styles';
import { AnimatedTabProps } from '../types';
import { triggerHaptics } from '../utils';
import {
  AVATAR_SIZE,
  AVATAR_BORDER_RADIUS,
  AVATAR_BORDER_WIDTH_FOCUSED,
  AVATAR_BORDER_WIDTH_UNFOCUSED,
  AVATAR_BORDER_OPACITY,
  TAB_ICON_SIZE,
} from '../constants';
import { useEffect, useMemo } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';

const FOCUS_ANIMATION_DURATION = 300;
const BACKGROUND_SCALE_MIN = 0.8;
const BACKGROUND_SCALE_MAX = 1;
const ICON_OPACITY_THRESHOLDS = [0, 0.25, 0.4] as const;
const ICON_OPACITY_VALUES = [1, 0.5, 0] as const;
const ICON_SCALE_THRESHOLDS = [0, 0.5, 1] as const;
const ICON_SCALE_VALUES = [1, 0.5, 1] as const;

/**
 * AnimatedTab component that displays a tab with support for avatar or icons
 */
const AnimatedTab: React.FC<AnimatedTabProps> = ({
  isFocused,
  options,
  activeColor,
  inactiveColor,
  onPress,
  onLongPress,
  animationProgress,
}) => {
  const scale = useSharedValue(0);

  const { avatar } = useMemo(
    () => ({
      avatar: options.avatar,
    }),
    [options.avatar]
  );

  useEffect(() => {
    if (isFocused) {
      triggerHaptics();
    }
    scale.value = withTiming(isFocused ? 1 : 0, {
      duration: FOCUS_ANIMATION_DURATION,
      easing: Easing.out(Easing.ease),
    });
  }, [isFocused, scale]);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [0, 1]);
    return {
      opacity,
      transform: [
        {
          scale: interpolate(scale.value, [0, 1], [BACKGROUND_SCALE_MIN, BACKGROUND_SCALE_MAX]),
        },
      ],
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      ICON_OPACITY_THRESHOLDS,
      ICON_OPACITY_VALUES,
      Extrapolation.CLAMP
    );

    const counterScale = interpolate(
      animationProgress.value,
      ICON_SCALE_THRESHOLDS,
      ICON_SCALE_VALUES,
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale: counterScale }],
    };
  });

  const avatarBorderColor = isFocused
    ? activeColor
    : `rgba(255, 255, 255, ${AVATAR_BORDER_OPACITY})`;

  const renderTabIcon = () => {
    if (avatar) {
      return (
        <View style={localStyles.avatarContainer}>
          <Image
            source={{ uri: avatar }}
            style={[
              localStyles.avatar,
              {
                borderWidth: isFocused
                  ? AVATAR_BORDER_WIDTH_FOCUSED
                  : AVATAR_BORDER_WIDTH_UNFOCUSED,
                borderColor: avatarBorderColor,
              },
            ]}
            contentFit="cover"
          />
        </View>
      );
    }

    return (
      options.tabBarIcon &&
      options.tabBarIcon({
        focused: isFocused,
        color: isFocused ? activeColor : inactiveColor,
        size: TAB_ICON_SIZE,
      })
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tab}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View style={[styles.tabBackground, animatedBackgroundStyle]} />
      <Animated.View style={animatedIconStyle}>{renderTabIcon()}</Animated.View>
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  avatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: AVATAR_BORDER_RADIUS,
  },
});

export { AnimatedTab };
