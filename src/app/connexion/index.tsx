import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import Authentification from '@/screens/connexion';
import { supabaseClient } from '@/utils/supabase';
import { getThemeColor } from '@/utils/theme/theme';
import { AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabaseClient.auth.startAutoRefresh();
  } else {
    supabaseClient.auth.stopAutoRefresh();
  }
});

const AuthentificationScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <Authentification />
    </SafeAreaView>
  );
};

export default AuthentificationScreen;
