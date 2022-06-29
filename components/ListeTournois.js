import React from 'react'
import { StyleSheet, View, FlatList, Text, Button, Alert } from 'react-native'
import { connect } from 'react-redux'

class ListeTournois extends React.Component {

  constructor(props) {
    super(props)
  }

  _chargerTournoi(tournoi) {
    const actionUpdateListeMatchs = {type: "AJOUT_MATCHS", value: tournoi.tournoi};
    this.props.dispatch(actionUpdateListeMatchs);
    this.props.navigation.reset({
      index: 0,
      routes: [{
        name: 'ListeMatchsInscription', 
        params: {
          tournoiId: tournoi.tournoiId, 
          tournoi: tournoi
        }
      }],
      key: null
    });
  }

  _supprimerTournoi(tournoiId) {
    const actionSupprimerTournoi = {type: "SUPPR_TOURNOI", value: {tournoiId: tournoiId}};
    this.props.dispatch(actionSupprimerTournoi);
  }

  _modalSupprimerTournoi(tournoi) {
    Alert.alert(
      "Suppression d'un tournoi",
      "Êtes-vous sûr de vouloir supprimer le tournoi n°" + (tournoi.tournoiId + 1) + " ?",
      [
        { text: "Annuler", onPress: () => undefined, style: "cancel" },
        { text: "OK", onPress: () => this._supprimerTournoi(tournoi.tournoiId) },
      ],
      { cancelable: true }
    );
  }

  _listeTournoisItem(tournoi) {
    let boutonDesactive = false;
    if (this.props.listeMatchs && tournoi.tournoiId == this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID) {
      boutonDesactive = true;
    }
    return (
      <View style={styles.tournoi_container}>
        <View style={styles.text_container}>
          <Text style={styles.tournoi_text}>Tournoi n°{tournoi.tournoiId + 1}</Text>
        </View>
        <View style={styles.buttonView}>
          <Button disabled={boutonDesactive} color="#1c3969" title="Charger" onPress={() => this._chargerTournoi(tournoi)}/>
        </View>
        <View style={styles.buttonView}>
          <Button disabled={boutonDesactive} color="red" title="Supprimer" onPress={() => this._modalSupprimerTournoi(tournoi)}/>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View>
            <Text style={styles.titre}>Types d'équipe et de tournoi</Text>
          </View>
          <View style={styles.flatList_container}>
            <FlatList
              data={this.props.listeTournois}
              initialNumToRender={20}
              keyExtractor={(item) => item.tournoiId.toString() }
              renderItem={({item}) => (this._listeTournoisItem(item))}
            />
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
    flex: 1
  },
  titre: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    color: 'white'
  },
  flatList_container: {
    flex: 1,
    margin: 10
  },
  tournoi_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  text_container: {
    flex: 1,
  },
  tournoi_text: {
    fontSize: 15,
    color: 'white'
  },
  buttonView: {
    flex: 1,
    alignItems: 'flex-end'
  },
})

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(ListeTournois)