import AlertDialog, { AlertDialogAction } from '@/components/alert-dialog';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Alert as RNAlert } from 'react-native';

type RNAlertButton = {
  text?: string;
  onPress?: () => void;
  style?: 'cancel' | 'default' | 'destructive';
};

// RN Alert.alert signature: (title?, message?, buttons?, options?)
interface RNAlertOptions {
  cancelable?: boolean;
  onDismiss?: () => void;
}

interface AlertState {
  visible: boolean;
  title?: string;
  message?: string;
  buttons?: RNAlertButton[];
  options?: RNAlertOptions;
}

export const AlertDialogProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AlertState>({ visible: false });
  const originalRef = useRef<typeof RNAlert.alert | null>(null);
  const isMountedRef = useRef(true);
  const queueRef = useRef<AlertState[]>([]);
  const isTransitioningRef = useRef(false);

  const showNext = useCallback(() => {
    if (!isMountedRef.current) return;
    if (state.visible || isTransitioningRef.current) return;
    const next = queueRef.current.shift();
    if (next) {
      isTransitioningRef.current = true;
      setTimeout(() => {
        if (!isMountedRef.current) return;
        setState({ ...next, visible: true });
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 16);
      }, 16);
    }
  }, [state.visible]);

  const present = useCallback(
    (title?: string, message?: string, buttons?: RNAlertButton[], options?: RNAlertOptions) => {
      // Simple dedupe: if same title+message queued within 500ms, drop it
      const now = Date.now();
      const last = (queueRef.current as any)._lastAt as number | undefined;
      const lastItem = queueRef.current[queueRef.current.length - 1];
      const isSame = lastItem && lastItem.title === title && lastItem.message === message;
      if (isSame && last && now - last < 500) {
        (queueRef.current as any)._lastAt = now;
        return;
      }
      queueRef.current.push({
        visible: false,
        title,
        message,
        buttons,
        options,
      });
      (queueRef.current as any)._lastAt = now;
      if (!state.visible && !isTransitioningRef.current) {
        showNext();
      }
    },
    [showNext, state.visible]
  );

  useEffect(() => {
    isMountedRef.current = true;
    // Save original once
    if (!originalRef.current) {
      originalRef.current = RNAlert.alert;
    }
    RNAlert.alert = (
      title?: string,
      message?: string,
      buttons?: RNAlertButton[],
      options?: RNAlertOptions
    ) => {
      present(title, message, buttons, options);
    };
    return () => {
      isMountedRef.current = false;
      if (originalRef.current) {
        RNAlert.alert = originalRef.current;
      }
    };
  }, [present]);

  const actions: AlertDialogAction[] = useMemo(() => {
    const btns =
      state.buttons && state.buttons.length ? state.buttons.slice(0, 3) : [{} as RNAlertButton];
    const fallbackForStyle = (style?: RNAlertButton['style']) => {
      switch (style) {
        case 'cancel':
          return 'Cancel';
        case 'destructive':
          return 'Delete';
        default:
          return 'OK';
      }
    };
    return btns.map((b) => ({
      label: b.text ?? fallbackForStyle(b.style),
      onPress: b.onPress,
      style: b.style as any,
    }));
  }, [state.buttons]);

  const handleClose = useCallback(() => {
    if (!isMountedRef.current) return;
    isTransitioningRef.current = true;
    setState((s) => ({ ...s, visible: false }));
    // Android does not reliably call onDismiss; advance queue here
    if (Platform.OS !== 'ios') {
      setTimeout(() => {
        if (!isMountedRef.current) return;
        isTransitioningRef.current = false;
        showNext();
      }, 100);
    }
  }, [showNext]);

  const handleDismiss = useCallback(() => {
    // Called when the Modal has finished dismissing (critical for iOS)
    if (!isMountedRef.current) return;
    isTransitioningRef.current = false;
    // Fire RN options.onDismiss if provided
    const cb = state.options?.onDismiss;
    if (cb) {
      try {
        cb();
      } catch {}
    }
    showNext();
  }, [showNext, state.options]);

  return (
    <>
      {children}
      <AlertDialog
        visible={state.visible}
        onClose={handleClose}
        onDismiss={handleDismiss}
        title={state.title}
        description={state.message}
        actions={actions}
      />
    </>
  );
};

export default AlertDialogProvider;
