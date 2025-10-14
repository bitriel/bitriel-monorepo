import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';

// Enable className for non-RN components
cssInterop(Image, { className: { target: 'style' } });
