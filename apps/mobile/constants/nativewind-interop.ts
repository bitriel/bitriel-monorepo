import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';

// Enable className for non-RN components
cssInterop(Image, { className: { target: 'style' } });
