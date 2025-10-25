import { Input, InputField } from '@/components/ui/input';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCloseButton,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText, ButtonGroup } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';

export interface Props {
  tournoi: TournoiModel;
  showModalInfos: (tournoi: TournoiModel) => void;
  onDelete: (id: number) => void;
  onUpdateName: (id: number, name: string) => void;
}

const ListeTournoiItem: React.FC<Props> = ({
  tournoi,
  showModalInfos,
  onDelete,
  onUpdateName,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [renommerOn, setRenommerOn] = useState(false);
  const [tournoiNameText, setTournoiNameText] = useState('');
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);

  const listeMatchs = useSelector(
    (state: any) => state.gestionMatchs.listematchs,
  );

  const _chargerTournoi = (tournoi: TournoiModel) => {
    const actionUpdateListeMatchs = {
      type: 'AJOUT_MATCHS',
      value: tournoi.tournoi,
    };
    dispatch(actionUpdateListeMatchs);
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: 'tournoi' }],
      }),
    );
  };

  const _supprimerTournoi = (tournoiId: number) => {
    onDelete(tournoiId);
  };

  const _modalSupprimerTournoi = (tournoiId: number) => {
    return (
      <AlertDialog
        isOpen={modalDeleteIsOpen}
        onClose={() => setModalDeleteIsOpen(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="color-custom-text-modal">
              {t('supprimer_tournoi_modal_titre')}
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
            <Text>
              {t('supprimer_tournoi_modal_texte', { id: tournoiId + 1 })}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup flexDirection="row">
              <Button
                variant="outline"
                action="secondary"
                onPress={() => setModalDeleteIsOpen(false)}
              >
                <ButtonText className="color-custom-text-modal">
                  {t('annuler')}
                </ButtonText>
              </Button>
              <Button
                action="negative"
                onPress={() => _supprimerTournoi(tournoiId)}
              >
                <ButtonText>{t('oui')}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const _showRenameTournoi = (tournoi: TournoiModel) => {
    let name: string;
    let bgColor: string;
    let action;
    if (!renommerOn) {
      name = 'edit';
      bgColor = '#004282';
      action = () => setRenommerOn(true);
    } else if (tournoiNameText === '') {
      name = 'times';
      bgColor = '#5F5F5F';
      action = () => setRenommerOn(false);
    } else {
      name = 'check';
      bgColor = '#348352';
      action = () => _renameTournoi(tournoi);
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

  const _renameTournoi = (tournoi: TournoiModel) => {
    if (tournoiNameText === '') {
      return;
    }
    onUpdateName(tournoi.tournoiId, tournoiNameText);
    setTournoiNameText('');
    setRenommerOn(false);
  };

  const _tournoiTextInputChanged = (text: string) => {
    setTournoiNameText(text);
    setRenommerOn(true);
  };

  const _tournoiName = (tournoi: TournoiModel) => {
    let tournoiName = tournoi.name ? tournoi.name : 'n°' + tournoi.tournoiId;
    if (renommerOn) {
      return (
        <Input className="border-custom-bg-inverse">
          <InputField
            className="text-typography-white placeholder:text-typography-white"
            placeholder={tournoiName}
            autoFocus={true}
            onChangeText={(text: string) => _tournoiTextInputChanged(text)}
            onSubmitEditing={() => _renameTournoi(tournoi)}
          />
        </Input>
      );
    } else {
      return (
        <Text className="text-typography-white">
          {t('tournoi')} {tournoiName}
        </Text>
      );
    }
  };

  let btnDisabled = false;
  if (listeMatchs && tournoi.tournoiId === listeMatchs.at(-1).tournoiID) {
    btnDisabled = true;
  }
  return (
    <HStack space="md" className="px-2 my-2 items-center">
      <Box className="flex-1">{_tournoiName(tournoi)}</Box>
      <HStack space="sm">
        {_showRenameTournoi(tournoi)}
        <FontAwesome5.Button
          name="info-circle"
          backgroundColor="#004282"
          iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
          onPress={() => showModalInfos(tournoi)}
        />
        <Button
          isDisabled={btnDisabled}
          action="primary"
          onPress={() => _chargerTournoi(tournoi)}
        >
          <ButtonText>{t('charger')}</ButtonText>
        </Button>
        <FontAwesome5.Button
          disabled={btnDisabled}
          name="times"
          backgroundColor={btnDisabled ? '#C0C0C0' : '#E63535'}
          iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
          onPress={() => setModalDeleteIsOpen(true)}
        />
      </HStack>
      {_modalSupprimerTournoi(tournoi.tournoiId)}
    </HStack>
  );
};

export default ListeTournoiItem;
