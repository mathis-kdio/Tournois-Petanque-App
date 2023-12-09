import React from 'react'
import { connect } from 'react-redux'
import Inscriptions from '@components/Inscriptions'
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopBarBack from 'components/TopBarBack'
import { Box, Button, ButtonText, Text, VStack } from '@gluestack-ui/themed'

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
    let buttonDisabled = false;
    let title = t("commencer_tournoi");
    const nbJoueurs = this.props.listesJoueurs[this.props.optionsTournoi.mode].length;
    const listesJoueurs = this.props.listesJoueurs;
    const optionsTournoi = this.props.optionsTournoi;
    let nbEquipes = 0;

    if (optionsTournoi.typeEquipes == "teteatete") {
      nbEquipes = nbJoueurs;
    }
    else if (optionsTournoi.typeEquipes == "doublette") {
      nbEquipes = Math.ceil(nbJoueurs / 2);
    }
    else {
      nbEquipes = Math.ceil(nbJoueurs / 3);
    }

    if (optionsTournoi.type == 'coupe' && (nbEquipes < 4 || Math.log2(nbEquipes) % 1 !== 0)) {
      title = t("configuration_impossible_coupe");
      buttonDisabled = true;
    }
    else if (optionsTournoi.mode == 'avecEquipes') {
      if (listesJoueurs.avecEquipes.find(el => el.equipe == undefined) != undefined || listesJoueurs.avecEquipes.find(el => el.equipe > nbEquipes) != undefined) {
        title = t("joueurs_sans_equipe");
        buttonDisabled = true;
      }
      else if (optionsTournoi.typeEquipes == "teteatete") {
        if (listesJoueurs.avecEquipes.length % 2 != 0 || listesJoueurs.avecEquipes.length < 2) {
          title = t("nombre_equipe_multiple_2");
          buttonDisabled = true;
        }
        else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = listesJoueurs.avecEquipes.reduce((counter, obj) => obj.equipe == i ? counter += 1 : counter, 0)
            if (count > 1) {
              title = t("equipes_trop_joueurs");
              buttonDisabled = true;
              break
            }
          }
        }
      }
      else if (optionsTournoi.typeEquipes == "doublette") {
        if (listesJoueurs.avecEquipes.length % 4 != 0 || listesJoueurs.avecEquipes.length == 0) {
          title = t("equipe_doublette_multiple_4");
          buttonDisabled = true;
        }
        else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = listesJoueurs.avecEquipes.reduce((counter, obj) => obj.equipe == i ? counter += 1 : counter, 0)
            if (count > 2) {
              title = t("equipes_trop_joueurs");
              buttonDisabled = true;
              break;
            }
          }
        }
      }
      else if (optionsTournoi.typeEquipes == "triplette" && (listesJoueurs.avecEquipes.length % 6 != 0 || listesJoueurs.avecEquipes.length == 0)) {
        title = t("equipe_triplette_multiple_6");
        buttonDisabled = true;
      }
    }
    else if (optionsTournoi.typeEquipes == "teteatete" && (listesJoueurs.avecNoms.length % 2 != 0 || listesJoueurs.avecNoms.length < 2)) {
      title = t("tete_a_tete_multiple_2");
      buttonDisabled = true;
    }
    else if (optionsTournoi.typeEquipes == "doublette" && (listesJoueurs.avecNoms.length % 4 != 0 || listesJoueurs.avecNoms.length < 4)) {
      if (listesJoueurs.avecNoms.length < 4) {
        title = t("joueurs_insuffisants");
        buttonDisabled = true;
      }
      else if (listesJoueurs.avecNoms.length % 2 == 0 && optionsTournoi.complement == "1") {
        title = t("complement_tete_a_tete");
      }
      else if (optionsTournoi.complement == "3") {
        if (listesJoueurs.avecNoms.length == 7) {
          title = t("configuration_impossible");
          buttonDisabled = true;
        }
        else {
          title = t("complement_triplette");
        }
      }
      else if (optionsTournoi.complement != "3") {
        title = t("blocage_complement");
        buttonDisabled = true;
      }
    }
    else if (optionsTournoi.typeEquipes == "triplette" && (listesJoueurs.avecNoms.length % 6 != 0 || listesJoueurs.avecNoms.length < 6)) {
      title = t("triplette_multiple_6");
      buttonDisabled = true;
    }

    return (
      <Button
        isDisabled={buttonDisabled}
        action='positive'
        onPress={() => this._commencer()}
        size='md'
      >
        <ButtonText>{title}</ButtonText>
      </Button>
    )
  }

  render() {
    const { t } = this.props;
    const nbJoueur = this.props.listesJoueurs[this.props.optionsTournoi.mode].length;
    return (
      <SafeAreaView style={{flex: 1}}>
        <VStack flex={1} bgColor='#0594ae'>
          <TopBarBack title={t("inscription_avec_noms_navigation_title")} navigation={this.props.navigation}/>
          <VStack flex={1}>
            <Text color='$white' fontSize={'$xl'} textAlign='center'>{t("nombre_joueurs", {nb: nbJoueur})}</Text>
            <Inscriptions 
              navigation={this.props.navigation}
              loadListScreen={false}
            />
            <Box px={'$10'}>
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