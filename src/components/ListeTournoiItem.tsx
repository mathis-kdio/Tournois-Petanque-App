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
import { Tournoi } from '@/types/interfaces/tournoi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';

export interface Props {
  tournoi: Tournoi;
  _showModalTournoiInfos: (tournoi: Tournoi) => void;
}

const ListeTournoiItem: React.FC<Props> = ({
  tournoi,
  _showModalTournoiInfos,
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

  const _chargerTournoi = (tournoi: Tournoi) => {
    const actionUpdateListeMatchs = {
      type: 'AJOUT_MATCHS',
      value: tournoi.tournoi,
    };
    dispatch(actionUpdateListeMatchs);
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ key: 'tournoi', name: 'tournoi' }],
      }),
    );
  };

  const _supprimerTournoi = (tournoiId: number) => {
    const actionSupprimerTournoi = {
      type: 'SUPPR_TOURNOI',
      value: { tournoiId: tournoiId },
    };
    dispatch(actionSupprimerTournoi);
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
            <Heading className="text-black">
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
                <ButtonText className="text-black">{t('annuler')}</ButtonText>
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

  const _showRenameTournoi = (tournoi: Tournoi) => {
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

  const _renameTournoi = (tournoi: Tournoi) => {
    if (tournoiNameText !== '') {
      setRenommerOn(false);
      const actionRenameTournoi = {
        type: 'RENOMMER_TOURNOI',
        value: { tournoiId: tournoi.tournoiId, newName: tournoiNameText },
      };
      dispatch(actionRenameTournoi);
      setTournoiNameText('');
    }
  };

  const _tournoiTextInputChanged = (text: string) => {
    setTournoiNameText(text);
    setRenommerOn(true);
  };

  const _tournoiName = (tournoi: Tournoi) => {
    let tournoiName = tournoi.name ? tournoi.name : 'n°' + tournoi.tournoiId;
    if (renommerOn) {
      return (
        <Input className="border-white">
          <InputField
            className="text-white placeholder:text-black"
            placeholder={tournoiName}
            autoFocus={true}
            onChangeText={(text: string) => _tournoiTextInputChanged(text)}
            onSubmitEditing={() => _renameTournoi(tournoi)}
          />
        </Input>
      );
    } else {
      return (
        <Text className="text-white">
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
          onPress={() => _showModalTournoiInfos(tournoi)}
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
