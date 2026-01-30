import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { useDispatch } from 'react-redux';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import ModalDeleteTournoi from './ModalDeleteTournoi';

export interface Props {
  tournoi: TournoiModel;
  estTournoiActuel: boolean;
  showModalInfos: (tournoi: TournoiModel) => void;
  onDelete: (id: number) => void;
  onUpdateName: (id: number, name: string) => void;
}

const ListeTournoiItem: React.FC<Props> = ({
  tournoi,
  estTournoiActuel,
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

  const chargerTournoi = (tournoi: TournoiModel) => {
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

  const modalSupprimerTournoi = (tournoiId: number) => {
    return (
      <ModalDeleteTournoi
        tournoiId={tournoiId}
        onDelete={onDelete}
        modalDeleteIsOpen={modalDeleteIsOpen}
        setModalDeleteIsOpen={setModalDeleteIsOpen}
      />
    );
  };

  const showRenameTournoi = (tournoi: TournoiModel) => {
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
      action = () => renameTournoi(tournoi.tournoiId);
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

  const renameTournoi = (tournoiId: number) => {
    if (tournoiNameText === '') {
      return;
    }
    onUpdateName(tournoiId, tournoiNameText);
    setTournoiNameText('');
    setRenommerOn(false);
  };

  const tournoiTextInputChanged = (text: string) => {
    setTournoiNameText(text);
    setRenommerOn(true);
  };

  const tournoiName = (tournoi: TournoiModel) => {
    const { name, tournoiId } = tournoi;
    const tournoiName = name ? name : 'n°' + tournoiId;
    if (renommerOn) {
      return (
        <Input className="border-custom-bg-inverse">
          <InputField
            className="text-typography-white placeholder:text-typography-white"
            placeholder={tournoiName}
            autoFocus={true}
            onChangeText={(text: string) => tournoiTextInputChanged(text)}
            onSubmitEditing={() => renameTournoi(tournoiId)}
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

  return (
    <HStack space="md" className="px-2 my-2 items-center">
      <Box className="flex-1">{tournoiName(tournoi)}</Box>
      <HStack space="sm">
        {showRenameTournoi(tournoi)}
        <FontAwesome5.Button
          name="info-circle"
          backgroundColor="#004282"
          iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
          onPress={() => showModalInfos(tournoi)}
        />
        <Button
          isDisabled={estTournoiActuel}
          action="primary"
          onPress={() => chargerTournoi(tournoi)}
        >
          <ButtonText>{t('charger')}</ButtonText>
        </Button>
        <FontAwesome5.Button
          disabled={estTournoiActuel}
          name="times"
          backgroundColor={estTournoiActuel ? '#C0C0C0' : '#E63535'}
          iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
          onPress={() => setModalDeleteIsOpen(true)}
        />
      </HStack>
      {modalSupprimerTournoi(tournoi.tournoiId)}
    </HStack>
  );
};

export default ListeTournoiItem;
