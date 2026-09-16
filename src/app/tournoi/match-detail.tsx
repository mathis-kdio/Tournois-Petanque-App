import Loading from '@/components/Loading';
import { KeyboardAvoidingView } from '@/components/ui/keyboard-avoiding-view';
import { useTheme } from '@/components/ui/theme-provider/ThemeProvider';
import MatchDetail from '@/screens/match-detail';
import { getThemeColor } from '@/utils/theme/theme';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useRef } from 'react';

type SearchParams = {
  idMatch?: string;
};

const MatchDetailScreen = () => {
  const { theme } = useTheme();
  const color = getThemeColor(theme);
  const isMounted = useRef(true);

  const param = useLocalSearchParams<SearchParams>();

  const idMatchParams = parseInt(param.idMatch ?? '');

  // Cleanup pour éviter les fuites mémoire
  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, [])
  );

  if (isNaN(idMatchParams)) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : 'height'}
      style={{ flex: 1, zIndex: 999 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
        <MatchDetail idMatch={idMatchParams} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default MatchDetailScreen;
