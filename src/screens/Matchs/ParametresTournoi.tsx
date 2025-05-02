import { ScrollView } from '@/components/ui/scroll-view';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
} from '@/components/ui/alert-dialog';

import { Text } from '@/components/ui/text';
import { Button, ButtonText, ButtonGroup } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { PropsFromRedux, connector } from '@/store/connector';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
}

interface State {
  modalDeleteIsOpen: boolean;
}

class ParametresTournoi extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalDeleteIsOpen: false,
    };
  }

  _showMatchs() {
    this.props.navigation.navigate('ListeMatchsStack');
  }

  _supprimerTournoi() {
    this.setState({ modalDeleteIsOpen: false });
    this.props.navigation.reset({
      index: 0,
      routes: [
        {
          name: 'AccueilGeneral',
        },
      ],
    });
    const supprDansListeTournois = {
      type: 'SUPPR_TOURNOI',
      value: {
        tournoiId:
          this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID,
      },
    };
    this.props.dispatch(supprDansListeTournois);
    const suppressionAllMatchs = { type: 'SUPPR_MATCHS' };
    this.props.dispatch(suppressionAllMatchs);
  }

  _modalSupprimerTournoi() {
    const { t } = this.props;
    let tournoiId = 0;
    if (this.props.listeMatchs) {
      tournoiId =
        this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID;
    }
    return (
      <AlertDialog
        isOpen={this.state.modalDeleteIsOpen}
        onClose={() => this.setState({ modalDeleteIsOpen: false })}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-black">
              {t('supprimer_tournoi_actuel_modal_titre')}
            </Heading>
            <AlertDialogCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>
              {t('supprimer_tournoi_actuel_modal_texte', { id: tournoiId })}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup flexDirection="row">
              <Button
                variant="outline"
                action="secondary"
                onPress={() => this.setState({ modalDeleteIsOpen: false })}
              >
                <ButtonText className="text-black">{t('annuler')}</ButtonText>
              </Button>
              <Button
                action="negative"
                onPress={() => this._supprimerTournoi()}
              >
                <ButtonText>{t('oui')}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  render() {
    const { t } = this.props;
    let parametresTournoi = {
      nbTours: 0,
      nbPtVictoire: 13,
      speciauxIncompatibles: false,
      memesEquipes: false,
      memesAdversaires: 50,
    };
    if (this.props.listeMatchs) {
      parametresTournoi =
        this.props.listeMatchs[this.props.listeMatchs.length - 1];
      parametresTournoi.nbPtVictoire = parametresTournoi.nbPtVictoire
        ? parametresTournoi.nbPtVictoire
        : 13;
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <TopBarBack
            title={t('parametres_tournoi_navigation_title')}
            navigation={this.props.navigation}
          />
          <VStack className="flex-1 px-10 justify-around">
            <VStack>
              <Text className="text-white text-xl text-center">
                {t('options_tournoi')}
              </Text>
              <Text className="text-white">
                {t('nombre_tours')} {parametresTournoi.nbTours.toString()}
              </Text>
              <Text className="text-white">
                {t('nombre_points_victoire')}{' '}
                {parametresTournoi.nbPtVictoire.toString()}
              </Text>
              <Text className="text-white">
                {t('regle_speciaux')}{' '}
                {parametresTournoi.speciauxIncompatibles
                  ? 'Activé'
                  : 'Désactivé'}
              </Text>
              <Text className="text-white">
                {t('regle_equipes_differentes')}{' '}
                {parametresTournoi.memesEquipes ? 'Activé' : 'Désactivé'}
              </Text>
              <Text className="text-white">
                {t('regle_adversaires')}{' '}
                {parametresTournoi.memesAdversaires === 0
                  ? '1 match'
                  : parametresTournoi.memesAdversaires + '% des matchs'}
              </Text>
            </VStack>
            <VStack space="xl">
              <Button
                action="negative"
                onPress={() => this.setState({ modalDeleteIsOpen: true })}
              >
                <ButtonText>{t('supprimer_tournoi')}</ButtonText>
              </Button>
              <Button action="primary" onPress={() => this._showMatchs()}>
                <ButtonText>{t('retour_liste_matchs_bouton')}</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
        {this._modalSupprimerTournoi()}
      </SafeAreaView>
    );
  }
}

export default connector(withTranslation()(ParametresTournoi));
