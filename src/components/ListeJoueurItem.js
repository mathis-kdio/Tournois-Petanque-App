import React from 'react'
import { connect } from 'react-redux'
import { FontAwesome5 } from '@expo/vector-icons';
import { Box, CheckIcon, HStack, Image, Input, Select, Text } from 'native-base';
import { withTranslation } from 'react-i18next';

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
        <Box ml="2">
          <FontAwesome5.Button name="times" backgroundColor="red" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._supprimerJoueur(joueur.id)}/>
        </Box>
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
        <Box>
          <FontAwesome5.Button name="edit" backgroundColor="green" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._renommerJoueurInput(joueur)}/>
        </Box>
      )
    }
    else {
      if (this.state.disabledBoutonRenommer == true) {
        return (
          <Box>
            <FontAwesome5.Button name="edit" backgroundColor="gray" iconStyle={{paddingHorizontal: 2, marginRight: 0}}/>
          </Box>
        )
      }
      else {
        return (
          <Box>
            <FontAwesome5.Button name="check" backgroundColor="green" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._renommerJoueur(joueur, isInscription, avecEquipes)}/>
          </Box>
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
        <Input
          placeholder={joueur.name}
          borderWidth="0"
          keyboardType="default"
          autoFocus={true}
          onChangeText={(text) => this._joueurTxtInputChanged(text)}
          onSubmitEditing={() => this._renommerJoueur(joueur, isInscription, avecEquipes)}
          size="lg"
        />
      )
    }
    else {
      return(
        <Text color="white" fontSize="xl" fontWeight="bold">{(joueur.id+1)}-{joueur.name}</Text>
      )
    }
  }

  _ajoutEquipe(joueurId, equipeId) {
    const action = { type: "AJOUT_EQUIPE_JOUEUR", value: ["avecEquipes", joueurId, equipeId] }
    this.props.dispatch(action)
  }

  _equipePicker(joueur, avecEquipes, typeEquipes, nbJoueurs) {
    const { t } = this.props;
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
        <Select
          selectedValue={selectedValue}
          accessibilityLabel={t("choix_equipe")}
          placeholder={t("choix_equipe")}
          onValueChange={itemValue => this._ajoutEquipe(joueur.id, itemValue)}
          _selectedItem={{
            endIcon: <CheckIcon size="5" color="cyan.500"/>
          }}
          size="lg"
        >
          <Select.Item label={t("choisir")} value={undefined} key="0"/>
          {pickerItem}
        </Select>
      )
    }
  }

  _equipePickerItem(equipe) {
    return (
      <Select.Item label={equipe.toString()} value={equipe} key={equipe}/>
    )
  }

  _joueurTypeIcon(joueurType) {
    const { mode, type, typeEquipes } = this.props.optionsTournoi;
    if (mode == "sauvegarde" || (type == "mele-demele" && typeEquipes == "doublette")) {
      return (
        <Box>
          {joueurType == "enfant" && <FontAwesome5 name="child" color="darkgray" size={24}/>}
          {joueurType == "tireur" && <Image source={require('@assets/images/tireur.png')} alt={type} width={30} height={30}/>}
          {joueurType == "pointeur" && <Image source={require('@assets/images/pointeur.png')} alt={type} width={30} height={30}/>}
        </Box>
      )
    }
    else {
      return (
        <Box>
          {joueurType == "enfant" && <FontAwesome5 name="child" color="darkgray" size={24}/>}
        </Box>
      )
    }
  }


  render() {
    const { joueur, isInscription, avecEquipes, typeEquipes, nbJoueurs } = this.props;
    return (
      <HStack borderWidth="1" borderColor="white" borderRadius="xl" margin="1" paddingX="1" alignItems="center">
        {this._joueurTypeIcon(joueur.type)}
        <Box flex="1">
          {this._joueurName(joueur, isInscription, avecEquipes)}
        </Box>
        {(avecEquipes == true && <Box flex="1">
          {this._equipePicker(joueur, avecEquipes, typeEquipes, nbJoueurs)}
        </Box>)}
        {this._showRenommerJoueur(joueur, isInscription, avecEquipes)}
        {this._showSupprimerJoueur(joueur, isInscription)}
      </HStack>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    listeMatchs: state.gestionMatchs.listematchs,
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(withTranslation()(ListeJoueurItem))