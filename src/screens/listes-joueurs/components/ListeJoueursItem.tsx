import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { CheckIcon, CloseIcon, EditIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { addJoueursPreparationTournoiFromList } from '@/repositories/joueursPreparationTournois/joueursPreparationTournoisActions';
import { ListeJoueursInfos } from '@/types/interfaces/listeJoueurs';
import { IIconComponentType } from '@gluestack-ui/core/lib/esm/icon/creator/createIcon';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorValue } from 'react-native';
import { SvgProps } from 'react-native-svg';
import ModalDeleteListe from './ModalDeleteListe';

export interface Props {
  listeJoueursInfos: ListeJoueursInfos;
  loadListScreen: boolean;
  onDelete: (id: number) => Promise<void>;
  onUpdateName: (id: number, name: string) => Promise<void>;
}

const ListeJoueursItem: React.FC<Props> = ({
  listeJoueursInfos,
  loadListScreen,
  onDelete,
  onUpdateName,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [renommerOn, setRenommerOn] = useState(false);
  const [listNameText, setListNameText] = useState('');
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);

  const modifyList = (listId: number) => {
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
    let name: IIconComponentType<
      | SvgProps
      | { fill?: ColorValue | undefined; stroke?: ColorValue | undefined }
    >;
    let bgColor: string;
    let action;
    if (!renommerOn) {
      name = EditIcon;
      bgColor = 'bg-primary-500';
      action = () => setRenommerOn(true);
    } else if (listNameText === '') {
      name = CloseIcon;
      bgColor = 'bg-[#5F5F5F]';
      action = () => setRenommerOn(false);
    } else {
      name = CheckIcon;
      bgColor = 'bg-success-500';
      action = () => renameList(listId);
    }

    return (
      <Box>
        <Button className={bgColor} onPress={action}>
          <ButtonIcon as={name} />
        </Button>
      </Box>
    );
  };

  const renameList = async (listId: number) => {
    if (listNameText !== '') {
      await onUpdateName(listId, listNameText);
    }
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
          <Button
            className="bg-error-500"
            onPress={() => setModalDeleteIsOpen(true)}
          >
            <ButtonIcon as={CloseIcon} />
          </Button>
        </HStack>
      );
    }
  };

  const loadList = async (listId: number) => {
    await addJoueursPreparationTournoiFromList(listId);
    router.back();
  };

  const listName = (listeJoueursInfos: ListeJoueursInfos) => {
    const { name, listId } = listeJoueursInfos;
    let listName = name ? name : `n° ${listId}`;
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
