import React from 'react'
import { StyleSheet, View, Text, Button, FlatList, Alert } from 'react-native'
import { expo } from '../../app.json'
import { connect } from 'react-redux'
import ChangelogData from '@assets/ChangelogData.json'
import { _openURL } from 'utils/link'

class Changelog extends React.Component {
  constructor(props) {
    super(props)
    this.githubRepository = "https://github.com/sponsors/mathis-kdio";
  }

  _modalClearData() {
    Alert.alert(
      "Suppression des données",
      "Êtes-vous sûr de vouloir supprimer toutes les données (listes joueurs, anciens tournois, etc) ?",
      [
        { text: "Annuler", onPress: () => undefined, style: "cancel" },
        { text: "Oui", onPress: () => this._clearData() },
      ],
      { cancelable: true }
    );
  }

  _clearData() {
    const actionRemoveAllPlayersAvecNoms = { type: "SUPPR_ALL_JOUEURS", value: ["avecNoms"] }
    this.props.dispatch(actionRemoveAllPlayersAvecNoms);
    const actionRemoveAllPlayersSansNoms = { type: "SUPPR_ALL_JOUEURS", value: ["sansNoms"] }
    this.props.dispatch(actionRemoveAllPlayersSansNoms);
    const actionRemoveAllPlayersAvecEquipes = { type: "SUPPR_ALL_JOUEURS", value: ["avecEquipes"] }
    this.props.dispatch(actionRemoveAllPlayersAvecEquipes);
    const actionRemoveAllPlayersHistorique = { type: "SUPPR_ALL_JOUEURS", value: ["historique"] }
    this.props.dispatch(actionRemoveAllPlayersHistorique);
    const actionRemoveAllPlayersSauvegarde = { type: "SUPPR_ALL_JOUEURS", value: ["sauvegarde"] }
    this.props.dispatch(actionRemoveAllPlayersSauvegarde);
    const actionRemoveAllSavedList = { type: "REMOVE_ALL_SAVED_LIST"}
    this.props.dispatch(actionRemoveAllSavedList);
    const actionRemoveAllTournaments = { type: "SUPPR_ALL_TOURNOIS"}
    this.props.dispatch(actionRemoveAllTournaments);
    const actionRemoveAllMatchs = { type: "REMOVE_ALL_MATCHS"}
    this.props.dispatch(actionRemoveAllMatchs);
    const actionRemoveAllOptions = { type: "SUPPR_ALL_OPTIONS"}
    this.props.dispatch(actionRemoveAllOptions);
  }

  _changelogItem(item) {
    return (
      <View style={styles.informations_container}>
        <Text style={styles.titre}>Version {item.version} :</Text>
        <Text style={styles.informations_texte}>
          {item.infos}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <Text style={styles.titre}>Version actuelle : {expo.version}</Text>
          <FlatList 
              data={ChangelogData}
              keyExtractor={(item) => item.id.toString() }
              renderItem={({item}) => this._changelogItem(item)}
          />
          <View style={styles.create_container}>
            <Button color="red" title='Supprimer toutes les données' onPress={() => this._modalClearData()}/>
          </View>
          <View style={styles.create_container}>
            <Button color="#1c3969" title='Code OpenSource' onPress={() => _openURL(this.githubRepository)}/>
            <Text style={styles.create_text}>Par Mathis Cadio</Text>
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
  body_container : {
    flex: 1,
    alignItems: 'center',
  },
  titre: {
    textAlign: 'center',
    fontSize: 24,
    color: 'white'
  },
  informations_container: {
    alignItems: 'center',
    paddingHorizontal: '5%',
    marginBottom: 5
  },
  informations_texte: {
    alignSelf: 'flex-start',
    fontSize: 18,
    color: 'white'
  },
  create_container: {
    alignItems: 'center',
    paddingVertical: 10
  },
  create_text: {
    fontSize: 15,
    color: 'white'
  },
})

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    savedLists: state.listesJoueurs.listesSauvegarde,
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois,
    optionsTournoi: state.optionsTournoi.options,
  }
}

export default connect(mapStateToProps)(Changelog)