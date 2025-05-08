import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import React from 'react';
import Inscriptions from '@components/Inscriptions';
import { withTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { TFunction } from 'i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { PropsFromRedux, connector } from '@/store/connector';
import { RouteProp, StackActions } from '@react-navigation/native';
import { GeneralStackParamList } from '@/navigation/Navigation';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
  route: RouteProp<GeneralStackParamList, 'CreateListeJoueurs'>;
}

interface State {}

class CreateListeJoueur extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  _dispatch(type: string, listId: number) {
    if (type === 'create') {
      const addSavedList = {
        type: 'ADD_SAVED_LIST',
        value: {
          typeInscription: ModeTournoi.AVECNOMS,
          savedList: this.props.listesJoueurs.sauvegarde,
        },
      };
      this.props.dispatch(addSavedList);
    } else if (type === 'edit' && listId !== undefined) {
      const updateSavedList = {
        type: 'UPDATE_SAVED_LIST',
        value: {
          typeInscription: ModeTournoi.AVECNOMS,
          listId: listId,
          savedList: this.props.listesJoueurs.sauvegarde,
        },
      };
      this.props.dispatch(updateSavedList);
    }

    this.props.navigation.dispatch(StackActions.pop(1));
  }

  _submitButton() {
    const { t } = this.props;
    let params = this.props.route.params;
    if (params) {
      let nbPlayers = this.props.listesJoueurs.sauvegarde.length;
      let title = 'error';
      if (params.type === 'create') {
        title = t('creer_liste');
      } else if (params.type === 'edit') {
        title = t('valider_modification');
      }
      return (
        <Button
          isDisabled={nbPlayers === 0}
          action="positive"
          onPress={() => this._dispatch(params.type, params.listId)}
        >
          <ButtonText>{title}</ButtonText>
        </Button>
      );
    }
  }

  render() {
    const { t } = this.props;
    let nbJoueurs = 0;
    if (this.props.listesJoueurs.sauvegarde) {
      nbJoueurs = this.props.listesJoueurs.sauvegarde.length;
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <VStack className="flex-1 bg-[#0594ae]">
          <TopBarBack
            title={t('creation_liste_joueurs_navigation_title')}
            navigation={this.props.navigation}
          />
          <VStack className="flex-1 justify-between">
            <Text className="text-white text-xl text-center">
              {t('nombre_joueurs', { nb: nbJoueurs })}
            </Text>
            <Inscriptions
              navigation={this.props.navigation}
              loadListScreen={true}
            />
            <Box className="px-10">{this._submitButton()}</Box>
          </VStack>
        </VStack>
      </SafeAreaView>
    );
  }
}

export default connector(withTranslation()(CreateListeJoueur));
