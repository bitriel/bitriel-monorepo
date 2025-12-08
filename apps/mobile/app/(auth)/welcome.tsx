import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import { useAuth as useAuthHook } from '@/hooks/useAuth';
import { useColorScheme } from '@/lib/useColorScheme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Wallet } from 'lucide-react-native';
import React from 'react';
import {View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const { handleOAuthLogin, isLoading } = useAuthHook();
  const { colors, isDarkColorScheme } = useColorScheme();

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-12 items-center justify-center rounded-full bg-primary/10 p-8">
            <Wallet size={64} color={colors.primary} />
          </View>
          
          <Text variant="largeTitle" className="mb-4 text-center font-extrabold text-foreground">
            Welcome to Bitriel
          </Text>
          
          <Text variant="body" className="mb-12 text-center text-muted-foreground text-lg">
            Your secure gateway to the crypto world. Manage assets, track portfolio, and more.
          </Text>
        </View>

        <View className="px-8 pb-12">
          <Button
            size="lg"
            className="w-full shadow-lg shadow-primary/25"
            onPress={handleOAuthLogin}
            disabled={isLoading}
          >
            <Text className="text-white font-bold text-lg mr-2">
              {isLoading ? 'Authenticating...' : 'Login with Koompi'}
            </Text>
            {!isLoading && <ArrowRight size={20} color="white" />}
          </Button>
          
          <Text variant="caption1" className="mt-6 text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
