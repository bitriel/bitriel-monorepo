import { StatusBar } from 'expo-status-bar';
import { Linking, Platform, View } from 'react-native';

import { FileText } from 'lucide-react-native';
import { Text } from '@/components/nativewindui/Text';
import { useColorScheme } from '@/lib/useColorScheme';

export default function ModalScreen() {
  const { colors, colorScheme } = useColorScheme();
  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <View className="pb-safe flex-1 items-center justify-center gap-1 px-12">
        <FileText size={42} color={colors.grey} />
        <Text variant="title3" className="pb-1 text-center font-semibold">
          NativewindUI
        </Text>
        <Text color="tertiary" variant="subhead" className="pb-4 text-center">
          You can install any of the free components from the{' '}
          <Text
            onPress={() => Linking.openURL('https://nativewindui.com')}
            variant="subhead"
            className="text-primary">
            NativewindUI
          </Text>
          {' website.'}
        </Text>
      </View>
    </>
  );
}
