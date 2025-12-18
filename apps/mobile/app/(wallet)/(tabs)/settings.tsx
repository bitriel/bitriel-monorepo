import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Moon,
  HelpCircle,
  FileText,
  ChevronRight,
} from 'lucide-react-native';
import { View, ScrollView, Pressable, Switch } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

import { Text } from '@/components/nativewindui/Text';
import { useColorScheme } from '@/lib/useColorScheme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDarkColorScheme, colors, toggleColorScheme } = useColorScheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top + 16 }} className="px-6 mb-6">
          <Text variant="largeTitle" className="font-bold">
            Settings
          </Text>
        </View>

        {/* Preferences Section */}
        <Animated.View entering={FadeIn.duration(400)} className="px-6 mb-6">
          <Text variant="caption1" className="text-muted-foreground mb-3 uppercase tracking-wider">
            Preferences
          </Text>

          <View
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#FFFFFF',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <SettingsItem
              icon={Bell}
              iconColor="#FF9500"
              label="Notifications"
              isDarkColorScheme={isDarkColorScheme}
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#767577', true: '#007AFF' }}
                />
              }
            />
            <SettingsItem
              icon={Moon}
              iconColor="#8E44AD"
              label="Dark Mode"
              isDarkColorScheme={isDarkColorScheme}
              rightElement={
                <Switch
                  value={isDarkColorScheme}
                  onValueChange={toggleColorScheme}
                  trackColor={{ false: '#767577', true: '#007AFF' }}
                />
              }
            />
            <SettingsItem
              icon={Globe}
              iconColor="#0385FF"
              label="Language"
              isDarkColorScheme={isDarkColorScheme}
              value="English"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              isLast
            />
          </View>
        </Animated.View>

        {/* Security Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="px-6 mb-6">
          <Text variant="caption1" className="text-muted-foreground mb-3 uppercase tracking-wider">
            Security
          </Text>

          <View
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#FFFFFF',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <SettingsItem
              icon={Shield}
              iconColor="#00C853"
              label="Security Settings"
              isDarkColorScheme={isDarkColorScheme}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              isLast
            />
          </View>
        </Animated.View>

        {/* Support Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="px-6 mb-6">
          <Text variant="caption1" className="text-muted-foreground mb-3 uppercase tracking-wider">
            Support
          </Text>

          <View
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: isDarkColorScheme ? '#1C1C1E' : '#FFFFFF',
              borderWidth: 1,
              borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
            }}
          >
            <SettingsItem
              icon={HelpCircle}
              iconColor="#FF3B30"
              label="Help Center"
              isDarkColorScheme={isDarkColorScheme}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
            <SettingsItem
              icon={FileText}
              iconColor="#5856D6"
              label="Terms & Privacy"
              isDarkColorScheme={isDarkColorScheme}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              isLast
            />
          </View>
        </Animated.View>

        {/* App Info */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="px-6 items-center">
          <Text variant="caption1" className="text-muted-foreground">
            Bitriel v1.0.0
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function SettingsItem({
  icon: Icon,
  iconColor,
  label,
  value,
  isDarkColorScheme,
  onPress,
  rightElement,
  isLast = false,
}: {
  icon: React.ComponentType<{ size: number; color: string }>;
  iconColor: string;
  label: string;
  value?: string;
  isDarkColorScheme: boolean;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  isLast?: boolean;
}) {
  const content = (
    <View
      className={`flex-row items-center p-4 ${!isLast ? 'border-b' : ''}`}
      style={{
        borderColor: isDarkColorScheme ? '#2C2C2E' : '#E5E5EA',
      }}
    >
      <View
        style={{ backgroundColor: iconColor }}
        className="w-9 h-9 rounded-lg items-center justify-center mr-3"
      >
        <Icon size={18} color="#FFFFFF" />
      </View>
      <Text variant="body" className="flex-1 font-medium">
        {label}
      </Text>
      {rightElement || (
        <>
          {value && (
            <Text variant="body" className="text-muted-foreground mr-2">
              {value}
            </Text>
          )}
          {onPress && <ChevronRight size={20} color={isDarkColorScheme ? '#666' : '#999'} />}
        </>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} className="active:opacity-70">
        {content}
      </Pressable>
    );
  }

  return content;
}
