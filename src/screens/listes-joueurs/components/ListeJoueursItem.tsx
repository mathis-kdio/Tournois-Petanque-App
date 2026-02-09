import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { ListeJoueursInfos } from '@/types/interfaces/listeJoueurs';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import ModalDeleteListe from './ModalDeleteListe';

export interface Props {
  listeJoueursInfos: ListeJoueursInfos;
  loadListScreen: boolean;
  onDelete: (id: number) => void;
  onUpdateName: (id: number, name: string) => void;
}

const ListeJoueursItem: React.FC<Props> = ({
  listeJoueursInfos,
  loadListScreen,
  onDelete,
  onUpdateName,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const [renommerOn, setRenommerOn] = useState(false);
  const [listNameText, setListNameText] = useState('');
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);

  const optionsTournoi = useSelector(
    (state: any) => state.optionsTournoi.options,
  );

  const modifyList = (listId: number) => {
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

  const modalSupprimerListe = (listId: number) => {
    return (
      <ModalDeleteListe
        listId={listId}
        modalDeleteIsOpen={modalDeleteIsOpen}
        setModalDeleteIsOpen={setModalDeleteIsOpen}
        onDelete={onDelete}
      />
    );
  };

  const showRenameList = (listId: number) => {
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
      action = () => renameList(listId);
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

  const renameList = (listId: number) => {
    if (listNameText === '') {
      return;
    }
    onUpdateName(listId, listNameText);
    setListNameText('');
    setRenommerOn(false);
  };

  const listTextInputChanged = (text: string) => {
    setListNameText(text);
    setRenommerOn(true);
  };

  const buttons = (listId: number) => {
    if (loadListScreen) {
      return (
        <Button action="positive" onPress={() => loadList(listId)}>
          <ButtonText>{t('charger')}</ButtonText>
        </Button>
      );
    } else {
      return (
        <HStack space="md">
          <Button action="primary" onPress={() => modifyList(listId)}>
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

  const loadList = (listId: number) => {
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

  const listName = (listeJoueursInfos: ListeJoueursInfos) => {
    const { name, listId } = listeJoueursInfos;
    let listName = name ? name : `n°' ${listId}`;
    if (renommerOn) {
      return (
        <Input className="border-custom-bg-inverse">
          <InputField
            className="text-typography-white placeholder:text-typography-white"
            placeholder={listName}
            autoFocus={true}
            onChangeText={(text) => listTextInputChanged(text)}
            onSubmitEditing={() => renameList(listId)}
          />
        </Input>
      );
    } else {
      return (
        <Text className="text-typography-white">
          {`${t('liste')} ${listName}`}
        </Text>
      );
    }
  };

  return (
    <HStack space="md" className="px-2 my-2 items-center">
      <Box className="flex-1">{listName(listeJoueursInfos)}</Box>
      <HStack space="md">
        {showRenameList(listeJoueursInfos.listId)}
        {buttons(listeJoueursInfos.listId)}
      </HStack>
      {modalSupprimerListe(listeJoueursInfos.listId)}
    </HStack>
  );
};

export default ListeJoueursItem;
