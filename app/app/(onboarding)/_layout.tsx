import { Stack } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.neutral.cream },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="language" />
      <Stack.Screen name="level" />
      <Stack.Screen name="motivation" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="obstacles" />
      <Stack.Screen name="genre" />
      <Stack.Screen name="suggestions" />
      <Stack.Screen name="confirm" />
    </Stack>
  );
}
