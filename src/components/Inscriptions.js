import React from 'react'
import { StyleSheet, View, TextInput, Text, Button, Alert } from 'react-native'
import { connect } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import ListeJoueurItem from '@components/ListeJoueurItem'
import JoueurSuggere from '@components/JoueurSuggere'
import { Box, CheckIcon, ChevronDownIcon, HStack, Select } from 'native-base';

class Inscription extends React.Component {

  constructor(props) {
    super(props)
    this.joueurText = "",
    this.addPlayerTextInput = React.createRef()
    this.state = {
      joueur: undefined,
      isChecked: false,
      etatBouton: false,
      suggestions: [],
      nbSuggestions: 5
    }
  }

  componentDidMount() {
    let suggestions = this._getSuggestions();
    this.setState({
      suggestions: suggestions
    })
  }

  componentDidUpdate() {
    let newSuggestions = this._getSuggestions();
    if (newSuggestions.length != this.state.suggestions.length) {
      this.setState({
        suggestions: newSuggestions
      })
    }
  }

  _getSuggestions() {
    let listeHistoriqueFiltre = this.props.listesJoueurs.historique.filter(item1 => this.props.listesJoueurs[this.props.optionsTournoi.mode].every(item2 => item2.name !== item1.name));
    if (listeHistoriqueFiltre.length > 0) {
      return listeHistoriqueFiltre.sort(function (a, b) {return b.nbTournois - a.nbTournois;});
    }
    return [];
  }

  _ajoutJoueurTextInputChanged(text) {
    this.joueurText = text
    //Possible d'utiliser le bouton sauf si pas de lettre
    if (this.joueurText != '') {
      this.setState({
        etatBouton: true
      })
    }
    else {
      this.setState({
        etatBouton: false
      })
    }
  } 

  _ajoutJoueur() {
    //Test si au moins 1 caractère
    if (this.joueurText != '') {
      let equipe = 1
      if (this.props.optionsTournoi.typeEquipes == "teteatete" && this.props.listesJoueurs[this.props.optionsTournoi.mode]) {
        equipe = this.props.listesJoueurs[this.props.optionsTournoi.mode].length + 1
      }
      const action = { type: "AJOUT_JOUEUR", value: [this.props.optionsTournoi.mode, this.joueurText, this.state.isChecked, equipe] }
      this.props.dispatch(action);
      this.addPlayerTextInput.current.clear();
      this.joueurText = "";
      this.setState({
        isChecked: false,
        etatBouton: false
      })
      //Ne fonctionne pas avec: "this.addPlayerTextInput.current.focus()" quand validation avec clavier donc "hack" ci-dessous
      setTimeout(() => this.addPlayerTextInput.current.focus(), 0)
    }
  }

  _modalRemoveAllPlayers() {
    Alert.alert(
      "Supprimer tous les joueurs",
      "Êtes-vous sûr de vouloir supprimer tous les joueurs déjà inscrits ?",
      [
        { text: "Annuler", onPress: () => undefined, style: "cancel" },
        { text: "Oui", onPress: () => this._removeAllPlayers() },
      ],
      { cancelable: true }
    );
  }

  _removeAllPlayers() {
    const actionRemoveAll = { type: "SUPPR_ALL_JOUEURS", value: [this.props.optionsTournoi.mode] }
    this.props.dispatch(actionRemoveAll);
  }

  _loadSavedList() {
    this.props.navigation.navigate({
      name: 'ListesJoueurs',
      params: {
        loadListScreen: true
      }
    })
  }

  _displayListeJoueur() {
    if (this.props.listesJoueurs[this.props.optionsTournoi.mode] !== undefined) {
      let avecEquipes = false;
      if (this.props.optionsTournoi.mode == 'avecEquipes') {
        avecEquipes = true;
      }
      return (
        <FlatList
          removeClippedSubviews={false}
          persistentScrollbar={true}
          data={this.props.listesJoueurs[this.props.optionsTournoi.mode]}
          keyExtractor={(item) => item.id.toString() }
          renderItem={({item}) => (
            <ListeJoueurItem
              joueur={item}
              isInscription={true}
              avecEquipes={avecEquipes}
              typeEquipes={this.props.optionsTournoi.typeEquipes}
              nbJoueurs={this.props.listesJoueurs[this.props.optionsTournoi.mode].length}
            />
          )}
          ListFooterComponent={
            <View>
              {this._buttonRemoveAllPlayers()}
              {this._buttonLoadSavedList()}
              {this._displayListeJoueursSuggeres()}
            </View>
          }
        />
      )
    }
  }

