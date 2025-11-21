import '@/global.css';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import {
  Manrope_200ExtraLight,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import * as Device from 'expo-device';
import { useFonts } from 'expo-font';
import { Link, Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Settings } from 'lucide-react-native';
import { useEffect } from 'react';
import { Platform, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ToastContainer } from '@/components/Toast';
import { ThemeToggle } from '@/components/nativewindui/ThemeToggle';
import { PaymentProvider } from '@/context/PaymentContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/cn';
import { useColorScheme } from '@/lib/useColorScheme';
import { NAV_THEME } from '@/theme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const isIos26 = Platform.select({ default: false, ios: Device.osVersion?.startsWith('26.') });

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_200ExtraLight,
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  return (
    <AuthProvider>
      <RootLayoutNav fontsLoaded={fontsLoaded} fontError={fontError} />
    </AuthProvider>
  );
}

function RootLayoutNav({ fontsLoaded, fontError }: { fontsLoaded: boolean; fontError: Error | null }) {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading || (!fontsLoaded && !fontError)) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Wait for redirect to login
      return;
    }

    if (user && inAuthGroup) {
      // Wait for redirect to app
      return;
    }

    // Hide the splash screen once we are in the correct state
    SplashScreen.hideAsync();
  }, [fontsLoaded, fontError, isLoading, user, segments]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Keep splash screen visible while checking auth
  if (isLoading) {
    return null;
  }

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      {/* WRAP YOUR APP WITH ANY ADDITIONAL PROVIDERS HERE */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ToastProvider>
          <PaymentProvider>
            <ActionSheetProvider>
              <NavThemeProvider value={NAV_THEME[colorScheme]}>
                <Stack>
                  <Stack.Screen name="(wallet)" options={{ headerShown: false }} />
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                </Stack>
                <ToastContainer />
              </NavThemeProvider>
            </ActionSheetProvider>
          </PaymentProvider>
        </ToastProvider>
      </GestureHandlerRootView>
    </>
  );
}