import React from 'react'
import { StyleSheet, View, Text, Button, FlatList, Alert } from 'react-native'
import { connect } from 'react-redux'

class ListeJoueur extends React.Component {
  constructor(props) {
    super(props)
  }

  modifyList(savedList) {
    //const actionUpdateListeMatchs = {type: "AJOUT_MATCHS", value: tournoi.tournoi};
    //this.props.dispatch(actionUpdateListeMatchs);
  }

  _modalRemoveList(list) {
    Alert.alert(
      "Suppression d'une liste",
      "Êtes-vous sûr de vouloir supprimer la liste n°" + (list[list.length -1].listId + 1) + " ?",
      [
        { text: "Annuler", onPress: () => undefined, style: "cancel" },
        { text: "Oui", onPress: () => this._removeList(list[list.length -1].listId) },
      ],
      { cancelable: true }
    );
  }

  _removeList(listId) {
    const actionRemoveList = {type: "REMOVE_SAVED_LIST", value: {typeInscription: 'avecNoms', listId: listId}};
    this.props.dispatch(actionRemoveList);
  }

  _buttons() {
    if(this.props.route.params && this.props.route.params.loadListScreen) {
      return (
        <View>
          <View style={styles.buttonView}>
            <Button color="#1c3969" title="Charger" onPress={() => this._loadList(list)}/>
          </View>
        </View>  
      )
    }
    else {
      return(
        <View>
          <View style={styles.buttonView}>
            <Button color="#1c3969" title="Modifier" onPress={() => this.modifyList(list)}/>
          </View>
          <View style={styles.buttonView}>
            <Button color="red" title="Supprimer" onPress={() => this._modalRemoveList(list)}/>
          </View>
        </View>
      )
    }
  }

  _loadList(list) {
    const actionLoadList = { type: "LOAD_SAVED_LIST", value: [this.props.optionsTournoi.mode, list.id] }
    this.props.dispatch(actionLoadList);
    this.props.navigation.navigate("Inscription")
  }

  _listeJoueursItem(list) {
    return (
      <View style={styles.saved_list_container}>
        <View style={styles.text_container}>
          <Text style={styles.title_text}>Liste n°{list[list.length -1].listId + 1}</Text>
        </View>
        {_buttons()}
      </View>
    )
  }

  render() {
    const { savedLists } = this.props;
    return (
      <FlatList
        data={savedLists.avecNoms}
        initialNumToRender={20}
        keyExtractor={(item) => item[item.length - 1].listId.toString() }
        renderItem={({item}) => (this._listeJoueursItem(item))}
      />
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: 'white'
  },
  name_container: {
    flex: 1,
  },
  name_text: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
  special_container: {
    marginLeft: 5,
    marginRight: 5,
  },
  special_text: {
    fontSize: 20,
    color: 'white'
  },
  text_input: {
    height: 50,
    paddingLeft: 5,
    color: 'white'
  },
  picker_container: {
    flex: 1,
    alignItems: 'flex-end',
  },
  picker: {
    color: 'white',
    width: 115
  }
})

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs,
  }
}

export default connect(mapStateToProps)(ListeJoueur)