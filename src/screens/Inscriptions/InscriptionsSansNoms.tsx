import { ScrollView } from "@/components/ui/scroll-view";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from 'react'
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopBarBack from '@components/TopBarBack'
import { StackNavigationProp } from '@react-navigation/stack'
import { TFunction } from 'i18next'
import { JoueurType } from '@/types/enums/joueurType'
import { TypeEquipes } from '@/types/enums/typeEquipes'
import { ModeTournoi } from '@/types/enums/modeTournoi'
import { PropsFromRedux, connector } from '@/store/connector'

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
}

interface State {
  nbJoueurNormaux: number;
  nbJoueurEnfants: number;
}

class InscriptionsSansNoms extends React.Component<Props, State> {
  secondInput = React.createRef<any>();

  constructor(props: Props) {
    super(props)
    this.state = {
      nbJoueurNormaux: 0,
      nbJoueurEnfants: 0,
    }
  }

  _textInputJoueursNormaux(text: string) {
    this.setState({
      nbJoueurNormaux: parseInt(text)
    });
  }

  _textInputJoueursEnfants(text: string) {
    this.setState({
      nbJoueurEnfants: parseInt(text)
    });
  } 

  _ajoutJoueur(type: JoueurType) {
    const action = { type: "AJOUT_JOUEUR", value: [ModeTournoi.SANSNOMS,"", type, undefined] };
    this.props.dispatch(action);
  }

  _supprimerJoueurs() {
    const suppressionAllJoueurs = { type: "SUPPR_ALL_JOUEURS", value: [ModeTournoi.SANSNOMS] };
    this.props.dispatch(suppressionAllJoueurs);
  }
  
  _commencer() {
    this._supprimerJoueurs();

    for (let i = 0; i < this.state.nbJoueurNormaux; i++) {
      this._ajoutJoueur(undefined);
    }

    for (let i = 0; i < this.state.nbJoueurEnfants; i++) {
      this._ajoutJoueur(JoueurType.ENFANT);
    }

    let screenName = this.props.optionsTournoi.avecTerrains ? "ListeTerrains" : "GenerationMatchs";
    this.props.navigation.navigate({
      name: screenName,
      params: {
        screenStackName: 'InscriptionsSansNoms'
      }
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
    const { t } = this.props;
    let boutonDesactive: boolean;
    let boutonTitle = '';
    let nbJoueurs = this._nbJoueurs();
    if (this.props.optionsTournoi.typeEquipes == TypeEquipes.DOUBLETTE || this.props.optionsTournoi.typeEquipes == TypeEquipes.TETEATETE) {
      if (nbJoueurs % 2 == 0 && nbJoueurs != 0) {
        boutonTitle = t("commencer_tournoi");
        boutonDesactive = false;
      }
      else {
        boutonTitle = t("doublette_multiple_2");
        boutonDesactive = true;
      }
    }
    else {
      if (nbJoueurs % 6 == 0 && nbJoueurs >= 6) {
        boutonTitle = t("commencer_tournoi");
        boutonDesactive = false;
      }
      else {
        boutonTitle = t("triplette_multiple_6");
        boutonDesactive = true;
      }
    }
    return (
      <Button
        isDisabled={boutonDesactive}
        action='positive'
        onPress={() => this._commencer()}
      >
        <ButtonText>{boutonTitle}</ButtonText>
      </Button>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <TopBarBack title={t("inscription_sans_noms_navigation_title")} navigation={this.props.navigation}/>
          <VStack space='2xl' className="flex-1 px-10">
            <Text className="text-white text-center text-xl">{t("nombre_joueurs", {nb: this._nbJoueurs()})}</Text>
            <VStack>
              <Text className="text-white text-md">{t("nombre_joueurs_adultes")} </Text>
              <Input size='md'>
                <InputField
                  placeholder={t("nombre_placeholder")}
                  keyboardType='number-pad'
                  returnKeyType='next'
                  autoFocus={true}
                  blurOnSubmit={false}
                  onChangeText={(text) => this._textInputJoueursNormaux(text)}
                  onSubmitEditing={() => this.secondInput.current.focus()}
                />
              </Input>
            </VStack>
            <VStack>
              <Text className="text-white text-md">{t("nombre_joueurs_enfants")} </Text>
              <Input size='md'>
                <InputField
                  placeholder={t("nombre_placeholder")}
                  keyboardType='number-pad'
                  onChangeText={(text) => this._textInputJoueursEnfants(text)}
                  ref={this.secondInput}
                />
              </Input>
            </VStack>
            <Text className="text-white">{t("joueurs_enfants_explication")}</Text>
            {this._boutonCommencer()}
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connector(withTranslation()(InscriptionsSansNoms))