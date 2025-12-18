import {
  SPRING_CONFIG,
  MENU_START_THRESHOLD,
  MENU_STAGGER_DELAY,
  MENU_ITEM_DURATION,
  MENU_INTERACTIVE_THRESHOLD,
  AVATAR_SIZE,
  AVATAR_BORDER_RADIUS,
  AVATAR_BORDER_WIDTH_FOCUSED,
  AVATAR_BORDER_WIDTH_UNFOCUSED,
  AVATAR_BORDER_OPACITY,
  TAB_ICON_SIZE,
  MENU_BACKGROUND_OPACITY_SELECTED,
} from '../constants';
import { ExpandedMenuItemProps } from '../types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useMemo } from 'react';

import { styles } from '../styles';

const OPACITY_THRESHOLDS = [0, 0.5, 1] as const;
const OPACITY_VALUES = [0, 0.8, 1] as const;
const TRANSLATE_Y_VALUES = [40, 0] as const;
const SCALE_THRESHOLDS = [0, 0.8, 1] as const;
const SCALE_VALUES = [0.7, 1.02, 1] as const;
const SELECTED_SCALE = 1;
const UNSELECTED_SCALE = 0.95;
const SELECTED_COLOR = '#FFFFFF';
const UNSELECTED_COLOR = '#AAAAAA';

/**
 * ExpandedMenuItem component that displays a menu item with support for avatar or icons
 */
const ExpandedMenuItems: React.FC<ExpandedMenuItemProps> = ({
  item,
  index,
  animationProgress,
  isSelected,
  onPress,
}) => {
  const { itemStartThreshold, itemEndThreshold } = useMemo(() => {
    const staggerDelay = index * MENU_STAGGER_DELAY;
    const startThreshold = MENU_START_THRESHOLD + staggerDelay;
    const endThreshold = Math.min(startThreshold + MENU_ITEM_DURATION, 1);
    return {
      itemStartThreshold: startThreshold,
      itemEndThreshold: endThreshold,
    };
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    const itemProgress = interpolate(
      animationProgress.value,
      [itemStartThreshold, itemEndThreshold],
      [0, 1],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      itemProgress,
      OPACITY_THRESHOLDS,
      OPACITY_VALUES,
      Extrapolation.CLAMP
    );

    const translateY = withSpring(
      interpolate(itemProgress, [0, 1], TRANSLATE_Y_VALUES, Extrapolation.CLAMP),
      SPRING_CONFIG
    );

    const scale = withSpring(
      interpolate(itemProgress, SCALE_THRESHOLDS, SCALE_VALUES, Extrapolation.CLAMP),
      SPRING_CONFIG
    );

    const isInteractive = animationProgress.value > MENU_INTERACTIVE_THRESHOLD;

    return {
      opacity,
      transform: [{ translateY }, { scale }],
      pointerEvents: isInteractive ? 'auto' : 'none',
    };
  });

  const animatedSelectionStyle = useAnimatedStyle(() => {
    const scale = isSelected ? SELECTED_SCALE : UNSELECTED_SCALE;
    const opacity = isSelected ? MENU_BACKGROUND_OPACITY_SELECTED : 0;

    return {
      opacity,
      transform: [
        {
          scale: withSpring(scale, SPRING_CONFIG),
        },
      ],
    };
  });

  const Icon = item.icon;
  const iconColor = isSelected ? SELECTED_COLOR : UNSELECTED_COLOR;
  const labelColor = isSelected ? SELECTED_COLOR : UNSELECTED_COLOR;
  const avatarBorderColor = isSelected
    ? SELECTED_COLOR
    : `rgba(255, 255, 255, ${AVATAR_BORDER_OPACITY})`;

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={styles.menuItem}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={item.label}
        accessibilityState={{ selected: isSelected }}
      >
        <Animated.View
          style={[StyleSheet.absoluteFillObject, styles.menuItemBackground, animatedSelectionStyle]}
        />

        <View style={styles.menuIconContainer}>
          {item.avatar ? (
            <Image
              source={{ uri: item.avatar }}
              style={[
                localStyles.avatar,
                {
                  borderWidth: isSelected
                    ? AVATAR_BORDER_WIDTH_FOCUSED
                    : AVATAR_BORDER_WIDTH_UNFOCUSED,
                  borderColor: avatarBorderColor,
                },
              ]}
              contentFit="cover"
            />
          ) : (
            <Icon size={TAB_ICON_SIZE} color={iconColor} />
          )}
        </View>

        <Text style={[styles.menuLabel, { color: labelColor }]}>{item.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const localStyles = StyleSheet.create({
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_BORDER_RADIUS,
  },
});

export { ExpandedMenuItems };
