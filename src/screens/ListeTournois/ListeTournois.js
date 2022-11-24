import React from 'react'
import { StyleSheet, View, FlatList, Text, Button, Alert, Modal } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'

class ListeTournois extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      modalTournoiInfos: false,
      infosTournoi: {}
    }
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
    });
  }

  _supprimerTournoi(tournoiId) {
    const actionSupprimerTournoi = {type: "SUPPR_TOURNOI", value: {tournoiId: tournoiId}};
    this.props.dispatch(actionSupprimerTournoi);
  }

  _modalSupprimerTournoi(tournoi) {
    Alert.alert(
      "Suppression d'un tournoi",
      "Êtes-vous sûr de vouloir supprimer le tournoi n°" + (tournoi.tournoiId) + " ?",
      [
        { text: "Annuler", onPress: () => undefined, style: "cancel" },
        { text: "OK", onPress: () => this._supprimerTournoi(tournoi.tournoiId) },
      ],
      { cancelable: true }
    );
  }

  _modalTournoiInfos() {
    let tournoi = this.state.infosTournoi;
    if (tournoi.tournoi) {
      return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalTournoiInfos}
        onRequestClose={() => {
          this.setState({ modalTournoiInfos: false })
        }}
        >
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              <Text style={modalStyles.modalText}>Informations concernant l'état du tournoi :</Text>
              <View style={styles.buttonViewCreate}>
                <Text style={modalStyles.modalText}>Id du tournoi: {tournoi.tournoiId}</Text>
                <Text style={modalStyles.modalText}>Nombre de joueurs: {tournoi.tournoi.length}</Text>
              </View>
              <View style={styles.buttonView}>
                <Button color="red" title='Fermer' onPress={() => this.setState({modalTournoiInfos: false}) }/>
              </View>
            </View>
          </View>
        </Modal>
      )
    }
  }

  _listeTournoisItem(tournoi) {
    let boutonDesactive = false;
    if (this.props.listeMatchs && tournoi.tournoiId == this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID) {
      boutonDesactive = true;
    }
    return (
      <View style={styles.tournoi_container}>
        <View style={styles.text_container}>
          <Text style={styles.tournoi_text}>Tournoi n°{tournoi.tournoiId}</Text>
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
        {this._modalTournoiInfos()}
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
    alignItems: 'flex-end',
    marginHorizontal: 5
  },
})

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
})

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(ListeTournois)