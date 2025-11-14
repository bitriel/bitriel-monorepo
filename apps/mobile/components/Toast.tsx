import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/nativewindui/Text';
import { useToast } from '@/context/ToastContext';

export function ToastContainer() {
  const { toastState } = useToast();
  const insets = useSafeAreaInsets();

  if (!toastState.isVisible) {
    return null;
  }

  const variantConfig = {
    success: {
      icon: CheckCircle2,
      backgroundColor: '#10B981',
      iconColor: '#FFFFFF',
    },
    error: {
      icon: AlertCircle,
      backgroundColor: '#EF4444',
      iconColor: '#FFFFFF',
    },
    warning: {
      icon: AlertTriangle,
      backgroundColor: '#F59E0B',
      iconColor: '#FFFFFF',
    },
    info: {
      icon: Info,
      backgroundColor: '#3B82F6',
      iconColor: '#FFFFFF',
    },
  };

  const config = variantConfig[toastState.variant];
  const IconComponent = config.icon;

  return (
    <Animated.View
      entering={FadeInUp.duration(300).springify()}
      exiting={FadeOutUp.duration(200)}
      style={{
        position: 'absolute',
        top: insets.top + 8,
        left: 16,
        right: 16,
        zIndex: 9999,
      }}
    >
      <View
        style={{
          backgroundColor: config.backgroundColor,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconComponent size={20} color={config.iconColor} />
        </View>
        <Text
          variant="callout"
          style={{
            color: '#FFFFFF',
            flex: 1,
            fontWeight: '600',
          }}
        >
          {toastState.message}
        </Text>
      </View>
    </Animated.View>
  );
}
