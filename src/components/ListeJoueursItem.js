import React from 'react'
import { connect } from 'react-redux'
import { FontAwesome5 } from '@expo/vector-icons';
import { withTranslation } from 'react-i18next';
import { Box, HStack, Text, Button, Input, InputField, ButtonText, AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader, Heading, AlertDialogCloseButton, CloseIcon, AlertDialogBody, AlertDialogFooter, ButtonGroup } from '@gluestack-ui/themed';

class ListeJoueursItem extends React.Component {
  constructor(props) {
    super(props)
    this.listNameText = ""
    this.state = {
      renommerOn: false,
      modalDeleteIsOpen: false
    }
  }

  _modifyList(list) {
    const actionRemoveList = {type: "SUPPR_ALL_JOUEURS", value: ['sauvegarde']};
    this.props.dispatch(actionRemoveList);
    const actionLoadList = {type: "LOAD_SAVED_LIST", value: {typeInscriptionSrc: 'avecNoms', typeInscriptionDst: 'sauvegarde', listId: list[list.length - 1].listId}};
    this.props.dispatch(actionLoadList);
    const updateOptionModeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['mode', 'sauvegarde']};
    this.props.dispatch(updateOptionModeTournoi);
    this.props.navigation.navigate({
      name: 'CreateListeJoueurs',
      params: {
        type: "edit",
        listId: list[list.length - 1].listId
      }
    });
  }

  _modalSupprimerListe(listId) {
    const { t } = this.props;
    return (
      <AlertDialog isOpen={this.state.modalDeleteIsOpen} onClose={() => this.setState({modalDeleteIsOpen: false})}>
        <AlertDialogBackdrop/>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading>{t("supprimer_liste_modal_titre")}</Heading>
            <AlertDialogCloseButton>
              <CloseIcon/>
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>{t("supprimer_liste_modal_texte", {id: listId + 1})}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup>
              <Button variant='outline' action='secondary' onPress={() => this.setState({modalDeleteIsOpen: false})}>
                <ButtonText>{t("annuler")}</ButtonText>
              </Button>
              <Button action='negative' onPress={() => this._removeList(listId)}>
                <ButtonText>{t("oui")}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> 
    )
  }

  _removeList(listId) {
    const actionRemoveList = {type: "REMOVE_SAVED_LIST", value: {typeInscription: 'avecNoms', listId: listId}};
    this.props.dispatch(actionRemoveList);
  }

  _showRenameList(list) {
    let name;
    let bgColor;
    let action;
    if (!this.state.renommerOn) {
      name = 'edit';
      bgColor = '#004282';
      action = () => this.setState({renommerOn: true});
    } else if (this.listNameText == '') {
      name = 'times';
      bgColor = '#5F5F5F';
      action = () => this.setState({renommerOn: false});
    } else {
      name = 'check';
      bgColor = '#348352';
      action = () => this._renameList(list);
    }

    return (
      <Box>
        <FontAwesome5.Button name={name} backgroundColor={bgColor} iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={action}/>
      </Box>
    )
  }

  _renameList(list) {
    if (this.listNameText != "") {
      this.setState({renommerOn: false});
      const actionRenameList = { type: "RENAME_SAVED_LIST", value: {typeInscription: 'avecNoms', listId: list[list.length - 1].listId, newName: this.listNameText} };
      this.props.dispatch(actionRenameList);
      this.listNameText = "";
    }
  }

  _listTextInputChanged(text) {
    this.listNameText = text;
    this.setState({renommerOn: true});
  }

  _buttons(list) {
    const { t } = this.props;
    if(this.props.route && this.props.route.params && this.props.route.params.loadListScreen) {
      return (
        <Button action='positive' onPress={() => this._loadList(list[list.length - 1].listId)}>
          <ButtonText>{t("charger")}</ButtonText>
        </Button>
      )
    }
    else {
      return(
        <HStack space='md'>
          <Button action='primary' onPress={() => this._modifyList(list)}>
            <ButtonText>{t("modifier")}</ButtonText>
          </Button>
          <FontAwesome5.Button name="times" backgroundColor="#E63535" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this.setState({modalDeleteIsOpen: true})}/>
        </HStack>
      )
    }
  }

  _loadList(listId) {
    const actionLoadList = { type: "LOAD_SAVED_LIST", value: {typeInscriptionSrc: 'avecNoms', typeInscriptionDst: this.props.optionsTournoi.mode, listId: listId} }
    this.props.dispatch(actionLoadList);
    this.props.navigation.goBack();
  }

  _listName(list) {
    const { t } = this.props;
    let listName = list[list.length - 1].name ? list[list.length - 1].name : 'n°' + list[list.length - 1].listId;
    if (this.state.renommerOn) {
      return (
        <Input>
          <InputField
            placeholder={listName}
            autoFocus={true}
            onChangeText={(text) => this._listTextInputChanged(text)}
            onSubmitEditing={() => this._renameList(list)}
          />
        </Input>
      )
    }
    else {
      return (
        <Text color='$white'>{t("liste")} {listName}</Text>
      )
    }
  }

  render() {
    const { list} = this.props;
    return (
      <HStack px={'$2'} my={'$2'} space='md' alignItems='center'>
        <Box flex={1}>
          {this._listName(list)}
        </Box>
        <HStack space='md'>
          {this._showRenameList(list)}
          {this._buttons(list)}
        </HStack>
        {this._modalSupprimerListe(list[list.length - 1].listId)}
      </HStack>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs,
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(withTranslation()(ListeJoueursItem))