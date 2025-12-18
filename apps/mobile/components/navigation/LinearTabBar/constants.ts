import { Dimensions } from 'react-native';

/** Screen width for tab bar calculations */
export const WIDTH: number = Dimensions.get('window').width;

/** Duration for tab bar animations in milliseconds */
export const ANIMATION_DURATION = 400;

/** Spring configuration for smooth animations */
export const SPRING_CONFIG = {
  damping: 15,
  stiffness: 190,
  mass: 0.8,
};

/** Size constants for tab bar icons */
export const TAB_ICON_SIZE = 28;
export const AVATAR_SIZE = 32;

/** Animation thresholds for menu expansion */
export const MENU_START_THRESHOLD = 0.4;
export const MENU_STAGGER_DELAY = 0.05;
export const MENU_ITEM_DURATION = 0.3;
export const MENU_PLAY_THRESHOLD = 0.8;
export const MENU_RESET_THRESHOLD = 0.3;
export const MENU_INTERACTIVE_THRESHOLD = 0.7;

/** Border radius for avatars */
export const AVATAR_BORDER_RADIUS = 9999;

/** Border widths */
export const AVATAR_BORDER_WIDTH_FOCUSED = 2;
export const AVATAR_BORDER_WIDTH_UNFOCUSED = 1;

/** Opacity values */
export const AVATAR_BORDER_OPACITY = 0.3;
export const MENU_BACKGROUND_OPACITY_SELECTED = 0.15;
