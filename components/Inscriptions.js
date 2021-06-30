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
    this.state = {
      joueur: undefined,
      isChecked: false
    }
  }

  _ajoutJoueurTextInputChanged = (text) => {
    this.joueurText = text;
  } 

  _ajoutJoueur() {
    if( this.joueurText != '') {
      const action = { type: "AJOUT_JOUEUR", value: [this.joueurText, this.state.isChecked] }
      this.props.dispatch(action);
      this.addPlayerTextInput.current.clear();
      this.joueurText = "";
      this.setState({
        isChecked: false
      })
    }
  }
  _supprimerJoueur = (idJoueur) => {
    const action = { type: "SUPPR_JOUEUR", value: idJoueur }
    this.props.dispatch(action);
  }

  _commencer() {
    this.props.navigation.navigate('GenerationMatchs');
  }

  _parametres() {
    this.props.navigation.navigate('OptionsTournoi');   
  }

  _displayListeJoueur() {
    if (this.props.listeJoueurs !== undefined) {
      return (
        <FlatList
          data={this.props.listeJoueurs}
          keyExtractor={(item) => item.id.toString() }
          renderItem={({item}) => (
            <ListeJoueur
              joueur={item}
              supprimerJoueur={this._supprimerJoueur}
              isInscription={true}
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

  render() {
    return (
      <View style={styles.main_container} >
        <View style={styles.nbjoueur_container}>
          <Text style={styles.text_nbjoueur}>Il y a : {this._showNbJoueur()} joueur.se.s inscrit.e.s</Text>
        </View>
        <View style={styles.ajoutjoueur_container}>
          <View style={styles.textinput_ajoutjoueur_container}>
            <TextInput
              style={styles.textinput}
              placeholder="Nom du joueur"
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
              rightText={"Femme/Enfant"}
            />
          </View>
          <View style={styles.button_ajoutjoueur_container}> 
            <Button color='#32cd32' title='Ajouter' onPress={() => this._ajoutJoueur()}/>
          </View>
        </View>
        <View style={styles.flatList} >
          {this._displayListeJoueur()}
        </View>
        <View style={styles.buttonView}>
          <Button color='#32cd32' title='Options Tounrois' onPress={() => this._parametres()}/>
        </View>
        <View style={styles.buttonView}>
          <Button color='#32cd32' title='Commencer' onPress={() => this._commencer()}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
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
    flex: 1,
  },
  button_ajoutjoueur_container: {
    flex: 1,
    marginRight: 5
  },
  textinput: {
    height: 50,
    borderBottomWidth: 1,
    paddingLeft: 5,
  },
  buttonView: {
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20
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
  }
})

const mapStateToProps = (state) => {
  return {
    listeJoueurs: state.toggleJoueur.listeJoueurs
  }
}

export default connect(mapStateToProps)(Inscription)