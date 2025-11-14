import { Stack } from 'expo-router';

export default function EarnLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="merchants" />
      <Stack.Screen name="cashback" />
      <Stack.Screen name="savings" />
      <Stack.Screen name="history" />
      <Stack.Screen name="points" />
      <Stack.Screen name="swap-points" />
    </Stack>
  );
}
