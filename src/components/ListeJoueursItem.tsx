import { CloseIcon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText, ButtonGroup } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { withTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { PropsFromRedux, connector } from '@/store/connector';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { ListeJoueurs, ListeJoueursInfos } from '@/types/interfaces/listeJoueurs';
import { RouteProp } from '@react-navigation/native';
import { GeneralStackParamList } from '@/navigation/Navigation';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
  list: ListeJoueurs;
  route: RouteProp<GeneralStackParamList, "ListesJoueurs">;
}

interface State {
  renommerOn: boolean;
  modalDeleteIsOpen: boolean;
}

class ListeJoueursItem extends React.Component<Props, State> {
  listNameText: string = "";

  constructor(props: Props) {
    super(props)
    this.state = {
      renommerOn: false,
      modalDeleteIsOpen: false
    }
  }

  _modifyList(listId: number) {
    const actionRemoveList = {type: "SUPPR_ALL_JOUEURS", value: [ModeTournoi.SAUVEGARDE]};
    this.props.dispatch(actionRemoveList);
    const actionLoadList = {type: "LOAD_SAVED_LIST", value: {typeInscriptionSrc: 'avecNoms', typeInscriptionDst: ModeTournoi.SAUVEGARDE, listId: listId}};
    this.props.dispatch(actionLoadList);
    const updateOptionModeTournoi = { type: "UPDATE_OPTION_TOURNOI", value: ['mode', ModeTournoi.SAUVEGARDE]};
    this.props.dispatch(updateOptionModeTournoi);
    this.props.navigation.navigate({
      name: 'CreateListeJoueurs',
      params: {
        type: "edit",
        listId: listId
      }
    });
  }

  _modalSupprimerListe(listId: number) {
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
    );
  }

  _removeList(listId: number) {
    const actionRemoveList = {type: "REMOVE_SAVED_LIST", value: {typeInscription: 'avecNoms', listId: listId}};
    this.props.dispatch(actionRemoveList);
  }

  _showRenameList(listId: number) {
    let name: string;
    let bgColor: string;
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
      action = () => this._renameList(listId);
    }

    return (
      <Box>
        <FontAwesome5.Button name={name} backgroundColor={bgColor} iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={action}/>
      </Box>
    );
  }

  _renameList(listId: number) {
    if (this.listNameText != "") {
      this.setState({renommerOn: false});
      const actionRenameList = { type: "RENAME_SAVED_LIST", value: {typeInscription: 'avecNoms', listId: listId, newName: this.listNameText} };
      this.props.dispatch(actionRenameList);
      this.listNameText = "";
    }
  }

  _listTextInputChanged(text: string) {
    this.listNameText = text;
    this.setState({renommerOn: true});
  }

  _buttons(listId: number) {
    const { t } = this.props;
    if (this.props.route && this.props.route.params && this.props.route.params.loadListScreen) {
      return (
        <Button action='positive' onPress={() => this._loadList(listId)}>
          <ButtonText>{t("charger")}</ButtonText>
        </Button>
      );
    }
    else {
      return (
        <HStack space='md'>
          <Button action='primary' onPress={() => this._modifyList(listId)}>
            <ButtonText>{t("modifier")}</ButtonText>
          </Button>
          <FontAwesome5.Button name="times" backgroundColor="#E63535" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this.setState({modalDeleteIsOpen: true})}/>
        </HStack>
      );
    }
  }

  _loadList(listId: number) {
    const actionLoadList = { type: "LOAD_SAVED_LIST", value: {typeInscriptionSrc: 'avecNoms', typeInscriptionDst: this.props.optionsTournoi.mode, listId: listId} }
    this.props.dispatch(actionLoadList);
    this.props.navigation.goBack();
  }

  _listName(listeJoueursInfos: ListeJoueursInfos) {
    const { t } = this.props;
    let listName = listeJoueursInfos.name ? listeJoueursInfos.name : 'n°' + listeJoueursInfos.listId;
    if (this.state.renommerOn) {
      return (
        <Input>
          <InputField
            placeholder={listName}
            autoFocus={true}
            onChangeText={(text) => this._listTextInputChanged(text)}
            onSubmitEditing={() => this._renameList(listeJoueursInfos.listId)}
          />
        </Input>
      );
    }
    else {
      return <Text className="text-white">{t("liste")} {listName}</Text>;
    }
  }

  render() {
    const { list } = this.props;
    let listeJoueursInfos = list.at(-1) as ListeJoueursInfos;
    return (
      <HStack space='md' className="px-2 my-2 items-center">
        <Box className="flex-1">
          {this._listName(listeJoueursInfos)}
        </Box>
        <HStack space='md'>
          {this._showRenameList(listeJoueursInfos.listId)}
          {this._buttons(listeJoueursInfos.listId)}
        </HStack>
        {this._modalSupprimerListe(listeJoueursInfos.listId)}
      </HStack>
    );
  }
}

export default connector(withTranslation()(ListeJoueursItem))