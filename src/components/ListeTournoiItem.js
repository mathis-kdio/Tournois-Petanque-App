import React from 'react'
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'

class ListeTournoiItem extends React.Component {
  constructor(props) {
    super(props)
    this.tournoiNameText = ""
    this.state = {
      renommerOn: false,
      disabledBoutonRenommer: true
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
  
  _showRenameTournoi(tournoi) {
    if (this.state.renommerOn == false) {
      return (
        <View>
          <Icon.Button name="edit" backgroundColor="#1c3969" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._renameTournoiInput(tournoi)}/>
        </View>
      )
    }
    else {
      if (this.state.disabledBoutonRenommer == true) {
        return (
          <View>
            <Icon.Button name="edit" backgroundColor="gray" iconStyle={{paddingHorizontal: 2, marginRight: 0}}/>
          </View>
        )
      }
      else {
        return (
          <View>
            <Icon.Button name="check" backgroundColor="green" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._renameTournoi()}/>
          </View>
        )
      }
    }
  }

  _renameTournoiInput(tournoi) {
    this.setState({
      renommerOn: true
    })
    this.tournoiNameText = tournoi.name
  }

  _renameTournoi() {
    if (this.tournoiNameText != "") {
      this.setState({
        renommerOn: false,
        disabledBoutonRenommer: true
      })
      const actionRenameTournoi = { type: "RENOMMER_TOURNOI", value: {tournoi: tournoi, newName: tournoiNameText} }
      this.props.dispatch(actionRenameTournoi)
      this.tournoiNameText = ""
    }
  }

  _tournoiTextInputChanged(text) {
    this.tournoiNameText = text
    this.setState({
      disabledBoutonRenommer: this.tournoiNameText == '' ? true : false
    })
  }

  _tournoiName(tournoi) {
    if (this.state.renommerOn == true) {
      let placeholder = tournoi.name != undefined ? tournoi.name : "Tournoi n°"+tournoi.tournoiId;
      return (
        <TextInput
          style={styles.text_input}
          placeholder={placeholder}
          autoFocus={true}
          onChangeText={(text) => this._tournoiTextInputChanged(text)}
          onSubmitEditing={() => this._renameTournoi()}
        />
      )
    }
    else {
      return (
        <Text style={styles.tournoi_text}>Tournoi n°{tournoi.tournoiId}</Text>
      )
    }
  }

  render() {
    const {tournoi, _showModalTournoiInfos} = this.props;
    let boutonDesactive = false;
    if (this.props.listeMatchs && tournoi.tournoiId == this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID) {
      boutonDesactive = true;
    }
    return (
      <View style={styles.tournoi_container}>
        <View style={styles.tournoi_name_container}>
          {this._tournoiName(tournoi)}
          <View style={styles.buttonView}>
            {this._showRenameTournoi(tournoi)}
          </View>
        </View>
        <View style={styles.buttonView}>
          <Icon.Button name="info-circle" backgroundColor="#1c3969" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => _showModalTournoiInfos(tournoi)}/>
        </View>
        <View style={styles.buttonView}>
          <Button disabled={boutonDesactive} color="#1c3969" title="Charger" onPress={() => this._chargerTournoi(tournoi)}/>
        </View>
        <View style={styles.buttonView}>
          <Icon.Button disabled={boutonDesactive} name="times" backgroundColor={boutonDesactive ? "#c0c0c0" : "red"} iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._modalSupprimerTournoi(tournoi)}/>
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
  tournoi_name_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
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

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(ListeTournoiItem)