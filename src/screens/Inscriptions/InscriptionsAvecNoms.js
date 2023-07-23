import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { connect } from 'react-redux'
import Inscriptions from '@components/Inscriptions'
import { withTranslation } from 'react-i18next'

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
    let boutonDesactive = false
    let boutonTitle = t("commencer_tournoi")
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
      boutonTitle = t("configuration_impossible_coupe");
      boutonDesactive = true;
    }
    else if (this.props.optionsTournoi.mode == 'avecEquipes') {
      if (this.props.listesJoueurs.avecEquipes.find(el => el.equipe == undefined) != undefined || this.props.listesJoueurs.avecEquipes.find(el => el.equipe > nbEquipes) != undefined) {
        boutonTitle = t("joueurs_sans_equipe");
        boutonDesactive = true;
      }
      else if (this.props.optionsTournoi.typeEquipes == "teteatete") {
        if (this.props.listesJoueurs.avecEquipes.length % 2 != 0 || this.props.listesJoueurs.avecEquipes.length < 2) {
          boutonTitle = t("nombre_equipe_multiple_2");
          boutonDesactive = true;
        }
        else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = this.props.listesJoueurs.avecEquipes.reduce((counter, obj) => obj.equipe == i ? counter += 1 : counter, 0)
            if (count > 1) {
              boutonTitle = t("equipes_trop_joueurs");
              boutonDesactive = true;
              break
            }
          }
        }
      }
      else if (this.props.optionsTournoi.typeEquipes == "doublette") {
        if (this.props.listesJoueurs.avecEquipes.length % 4 != 0 || this.props.listesJoueurs.avecEquipes.length == 0) {
          boutonTitle = t("equipe_doublette_multiple_4");
          boutonDesactive = true;
        }
        else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = this.props.listesJoueurs.avecEquipes.reduce((counter, obj) => obj.equipe == i ? counter += 1 : counter, 0)
            if (count > 2) {
              boutonTitle = t("equipes_trop_joueurs");
              boutonDesactive = true;
              break;
            }
          }
        }
      }
      else if (this.props.optionsTournoi.typeEquipes == "triplette" && (this.props.listesJoueurs.avecEquipes.length % 6 != 0 || this.props.listesJoueurs.avecEquipes.length == 0)) {
        boutonTitle = t("equipe_triplette_multiple_6");
        boutonDesactive = true;
      }
    }
    else if (this.props.optionsTournoi.typeEquipes == "teteatete" && (this.props.listesJoueurs.avecNoms.length % 2 != 0 || this.props.listesJoueurs.avecNoms.length < 2)) {
      boutonTitle = t("tete_a_tete_multiple_2");
      boutonDesactive = true;
    }
    else if (this.props.optionsTournoi.typeEquipes == "doublette" && (this.props.listesJoueurs.avecNoms.length % 4 != 0 || this.props.listesJoueurs.avecNoms.length < 4)) {
      if (this.props.listesJoueurs.avecNoms.length < 4) {
        boutonTitle = t("joueurs_insuffisants");
        boutonDesactive = true;
      }
      else if (this.props.listesJoueurs.avecNoms.length % 2 == 0 && this.props.optionsTournoi.complement == "1") {
        boutonTitle = t("complement_tete_a_tete");
      }
      else if (this.props.optionsTournoi.complement == "3") {
        if (this.props.listesJoueurs.avecNoms.length == 7) {
          boutonTitle = t("configuration_impossible");
          boutonDesactive = true;
        }
        else {
          boutonTitle = t("complement_triplette");
        }
      }
      else if (this.props.optionsTournoi.complement != "3") {
        boutonTitle = t("blocage_complement");
        boutonDesactive = true;
      }
    }
    else if (this.props.optionsTournoi.typeEquipes == "triplette" && (this.props.listesJoueurs.avecNoms.length % 6 != 0 || this.props.listesJoueurs.avecNoms.length < 6)) {
      boutonTitle = t("triplette_multiple_6");
      boutonDesactive = true;
    }
    return (
      <Button disabled={boutonDesactive} color='green' title={boutonTitle} onPress={() => this._commencer()}/>
    )
  }

  render() {
    const { t } = this.props;
    let nbJoueur = this.props.listesJoueurs[this.props.optionsTournoi.mode].length;
    return (
      <View style={styles.main_container}>
        <View style={styles.text_container}>
          <Text style={styles.text_nbjoueur}>{t("nombre_joueurs", {nb: nbJoueur})}</Text>
        </View>
          <Inscriptions 
            navigation={this.props.navigation}
            loadListScreen={false}
          />
        <View>
          <View style={styles.buttonView}>
            {this._boutonCommencer()}
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0594ae"
  },
  text_container: {
    alignItems: 'center',
    marginTop: 5
  },
  text_nbjoueur: {
    fontSize: 20,
    color: 'white'
  },
  buttonView: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
})

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(withTranslation()(InscriptionsAvecNoms))