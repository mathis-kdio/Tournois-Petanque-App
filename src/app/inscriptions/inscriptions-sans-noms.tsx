import { ScrollView } from '@/components/ui/scroll-view';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { withTranslation } from 'react-i18next';
import TopBarBack from '@/components/topBar/TopBarBack';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { JoueurType } from '@/types/enums/joueurType';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { PropsFromRedux, connector } from '@/store/connector';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
}

interface State {
  nbJoueurNormaux: number;
  nbJoueurEnfants: number;
}

class InscriptionsSansNoms extends React.Component<Props, State> {
  secondInput = React.createRef<any>();

  constructor(props: Props) {
    super(props);
    this.state = {
      nbJoueurNormaux: 0,
      nbJoueurEnfants: 0,
    };
  }

  _textInputJoueursNormaux(text: string) {
    this.setState({
      nbJoueurNormaux: parseInt(text),
    });
  }

  _textInputJoueursEnfants(text: string) {
    this.setState({
      nbJoueurEnfants: parseInt(text),
    });
  }

  _ajoutJoueur(type: JoueurType) {
    const action = {
      type: 'AJOUT_JOUEUR',
      value: [ModeTournoi.SANSNOMS, '', type, undefined],
    };
    this.props.dispatch(action);
  }

  _supprimerJoueurs() {
    const suppressionAllJoueurs = {
      type: 'SUPPR_ALL_JOUEURS',
      value: [ModeTournoi.SANSNOMS],
    };
    this.props.dispatch(suppressionAllJoueurs);
  }

  _commencer(choixComplement: boolean) {
    this._supprimerJoueurs();

    for (let i = 0; i < this.state.nbJoueurNormaux; i++) {
      this._ajoutJoueur(undefined);
    }

    for (let i = 0; i < this.state.nbJoueurEnfants; i++) {
      this._ajoutJoueur(JoueurType.ENFANT);
    }

    let screenName = 'GenerationMatchs';
    if (choixComplement) {
      screenName = 'ChoixComplement';
    } else if (this.props.optionsTournoi.avecTerrains) {
      screenName = 'ListeTerrains';
    }
    this.props.navigation.navigate({
      name: screenName,
      params: {
        screenStackName: 'InscriptionsSansNoms',
      },
    });
  }

  _nbJoueurs() {
    let nbJoueur = 0;
    if (!isNaN(this.state.nbJoueurNormaux)) {
      nbJoueur = this.state.nbJoueurNormaux;
    }
    if (!isNaN(this.state.nbJoueurEnfants)) {
      nbJoueur += this.state.nbJoueurEnfants;
    }
    return nbJoueur;
  }

  _boutonCommencer() {
    const { t, optionsTournoi } = this.props;
    let btnDisabled: boolean;
    let title = t('commencer_tournoi');
    let nbJoueurs = this._nbJoueurs();
    let choixComplement = false;

    if (
      optionsTournoi.typeEquipes === TypeEquipes.TETEATETE &&
      (nbJoueurs % 2 !== 0 || nbJoueurs < 2)
    ) {
      title = t('tete_a_tete_multiple_2');
      btnDisabled = true;
    } else if (optionsTournoi.typeEquipes === TypeEquipes.DOUBLETTE) {
      if (nbJoueurs < 4) {
        title = t('joueurs_insuffisants');
        btnDisabled = true;
      } else if (nbJoueurs % 4 !== 0) {
        choixComplement = true;
      }
    } else if (optionsTournoi.typeEquipes === TypeEquipes.TRIPLETTE) {
      if (nbJoueurs < 6) {
        title = t('joueurs_insuffisants');
        btnDisabled = true;
      } else if (nbJoueurs % 6 !== 0) {
        choixComplement = true;
      }
    }

    return (
      <Button
        isDisabled={btnDisabled}
        action="positive"
        onPress={() => this._commencer(choixComplement)}
        className="h-min min-h-10"
      >
        <ButtonText>{title}</ButtonText>
      </Button>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <ScrollView className="h-1 bg-[#0594ae]">
        <TopBarBack
          title={t('inscription_sans_noms_navigation_title')}
          navigation={this.props.navigation}
        />
        <VStack space="2xl" className="flex-1 px-10">
          <Text className="text-white text-center text-xl">
            {t('nombre_joueurs', { nb: this._nbJoueurs() })}
          </Text>
          <VStack>
            <Text className="text-white text-md">
              {t('nombre_joueurs_adultes')}{' '}
            </Text>
            <Input className="border-white">
              <InputField
                placeholder={t('nombre_placeholder')}
                keyboardType="number-pad"
                returnKeyType="next"
                autoFocus={true}
                blurOnSubmit={false}
                onChangeText={(text) => this._textInputJoueursNormaux(text)}
                onSubmitEditing={() => this.secondInput.current.focus()}
              />
            </Input>
          </VStack>
          <VStack>
            <Text className="text-white text-md">
              {t('nombre_joueurs_enfants')}{' '}
            </Text>
            <Input className="border-white">
              <InputField
                placeholder={t('nombre_placeholder')}
                keyboardType="number-pad"
                onChangeText={(text) => this._textInputJoueursEnfants(text)}
                ref={this.secondInput}
              />
            </Input>
          </VStack>
          <Text className="text-white">
            {t('joueurs_enfants_explication')}
          </Text>
          {this._boutonCommencer()}
        </VStack>
      </ScrollView>
    );
  }
}

export default connector(withTranslation()(InscriptionsSansNoms));
