import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import React from 'react';
import Inscriptions from '@components/Inscriptions';
import { withTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@components/TopBarBack';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { Complement } from '@/types/enums/complement';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { Joueur } from '@/types/interfaces/joueur';
import { PropsFromRedux, connector } from '@/store/connector';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
}

interface State {}

class InscriptionsAvecNoms extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  _commencer() {
    let screenName = 'GenerationMatchs';
    if (this.props.optionsTournoi.avecTerrains) {
      screenName = 'ListeTerrains';
    }
    this.props.navigation.navigate({
      name: screenName,
      params: {
        screenStackName: 'InscriptionsAvecNoms',
      },
    });
  }

  _boutonCommencer() {
    const { t } = this.props;
    let btnDisabled = false;
    let title = t('commencer_tournoi');
    let btnAction = 'positive';
    const nbJoueurs =
      this.props.listesJoueurs[this.props.optionsTournoi.mode].length;
    const listesJoueurs = this.props.listesJoueurs;
    const optionsTournoi = this.props.optionsTournoi;
    let nbEquipes = 0;

    if (optionsTournoi.typeEquipes == TypeEquipes.TETEATETE) {
      nbEquipes = nbJoueurs;
    } else if (optionsTournoi.typeEquipes == TypeEquipes.DOUBLETTE) {
      nbEquipes = Math.ceil(nbJoueurs / 2);
    } else {
      nbEquipes = Math.ceil(nbJoueurs / 3);
    }

    if (
      optionsTournoi.typeTournoi == TypeTournoi.COUPE &&
      (nbEquipes < 4 || Math.log2(nbEquipes) % 1 !== 0)
    ) {
      title = t('configuration_impossible_coupe');
      btnDisabled = true;
    } else if (
      optionsTournoi.typeTournoi == TypeTournoi.MULTICHANCES &&
      (nbEquipes == 0 || nbEquipes % 8 != 0)
    ) {
      title = t('configuration_impossible_multichances');
      btnDisabled = true;
    } else if (optionsTournoi.mode == ModeTournoi.AVECEQUIPES) {
      if (
        listesJoueurs.avecEquipes.find(
          (el: Joueur) =>
            el.equipe == undefined || el.equipe == 0 || el.equipe > nbEquipes,
        ) != undefined
      ) {
        title = t('joueurs_sans_equipe');
        btnDisabled = true;
      } else if (optionsTournoi.typeEquipes == TypeEquipes.TETEATETE) {
        if (
          listesJoueurs.avecEquipes.length % 2 != 0 ||
          listesJoueurs.avecEquipes.length < 2
        ) {
          title = t('nombre_equipe_multiple_2');
          btnDisabled = true;
        } else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = listesJoueurs.avecEquipes.reduce(
              (counter: number, obj: Joueur) =>
                obj.equipe == i ? (counter += 1) : counter,
              0,
            );
            if (count > 1) {
              title = t('equipes_trop_joueurs');
              btnDisabled = true;
              break;
            }
          }
        }
      } else if (optionsTournoi.typeEquipes == TypeEquipes.DOUBLETTE) {
        if (
          listesJoueurs.avecEquipes.length % 4 != 0 ||
          listesJoueurs.avecEquipes.length == 0
        ) {
          title = t('equipe_doublette_multiple_4');
          btnDisabled = true;
        } else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = listesJoueurs.avecEquipes.reduce(
              (counter: number, obj: Joueur) =>
                obj.equipe == i ? (counter += 1) : counter,
              0,
            );
            if (count > 2) {
              title = t('equipes_trop_joueurs');
              btnDisabled = true;
              break;
            }
          }
        }
      } else if (
        optionsTournoi.typeEquipes == TypeEquipes.TRIPLETTE &&
        (listesJoueurs.avecEquipes.length % 6 != 0 ||
          listesJoueurs.avecEquipes.length == 0)
      ) {
        title = t('equipe_triplette_multiple_6');
        btnDisabled = true;
      }
    } else if (
      optionsTournoi.typeEquipes == TypeEquipes.TETEATETE &&
      (listesJoueurs.avecNoms.length % 2 != 0 ||
        listesJoueurs.avecNoms.length < 2)
    ) {
      title = t('tete_a_tete_multiple_2');
      btnDisabled = true;
    } else if (
      optionsTournoi.typeEquipes == TypeEquipes.DOUBLETTE &&
      (listesJoueurs.avecNoms.length % 4 != 0 ||
        listesJoueurs.avecNoms.length < 4)
    ) {
      if (listesJoueurs.avecNoms.length < 4) {
        title = t('joueurs_insuffisants');
        btnDisabled = true;
      } else if (
        listesJoueurs.avecNoms.length % 2 == 0 &&
        optionsTournoi.complement == Complement.TETEATETE
      ) {
        title = t('complement_tete_a_tete');
        btnAction = 'warning';
      } else if (optionsTournoi.complement == Complement.TRIPLETTE) {
        if (listesJoueurs.avecNoms.length == 7) {
          title = t('configuration_impossible');
          btnDisabled = true;
        } else {
          title = t('complement_triplette');
          btnAction = 'warning';
        }
      } else if (optionsTournoi.complement != Complement.TRIPLETTE) {
        title = t('blocage_complement');
        btnDisabled = true;
      }
    } else if (
      optionsTournoi.typeEquipes == TypeEquipes.TRIPLETTE &&
      (listesJoueurs.avecNoms.length % 6 != 0 ||
        listesJoueurs.avecNoms.length < 6)
    ) {
      title = t('triplette_multiple_6');
      btnDisabled = true;
    }

    return (
      <Button
        isDisabled={btnDisabled}
        action={btnDisabled ? 'negative' : btnAction}
        onPress={() => this._commencer()}
        size="md"
        className="h-min min-h-10"
      >
        <ButtonText>{title}</ButtonText>
      </Button>
    );
  }

  render() {
    const { t } = this.props;
    const nbJoueur =
      this.props.listesJoueurs[this.props.optionsTournoi.mode].length;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <VStack className="flex-1 bg-[#0594ae]">
          <TopBarBack
            title={t('inscription_avec_noms_navigation_title')}
            navigation={this.props.navigation}
          />
          <VStack className="flex-1">
            <Text className="text-white text-xl text-center">
              {t('nombre_joueurs', { nb: nbJoueur })}
            </Text>
            <Inscriptions
              navigation={this.props.navigation}
              loadListScreen={false}
            />
            <Box className="px-10">{this._boutonCommencer()}</Box>
          </VStack>
        </VStack>
      </SafeAreaView>
    );
  }
}

export default connector(withTranslation()(InscriptionsAvecNoms));
