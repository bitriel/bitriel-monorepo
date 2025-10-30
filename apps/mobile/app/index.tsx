import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the wallet tab
  return <Redirect href="/(tabs)/wallet" />;
}
