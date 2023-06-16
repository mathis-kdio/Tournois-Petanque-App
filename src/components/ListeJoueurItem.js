import React from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesome5 } from '@expo/vector-icons';
import { CheckIcon, Image, Select, VStack } from 'native-base';

class ListeJoueurItem extends React.Component {
  constructor(props) {
    super(props)
    this.joueurText = ""
    this.state = {
      renommerOn: false,
      disabledBoutonRenommer: true,
    }
  }

  _showSupprimerJoueur(joueur, isInscription) {
    if (isInscription === true) {
      return (
        <View style={{marginLeft: 5}}>
          <FontAwesome5.Button name="times" backgroundColor="red" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._supprimerJoueur(joueur.id)}/>
        </View>
      )
    }
  }

  _supprimerJoueur(idJoueur) {
    this.setState({
      renommerOn: false
    })
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
          <FontAwesome5.Button name="edit" backgroundColor="green" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._renommerJoueurInput(joueur)}/>
        </View>
      )
    }
    else {
      if (this.state.disabledBoutonRenommer == true) {
        return (
          <View>
            <FontAwesome5.Button name="edit" backgroundColor="gray" iconStyle={{paddingHorizontal: 2, marginRight: 0}}/>
          </View>
        )
      }
      else {
        return (
          <View>
            <FontAwesome5.Button name="check" backgroundColor="green" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._renommerJoueur(joueur, isInscription, avecEquipes)}/>
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
        let typeInscription = "";
        if (this.props.optionsTournoi.mode == "sauvegarde") {
          typeInscription = "sauvegarde"
        }
        else if (avecEquipes == true) {
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
        <VStack flex="1" borderWidth="1">
          <Select
            selectedValue={selectedValue}
            accessibilityLabel="Choix de l'équipe"
            placeholder="Choix de l'équipe"
            onValueChange={itemValue => this._ajoutEquipe(joueur.id, itemValue)}
            _selectedItem={{
              endIcon: <CheckIcon size="5" color="cyan.500"/>
            }}
            size="lg"
          >
            <Select.Item label="Choisir" value={undefined} key="0"/>
            {pickerItem}
          </Select>
        </VStack>
      )
    }
  }

  _equipePickerItem(equipe) {
    return (
      <Select.Item label={equipe.toString()} value={equipe} key={equipe}/>
    )
  }

  _joueurTypeIcon(type) {
    if (type == "enfant") {
      return (
        <View style={styles.type_icon_container}>
          <FontAwesome5 name="child" color="darkgray" size={24}/>
        </View>
      )
    }
    else if (type == "tireur") {
      return (
        <View style={styles.type_icon_container}>
          <Image source={require('@assets/images/tireur.png')} alt={type} style={styles.icon}/>
        </View>
      )
    }
    else if (type == "pointeur") {
      return (
        <View style={styles.type_icon_container}>
          <Image source={require('@assets/images/pointeur.png')} alt={type} style={styles.icon}/>
        </View>
      )
    }
  }


  render() {
    const { joueur, isInscription, avecEquipes, typeEquipes, nbJoueurs } = this.props;
    return (
      <View style={styles.main_container}>
        {this._joueurTypeIcon(joueur.type)}
        <View style={styles.name_container}>
          {this._joueurName(joueur, isInscription, avecEquipes)}
        </View>
        {this._equipePicker(joueur, avecEquipes, typeEquipes, nbJoueurs)}
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
  text_input: {
    height: 50,
    paddingLeft: 5,
    color: 'white'
  },
  picker: {
    color: 'white',
    width: 115
  },
  type_icon_container: {
    flexDirection: 'row',
    justifyContent:'center'
  },
  icon: {
    width: 30,
    height: 30
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