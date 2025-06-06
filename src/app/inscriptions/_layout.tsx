import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="choix-type-tournoi" />
      <Stack.Screen name="choix-mode-tournoi" />
      <Stack.Screen name="options-tournoi" />
      <Stack.Screen name="inscriptions-avec-noms" />
      <Stack.Screen name="inscriptions-sans-noms" />
      <Stack.Screen name="choix-complement" />
      <Stack.Screen name="liste-terrains" />
      <Stack.Screen name="generation-matchs" />
    </Stack>
  );
}
