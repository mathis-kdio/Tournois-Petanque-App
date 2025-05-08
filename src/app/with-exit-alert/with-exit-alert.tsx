import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler, NativeEventSubscription } from 'react-native';

type WithExitAlertProps = {
  navigation: NavigationProp<any>;
  t: TFunction;
};

const WithExitAlert = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any, any>>();

  let focusListener: () => void;
  let blurListener: () => void;
  let backHandler: NativeEventSubscription;

  const resetAccueil = CommonActions.reset({
    index: 0,
    routes: [{ name: 'AccueilGeneral' }],
  });

  const onBackPress = () => {
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

    return true;
  };

  useEffect(() => {
    focusListener = navigation.addListener('focus', () => {
      backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
    });

    blurListener = navigation.addListener('blur', () => {
      if (backHandler) {
        backHandler.remove();
      }
    });

    return () => {
      if (focusListener) {
        focusListener();
      }
      if (blurListener) {
        blurListener();
      }
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, [navigation, onBackPress]);
};

export default WithExitAlert;
