import React from 'react'
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
    let tournoiId = 0;
    if (this.props.listeMatchs) {
      tournoiId = this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID;
    }
    Alert.alert(
      "Suppression du tournoi en cours",
      "Êtes-vous sûr de vouloir supprimer l'actuel tournoi n°" + (tournoiId + 1) + " ?",
      [
        { text: "Annuler", onPress: () => undefined, style: "cancel" },
        { text: "OK", onPress: () => this._supprimerTournoi() },
      ],
      { cancelable: true }
    );
  }

  render() {
    let parametresTournoi = {nbTours: 0, nbPtVictoire: 13, speciauxIncompatibles: false, memesEquipes: false, memesAdversaires: false};
    if (this.props.listeMatchs) {
      parametresTournoi = this.props.listeMatchs[this.props.listeMatchs.length - 1];
      parametresTournoi.nbPtVictoire = parametresTournoi.nbPtVictoire ? parametresTournoi.nbPtVictoire : 13;
    }
    return (
      <View style={styles.main_container} >
        <View style={styles.body_container}>
          <View style={styles.options_container}>
            <Text style={styles.titre}>Les options du tournois :</Text>
            <Text style={styles.texte}>- Nombre de tours: {parametresTournoi.nbTours.toString()}</Text>
            <Text style={styles.texte}>- Nombre de points pour la victoire: {parametresTournoi.nbPtVictoire.toString()}</Text>
            <Text style={styles.texte}>- Ne jamais faire jouer 2 joueurs spéciaux dans la même équipe : {parametresTournoi.speciauxIncompatibles.toString() ? "Activé" : "Désactivé"}</Text>
            <Text style={styles.texte}>- Ne jamais former les mêmes équipes : {parametresTournoi.memesEquipes.toString() ? "Activé" : "Désactivé"}</Text>
            <Text style={styles.texte}>- Empecher 2 joueurs de jouer + de la moitié des matchs contre et ensemble : {parametresTournoi.memesAdversaires.toString() ? "Activé" : "Désactivé"}</Text>
          </View>
          <View style={styles.button_container}>
            <View style={styles.buttonView}>
              <Button color='red' title='Supprimer le tournoi' onPress={() => this._modalSupprimerTournoi()}/>
            </View>
            <View style={styles.buttonView}>
              <Button color="#1c3969" title='Retourner à la liste des parties' onPress={() => this._showMatchs()}/>
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

export default connect(mapStateToProps)(ParametresTournoi)