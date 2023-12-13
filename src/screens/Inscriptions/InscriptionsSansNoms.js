import { VStack, Text, Button, ButtonText, Input, InputField } from '@gluestack-ui/themed'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux'
import TopBarBack from '../../components/TopBarBack'

class InscriptionsSansNoms extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nbJoueurNormaux: 0,
      nbJoueurEnfants: 0,
    }
  }

  _textInputJoueursNormaux(text) {
    this.setState({
      nbJoueurNormaux: parseInt(text)
    });
  }

  _textInputJoueursEnfants(text) {
    this.setState({
      nbJoueurEnfants: parseInt(text)
    });
  } 

  _ajoutJoueur(type) {
    const action = { type: "AJOUT_JOUEUR", value: ["sansNoms","", type, undefined] };
    this.props.dispatch(action);
  }

  _supprimerJoueurs() {
    const suppressionAllJoueurs = { type: "SUPPR_ALL_JOUEURS", value: ["sansNoms"] };
    this.props.dispatch(suppressionAllJoueurs);
  }
  
  _commencer() {
    this._supprimerJoueurs();

    for (let i = 0; i < this.state.nbJoueurNormaux; i++) {
      this._ajoutJoueur(undefined);
    }

    for (let i = 0; i < this.state.nbJoueurEnfants; i++) {
      this._ajoutJoueur("enfant");
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
    let boutonDesactive;
    let boutonTitle = '';
    let nbJoueurs = this._nbJoueurs();
    if (this.props.optionsTournoi.typeEquipes == 'doublette' || this.props.optionsTournoi.typeEquipes == "teteatete") {
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
    )
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <VStack flex={1} bgColor='#0594ae'>
          <TopBarBack title={t("inscription_sans_noms_navigation_title")} navigation={this.props.navigation}/>
          <VStack flex={1} px={'$10'} space='2xl'>
            <Text color='$white' textAlign='center' fontSize={'$xl'}>{t("nombre_joueurs", {nb: this._nbJoueurs()})}</Text>
            <VStack>
              <Text color='$white' fontSize={'$md'}>{t("nombre_joueurs_adultes")} </Text>
              <Input size='md'>
                <InputField
                  placeholder={t("nombre_placeholder")}
                  keyboardType='number-pad'
                  returnKeyType='next'
                  autoFocus={true}
                  blurOnSubmit={false}
                  onChangeText={(text) => this._textInputJoueursNormaux(text)}
                  onSubmitEditing={() => this.secondInput.focus()}
                />
              </Input>
            </VStack>
            <VStack>
              <Text color='$white' fontSize={'$md'}>{t("nombre_joueurs_enfants")} </Text>
              <Input size='md'>
                <InputField
                  placeholder={t("nombre_placeholder")}
                  keyboardType='number-pad'
                  onChangeText={(text) => this._textInputJoueursEnfants(text)}
                  ref={ref => {this.secondInput = ref}}
                />
              </Input>
            </VStack>
            <Text color='$white'>{t("joueurs_enfants_explication")}</Text>
            {this._boutonCommencer()}
          </VStack>
        </VStack>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(withTranslation()(InscriptionsSansNoms))