import React from 'react'
import { StyleSheet, View, FlatList, Text, Button, Alert } from 'react-native'
import { connect } from 'react-redux'

class ListesJoueurs extends React.Component {

  constructor(props) {
    super(props)
  }

  _addList() {
    const actionRemoveList = {type: "SUPPR_ALL_JOUEURS", value: ['sauvegarde']};
    this.props.dispatch(actionRemoveList);
    //Sera utilisé par le component inscription 
    const updateOptionTypeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['type', 'mele-demele']}
    this.props.dispatch(updateOptionTypeTournoi);
    const updateOptionEquipesTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['typeEquipes', 'teteatete']}
    this.props.dispatch(updateOptionEquipesTournoi);
    const updateOptionModeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['mode', 'sauvegarde']}
    this.props.dispatch(updateOptionModeTournoi);

    this.props.navigation.navigate({
      name: 'CreateListeJoueurs',
      params: { }
    })
  }

  modifyList(savedList) {
    //const actionUpdateListeMatchs = {type: "AJOUT_MATCHS", value: tournoi.tournoi};
    //this.props.dispatch(actionUpdateListeMatchs);
  }

  _removeList(savedListId) {
    const actionRemoveList = {type: "REMOVE_SAVED_LIST", value: {listId: savedListId}};
    this.props.dispatch(actionRemoveList);
  }

  _modalRemoveSavedList(savedList) {
    Alert.alert(
      "Suppression d'une liste",
      "Êtes-vous sûr de vouloir supprimer la liste n°" + (savedList[savedList.length -1].listId + 1) + " ?",
      [
        { text: "Annuler", onPress: () => undefined, style: "cancel" },
        { text: "Oui", onPress: () => this._removeList(savedList[savedList.length -1].listId) },
      ],
      { cancelable: true }
    );
  }

  _listeJoueursItem(savedList) {
    return (
      <View style={styles.saved_list_container}>
        <View style={styles.text_container}>
          <Text style={styles.title_text}>Liste n°{savedList[savedList.length -1].listId + 1}</Text>
        </View>
        <View style={styles.buttonView}>
          <Button color="#1c3969" title="Modifier" onPress={() => this.modifyList(savedList)}/>
        </View>
        <View style={styles.buttonView}>
          <Button color="red" title="Supprimer" onPress={() => this._modalRemoveSavedList(savedList)}/>
        </View>
      </View>
    )
  }

  render() {
    let nbLists = 0;
    if (this.props.savedLists) {
      nbLists += this.props.savedLists.avecEquipes.length;
      nbLists += this.props.savedLists.avecNoms.length;
      nbLists += this.props.savedLists.sansNoms.length;
    }
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View>
            <Text style={styles.title}>Vous avez {nbLists} listes</Text>
          </View>
          <View style={styles.createBtnView}>
            <Button color="green" title="Créer une liste" onPress={() => this._addList()}/>
          </View>
          <View style={styles.flatList_container}>
            <FlatList
              data={this.props.savedLists.avecNoms}
              initialNumToRender={20}
              keyExtractor={(item) => item[item.length - 1].listId.toString() }
              renderItem={({item}) => (this._listeJoueursItem(item))}
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
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    color: 'white'
  },
  flatList_container: {
    flex: 1,
    margin: 10
  },
  saved_list_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  text_container: {
    flex: 1,
  },
  title_text: {
    fontSize: 15,
    color: 'white'
  },
  buttonView: {
    flex: 1,
    alignItems: 'flex-end'
  },
  createBtnView: {
    alignItems: 'center'
  }
})

const mapStateToProps = (state) => {
  return {
    savedLists: state.listesJoueurs.listesSauvegarde,
    listesJoueurs: state.listesJoueurs.listesJoueurs
  }
}

export default connect(mapStateToProps)(ListesJoueurs)