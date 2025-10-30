import * as React from 'react';
import { View, ScrollView, Pressable, StatusBar, TextInput, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Icon } from '@/components/nativewindui/Icon';
import { Text } from '@/components/nativewindui/Text';
import { useColorScheme } from '@/lib/useColorScheme';

type RecentTransfer = {
  id: string;
  name: string;
  address: string;
};

type SavedAddress = {
  id: string;
  name: string;
  address: string;
};

const MOCK_RECENT_TRANSFERS: RecentTransfer[] = [
  { id: '1', name: 'stepprofile', address: 'TCsMaX....pimpc' },
  { id: '2', name: 'Emerie.sol', address: 'TCsMaX....pimpc' },
  { id: '3', name: 'XOhhsu...plqawe', address: 'XOhhsu...plqawe' },
];

const MOCK_SAVED_ADDRESSES: SavedAddress[] = [
  { id: '1', name: 'My okx sol address', address: 'Zx97hl...09pUyv' },
  { id: '2', name: 'Mine 🤑❤️', address: 'TCsMaX...pImapc' },
  { id: '3', name: 'Chinnie Funds', address: 'mz5qC2...oeJQ9zl' },
  { id: '4', name: 'Just rite', address: 'lokMnA...UytREq' },
  { id: '5', name: 'Jendol supermarket', address: 'pqla27...plwmpc' },
  { id: '6', name: 'Pelumi mechanic', address: 'WAzrpt...90uJaq' },
];

export default function SendAssetScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDarkColorScheme } = useColorScheme();

  const asset = (params.asset as string) || 'SOL';
  const [address, setAddress] = React.useState('');
  const [isAddressFound, setIsAddressFound] = React.useState(false);
  const [foundName, setFoundName] = React.useState('');

  const handleAddressChange = (text: string) => {
    setAddress(text);
    // Simulate address validation
    if (text.length > 20) {
      setIsAddressFound(true);
      setFoundName('TCsMaX...klaZZq');
    } else {
      setIsAddressFound(false);
      setFoundName('');
    }
  };

  const handleSelectAddress = (selectedAddress: string, name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAddress(selectedAddress);
    setIsAddressFound(true);
    setFoundName(name);
    Keyboard.dismiss();
  };

  const handleContinue = () => {
    if (address) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push({
        pathname: '/(routes)/send/amount' as any,
        params: { asset, address, recipientName: foundName },
      });
    }
  };

  const handleScanQR = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement QR scanner
    console.log('Scan QR code');
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
          <Text className="text-lg font-semibold">Send {asset}</Text>
          <View className="size-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Address Input */}
        <View className="px-5 pt-6">
          <Text className="mb-3 text-sm opacity-60">To</Text>
          <View
            className="flex-row items-center gap-3 rounded-2xl px-4 py-3"
            style={{ backgroundColor: colors.grey6 }}
          >
            <TextInput
              value={address}
              onChangeText={handleAddressChange}
              placeholder="Enter address"
              placeholderTextColor={colors.grey}
              style={{
                flex: 1,
                color: colors.foreground,
                fontSize: 16,
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable onPress={handleScanQR} className="active:opacity-70">
              <View
                className="size-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: colors.primary }}
              >
                <Icon name="qrcode" size={18} color="white" />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Address Found */}
        {isAddressFound && (
          <View className="px-5 pt-4">
            <Text className="mb-3 text-sm font-medium">Address found</Text>
            <View
              className="flex-row items-center gap-3 rounded-2xl p-4"
              style={{ backgroundColor: colors.card }}
            >
              <View
                className="size-10 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.grey6 }}
              >
                <Icon name="person.fill" size={20} color={colors.foreground} />
              </View>
              <Text className="text-base font-medium">{foundName}</Text>
            </View>
          </View>
        )}

        {/* Recent Transfers */}
        {!isAddressFound && (
          <>
            <View className="px-5 pt-6">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-base font-semibold">Recent transfers</Text>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className="active:opacity-70"
                >
                  <Text className="text-sm font-medium" style={{ color: colors.primary }}>
                    View all
                  </Text>
                </Pressable>
              </View>

              <View className="gap-2">
                {MOCK_RECENT_TRANSFERS.map((transfer) => (
                  <Pressable
                    key={transfer.id}
                    onPress={() => handleSelectAddress(transfer.address, transfer.name)}
                    className="flex-row items-center gap-3 rounded-xl p-3 active:opacity-70"
                    style={{ backgroundColor: colors.card }}
                  >
                    <View
                      className="size-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.grey6 }}
                    >
                      <Icon name="person.fill" size={20} color={colors.foreground} />
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1 text-base font-medium">{transfer.name}</Text>
                      <Text className="text-sm opacity-60">{transfer.address}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Saved Addresses */}
            <View className="px-5 pt-6">
              <Text className="mb-4 text-base font-semibold">My saved address</Text>
              <View className="gap-2">
                {MOCK_SAVED_ADDRESSES.map((saved) => (
                  <Pressable
                    key={saved.id}
                    onPress={() => handleSelectAddress(saved.address, saved.name)}
                    className="flex-row items-center gap-3 rounded-xl p-3 active:opacity-70"
                    style={{ backgroundColor: colors.card }}
                  >
                    <View
                      className="size-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.grey6 }}
                    >
                      <Icon name="person.fill" size={20} color={colors.foreground} />
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1 text-base font-medium">{saved.name}</Text>
                      <Text className="text-sm opacity-60">{saved.address}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View
        className="px-5 pb-6"
        style={{
          paddingBottom: insets.bottom + 24,
          backgroundColor: colors.background,
        }}
      >
        <Pressable
          onPress={handleContinue}
          disabled={!address}
          className="items-center justify-center rounded-2xl py-4 active:opacity-90"
          style={{
            backgroundColor: address ? (isAddressFound ? '#FF8A3D' : colors.grey4) : colors.grey4,
          }}
        >
          <Text className="text-lg font-semibold text-white">Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}
