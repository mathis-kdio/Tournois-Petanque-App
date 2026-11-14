import { resetNavigationTo } from '@/navigation/resetNavigation';
import { useFocusEffect, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler } from 'react-native';

const useExitAlertOnBack = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  useFocusEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        t('quitter_tournoi'),
        t('quitter_tournoi_question'),
        [
          { text: t('rester'), onPress: () => null, style: 'cancel' },
          {
            text: t('retour_accueil'),
            onPress: () => resetNavigationTo(navigation, 'index'),
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
  });
};

export default useExitAlertOnBack;
