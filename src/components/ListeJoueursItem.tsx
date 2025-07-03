import { CloseIcon, Icon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';

import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText, ButtonGroup } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import {
  ListeJoueurs,
  ListeJoueursInfos,
} from '@/types/interfaces/listeJoueurs';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

export interface Props {
  list: ListeJoueurs;
  loadListScreen: boolean;
}

const ListeJoueursItem: React.FC<Props> = ({ list, loadListScreen }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const [renommerOn, setRenommerOn] = useState(false);
  const [listNameText, setListNameText] = useState('');
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);

  const optionsTournoi = useSelector(
    (state: any) => state.optionsTournoi.options,
  );

  const _modifyList = (listId: number) => {
    const actionRemoveList = {
      type: 'SUPPR_ALL_JOUEURS',
      value: [ModeTournoi.SAUVEGARDE],
    };
    dispatch(actionRemoveList);
    const actionLoadList = {
      type: 'LOAD_SAVED_LIST',
      value: {
        typeInscriptionSrc: 'avecNoms',
        typeInscriptionDst: ModeTournoi.SAUVEGARDE,
        listId: listId,
      },
    };
    dispatch(actionLoadList);
    const updateOptionModeTournoi = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['mode', ModeTournoi.SAUVEGARDE],
    };
    dispatch(updateOptionModeTournoi);
    router.navigate({
      pathname: '/listes-joueurs/create-liste-joueurs',
      params: {
        type: 'edit',
        listId: listId,
      },
    });
  };

  const _modalSupprimerListe = (listId: number) => {
    return (
      <AlertDialog
        isOpen={modalDeleteIsOpen}
        onClose={() => setModalDeleteIsOpen(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="color-custom-text">
              {t('supprimer_liste_modal_titre')}
            </Heading>
            <AlertDialogCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>{t('supprimer_liste_modal_texte', { id: listId + 1 })}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup flexDirection="row">
              <Button
                variant="outline"
                action="secondary"
                onPress={() => setModalDeleteIsOpen(false)}
              >
                <ButtonText className="color-custom-text">
                  {t('annuler')}
                </ButtonText>
              </Button>
              <Button action="negative" onPress={() => _removeList(listId)}>
                <ButtonText>{t('oui')}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const _removeList = (listId: number) => {
    const actionRemoveList = {
      type: 'REMOVE_SAVED_LIST',
      value: { typeInscription: 'avecNoms', listId: listId },
    };
    dispatch(actionRemoveList);
  };

  const _showRenameList = (listId: number) => {
    let name: string;
    let bgColor: string;
    let action;
    if (!renommerOn) {
      name = 'edit';
      bgColor = '#004282';
      action = () => setRenommerOn(true);
    } else if (listNameText === '') {
      name = 'times';
      bgColor = '#5F5F5F';
      action = () => setRenommerOn(false);
    } else {
      name = 'check';
      bgColor = '#348352';
      action = () => _renameList(listId);
    }

    return (
      <Box>
        <FontAwesome5.Button
          name={name}
          backgroundColor={bgColor}
          iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
          onPress={action}
        />
      </Box>
    );
  };

  const _renameList = (listId: number) => {
    if (listNameText !== '') {
      setRenommerOn(false);
      const actionRenameList = {
        type: 'RENAME_SAVED_LIST',
        value: {
          typeInscription: 'avecNoms',
          listId: listId,
          newName: listNameText,
        },
      };
      dispatch(actionRenameList);
      setListNameText('');
    }
  };

  const _listTextInputChanged = (text: string) => {
    setListNameText(text);
    setRenommerOn(true);
  };

  const _buttons = (listId: number) => {
    if (loadListScreen) {
      return (
        <Button action="positive" onPress={() => _loadList(listId)}>
          <ButtonText>{t('charger')}</ButtonText>
        </Button>
      );
    } else {
      return (
        <HStack space="md">
          <Button action="primary" onPress={() => _modifyList(listId)}>
            <ButtonText>{t('modifier')}</ButtonText>
          </Button>
          <FontAwesome5.Button
            name="times"
            backgroundColor="#E63535"
            iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
            onPress={() => setModalDeleteIsOpen(true)}
          />
        </HStack>
      );
    }
  };

  const _loadList = (listId: number) => {
    const actionLoadList = {
      type: 'LOAD_SAVED_LIST',
      value: {
        typeInscriptionSrc: 'avecNoms',
        typeInscriptionDst: optionsTournoi.mode,
        listId: listId,
      },
    };
    dispatch(actionLoadList);
    router.back();
  };

  const _listName = (listeJoueursInfos: ListeJoueursInfos) => {
    let listName = listeJoueursInfos.name
      ? listeJoueursInfos.name
      : 'n°' + listeJoueursInfos.listId;
    if (renommerOn) {
      return (
        <Input className="border-white">
          <InputField
            className="text-white placeholder:text-black"
            placeholder={listName}
            autoFocus={true}
            onChangeText={(text) => _listTextInputChanged(text)}
            onSubmitEditing={() => _renameList(listeJoueursInfos.listId)}
          />
        </Input>
      );
    } else {
      return (
        <Text className="text-typography-white">
          {t('liste')} {listName}
        </Text>
      );
    }
  };

  let listeJoueursInfos = list.at(-1) as ListeJoueursInfos;
  return (
    <HStack space="md" className="px-2 my-2 items-center">
      <Box className="flex-1">{_listName(listeJoueursInfos)}</Box>
      <HStack space="md">
        {_showRenameList(listeJoueursInfos.listId)}
        {_buttons(listeJoueursInfos.listId)}
      </HStack>
      {_modalSupprimerListe(listeJoueursInfos.listId)}
    </HStack>
  );
};

export default ListeJoueursItem;
