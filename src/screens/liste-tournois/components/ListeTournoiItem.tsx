import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useTournois } from '@/repositories/tournois/useTournois';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { FontAwesome5 } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalDeleteTournoi from './ModalDeleteTournoi';

export interface Props {
  tournoi: TournoiModel;
  showModalInfos: (tournoi: TournoiModel) => void;
}

const ListeTournoiItem: React.FC<Props> = ({ tournoi, showModalInfos }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [renommerOn, setRenommerOn] = useState(false);
  const [tournoiNameText, setTournoiNameText] = useState('');
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);

  const { renameTournoi, setActualTournoi } = useTournois();

  const { tournoiId, name, estTournoiActuel } = tournoi;

  const chargerTournoi = () => {
    setActualTournoi(tournoiId);

    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: 'tournoi' }],
      }),
    );
  };

  const modalSupprimerTournoi = () => {
    return (
      <ModalDeleteTournoi
        tournoiId={tournoiId}
        modalDeleteIsOpen={modalDeleteIsOpen}
        setModalDeleteIsOpen={setModalDeleteIsOpen}
      />
    );
  };

  const showRenameTournoi = () => {
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
      action = () => updateNameTournoi();
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

  const updateNameTournoi = async () => {
    if (tournoiNameText === '') {
      return;
    }
    await renameTournoi(tournoiId, tournoiNameText);
    setTournoiNameText('');
    setRenommerOn(false);
  };

  const tournoiTextInputChanged = (text: string) => {
    setTournoiNameText(text);
    setRenommerOn(true);
  };

  const tournoiName = () => {
    const tournoiName = name ? name : `n°${tournoiId}`;
    if (renommerOn) {
      return (
        <Input className="border-custom-bg-inverse">
          <InputField
            className="text-typography-white placeholder:text-typography-white"
            placeholder={tournoiName}
            autoFocus={true}
            onChangeText={tournoiTextInputChanged}
            onSubmitEditing={updateNameTournoi}
          />
        </Input>
      );
    } else {
      return (
        <Text className="text-typography-white">
          {`${t('tournoi')} ${tournoiName}`}
        </Text>
      );
    }
  };

  return (
    <HStack space="md" className="px-2 my-2 items-center">
      <Box className="flex-1">{tournoiName()}</Box>
      <HStack space="sm">
        {showRenameTournoi()}
        <FontAwesome5.Button
          name="info-circle"
          backgroundColor="#004282"
          iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
          onPress={() => showModalInfos(tournoi)}
        />
        <Button
          isDisabled={estTournoiActuel}
          action="primary"
          onPress={() => chargerTournoi()}
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
      {modalSupprimerTournoi()}
    </HStack>
  );
};

export default ListeTournoiItem;
