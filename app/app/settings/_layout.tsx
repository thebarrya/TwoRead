import { Stack } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.neutral.white,
        },
        headerTintColor: colors.neutral.black,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen
        name="edit-profile"
        options={{
          title: 'Modifier le profil',
          headerBackTitle: 'Retour',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          headerBackTitle: 'Retour',
        }}
      />
      <Stack.Screen
        name="reading-preferences"
        options={{
          title: 'Préférences de lecture',
          headerBackTitle: 'Retour',
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: 'Aide et support',
          headerBackTitle: 'Retour',
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: 'À propos',
          headerBackTitle: 'Retour',
        }}
      />
    </Stack>
  );
}
