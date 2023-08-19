import React from 'react'
import { connect } from 'react-redux'
import Inscriptions from '@components/Inscriptions'
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import TopBarBack from 'components/TopBarBack'
import { Box, Button, Text, VStack } from 'native-base'

class InscriptionsAvecNoms extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _commencer() {
    let screenName = "GenerationMatchs";
    if (this.props.optionsTournoi.avecTerrains) {
      screenName = "ListeTerrains";
    }
    this.props.navigation.navigate({
      name: screenName,
      params: {
        screenStackName: 'InscriptionsAvecNoms'
      }
    });
  }

  _boutonCommencer() {
    const { t } = this.props;
    let buttonDisabled = false
    let title = t("commencer_tournoi")
    let nbJoueurs = this.props.listesJoueurs[this.props.optionsTournoi.mode].length

    let nbEquipes
    if (this.props.optionsTournoi.typeEquipes == "teteatete") {
      nbEquipes = nbJoueurs
    }
    else if (this.props.optionsTournoi.typeEquipes == "doublette") {
      nbEquipes = Math.ceil(nbJoueurs / 2)
    }
    else {
      nbEquipes = Math.ceil(nbJoueurs / 3)
    }

    if (this.props.optionsTournoi.type == 'coupe' && (nbEquipes < 4 || Math.log2(nbEquipes) % 1 !== 0)) {
      title = t("configuration_impossible_coupe");
      buttonDisabled = true;
    }
    else if (this.props.optionsTournoi.mode == 'avecEquipes') {
      if (this.props.listesJoueurs.avecEquipes.find(el => el.equipe == undefined) != undefined || this.props.listesJoueurs.avecEquipes.find(el => el.equipe > nbEquipes) != undefined) {
        title = t("joueurs_sans_equipe");
        buttonDisabled = true;
      }
      else if (this.props.optionsTournoi.typeEquipes == "teteatete") {
        if (this.props.listesJoueurs.avecEquipes.length % 2 != 0 || this.props.listesJoueurs.avecEquipes.length < 2) {
          title = t("nombre_equipe_multiple_2");
          buttonDisabled = true;
        }
        else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = this.props.listesJoueurs.avecEquipes.reduce((counter, obj) => obj.equipe == i ? counter += 1 : counter, 0)
            if (count > 1) {
              title = t("equipes_trop_joueurs");
              buttonDisabled = true;
              break
            }
          }
        }
      }
      else if (this.props.optionsTournoi.typeEquipes == "doublette") {
        if (this.props.listesJoueurs.avecEquipes.length % 4 != 0 || this.props.listesJoueurs.avecEquipes.length == 0) {
          title = t("equipe_doublette_multiple_4");
          buttonDisabled = true;
        }
        else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = this.props.listesJoueurs.avecEquipes.reduce((counter, obj) => obj.equipe == i ? counter += 1 : counter, 0)
            if (count > 2) {
              title = t("equipes_trop_joueurs");
              buttonDisabled = true;
              break;
            }
          }
        }
      }
      else if (this.props.optionsTournoi.typeEquipes == "triplette" && (this.props.listesJoueurs.avecEquipes.length % 6 != 0 || this.props.listesJoueurs.avecEquipes.length == 0)) {
        title = t("equipe_triplette_multiple_6");
        buttonDisabled = true;
      }
    }
    else if (this.props.optionsTournoi.typeEquipes == "teteatete" && (this.props.listesJoueurs.avecNoms.length % 2 != 0 || this.props.listesJoueurs.avecNoms.length < 2)) {
      title = t("tete_a_tete_multiple_2");
      buttonDisabled = true;
    }
    else if (this.props.optionsTournoi.typeEquipes == "doublette" && (this.props.listesJoueurs.avecNoms.length % 4 != 0 || this.props.listesJoueurs.avecNoms.length < 4)) {
      if (this.props.listesJoueurs.avecNoms.length < 4) {
        title = t("joueurs_insuffisants");
        buttonDisabled = true;
      }
      else if (this.props.listesJoueurs.avecNoms.length % 2 == 0 && this.props.optionsTournoi.complement == "1") {
        title = t("complement_tete_a_tete");
      }
      else if (this.props.optionsTournoi.complement == "3") {
        if (this.props.listesJoueurs.avecNoms.length == 7) {
          title = t("configuration_impossible");
          buttonDisabled = true;
        }
        else {
          title = t("complement_triplette");
        }
      }
      else if (this.props.optionsTournoi.complement != "3") {
        title = t("blocage_complement");
        buttonDisabled = true;
      }
    }
    else if (this.props.optionsTournoi.typeEquipes == "triplette" && (this.props.listesJoueurs.avecNoms.length % 6 != 0 || this.props.listesJoueurs.avecNoms.length < 6)) {
      title = t("triplette_multiple_6");
      buttonDisabled = true;
    }
    return (
      <Button
        bg="green.700"
        isDisabled={buttonDisabled}
        onPress={() => this._commencer()}
        size="lg"
      >
        {title}
      </Button>
    )
  }

  render() {
    const { t } = this.props;
    let nbJoueur = this.props.listesJoueurs[this.props.optionsTournoi.mode].length;
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#0594ae"/>
        <VStack flex="1" bgColor={"#0594ae"}>
          <TopBarBack title={t("inscription_avec_noms_navigation_title")} navigation={this.props.navigation}/>
          <VStack flex="1">
            <Text color="white" fontSize="xl" textAlign="center">{t("nombre_joueurs", {nb: nbJoueur})}</Text>
            <Inscriptions 
              navigation={this.props.navigation}
              loadListScreen={false}
            />
            <Box px="10">
              {this._boutonCommencer()}
            </Box>
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

export default connect(mapStateToProps)(withTranslation()(InscriptionsAvecNoms))