  _displayListeJoueursSuggeres() {
    if (this.state.suggestions.length > 0) {
      let partialSuggested = this.state.suggestions.slice(0, this.state.nbSuggestions);
      return (
        <View>
          <View style={styles.text_container}>
            <Text style={styles.text_nbjoueur}>Suggestions de Joueurs</Text>
          </View>
          <FlatList
            removeClippedSubviews={false}
            persistentScrollbar={true}
            data={partialSuggested}
            keyExtractor={(item) => item.id.toString() }
            renderItem={({item}) => (
              <JoueurSuggere
                joueur={item}
              />
            )}
          />
          <View style={styles.buttonView}>
            {this._buttonMoreSuggestedPlayers()}
          </View>
        </View>
      )
    }
  }

  _buttonMoreSuggestedPlayers() {
    if (this.state.nbSuggestions < this.state.suggestions.length) {
      return (
        <Button style={styles.text_nbjoueur} color='green' title='Afficher + de joueurs suggérés' onPress={() => this._showMoreSuggestedPlayers()}/>
      )
    }
  }

  _showMoreSuggestedPlayers() {
    this.setState(prevState => ({ nbSuggestions: prevState.nbSuggestions + 5 }))
  }

  _buttonRemoveAllPlayers() {
    if (this.props.listesJoueurs[this.props.optionsTournoi.mode].length > 0) {
      return (
        <View style={styles.buttonView}>
          <Button style={styles.text_nbjoueur} color='red' title='Supprimer tous les joueurs' onPress={() => this._modalRemoveAllPlayers()}/>
        </View>
      )
    }
  }

  _buttonLoadSavedList() {
    if (!this.props.loadListScreen) {
      return (
        <View style={styles.buttonView}>
          <Button style={styles.text_nbjoueur} color='green' title='Charger une liste de joueurs' onPress={() => this._loadSavedList()}/>
        </View>
      )
    }
  }

  _showEquipeEntete() {
    if (this.props.optionsTournoi.mode == 'avecEquipes') {
      return (
        <Text style={styles.texte_entete}>Equipe</Text>
      )
    }
  }

  render() {
    return (
      <View style={styles.main_container}>
        <HStack alignItems="center" mx="1" space="1">
          <Box flex="1">
            <TextInput
              style={styles.textinput}
              placeholderTextColor="white"
              underlineColorAndroid="white"
              placeholder="Nom du joueur"
              autoFocus={true}
              onChangeText={(text) => this._ajoutJoueurTextInputChanged(text)}
              onSubmitEditing={() => this._ajoutJoueur()}
              ref={this.addPlayerTextInput}
            />
          </Box>
          <Box flex="1">
            <Select
              //selectedValue={"inconnu"}
              accessibilityLabel="Choisir un poste"
              placeholder="Choisir un poste"
              placeholderTextColor="white"
              color="white"
              variant="rounded"
              dropdownIcon={<ChevronDownIcon color="white" mr="2" size="6"/>}
              _selectedItem={{
                bg: "#0594ae",
                endIcon: <CheckIcon size="5"/>}}
              /*onValueChange={itemValue => setService(itemValue)}*/>
              <Select.Item label="Inconnu" value="inconnu"/>
              <Select.Item label="Enfant" value="enfant"/>
              <Select.Item label="Tireur" value="tireur"/>
              <Select.Item label="Pointeur" value="pointeur"/>
              <Select.Item label="Milieu" value="milieu"/>
            </Select>
          </Box>
          <Box>
            <Button
              disabled={!this.state.etatBouton}
              color="green"
              title="Ajouter"
              onPress={() => this._ajoutJoueur()}
            />
          </Box>
        </HStack>
        <View style={styles.entete_container}>
          <View style={styles.prenom_container}>
            <Text style={styles.texte_entete}>N° Prénom</Text>
          </View>
          <View style={styles.equipe_container}>
            {this._showEquipeEntete()}
          </View>
          <View style={styles.renommer_container}>
            <Text style={styles.texte_entete}>Renommer</Text>
          </View>
          <View style={styles.supprimer_container}>
            <Text style={styles.texte_entete}>Supprimer</Text>
          </View>
        </View>
        <View style={styles.flatList_container}>
          {this._displayListeJoueur()}
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
  textinput: {
    height: 50,
    paddingLeft: 5,
    color: 'white'
  },
  entete_container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderBottomWidth: 2,
    borderColor: 'white'
  },
  prenom_container: {
    flex: 3,
  },
  equipe_container: {
    flex: 2,
    alignItems: 'center',
  },
  renommer_container: {
    flex: 1,
    alignItems: 'center',
  },
  supprimer_container: {
    flex: 1,
    alignItems: 'flex-end',
  },
  texte_entete: {
    textAlign: 'center',
    fontSize: 15,
    color: 'white'
  },
  flatList_container: {
    flex: 1
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

export default connect(mapStateToProps)(Inscription)