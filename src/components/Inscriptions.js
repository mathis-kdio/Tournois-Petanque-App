import React from 'react'
import { StyleSheet, View, TextInput, Text, Button } from 'react-native'
import CheckBox from 'react-native-check-box'
import { connect } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import ListeJoueur from '../../components/ListeJoueur'
import JoueurSuggere from '../../components/JoueurSuggere'

class Inscription extends React.Component {

  constructor(props) {
    super(props)
    this.joueurText = "",
    this.addPlayerTextInput = React.createRef()
    this.state = {
      joueur: undefined,
      isChecked: false,
      etatBouton: false,
      typeEquipes: 'doublette',
      avecEquipes: false,
      typeInscription: "avecNoms"
    }
  }

  componentDidMount() {
    if (this.props.route.params != undefined) {
      let routeparams = this.props.route.params
      if (routeparams.typeEquipes != undefined) {
        this.setState({
          typeEquipes: routeparams.typeEquipes
        })
      }
      if (routeparams.avecEquipes != undefined) {
        let typeInscription = "avecNoms"
        if (routeparams.avecEquipes == true) {
          typeInscription = "avecEquipes"
        }
        this.setState({
          avecEquipes: routeparams.avecEquipes,
          typeInscription: typeInscription
        })
      }
    }
  }

  _ajoutJoueurTextInputChanged = (text) => {
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
      let equipe = undefined
      if (this.state.typeEquipes == "teteatete" || this.props.optionsTournoi.typeEquipe == "teteatete") {
        equipe = this.props.listesJoueurs[this.state.typeInscription].length + 1
      }
      const action = { type: "AJOUT_JOUEUR", value: [this.state.typeInscription, this.joueurText, this.state.isChecked, equipe] }
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

  _ajoutJoueurBouton() {
    if (this.state.etatBouton == true) {
      return <Button color='green' title='Ajouter' onPress={() => this._ajoutJoueur()}/>
    }
    else {
      return <Button disabled title='Ajouter' onPress={() => this._ajoutJoueur()}/>
    }
  }

  _supprimerJoueur = (idJoueur) => {
    const actionSuppr = {type: "SUPPR_JOUEUR", value: [this.state.typeInscription, idJoueur]};
    this.props.dispatch(actionSuppr);
    const actionUpdate = {type: "UPDATE_ALL_JOUEURS_ID", value: [this.state.typeInscription]};
    this.props.dispatch(actionUpdate);
    if (this.props.optionsTournoi.typeEquipe == "teteatete") {
      const actionUpdateEquipe = {type: "UPDATE_ALL_JOUEURS_EQUIPE", value: [this.state.typeInscription]};
      this.props.dispatch(actionUpdateEquipe);
    }
  }

  _supprimerAllJoueurs() {
    const actionSupprAll = { type: "SUPPR_ALL_JOUEURS", value: [this.state.typeInscription] }
    this.props.dispatch(actionSupprAll);
  }

  _displayListeJoueur() {
    if (this.props.listesJoueurs[this.state.typeInscription] !== undefined) {
      return (
        <FlatList
          removeClippedSubviews={false}
          persistentScrollbar={true}
          data={this.props.listesJoueurs[this.state.typeInscription]}
          keyExtractor={(item) => item.id.toString() }
          renderItem={({item}) => (
            <ListeJoueur
              joueur={item}
              supprimerJoueur={this._supprimerJoueur}
              isInscription={true}
              avecEquipes={this.state.avecEquipes}
              typeEquipes={this.state.typeEquipes}
              nbJoueurs={this.props.listesJoueurs[this.state.typeInscription].length}
            />
          )}
          ListFooterComponent={
            <View>
              {this._boutonSupprAllJoueurs()}
              {this._displayListeJoueursSuggeres()}
            </View>
          }
        />
      )
    }
  }

  _displayListeJoueursSuggeres() {
    if (this.props.listesJoueurs.historique) {
      let listeHistoriqueFiltre = this.props.listesJoueurs.historique.filter(item1 => this.props.listesJoueurs[this.state.typeInscription].every(item2 => item2.name !== item1.name));
      if (listeHistoriqueFiltre.length > 0) {
        let suggestions = listeHistoriqueFiltre.sort(function (a, b) {return b.nbTournois - a.nbTournois;});
        suggestions.splice(5, suggestions.length - 5)
        return (
          <View>
            <View style={styles.text_container}>
              <Text style={styles.text_nbjoueur}>Suggestions de Joueurs</Text>
            </View>
            <FlatList
              removeClippedSubviews={false}
              persistentScrollbar={true}
              data={suggestions}
              keyExtractor={(item) => item.id.toString() }
              renderItem={({item}) => (
                <JoueurSuggere
                  joueur={item}
                  typeInscription={this.state.typeInscription}
                />
              )}
            />
          </View>
        )
      }
    }
  }

  _boutonSupprAllJoueurs() {
    if (this.props.listesJoueurs[this.state.typeInscription].length > 0) {
      return (
        <View style={styles.buttonView}>
          <Button style={styles.text_nbjoueur} color='red' title='Supprimer tous les joueurs' onPress={() => this._supprimerAllJoueurs()}/>
        </View>
      )
    }
  }

  _showEquipeEntete() {
    if (this.state.avecEquipes == true) {
      return (
        <Text style={styles.texte_entete}>Equipe</Text>
      )
    }
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.ajoutjoueur_container}>
          <View style={styles.textinput_ajoutjoueur_container}>
            <TextInput
              style={styles.textinput}
              placeholderTextColor='white'
              underlineColorAndroid='white'
              placeholder="Nom du joueur"
              autoFocus={true}
              onChangeText={(text) => this._ajoutJoueurTextInputChanged(text)}
              onSubmitEditing={() => this._ajoutJoueur()}
              ref={this.addPlayerTextInput}
            />
          </View>
          <View style={styles.checkbox_ajoutjoueur_container}>
            <CheckBox
              onClick={()=>{
                this.setState({
                  isChecked:!this.state.isChecked
                })
              }}
              isChecked={this.state.isChecked}
              rightText={"Enfant"}
              rightTextStyle={{color: "white", fontSize: 15}}
              checkBoxColor={'white'}
            />
          </View>
          <View style={styles.button_ajoutjoueur_container}>
            {this._ajoutJoueurBouton()}
          </View>
        </View>
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
  ajoutjoueur_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  textinput_ajoutjoueur_container: {
    flex: 1,
    marginLeft: 5
  },
  textinput: {
    height: 50,
    paddingLeft: 5,
    color: 'white'
  },
  checkbox_ajoutjoueur_container: {
    flex: 1
  },
  button_ajoutjoueur_container: {
    flex: 1,
    marginRight: 5
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