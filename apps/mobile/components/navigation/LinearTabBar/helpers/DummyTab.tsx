import { ANIMATION_DURATION } from '../constants';
import { DummyTabProps } from '../types';
import { triggerHaptics } from '../utils';
import { ChevronUp } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { styles } from '../styles';

const DummyTab: React.FC<DummyTabProps> = ({ animationProgress, onPress: onDummyPress }) => {
  const onPress = (): void => {
    if (onDummyPress) onDummyPress();
    triggerHaptics('soft');
    if (animationProgress.value === 0) {
      animationProgress.value = withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      animationProgress.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  };

  const animatedIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.25, 0.4],
      [1, 0.5, 0],
      Extrapolation.CLAMP
    );

    const counterScale = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [1, 2, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale: counterScale }],
    };
  });

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.tab}>
      <Animated.View style={[styles.dummyIcon, animatedIconStyle]}>
        <ChevronUp size={24} color="white" />
      </Animated.View>
    </TouchableOpacity>
  );
};

export { DummyTab };
