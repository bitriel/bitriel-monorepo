import * as React from 'react';
import {
  View,
  ScrollView,
  Pressable,
  StatusBar,
  TextInput,
  Share,
  Alert,
  Clipboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Icon } from '@/components/nativewindui/Icon';
import { Text } from '@/components/nativewindui/Text';
import { useColorScheme } from '@/lib/useColorScheme';

type CryptoAddress = {
  id: string;
  name: string;
  symbol: string;
  address: string;
  icon: string;
  network?: string;
};

const CRYPTO_ADDRESSES: CryptoAddress[] = [
  {
    id: '1',
    name: 'ifeanyiachi.nimbus.com',
    symbol: 'DOMAIN',
    address: 'ifeanyiachi.nimbus.com',
    icon: '🌐',
  },
  {
    id: '2',
    name: 'USDT address',
    symbol: 'USDT',
    address: '0x6B...7eb6',
    icon: '💵',
  },
  {
    id: '3',
    name: 'SOL address',
    symbol: 'SOL',
    address: '0x6B...7eb6',
    icon: '🌊',
  },
  {
    id: '4',
    name: 'Ton address',
    symbol: 'TON',
    address: '0x6B...7eb6',
    icon: '💎',
  },
  {
    id: '5',
    name: 'Ethereum address',
    symbol: 'ETH',
    address: '0x6B...7eb6',
    icon: '⟠',
  },
  {
    id: '6',
    name: 'Bitcoin address',
    symbol: 'BTC',
    address: '0x6B...7eb6',
    icon: '₿',
  },
];

export default function ReceiveCryptoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDarkColorScheme } = useColorScheme();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredAddresses = CRYPTO_ADDRESSES.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCrypto = (crypto: CryptoAddress) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/(routes)/receive/address' as any,
      params: {
        symbol: crypto.symbol,
        name: crypto.name,
        address: crypto.address,
        icon: crypto.icon,
      },
    });
  };

  const handleCopyAddress = (address: string, name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Clipboard.setString(address);
    Alert.alert('Copied!', `${name} address copied to clipboard`);
  };

  const handleShowQR = (crypto: CryptoAddress) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/(routes)/receive/address' as any,
      params: {
        symbol: crypto.symbol,
        name: crypto.name,
        address: crypto.address,
        icon: crypto.icon,
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkColorScheme ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 16,
          backgroundColor: colors.root,
        }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            className="size-10 items-center justify-center active:opacity-70"
          >
            <Icon name="chevron.left" size={24} color={colors.foreground} />
          </Pressable>
          <Text className="text-lg font-semibold">Receive crypto</Text>
          <View className="size-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View className="px-5 pt-6">
          <View
            className="flex-row items-center gap-3 rounded-2xl px-4 py-3"
            style={{ backgroundColor: colors.grey6 }}
          >
            <Icon name="magnifyingglass" size={20} color={colors.grey} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search crypto"
              placeholderTextColor={colors.grey}
              style={{
                flex: 1,
                color: colors.foreground,
                fontSize: 16,
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Main Domain Address */}
        {filteredAddresses.length > 0 && filteredAddresses[0].symbol === 'DOMAIN' && (
          <View className="px-5 pt-6">
            <Pressable
              onPress={() => handleSelectCrypto(filteredAddresses[0])}
              className="rounded-2xl p-4 active:opacity-90"
              style={{ backgroundColor: colors.card }}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="size-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors.grey6 }}
                >
                  <Text className="text-2xl">{filteredAddresses[0].icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-base font-semibold">
                    {filteredAddresses[0].address}
                  </Text>
                  <Text className="text-sm opacity-60">
                    Share this address with{'\n'}friends to receive payments
                  </Text>
                </View>
                <Pressable
                  onPress={() =>
                    handleCopyAddress(filteredAddresses[0].address, filteredAddresses[0].name)
                  }
                  className="size-10 items-center justify-center rounded-full active:opacity-70"
                  style={{ backgroundColor: colors.grey6 }}
                >
                  <Icon name="doc.on.doc" size={20} color={colors.foreground} />
                </Pressable>
              </View>
            </Pressable>
          </View>
        )}

        {/* Crypto Address List */}
        <View className="px-5 pt-6">
          <View className="gap-3">
            {filteredAddresses.slice(1).map((crypto) => (
              <Pressable
                key={crypto.id}
                onPress={() => handleSelectCrypto(crypto)}
                className="flex-row items-center gap-3 rounded-2xl p-4 active:opacity-90"
                style={{ backgroundColor: colors.card }}
              >
                <View
                  className="size-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: colors.grey6 }}
                >
                  <Text className="text-2xl">{crypto.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-base font-semibold">{crypto.name}</Text>
                  <Text className="text-sm opacity-60">{crypto.address}</Text>
                </View>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => handleShowQR(crypto)}
                    className="size-10 items-center justify-center rounded-full active:opacity-70"
                    style={{ backgroundColor: colors.grey6 }}
                  >
                    <Icon name="qrcode" size={20} color={colors.foreground} />
                  </Pressable>
                  <Pressable
                    onPress={() => handleCopyAddress(crypto.address, crypto.name)}
                    className="size-10 items-center justify-center rounded-full active:opacity-70"
                    style={{ backgroundColor: colors.grey6 }}
                  >
                    <Icon name="doc.on.doc" size={20} color={colors.foreground} />
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Receive Other Assets */}
        <View className="px-5 pt-6">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              console.log('Receive other assets');
            }}
            className="flex-row items-center justify-between rounded-2xl p-4 active:opacity-90"
            style={{ backgroundColor: colors.card }}
          >
            <Text className="text-base font-medium">Receive other assets</Text>
            <Icon name="chevron.right" size={20} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Empty State */}
        {filteredAddresses.length === 0 && (
          <View className="items-center justify-center px-12 pt-20">
            <Icon name="magnifyingglass" size={48} color={colors.grey} />
            <Text className="mt-4 text-center text-base opacity-60">
              No crypto found matching "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
