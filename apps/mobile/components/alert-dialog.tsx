import React, { useEffect, useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import * as Haptics from 'expo-haptics';

export type AlertDialogActionStyle = 'default' | 'cancel' | 'destructive';

export interface AlertDialogAction {
  label: string;
  onPress?: () => void;
  style?: AlertDialogActionStyle;
}

interface AlertDialogProps {
  visible: boolean;
  onClose?: () => void;
  onDismiss?: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: AlertDialogAction[];
  /** When true, tapping backdrop will not close the dialog */
  preventBackdropClose?: boolean;
  /** Fire subtle haptic when opening */
  hapticsOnOpen?: boolean;
  /** Override backdrop color (defaults to black) */
  backdropColor?: string;
  /** Override backdrop opacity (default: 0.45) */
  backdropOpacity?: number;
  testID?: string;
}

/**
 * A lightweight headless Alert Dialog with nativewind classes.
 * Uses a blurred backdrop for a more native feel.
 */
export const AlertDialog: React.FC<AlertDialogProps> = ({
  visible,
  onClose,
  onDismiss,
  title,
  description,
  icon,
  actions,
  preventBackdropClose,
  hapticsOnOpen = true,
  backdropColor,
  backdropOpacity,
  testID,
}) => {

  useEffect(() => {
    if (visible && hapticsOnOpen) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  }, [visible, hapticsOnOpen]);

  const resolvedActions: AlertDialogAction[] = useMemo(
    () => (actions?.length ? actions.slice(0, 3) : [{ label: 'OK', style: 'default' }]),
    [actions]
  );

  const handleBackdropPress = () => {
    if (!preventBackdropClose) onClose?.();
  };

  const handleActionPress = (action: AlertDialogAction) => {
    onClose?.();
    requestAnimationFrame(() => action.onPress?.());
  };

  const overlayColor = backdropColor ?? '#000';
  const overlayOpacity = typeof backdropOpacity === 'number' ? backdropOpacity : 0.45;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onDismiss={onDismiss}
      statusBarTranslucent
      presentationStyle="overFullScreen"
    >
      <View className="flex-1">
        <Pressable onPress={handleBackdropPress} style={StyleSheet.absoluteFillObject}>
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: overlayColor,
                opacity: overlayOpacity,
              },
            ]}
          />
        </Pressable>

        <View className="flex-1 items-center justify-center px-6">
          <View
            testID={testID}
            className="w-full max-w-lg rounded-2xl border border-[#E5E7EB] bg-white"
          >
            {/* Header */}
            <View
              className="gap-2 border-b p-4"
              style={{
                borderColor: '#E5E7EB',
              }}
            >
              <View className="flex-row items-center">
                {!!icon && (
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-black/5">
                    {icon}
                  </View>
                )}
                {!!title && (
                  <Text className="font-KantumruyProSemiBold text-xl leading-relaxed text-slate-900">
                    {title}
                  </Text>
                )}
              </View>
              {!!description && (
                <Text className="font-KantumruyProRegular text-base leading-relaxed text-slate-600">
                  {description}
                </Text>
              )}
            </View>

            {/* Actions */}
            <View className="flex-row items-center justify-between gap-3 p-4">
              {resolvedActions.map((a, idx) => {
                const base =
                  a.style === 'cancel'
                    ? 'bg-black/5 border border-[#E5E7EB]'
                    : a.style === 'destructive'
                    ? 'bg-red-500 border border-red-500'
                    : 'bg-primary border border-primary';

                const textClass = a.style === 'cancel' ? 'text-slate-900' : 'text-white';

                return (
                  <Pressable
                    key={`${idx}-${a.label}`}
                    className={`flex-1 items-center justify-center rounded-xl p-2 ${base}`}
                    style={{ minHeight: 44 }}
                    android_ripple={{
                      color: '#00000010',
                    }}
                    onPress={() => handleActionPress(a)}
                  >
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      className={`text-center font-KantumruyProSemiBold text-base leading-relaxed ${textClass}`}
                    >
                      {a.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertDialog;
