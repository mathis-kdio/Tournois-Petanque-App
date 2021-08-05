import React from 'react'
import { StyleSheet, View, Text, Button, TextInput } from 'react-native'
import { connect } from 'react-redux'

class ListeJoueur extends React.Component {
  constructor(props) {
    super(props)
    this.joueurText = ""
    this.state = {
      renommerOn: false,
      disabledBoutonRenommer: true
    }
  }

  _isSpecial = (joueurSpecial) => {
    if (joueurSpecial === true) {
      return (
        <View style={styles.special_container}>
          <Text style={styles.special_text}>Femme/Enfant</Text>
        </View>
      )
    }
  }

  _showSupprimerJoueur(joueur, supprimerJoueur, isInscription) {
    if (isInscription === true) {
      return (
        <View>
          <Button color='#ff0000' title='Supprimer' onPress={() => supprimerJoueur(joueur.id)}/>
        </View>
      )
    }
  }

  _showRenommerJoueur(joueur, isInscription) {
    if (isInscription === false) {
      if (this.state.renommerOn == false) {
        return (
          <View>
            <Button color='green' title='Renommer' onPress={() => this._renommerJoueurInput(joueur)}/>
          </View>
        )
      }
      else {
        return (
          <View>
            <Button disabled={this.state.disabledBoutonRenommer} color='green' title='Valider' onPress={() => this._renommerJoueur(joueur)}/>
          </View>
        )
      }
    }
  }

  _renommerJoueurInput(joueur) {
    this.setState({
      renommerOn: true
    })
    this.joueurText = joueur.name
  }

  _renommerJoueur(joueur) {
    if(this.joueurText != "") {
      this.setState({
        renommerOn: false,
        disabledBoutonRenommer: true
      })
      const actionRenommer = { type: "RENOMMER_JOUEUR", value: [joueur.id - 1, this.joueurText] }
      this.props.dispatch(actionRenommer)
      this.joueurText = ""
    }
  }

  _joueurTxtInputChanged = (text) => {
    this.joueurText = text
    //Le bouton valider est désactivé si aucune lettre
    if (this.joueurText == '') {
      this.setState({
        disabledBoutonRenommer: true
      })
    }
    else {
      this.setState({
        disabledBoutonRenommer: false
      })
    }
  }

  _joueurName(joueur) {
    if (this.state.renommerOn == true) {
      return(
        <TextInput
          style={styles.textinput}
          placeholder={joueur.name}
          autoFocus={true}
          onChangeText={(text) => this._joueurTxtInputChanged(text)}
          onSubmitEditing={() => this._renommerJoueur(joueur)}
        />
      )
    }
    else {
      return(
        <Text style={styles.name_text}>{joueur.id} {joueur.name}</Text>
      )
    }
  }

  render() {
    const { joueur, supprimerJoueur, isInscription } = this.props;
    return (
      <View style={styles.main_container}>
        <View style={styles.name_container}>
          {this._joueurName(joueur)}
        </View>
        {this._isSpecial(joueur.special)}
        {this._showSupprimerJoueur(joueur, supprimerJoueur, isInscription)}
        {this._showRenommerJoueur(joueur, isInscription)}
      </View>
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
  textinput: {
    height: 50,
    paddingLeft: 5,
    color: 'white'
  },
})

const mapStateToProps = (state) => {
  return {
    listeJoueurs: state.toggleJoueur.listeJoueurs
  }
}

export default connect(mapStateToProps)(ListeJoueur)