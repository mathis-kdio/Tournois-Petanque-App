import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler } from 'react-native';

const useExitAlertOnBack = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any, any>>();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        const resetAccueil = CommonActions.reset({
          index: 0,
          routes: [{ name: 'AccueilGeneral' }],
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
    }, [navigation, t]),
  );
};

export default useExitAlertOnBack;
