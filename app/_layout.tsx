import { Stack } from 'expo-router';
import Time from '../components/GlobalTimeContext';

export default function RootLayoutScreen() {
  return (
    <Time>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="counting" options={{ headerShown: false }} />
      </Stack>
    </Time>
  );
}
