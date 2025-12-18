import { LucideIcon } from 'lucide-react-native';
import type { SharedValue } from 'react-native-reanimated';
import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

/**
 * Haptic feedback weight options for user interactions
 */
export type HapticFeedBackWeight = 'soft' | 'normal' | 'heavy';

/**
 * Extended tab navigation options with custom properties for LinearTabBar
 */
export interface ExtendedTabNavigationOptions extends BottomTabNavigationOptions {
  /**
   * Optional avatar URL to display instead of icon when user is authenticated
   */
  avatar?: string;
}

/**
 * Props for the AnimatedTab component
 */
export interface AnimatedTabProps {
  /** Whether the tab is currently focused/active */
  isFocused: boolean;
  /** Tab navigation options including custom avatar property */
  options: ExtendedTabNavigationOptions;
  /** Color to use when tab is active */
  activeColor: string;
  /** Color to use when tab is inactive */
  inactiveColor: string;
  /** Callback when tab is pressed */
  onPress: () => void;
  /** Callback when tab is long-pressed */
  onLongPress: () => void;
  /** Shared animation progress value for menu expansion */
  animationProgress: SharedValue<number>;
  /** Index of the tab in the tab bar */
  index: number;
}

/**
 * Props for the DummyTab component (used as a spacer/trigger)
 */
export interface DummyTabProps {
  /** Shared animation progress value */
  animationProgress: SharedValue<number>;
  /** Optional callback when dummy tab is pressed */
  onPress?: () => void;
}

/**
 * Configuration for an expanded menu item
 */
export interface ExpandedMenuItem {
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Display label for the menu item */
  label: string;
  /** Route name to navigate to when item is pressed */
  route: string;
  /** Optional avatar URL to display instead of icon when user is authenticated */
  avatar?: string;
}

/**
 * Props for the ExpandedMenuItem component
 */
export interface ExpandedMenuItemProps {
  /** The menu item configuration */
  item: ExpandedMenuItem;
  /** Index of the item in the menu */
  index: number;
  /** Shared animation progress value for menu expansion */
  animationProgress: SharedValue<number>;
  /** Total number of items in the menu */
  totalItems: number;
  /** Whether this item is currently selected */
  isSelected: boolean;
  /** Callback when item is pressed */
  onPress: () => void;
}

/**
 * Props for the LinearTabBar component
 */
export interface LinearTabBarProps extends BottomTabBarProps {
  /** Optional callback when the linear tab bar is pressed */
  onLinearTabPress?: () => void;
  /** Optional callback when a menu item is pressed */
  onMenuItemPress?: (index: number) => void;
  /** Optional custom animation progress shared value (uses internal if not provided) */
  customAnimationProgress?: SharedValue<number>;
  /** Array of menu items to display in the expanded menu */
  menuItems: ExpandedMenuItem[];
  /** Color to use for active tabs (default: "#007AFF") */
  activeColor?: string;
  /** Color to use for inactive tabs (default: "#FFFFFF") */
  inactiveColor?: string;
}
