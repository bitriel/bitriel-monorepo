import { HapticFeedBackWeight } from './types';
import * as Haptics from 'expo-haptics';

export async function triggerHaptics<T extends HapticFeedBackWeight>(weight?: T): Promise<void> {
  switch (weight) {
    case 'soft':
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      break;
    case 'normal':
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case 'heavy':
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    default:
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}
