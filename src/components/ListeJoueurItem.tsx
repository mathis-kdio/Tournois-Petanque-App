import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, Box, Button, ButtonGroup, ButtonText, CheckIcon, Checkbox, CheckboxIndicator, CheckboxLabel, ChevronDownIcon, CloseIcon, HStack, Heading, Image, Input, InputField, Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger, Text } from '@gluestack-ui/themed';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { JoueurType } from '@/types/enums/joueurType';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { Joueur } from '@/types/interfaces/joueur';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { PropsFromRedux, connector } from '@/store/connector';

export interface Props extends PropsFromRedux {
  t: TFunction;
  joueur: Joueur;
  isInscription: boolean;
  avecEquipes: boolean;
  typeEquipes: TypeEquipes;
  nbJoueurs: number;
  showCheckbox: boolean;
}

interface State {
  renommerOn: boolean;
  modalConfirmUncheckIsOpen: boolean;
}

class ListeJoueurItem extends React.Component<Props, State> {
  joueurText: string = "";

  constructor(props: Props) {
    super(props)
    this.state = {
      renommerOn: false,
      modalConfirmUncheckIsOpen: false
    }
  }

  _showSupprimerJoueur(joueur: Joueur, isInscription: boolean) {
    if (isInscription === true) {
      return (
        <Box ml={'$2'}>
          <FontAwesome5.Button name="times" backgroundColor='#E63535' iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._supprimerJoueur(joueur.id)}/>
        </Box>
      )
    }
  }

  _supprimerJoueur(idJoueur: number) {
    this.setState({
      renommerOn: false
    })
    const actionSuppr = {type: "SUPPR_JOUEUR", value: [this.props.optionsTournoi.mode, idJoueur]};
    this.props.dispatch(actionSuppr);
    if (this.props.optionsTournoi.typeEquipes == TypeEquipes.TETEATETE) {
      const actionUpdateEquipe = {type: "UPDATE_ALL_JOUEURS_EQUIPE", value: [this.props.optionsTournoi.mode]};
      this.props.dispatch(actionUpdateEquipe);
    }
  }

  _showRenommerJoueur(joueur: Joueur, isInscription: boolean, avecEquipes: boolean) {
    let name: string;
    let bgColor: string;
    let action;
    if (!this.state.renommerOn) {
      name = 'edit';
      bgColor = '#004282';
      action = () => this.setState({renommerOn: true});
    } else if (this.joueurText == '') {
      name = 'times';
      bgColor = '#5F5F5F';
      action = () => this.setState({renommerOn: false});
    } else {
      name = 'check';
      bgColor = '#348352';
      action = () => this._renommerJoueur(joueur, isInscription, avecEquipes);
    }

    return (
      <Box>
        <FontAwesome5.Button name={name} backgroundColor={bgColor} iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={action}/>
      </Box>
    )
  }

  _renommerJoueurInput(joueur: Joueur) {
    this.setState({
      renommerOn: true
    })
    this.joueurText = joueur.name
  }

  _renommerJoueur(joueur: Joueur, isInscription: boolean, avecEquipes: boolean) {
    if (this.joueurText != "") {
      this.setState({renommerOn: false})
      if (isInscription === true) {
        let typeInscription = "";
        if (this.props.optionsTournoi.mode == ModeTournoi.SAUVEGARDE) {
          typeInscription = ModeTournoi.SAUVEGARDE
        }
        else if (avecEquipes == true) {
          typeInscription = ModeTournoi.AVECEQUIPES
        }
        else {
          typeInscription = ModeTournoi.AVECNOMS
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

  _joueurTxtInputChanged = (text: string) => {
    this.joueurText = text
    this.setState({renommerOn: true});
  }

  _joueurName(joueur: Joueur, isInscription: boolean, avecEquipes: boolean) {
    if (this.state.renommerOn == true) {
      return(
        <Input variant='underlined' size='md'>
          <InputField
            placeholder={joueur.name}
            autoFocus={true}
            onChangeText={(text: string) => this._joueurTxtInputChanged(text)}
            onSubmitEditing={() => this._renommerJoueur(joueur, isInscription, avecEquipes)}
          />
        </Input>
      )
    }
    else {
      return(
        <Text color='$white' fontSize={'$xl'} fontWeight='$bold'>{(joueur.id+1)}-{joueur.name}</Text>
      )
    }
  }

  _ajoutEquipe(joueurId: number, equipeId: number) {
    const action = { type: "AJOUT_EQUIPE_JOUEUR", value: [ModeTournoi.AVECEQUIPES, joueurId, equipeId] };
    this.props.dispatch(action);
  }

  _equipePicker(joueur: Joueur, avecEquipes: boolean, typeEquipes: TypeEquipes, nbJoueurs: number) {
    const { t } = this.props;
    if (avecEquipes == true) {
      let selectedValue = "0";
      if (joueur.equipe) {
        selectedValue = joueur.equipe.toString();
      }
      let nbEquipes = nbJoueurs;
      if (typeEquipes == TypeEquipes.DOUBLETTE) {
        nbEquipes = Math.ceil(nbJoueurs / 2);
      }
      else if (typeEquipes == TypeEquipes.TRIPLETTE){
        nbEquipes = Math.ceil(nbJoueurs / 3);
      }

      let pickerItem = [];
      for (let i = 1; i <= nbEquipes; i++) {
        let count = this.props.listesJoueurs.avecEquipes.reduce((counter: number, obj: Joueur) => obj.equipe == i ? counter += 1 : counter, 0);
        if (typeEquipes == TypeEquipes.TETEATETE && count < 1) {
          pickerItem.push(this._equipePickerItem(i));
        }
        if (typeEquipes == TypeEquipes.DOUBLETTE && count < 2) {
          pickerItem.push(this._equipePickerItem(i));
        }
        else if (typeEquipes == TypeEquipes.TRIPLETTE && count < 3) {
          pickerItem.push(this._equipePickerItem(i));
        }
        else if (joueur.equipe == i) {
          pickerItem.push(this._equipePickerItem(i));
        }
      }
      return (
        <Select
          selectedValue={selectedValue}
          aria-label={t("choix_equipe")}
          onValueChange={itemValue => this._ajoutEquipe(joueur.id, parseInt(itemValue))}
        >
          <SelectTrigger>
            <SelectInput placeholder={t("choix_equipe")}/>
            <SelectIcon mr={'$3'}>
              <ChevronDownIcon color='$white'/>
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop/>
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator/>
              </SelectDragIndicatorWrapper>
              <SelectItem label={t("choisir")} value="0" key="0"/>
              {pickerItem}
            </SelectContent>
          </SelectPortal>
        </Select>
      )
    }
  }

  _equipePickerItem(equipe: number) {
    return (
      <SelectItem label={equipe.toString()} value={equipe.toString()} key={equipe}/>
    )
  }

  _joueurTypeIcon(joueurType: string) {
    const { mode, type, typeEquipes } = this.props.optionsTournoi;
    if (mode == ModeTournoi.SAUVEGARDE || (type == TypeTournoi.MELEDEMELE && typeEquipes == TypeEquipes.DOUBLETTE)) {
      return (
        <Box>
          {joueurType == JoueurType.ENFANT && <FontAwesome5 name="child" color="darkgray" size={24}/>}
          {joueurType == JoueurType.TIREUR && <Image source={require('@assets/images/tireur.png')} alt={type} width={30} height={30} />}
          {joueurType == JoueurType.POINTEUR && <Image source={require('@assets/images/pointeur.png')} alt={type} width={30} height={30} />}
        </Box>
      )
    }
    else {
      return (
        <Box>
          {joueurType == JoueurType.ENFANT && <FontAwesome5 name="child" color="darkgray" size={24}/>}
        </Box>
      )
    }
  }

  _joueurCheckbox(showCheckbox: boolean, joueur: Joueur) {
    const {t} = this.props;
    if (showCheckbox) {
      let isChecked = true;
      if (joueur.isChecked == undefined || !joueur.isChecked) {
        isChecked = false;
      }
      return (
        <Box mr={'$1'}>
          <Checkbox
            value="joueurCheckbox"
            onChange={() => this._onCheckboxChange(isChecked, joueur.id)}
            aria-label={t("checkbox_inscription_joueuritem")}
            size='md'
            isChecked={isChecked}
          >
            <CheckboxIndicator mr={'$2'}>
              <CheckIcon color={isChecked ? '$white' : '$cyan600'}/>
            </CheckboxIndicator>
            <CheckboxLabel/>
          </Checkbox>
        </Box>
      )
    }
  }

  _onCheckboxChange(isChecked: boolean, joueurId: number) {
    if (!isChecked) {
      this._ajoutCheck(joueurId, true);
    } else {
      this.setState({modalConfirmUncheckIsOpen: true})
    }
  }

  _modalConfirmUncheck() {
    const { t, joueur } = this.props;
    return (
      <AlertDialog isOpen={this.state.modalConfirmUncheckIsOpen} onClose={() => this.setState({modalConfirmUncheckIsOpen: false})}>
        <AlertDialogBackdrop/>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading>{t("confirmer_uncheck_modal_titre")}</Heading>
            <AlertDialogCloseButton>
              <CloseIcon/>
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>{t("confirmer_uncheck_modal_texte")}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup>
              <Button variant='outline' action='secondary' onPress={() => this.setState({modalConfirmUncheckIsOpen: false})}>
                <ButtonText>{t("annuler")}</ButtonText>
              </Button>
              <Button action='negative' onPress={() => this._ajoutCheck(joueur.id, false)}>
                <ButtonText>{t("oui")}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  _ajoutCheck(joueurId: number, isChecked: boolean) {
    const action = { type: "CHECK_JOUEUR", value: [this.props.optionsTournoi.mode, joueurId, isChecked] };
    this.props.dispatch(action);
    this.setState({modalConfirmUncheckIsOpen: false});
  }

  render() {
    const { joueur, isInscription, avecEquipes, typeEquipes, nbJoueurs, showCheckbox } = this.props;
    return (
      <HStack borderWidth={'$1'} borderColor='$white' borderRadius={'$xl'} m={'$1'} px={'$1'} alignItems='center'>
        {this._joueurCheckbox(showCheckbox, joueur)}
        {this._joueurTypeIcon(joueur.type)}
        <Box flex={2}>
          {this._joueurName(joueur, isInscription, avecEquipes)}
        </Box>
        {(avecEquipes == true && <Box flex={1}>
          {this._equipePicker(joueur, avecEquipes, typeEquipes, nbJoueurs)}
        </Box>)}
        {this._showRenommerJoueur(joueur, isInscription, avecEquipes)}
        {this._showSupprimerJoueur(joueur, isInscription)}
        {this._modalConfirmUncheck()}
      </HStack>
    )
  }
}

export default connector(withTranslation()(ListeJoueurItem))