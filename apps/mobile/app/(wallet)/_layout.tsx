import { Stack } from 'expo-router';

export default function WalletLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="transactions" />
      <Stack.Screen name="services" />
      <Stack.Screen name="add-funds" />
      <Stack.Screen name="scan-qr" />
      <Stack.Screen name="my-cards" />
      <Stack.Screen name="send" />
      <Stack.Screen name="receive" />
      <Stack.Screen name="payment" />
    </Stack>
  );
}

