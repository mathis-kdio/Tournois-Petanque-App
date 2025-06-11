import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler } from 'react-native';

const useExitAlertOnBack = () => {
  const { t } = useTranslation();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          t('quitter_tournoi'),
          t('quitter_tournoi_question'),
          [
            { text: t('rester'), onPress: () => null, style: 'cancel' },
            {
              text: t('retour_accueil'),
              onPress: () => router.replace('/'),
            },
          ],
          { cancelable: true },
        );
        return true; // bloque le retour
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [router, t]),
  );
};

export default useExitAlertOnBack;
