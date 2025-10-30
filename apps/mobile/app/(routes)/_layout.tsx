import { Stack } from 'expo-router';

export default function RoutesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="send/[asset]" />
      <Stack.Screen name="send/amount" />
      <Stack.Screen name="send/review" />
      <Stack.Screen name="receive/index" />
      <Stack.Screen name="receive/address" />
      <Stack.Screen name="receive/request" />
      <Stack.Screen name="receive/share" />
    </Stack>
  );
}
