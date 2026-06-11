import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { CheckIcon, CloseIcon, EditIcon, InfoIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useTournois } from '@/repositories/tournois/useTournois';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { IIconComponentType } from '@gluestack-ui/core/lib/esm/icon/creator/createIcon';
import { useNavigation } from 'expo-router';
import { CommonActions } from 'expo-router/react-navigation';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorValue } from 'react-native';
import { SvgProps } from 'react-native-svg';
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

  const chargerTournoi = async () => {
    await setActualTournoi(tournoiId);

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
    } else if (tournoiNameText === '') {
      name = CloseIcon;
      bgColor = 'bg-[#5F5F5F]';
      action = () => setRenommerOn(false);
    } else {
      name = CheckIcon;
      bgColor = 'bg-success-500';
      action = () => updateNameTournoi();
    }

    return (
      <Box>
        <Button className={bgColor} onPress={action}>
          <ButtonIcon as={name} />
        </Button>
      </Box>
    );
  };

  const updateNameTournoi = async () => {
    if (tournoiNameText !== '') {
      await renameTournoi(tournoiId, tournoiNameText);
    }
    setTournoiNameText('');
    setRenommerOn(false);
  };

  const tournoiTextInputChanged = (text: string) => {
    setTournoiNameText(text);
    setRenommerOn(true);
  };

  const tournoiName = () => {
    const tournoiName = name ? name : `n° ${tournoiId}`;
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
        <Button action="primary" onPress={() => showModalInfos(tournoi)}>
          <ButtonIcon as={InfoIcon} />
        </Button>
        <Button
          isDisabled={estTournoiActuel}
          action="primary"
          onPress={() => chargerTournoi()}
        >
          <ButtonText>{t('charger')}</ButtonText>
        </Button>
        <Button
          isDisabled={estTournoiActuel}
          action="primary"
          onPress={() => setModalDeleteIsOpen(true)}
          className={estTournoiActuel ? 'bg-[#C0C0C0]' : 'bg-error-500'}
        >
          <ButtonIcon as={CloseIcon} />
        </Button>
      </HStack>
      {modalSupprimerTournoi()}
    </HStack>
  );
};

export default ListeTournoiItem;
