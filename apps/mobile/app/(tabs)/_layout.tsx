import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { Icon } from '@/components/nativewindui/Icon';
import { useColorScheme } from '@/lib/useColorScheme';

export default function TabLayout() {
  const { colors } = useColorScheme();

  return (
    <Tabs
      initialRouteName="wallet"
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {
          backgroundColor: colors.root,
          borderTopColor: colors.border,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <Icon name="creditcard.fill" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <Icon name="clock.fill" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stake"
        options={{
          title: 'Stake',
          tabBarIcon: ({ color, size }) => <Icon name="chart.bar.fill" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="card"
        options={{
          title: 'Card',
          tabBarIcon: ({ color, size }) => <Icon name="square.fill" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Icon name="globe" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
