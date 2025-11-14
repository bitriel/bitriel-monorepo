import { Stack } from 'expo-router';

export default function PaymentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="card" />
      <Stack.Screen name="bank" />
      <Stack.Screen name="crypto" />
      <Stack.Screen name="confirm" />
    </Stack>
  );
}
