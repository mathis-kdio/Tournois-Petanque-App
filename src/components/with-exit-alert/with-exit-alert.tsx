import { useFocusEffect, useNavigation } from 'expo-router';
import { CommonActions } from 'expo-router/react-navigation';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler } from 'react-native';

const useExitAlertOnBack = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  useFocusEffect(() => {
    const onBackPress = () => {
      const resetAccueil = CommonActions.reset({
        routes: [{ name: 'index' }],
      });
      Alert.alert(
        t('quitter_tournoi'),
        t('quitter_tournoi_question'),
        [
          { text: t('rester'), onPress: () => null, style: 'cancel' },
          {
            text: t('retour_accueil'),
            onPress: () => navigation.dispatch(resetAccueil),
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
