import React from 'react'
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'

class ListeJoueursItem extends React.Component {
  constructor(props) {
    super(props)
    this.listNameText = ""
    this.state = {
      renommerOn: false,
      disabledBoutonRenommer: true
    }
  }

  _modifyList(list) {
    const actionRemoveList = {type: "SUPPR_ALL_JOUEURS", value: ['sauvegarde']};
    this.props.dispatch(actionRemoveList);
    const actionLoadList = {type: "LOAD_SAVED_LIST", value: {typeInscriptionSrc: 'avecNoms', typeInscriptionDst: 'sauvegarde', listId: list[list.length - 1].listId}};
    this.props.dispatch(actionLoadList);
    this.props.navigation.navigate({
      name: 'CreateListeJoueurs',
      params: {
        type: "edit",
        listId: list[list.length - 1].listId
      }
    })
  }

  _modalRemoveList(list) {
    Alert.alert(
      "Suppression d'une liste",
      "Êtes-vous sûr de vouloir supprimer la liste n°" + (list[list.length - 1].listId + 1) + " ?",
      [
        { text: "Annuler", onPress: () => undefined, style: "cancel" },
        { text: "Oui", onPress: () => this._removeList(list[list.length - 1].listId) },
      ],
      { cancelable: true }
    );
  }

  _removeList(listId) {
    const actionRemoveList = {type: "REMOVE_SAVED_LIST", value: {typeInscription: 'avecNoms', listId: listId}};
    this.props.dispatch(actionRemoveList);
  }

  _showRenameList(list) {
    if (this.state.renommerOn) {
      if (this.state.disabledBoutonRenommer) {
        return (
          <Icon.Button name="check" backgroundColor="gray" iconStyle={{paddingHorizontal: 2, marginRight: 0}}/>
        )
      }
      else {
        return (
          <Icon.Button name="check" backgroundColor="green" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._renameList(list)}/>
        )
      }
    }
    else {
      return (
        <Icon.Button name="edit" backgroundColor="#1c3969" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._renameListInput(list)}/>
      )
    }
  }

  _renameListInput(list) {
    this.setState({
      renommerOn: true
    })
    this.listNameText = list.name
  }

  _renameList(list) {
    if (this.listNameText != "") {
      this.setState({
        renommerOn: false,
        disabledBoutonRenommer: true
      })
      const actionRenameList = { type: "RENAME_SAVED_LIST", value: {listId: list[list.length - 1].listId, newName: this.listNameText} }
      this.props.dispatch(actionRenameList)
      this.listNameText = ""
    }
  }

  _listTextInputChanged(text) {
    this.listNameText = text
    this.setState({
      disabledBoutonRenommer: this.listNameText == '' ? true : false
    })
  }

  _buttons(list) {
    if(this.props.route && this.props.route.params && this.props.route.params.loadListScreen) {
      return (
        <View style={styles.buttonView}>
          <Button color="#1c3969" title="Charger" onPress={() => this._loadList(list[list.length - 1].listId)}/>
        </View>
      )
    }
    else {
      return(
        <View style={styles.buttonContainer}>
          <View style={styles.buttonView}>
            <Button color="#1c3969" title="Modifier" onPress={() => this._modifyList(list)}/>
          </View>
          <View style={styles.buttonView}>
            <Icon.Button name="times" backgroundColor="red" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._modalRemoveList(list)}/>
          </View>
        </View>
      )
    }
  }

  _loadList(listId) {
    const actionLoadList = { type: "LOAD_SAVED_LIST", value: {typeInscriptionSrc: 'avecNoms', typeInscriptionDst: 'avecNoms', listId: listId} }
    this.props.dispatch(actionLoadList);
    this.props.navigation.goBack();
  }

  _listName(list) {
    let listName = 'List ' + (list.name ? list.name : 'n°' + list[list.length - 1].listId);
    if (this.state.renommerOn) {
      return (
        <TextInput
          style={styles.text_input}
          placeholder={listName}
          autoFocus={true}
          onChangeText={(text) => this._listTextInputChanged(text)}
          onSubmitEditing={() => this._renameList(list)}
        />
      )
    }
    else {
      return (
        <Text style={styles.list_text}>{listName}</Text>
      )
    }
  }

  render() {
    const {list} = this.props;
    console.log(list)
    return (
      <View style={styles.saved_list_container}>
        <View style={styles.saved_list_name_container}>
          <View style={{flex: 1}}>
            {this._listName(list)}
          </View>
          {this._showRenameList(list)}
        </View>
        {this._buttons(list)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    color: 'white'
  },
  saved_list_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  buttonView: {
    marginHorizontal: 5
  },
  saved_list_name_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  list_text: {
    fontSize: 15,
    color: 'white'
  }
})

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs,
  }
}

export default connect(mapStateToProps)(ListeJoueursItem)