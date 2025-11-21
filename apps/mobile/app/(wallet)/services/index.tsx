import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Ticket,
  UtensilsCrossed,
  Car,
  Home,
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/nativewindui/Text';
import { useColorScheme } from '@/lib/useColorScheme';

const SERVICES = [
  {
    id: '1',
    category: 'Shopping',
    icon: ShoppingCart,
    gradient: ['#FF3B57', '#FF6B35'],
    items: [
      { name: 'Local Markets', description: 'Traditional goods & crafts' },
      { name: 'Fashion Stores', description: 'Latest trends & designs' },
      { name: 'Souvenirs', description: 'Take home memories' },
    ],
  },
  {
    id: '2',
    category: 'Tours & Tickets',
    icon: Ticket,
    gradient: ['#0385FF', '#00C853'],
    items: [
      { name: 'City Tours', description: 'Guided heritage walks' },
      { name: 'Museums', description: 'Art & history exhibitions' },
      { name: 'Theme Parks', description: 'Fun for all ages' },
    ],
  },
  {
    id: '3',
    category: 'Dining',
    icon: UtensilsCrossed,
    gradient: ['#FF9500', '#FFB800'],
    items: [
      { name: 'Local Cuisine', description: 'Authentic flavors' },
      { name: 'Fine Dining', description: 'Premium restaurants' },
      { name: 'Street Food', description: 'Quick bites' },
    ],
  },
  {
    id: '4',
    category: 'Transportation',
    icon: Car,
    gradient: ['#8E44AD', '#C39BD3'],
    items: [
      { name: 'Ride Sharing', description: 'Quick & affordable' },
      { name: 'Car Rental', description: 'Self-drive options' },
      { name: 'Public Transit', description: 'Buses & trains' },
    ],
  },
  {
    id: '5',
    category: 'Accommodation',
    icon: Home,
    gradient: ['#E74C3C', '#FF6B9D'],
    items: [
      { name: 'Hotels', description: 'Luxury stays' },
      { name: 'Hostels', description: 'Budget-friendly' },
      { name: 'Vacation Rentals', description: 'Home away from home' },
    ],
  },
];

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useColorScheme();

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="px-6 pb-4 border-b border-border">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            className="active:opacity-70"
          >
            <ChevronLeft size={28} color={colors.foreground} />
          </Pressable>
          <Text variant="title3" className="font-semibold">
            All Services
          </Text>
          <View className="w-7" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-6">
        <View className="gap-6">
          {SERVICES.map((service, index) => (
            <Animated.View key={service.id} entering={FadeInDown.delay(index * 100).duration(400)}>
              <ServiceCategory service={service} />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ServiceCategory({ service }: { service: (typeof SERVICES)[number] }) {
  const { colors } = useColorScheme();
  return (
    <View className="bg-card rounded-3xl p-5 border border-border shadow-sm">
      <View className="flex-row items-center gap-3 mb-4">
        <View
          style={{ backgroundColor: service.gradient[0] }}
          className="w-14 h-14 rounded-2xl items-center justify-center"
        >
          <service.icon size={28} color="#FFFFFF" />
        </View>
        <Text variant="title3" className="font-semibold flex-1">
          {service.category}
        </Text>
      </View>
      <View className="gap-3">
        {service.items.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            className="active:opacity-70"
          >
            <View className="flex-row items-center justify-between py-2">
              <View className="flex-1">
                <Text variant="callout" className="font-semibold mb-0.5">
                  {item.name}
                </Text>
                <Text variant="caption1" className="text-muted-foreground">
                  {item.description}
                </Text>
              </View>
              <ChevronRight size={20} color={colors.mutedForeground} />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
