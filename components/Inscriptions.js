import React from 'react'
import { StyleSheet, View, TextInput, Text, Button } from 'react-native'
import CheckBox from 'react-native-check-box'
import { connect } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import ListeJoueur from '../components/ListeJoueur'
import JoueurSuggere from '../components/JoueurSuggere'

class Inscription extends React.Component {

  constructor(props) {
    super(props)
    this.joueurText = "",
    this.addPlayerTextInput = React.createRef()
    this.nbTours = "5"
    this.speciauxIncompatibles = true
    this.memesEquipes = true
    this.memesAdversaires = true
    this.state = {
      joueur: undefined,
      isChecked: false,
      etatBouton: false,
      typeEquipes: 'doublette',
      avecEquipes: false,
      complement: "3",
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

  componentDidUpdate() {
    if (this.props.route.params != undefined) {
      let routeparams = this.props.route.params;
      if (routeparams.nbTours != undefined) {
        this.nbTours = routeparams.nbTours
      }
      if (routeparams.speciauxIncompatibles != undefined) {
        this.speciauxIncompatibles = routeparams.speciauxIncompatibles
      }
      if (routeparams.memesEquipes != undefined) {
        this.memesEquipes = routeparams.memesEquipes
      }
      if (routeparams.memesAdversaires != undefined) {
        this.memesAdversaires = routeparams.memesAdversaires
      }
      if (routeparams.complement != undefined && this.state.complement != routeparams.complement) {
        this.setState({
          complement: routeparams.complement
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

  _commencer() {
    let screenName;
    if (this.props.optionsTournoi.type == "championnat") {
      screenName = 'GenerationChampionnat';
    }
    if (this.props.optionsTournoi.type == "coupe") {
      screenName = 'GenerationCoupe';
    }
    else if (this.props.optionsTournoi.type == "mele-demele") {
      if (this.state.avecEquipes == true) {
        screenName = 'GenerationMatchsAvecEquipes';
      }
      else if (this.state.typeEquipes == "triplette") {
        screenName = 'GenerationMatchsTriplettes';
      }
      else {
        screenName = 'GenerationMatchs';
      }
    }
    else {

    }

    this.props.navigation.navigate({
      name: screenName,
      params: {
        nbTours: parseInt(this.nbTours),
        speciauxIncompatibles: this.speciauxIncompatibles,
        memesEquipes: this.memesEquipes,
        memesAdversaires: this.memesAdversaires,
        typeEquipes: this.state.typeEquipes,
        complement: this.state.complement,
        typeInscription: this.state.typeInscription,
        screenStackName: 'InscriptionsAvecNoms'
      }
    })
  }

  _options() {
    this.props.navigation.navigate({
      name: 'OptionsTournoi',
      params: {
        nbTours: this.nbTours,
        speciauxIncompatibles: this.speciauxIncompatibles,
        memesEquipes: this.memesEquipes,
        memesAdversaires: this.memesAdversaires,
        complement: this.state.complement,
        screenStackName: 'InscriptionsAvecNoms'
      }
    })
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

  _showNbJoueur() {
    let nbJoueur = this.props.listesJoueurs[this.state.typeInscription].length;
    return (
      <Text>{nbJoueur}</Text>
    )
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

  _boutonCommencer() {
    let boutonDesactive = false
    let boutonTitle = 'Commencer le tournoi'
    let nbJoueurs = this.props.listesJoueurs[this.state.typeInscription].length

    let nbEquipes
    if (this.state.typeEquipes == "teteatete") {
      nbEquipes = nbJoueurs
    }
    else if (this.state.typeEquipes == "doublette") {
      nbEquipes = Math.ceil(nbJoueurs / 2)
    }
    else {
      nbEquipes = Math.ceil(nbJoueurs / 3)
    }

    if (this.props.optionsTournoi.type == 'coupe' && (nbEquipes < 4 || Math.log2(nbEquipes) % 1 !== 0)) {
      boutonTitle = "En coupe, le nombre d'équipes doit être de 4, 8, 16, ..."
      boutonDesactive = true
    }
    else if (this.state.avecEquipes == true) {
      if (this.props.listesJoueurs.avecEquipes.find(el => el.equipe == undefined) != undefined || this.props.listesJoueurs.avecEquipes.find(el => el.equipe > nbEquipes) != undefined) {
        boutonTitle = "Des joueurs n'ont pas d'équipe"
        boutonDesactive = true
      }
      else if (this.state.typeEquipes == "teteatete") {
        if (this.props.listesJoueurs.avecEquipes.length % 2 != 0 || this.props.listesJoueurs.avecEquipes.length < 2) {
          boutonTitle = "Le nombre d'equipe doit être un multiple de 2"
          boutonDesactive = true
        }
        else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = this.props.listesJoueurs.avecEquipes.reduce((counter, obj) => obj.equipe == i ? counter += 1 : counter, 0)
            if (count > 1) {
              boutonTitle = "Des équipes ont trop de joueurs"
              boutonDesactive = true
              break
            }
          }
        }
      }
      else if (this.state.typeEquipes == "doublette") {
        if (this.props.listesJoueurs.avecEquipes.length % 4 != 0 || this.props.listesJoueurs.avecEquipes.length == 0) {
          boutonTitle = "Avec des équipes en doublette, le nombre de joueurs doit être un multiple de 4"
          boutonDesactive = true
        }
        else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = this.props.listesJoueurs.avecEquipes.reduce((counter, obj) => obj.equipe == i ? counter += 1 : counter, 0)
            if (count > 2) {
              boutonTitle = "Des équipes ont trop de joueurs"
              boutonDesactive = true
              break
            }
          }
        }
      }
      else if (this.state.typeEquipes == "triplette" && (this.props.listesJoueurs.avecEquipes.length % 6 != 0 || this.props.listesJoueurs.avecEquipes.length == 0)) {
        boutonTitle = "En triplette avec des équipes formées, le nombre de joueurs doit être un multiple de 6"
        boutonDesactive = true
      }
    }
    else if (this.state.typeEquipes == "teteatete" && (this.props.listesJoueurs.avecNoms.length % 2 != 0 || this.props.listesJoueurs.avecNoms.length < 2)) {
      boutonTitle = "En tête-à-tête, le nombre de joueurs doit être un multiple de 2"
      boutonDesactive = true
    }
    else if (this.state.typeEquipes == "doublette" && (this.props.listesJoueurs.avecNoms.length % 4 != 0 || this.props.listesJoueurs.avecNoms.length < 4)) {
      if (this.props.listesJoueurs.avecNoms.length < 4) {
        boutonTitle = "Pas assez de joueurs"
        boutonDesactive = true
      }
      else if (this.props.listesJoueurs.avecNoms.length % 2 == 0 && this.state.complement == "1") {
        boutonTitle = "Nombre de joueurs pas multiple de 4, l'option sélectionnée formera un tête-à-tête"
      }
      else if (this.state.complement == "3") {
        if (this.props.listesJoueurs.avecNoms.length == 7) {
          boutonTitle = "Mode 3vs2 + 1vs1 n'est pas encore disponible"
          boutonDesactive = true
        }
        else {
          boutonTitle = "Nombre de joueurs pas multiple de 4, l'option sélectionnée formera des triplettes pour compléter"
        }
      }
      else if (this.state.complement != "3") {
        boutonTitle = "Nombre de joueurs pas multiple de 4, veuiller choisir l'option pour former des triplettes pour compléter si vous voulez lancer"
        boutonDesactive = true
      }
    }
    else if (this.state.typeEquipes == "triplette" && (this.props.listesJoueurs.avecNoms.length % 6 != 0 || this.props.listesJoueurs.avecNoms.length < 6)) {
      boutonTitle = "En triplette, le nombre de joueurs doit être un multiple de 6"
      boutonDesactive = true
    }
    return (
      <Button disabled={boutonDesactive} color='green' title={boutonTitle} onPress={() => this._commencer()}/>
    )
  }

  _boutonOptions() {
    if (this.props.optionsTournoi.type != 'championnat' && this.props.optionsTournoi.type != 'coupe') {
      return (
        <Button color='#1c3969' title='Options Tournoi' onPress={() => this._options()}/>
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
        <View style={styles.text_container}>
          <Text style={styles.text_nbjoueur}>Il y a : {this._showNbJoueur()} inscrit.e.s</Text>
        </View>
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
        <View>
          <View style={styles.buttonView}>
            {this._boutonOptions()}
          </View>
          <View style={styles.buttonView}>
            {this._boutonCommencer()}
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