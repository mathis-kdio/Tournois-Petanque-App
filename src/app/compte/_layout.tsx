import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="infos-perso" />
      <Stack.Screen name="securite" />
    </Stack>
  );
}
