import React from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Picker } from '@react-native-picker/picker'

class ListeJoueur extends React.Component {
  constructor(props) {
    super(props)
    this.joueurText = ""
    this.state = {
      renommerOn: false,
      disabledBoutonRenommer: true,
    }
  }

  _isSpecial = (joueurSpecial) => {
    if (joueurSpecial === true) {
      return (
        <View style={styles.special_container}>
          <Text style={styles.special_text}>Enfant</Text>
        </View>
      )
    }
  }

  _showSupprimerJoueur(joueur, supprimerJoueur, isInscription) {
    if (isInscription === true) {
      return (
        <View>
            <Icon.Button name="times" backgroundColor="red" onPress={() => supprimerJoueur(joueur.id)}/>
        </View>
      )
    }
  }

  _showRenommerJoueur(joueur, isInscription) {
    if (this.state.renommerOn == false) {
      return (
        <View>
            <Icon.Button name="edit" backgroundColor="green" onPress={() => this._renommerJoueurInput(joueur)}/>
        </View>
      )
    }
    else {
      if (this.state.disabledBoutonRenommer == true) {
        return (
          <View>
            <Icon.Button name="edit" backgroundColor="gray"/>
          </View>
        )
      }
      else {
        return (
          <View>
            <Icon.Button name="check" backgroundColor="green" onPress={() => this._renommerJoueur(joueur, isInscription)}/>
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

  _renommerJoueur(joueur, isInscription) {
    if(this.joueurText != "") {
      this.setState({
        renommerOn: false,
        disabledBoutonRenommer: true
      })
      if (isInscription === true) {
        const actionRenommer = { type: "RENOMMER_JOUEUR", value: [joueur.id - 1, this.joueurText] }
        this.props.dispatch(actionRenommer)
      }
      else {
        let data = { playerId: joueur.id - 1, newName: this.joueurText };
        const inGameRenamePlayer = { type: "INGAME_RENAME_PLAYER", value: data }
        this.props.dispatch(inGameRenamePlayer)
      }
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

  _ajoutEquipe(joueurId, equipeId) {
    const action = { type: "AJOUT_EQUIPE_JOUEUR", value: [joueurId - 1, equipeId] }
    this.props.dispatch(action)
  }

  _equipePicker(joueur, avecEquipes, typeEquipes, nbJoueurs) {
    if (avecEquipes == true) {
      let selectedValue = 0
      if (joueur.equipe) {
        selectedValue = joueur.equipe
      }
      let nbEquipes
      if (typeEquipes == "teteatete") {
        nbEquipes = nbJoueurs
      }
      else if (typeEquipes == "doublette") {
        nbEquipes = Math.ceil(nbJoueurs / 2)
      }
      else {
        nbEquipes = Math.ceil(nbJoueurs / 3)
      }

      let pickerItem = []
      for (let i = 1; i <= nbEquipes; i++) {
        let count =  this.props.listeJoueurs.reduce((counter, obj) => obj.equipe == i ? counter += 1 : counter, 0)
        if (typeEquipes == "teteatete" && count < 1) {
          pickerItem.push(this._equipePickerItem(i))
        }
        else if (typeEquipes == "doublette" && count < 2) {
          pickerItem.push(this._equipePickerItem(i))
        }
        else if (typeEquipes == "triplette" && count < 3) {
          pickerItem.push(this._equipePickerItem(i))
        }
        else if (joueur.equipe == i) {
          pickerItem.push(this._equipePickerItem(i))
        }
      }
      return (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) => this._ajoutEquipe(joueur.id, itemValue)}
            style={styles.picker}
            dropdownIconColor="white"
          >
            <Picker.Item label="Choisir" value={undefined} key="0"/>
            {pickerItem}
          </Picker>
        </View>
      )
    }
  }

  _equipePickerItem(equipe) {
    return (
      <Picker.Item label={equipe.toString()} value={equipe} key={equipe}/>
    )
  }

  render() {
    const { joueur, supprimerJoueur, isInscription, avecEquipes, typeEquipes, nbJoueurs } = this.props;
    return (
      <View style={styles.main_container}>
        <View style={styles.name_container}>
          {this._joueurName(joueur)}
        </View>
        {this._equipePicker(joueur, avecEquipes, typeEquipes, nbJoueurs)}
        {this._isSpecial(joueur.special)}
        {this._showRenommerJoueur(joueur, isInscription)}
        {this._showSupprimerJoueur(joueur, supprimerJoueur, isInscription)}
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
  pickerContainer: {
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
    listeJoueurs: state.toggleJoueur.listeJoueurs
  }
}

export default connect(mapStateToProps)(ListeJoueur)