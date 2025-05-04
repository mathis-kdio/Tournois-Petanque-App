import { CommonActions, NavigationProp } from '@react-navigation/native';
import { TFunction } from 'i18next';
import React from 'react';
import { Alert, BackHandler } from 'react-native';

type WithExitAlertProps = {
  navigation: NavigationProp<any>;
  t: TFunction;
};

export default class WithExitAlert<
  P extends WithExitAlertProps,
  S,
> extends React.Component<P, S> {
  focusListener = null;
  blurListener = null;
  backHandler = null;

  componentDidMount() {
    const { navigation } = this.props;

    this.focusListener = navigation.addListener('focus', () => {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackPress,
      );
    });

    this.blurListener = navigation.addListener('blur', () => {
      if (this.backHandler) this.backHandler.remove();
    });
  }

  componentWillUnmount() {
    if (this.focusListener) this.focusListener();
    if (this.blurListener) this.blurListener();
    if (this.backHandler) this.backHandler.remove();
  }

  resetAccueil = CommonActions.reset({
    index: 0,
    routes: [{ name: 'AccueilGeneral' }],
  });

  onBackPress = () => {
    const { t } = this.props;
    Alert.alert(
      t('quitter_tournoi'),
      t('quitter_tournoi_question'),
      [
        { text: t('rester'), onPress: () => null, style: 'cancel' },
        {
          text: t('retour_accueil'),
          onPress: () => this.props.navigation.dispatch(this.resetAccueil),
        },
      ],
      { cancelable: true },
    );

    return true;
  };
}
