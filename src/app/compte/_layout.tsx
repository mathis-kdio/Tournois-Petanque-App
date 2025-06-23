import { useAuth } from '@/components/supabase/SessionProvider';
import { Stack } from 'expo-router';

export default function StackLayout() {
  const { session } = useAuth();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="index" />
        <Stack.Screen name="infos-perso" />
        <Stack.Screen name="securite" />
      </Stack.Protected>
    </Stack>
  );
}
