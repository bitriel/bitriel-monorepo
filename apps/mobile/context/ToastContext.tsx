import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';

export interface ToastConfig {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  showToast: (config: ToastConfig) => void;
  success: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  // Expose current toast state for rendering
  toastState: {
    message: string;
    variant: ToastVariant;
    isVisible: boolean;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const TOAST_VARIANTS = {
  success: {
    backgroundColor: '#10B981',
    icon: 'checkmark-circle' as const,
  },
  warning: {
    backgroundColor: '#F59E0B',
    icon: 'warning' as const,
  },
  error: {
    backgroundColor: '#EF4444',
    icon: 'alert-circle' as const,
  },
  info: {
    backgroundColor: '#3B82F6',
    icon: 'information-circle' as const,
  },
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<ToastVariant>('info');
  const [isVisible, setIsVisible] = useState(false);

  const showToast = useCallback(({ message, variant = 'info', duration = 4000 }: ToastConfig) => {
    setMessage(message);
    setVariant(variant);
    setIsVisible(true);

    // Auto-hide after duration
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setMessage(''), 300); // Clear message after fade out
    }, duration);
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, variant: 'success', duration });
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, variant: 'warning', duration });
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, variant: 'error', duration });
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, variant: 'info', duration });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        success,
        warning,
        error,
        info,
        toastState: { message, variant, isVisible },
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
