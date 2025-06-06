import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="joueurs-tournoi" />
      <Stack.Screen name="match-detail" />
      <Stack.Screen name="parametres-tournoi" />
      <Stack.Screen name="pdf-export" />
    </Stack>
  );
}
