import React from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Picker } from '@react-native-picker/picker'

class ListeJoueurItem extends React.Component {
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

  _showSupprimerJoueur(joueur, isInscription) {
    if (isInscription === true) {
      return (
        <View style={{marginLeft: 5}}>
            <Icon.Button name="times" backgroundColor="red" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._supprimerJoueur(joueur.id)}/>
        </View>
      )
    }
  }

  _supprimerJoueur(idJoueur) {
    const actionSuppr = {type: "SUPPR_JOUEUR", value: [this.props.optionsTournoi.mode, idJoueur]};
    this.props.dispatch(actionSuppr);
    if (this.props.optionsTournoi.typeEquipes == "teteatete") {
      const actionUpdateEquipe = {type: "UPDATE_ALL_JOUEURS_EQUIPE", value: [this.props.optionsTournoi.mode]};
      this.props.dispatch(actionUpdateEquipe);
    }
  }

  _showRenommerJoueur(joueur, isInscription, avecEquipes) {
    if (this.state.renommerOn == false) {
      return (
        <View>
            <Icon.Button name="edit" backgroundColor="green" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._renommerJoueurInput(joueur)}/>
        </View>
      )
    }
    else {
      if (this.state.disabledBoutonRenommer == true) {
        return (
          <View>
            <Icon.Button name="edit" backgroundColor="gray" iconStyle={{paddingHorizontal: 2, marginRight: 0}}/>
          </View>
        )
      }
      else {
        return (
          <View>
            <Icon.Button name="check" backgroundColor="green" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._renommerJoueur(joueur, isInscription, avecEquipes)}/>
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

  _renommerJoueur(joueur, isInscription, avecEquipes) {
    if (this.joueurText != "") {
      this.setState({
        renommerOn: false,
        disabledBoutonRenommer: true
      })
      if (isInscription === true) {
        let typeInscription
        if (avecEquipes == true) {
          typeInscription = "avecEquipes"
        }
        else {
          typeInscription = "avecNoms"
        }
        const actionRenommer = { type: "RENOMMER_JOUEUR", value: [typeInscription, joueur.id, this.joueurText] }
        this.props.dispatch(actionRenommer)
      }
      else {
        let data = { playerId: joueur.id, newName: this.joueurText };
        const inGameRenamePlayer = { type: "INGAME_RENAME_PLAYER", value: data };
        this.props.dispatch(inGameRenamePlayer);
        const actionUpdateTournoi = { type: "UPDATE_TOURNOI", value: {tournoi: this.props.listeMatchs, tournoiId: this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID}};
        this.props.dispatch(actionUpdateTournoi);
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

  _joueurName(joueur, isInscription, avecEquipes) {
    if (this.state.renommerOn == true) {
      return(
        <TextInput
          style={styles.text_input}
          placeholder={joueur.name}
          autoFocus={true}
          onChangeText={(text) => this._joueurTxtInputChanged(text)}
          onSubmitEditing={() => this._renommerJoueur(joueur, isInscription, avecEquipes)}
        />
      )
    }
    else {
      return(
        <Text style={styles.name_text}>{(joueur.id+1)} {joueur.name}</Text>
      )
    }
  }

  _ajoutEquipe(joueurId, equipeId) {
    const action = { type: "AJOUT_EQUIPE_JOUEUR", value: ["avecEquipes", joueurId, equipeId] }
    this.props.dispatch(action)
  }

  _equipePicker(joueur, avecEquipes, typeEquipes, nbJoueurs) {
    if (avecEquipes == true) {
      let selectedValue = 0;
      if (joueur.equipe) {
        selectedValue = joueur.equipe;
      }
      let nbEquipes = nbJoueurs;
      if (typeEquipes == "doublette") {
        nbEquipes = Math.ceil(nbJoueurs / 2);
      }
      else if (typeEquipes == "triplette"){
        nbEquipes = Math.ceil(nbJoueurs / 3);
      }

      let pickerItem = [];
      for (let i = 1; i <= nbEquipes; i++) {
        let count = this.props.listesJoueurs.avecEquipes.reduce((counter, obj) => obj.equipe == i ? counter += 1 : counter, 0);
        if (typeEquipes == "teteatete" && count < 1) {
          pickerItem.push(this._equipePickerItem(i));
        }
        if (typeEquipes == "doublette" && count < 2) {
          pickerItem.push(this._equipePickerItem(i));
        }
        else if (typeEquipes == "triplette" && count < 3) {
          pickerItem.push(this._equipePickerItem(i));
        }
        else if (joueur.equipe == i) {
          pickerItem.push(this._equipePickerItem(i));
        }
      }
      return (
        <View style={styles.picker_container}>
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
    const { joueur, isInscription, avecEquipes, typeEquipes, nbJoueurs } = this.props;
    return (
      <View style={styles.main_container}>
        <View style={styles.name_container}>
          {this._joueurName(joueur, isInscription, avecEquipes)}
        </View>
        {this._equipePicker(joueur, avecEquipes, typeEquipes, nbJoueurs)}
        {this._isSpecial(joueur.special)}
        {this._showRenommerJoueur(joueur, isInscription, avecEquipes)}
        {this._showSupprimerJoueur(joueur, isInscription)}
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
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    listeMatchs: state.gestionMatchs.listematchs,
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(ListeJoueurItem)