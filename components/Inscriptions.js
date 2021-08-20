import React from 'react'
import { StyleSheet, View, TextInput, Text, Button } from 'react-native'
import CheckBox from 'react-native-check-box'
import { connect } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import ListeJoueur from '../components/ListeJoueur'

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
      complement: "3"
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
        this.setState({
          avecEquipes: routeparams.avecEquipes
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
    if(this.joueurText != '') {
      const action = { type: "AJOUT_JOUEUR", value: [this.joueurText, this.state.isChecked] }
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
    const actionSuppr = { type: "SUPPR_JOUEUR", value: idJoueur }
    this.props.dispatch(actionSuppr);
    const actionUpdate = { type: "UPDATE_ALL_JOUEURS_ID"}
    this.props.dispatch(actionUpdate);
  }

  _commencer() {
    let screenName
    if (this.state.avecEquipes == true) {
      screenName = 'GenerationMatchsAvecEquipes'
    }
    else if (this.state.typeEquipes == "triplette") {
      screenName = 'GenerationMatchsTriplettes'
    }
    else {
      screenName = 'GenerationMatchs'
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
        screenStackName: 'InscriptionGeneral'
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
        screenStackName: 'InscriptionGeneral'
      }
    })
  }

  _displayListeJoueur() {
    if (this.props.listeJoueurs !== undefined) {
      return (
        <FlatList
          persistentScrollbar={true}
          data={this.props.listeJoueurs}
          keyExtractor={(item) => item.id.toString() }
          renderItem={({item}) => (
            <ListeJoueur
              joueur={item}
              supprimerJoueur={this._supprimerJoueur}
              isInscription={true}
              avecEquipes={this.state.avecEquipes}
              typeEquipes={this.state.typeEquipes}
              nbJoueurs={this.props.listeJoueurs.length}
            />
          )}
        />
      )
    }
  }

  _showNbJoueur() {
    let nbJoueur = this.props.listeJoueurs.length;
    return (
    <Text>{nbJoueur}</Text>
    )
  }

  _boutonCommencer() {
    let boutonDesactive = false
    let boutonTitle = 'Commencer le tournoi'

    let nbEquipes
    if (this.state.typeEquipes == "doublette") {
      nbEquipes = Math.ceil(this.props.listeJoueurs.length / 2)
    }
    else {
      nbEquipes = Math.ceil(this.props.listeJoueurs.length / 3)
    }

    if (this.state.avecEquipes == true) {
      if (this.props.listeJoueurs.find(el => el.equipe == undefined) != undefined || this.props.listeJoueurs.find(el => el.equipe > nbEquipes) != undefined) {
        boutonTitle = "Des joueurs n'ont pas d'équipe"
        boutonDesactive = true
      }
      else if (this.state.typeEquipes == "teteatete" && (this.props.listeJoueurs.length % 2 != 0 || this.props.listeJoueurs.length < 2)) {
        boutonTitle = "En équipes, le nombre d'equipe doit être un multiple de 2"
        boutonDesactive = true
      }
      else if (this.state.typeEquipes == "doublette") {
        if (this.props.listeJoueurs.length % 4 != 0 || this.props.listeJoueurs.length == 0) {
          boutonTitle = "Avec des équipes en doublette, le nombre de joueurs doit être un multiple de 4"
          boutonDesactive = true
        }
        else {
          for (let i = 0; i < nbEquipes; i++) {
            let count = this.props.listeJoueurs.reduce((counter, obj) => obj.equipe == i ? counter += 1 : counter, 0)
            if (count > 2) {
              boutonTitle = "Des équipes ont trop de joueurs"
              boutonDesactive = true
              break
            }
          }
        }
      }
      else if (this.state.typeEquipes == "triplette" && (this.props.listeJoueurs.length % 6 != 0 || this.props.listeJoueurs.length == 0)) {
        boutonTitle = "En triplette avec des équipes formées, le nombre de joueurs doit être un multiple de 6"
        boutonDesactive = true
      }
    }
    else if (this.state.typeEquipes == "teteatete" && (this.props.listeJoueurs.length % 2 != 0 || this.props.listeJoueurs.length < 2)) {
      boutonTitle = "En tête-à-tête, le nombre de joueurs doit être un multiple de 2"
      boutonDesactive = true
    }
    else if (this.state.typeEquipes == "doublette" && this.props.listeJoueurs.length % 4 != 0) {
      if (this.state.complement == "3") {
        boutonTitle = "Nombre de joueurs pas multiple de 4, l'option sélectionnée formera des triplettes pour compléter"
      }
      else if (this.props.listeJoueurs.length % 2 == 0 && this.state.complement == "1") {
        boutonTitle = "Nombre de joueurs pas multiple de 4, l'option sélectionnée formera un tête-à-tête"
      }
      else if (this.state.complement != "3") {
        boutonTitle = "Nombre de joueurs pas multiple de 4, veuiller choisir l'option pour former des triplettes pour compléter si vous voulez lancer"
        boutonDesactive = true
      }
    }
    else if (this.state.typeEquipes == "triplette" && (this.props.listeJoueurs.length % 6 != 0 || this.props.listeJoueurs.length < 6)) {
      boutonTitle = "En triplette, le nombre de joueurs doit être un multiple de 6"
      boutonDesactive = true
    }
    return (
      <Button disabled={boutonDesactive} color='green' title={boutonTitle} onPress={() => this._commencer()}/>
    )
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
      <View style={styles.main_container} >
        <View style={styles.nbjoueur_container}>
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
        <View style={styles.entete}>
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
        <View style={styles.flatList} >
          {this._displayListeJoueur()}
        </View>
        <View style={styles.buttonView}>
          <Button color='#1c3969' title='Options Tournoi' onPress={() => this._options()}/>
        </View>
        <View style={styles.buttonView}>
          {this._boutonCommencer()}
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
  checkbox_ajoutjoueur_container: {
    flex: 1
  },
  button_ajoutjoueur_container: {
    flex: 1,
    marginRight: 5
  },
  textinput: {
    height: 50,
    paddingLeft: 5,
    color: 'white'
  },
  buttonView: {
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15
  },
  flatList: {
    flex: 1
  },
  nbjoueur_container: {
    alignItems: 'center',
    marginTop: 5
  },
  text_nbjoueur: {
    fontSize: 20,
    color: 'white'
  },
  entete: {
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
})

const mapStateToProps = (state) => {
  return {
    listeJoueurs: state.toggleJoueur.listeJoueurs
  }
}

export default connect(mapStateToProps)(Inscription)