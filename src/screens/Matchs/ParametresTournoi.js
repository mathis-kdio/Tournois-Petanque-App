import React from 'react'
import { withTranslation } from 'react-i18next';
import { StyleSheet, View, Button, Text, Alert } from 'react-native'
import { connect } from 'react-redux'

class ParametresTournoi extends React.Component {
  _showMatchs() {
    this.props.navigation.navigate('ListeMatchsStack');   
  }

  _supprimerTournoi() {
    const supprDansListeTournois = { type: "SUPPR_TOURNOI", value: {tournoiId: this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID}};
    this.props.dispatch(supprDansListeTournois);
    const suppressionAllMatchs = { type: "SUPPR_MATCHS"}
    this.props.dispatch(suppressionAllMatchs);
    this.props.navigation.reset({
      index: 0,
      routes: [{
        name: 'AccueilGeneral'
      }]
    });
  }

  _modalSupprimerTournoi() {
    const { t } = this.props;
    let tournoiId = 0;
    if (this.props.listeMatchs) {
      tournoiId = this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID;
    }
    Alert.alert(
      t("supprimer_tournoi_actuel_modal_titre"),
      t("supprimer_tournoi_actuel_modal_texte", {id: tournoiId + 1}),
      [
        { text: t("annuler"), onPress: () => undefined, style: "cancel" },
        { text: t("oui"), onPress: () => this._supprimerTournoi() },
      ],
      { cancelable: true }
    );
  }

  render() {
    const { t } = this.props;
    let parametresTournoi = {nbTours: 0, nbPtVictoire: 13, speciauxIncompatibles: false, memesEquipes: false, memesAdversaires: 50};
    if (this.props.listeMatchs) {
      parametresTournoi = this.props.listeMatchs[this.props.listeMatchs.length - 1];
      parametresTournoi.nbPtVictoire = parametresTournoi.nbPtVictoire ? parametresTournoi.nbPtVictoire : 13;
    }
    return (
      <View style={styles.main_container} >
        <View style={styles.body_container}>
          <View style={styles.options_container}>
            <Text style={styles.titre}>{t("options_tournoi")}</Text>
            <Text style={styles.texte}>{t("nombre_tours")} {parametresTournoi.nbTours.toString()}</Text>
            <Text style={styles.texte}>{t("nombre_points_victoire")} {parametresTournoi.nbPtVictoire.toString()}</Text>
            <Text style={styles.texte}>{t("regle_enfants")} {parametresTournoi.speciauxIncompatibles ? "Activé" : "Désactivé"}</Text>
            <Text style={styles.texte}>{t("regle_equipes_differentes")} {parametresTournoi.memesEquipes ? "Activé" : "Désactivé"}</Text>
            <Text style={styles.texte}>{t("regle_adversaires")} {parametresTournoi.memesAdversaires === 0 ? "1 match" : parametresTournoi.memesAdversaires+"% des matchs"}</Text>
          </View>
          <View style={styles.button_container}>
            <View style={styles.buttonView}>
              <Button color='red' title={t("supprimer_tournoi")} onPress={() => this._modalSupprimerTournoi()}/>
            </View>
            <View style={styles.buttonView}>
              <Button color="#1c3969" title={t("retour_liste_matchs_bouton")} onPress={() => this._showMatchs()}/>
            </View>
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
  body_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  options_container: {
    flex: 1,
    marginHorizontal: 40,
    justifyContent: 'center'
  },
  titre: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 24,
    color: 'white'
  },
  texte: {
    marginBottom: 5,
    textAlign: 'justify',
    fontSize: 17,
    color: 'white'
  },
  button_container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  buttonView: {
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15
  },
})

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(withTranslation()(ParametresTournoi))