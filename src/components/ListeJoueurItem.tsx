import { Text } from '@/components/ui/text';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@/components/ui/select';
import { Input, InputField } from '@/components/ui/input';
import { Image } from '@/components/ui/image';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import {
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  Icon,
} from '@/components/ui/icon';
import { Button, ButtonGroup, ButtonText } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { JoueurType } from '@/types/enums/joueurType';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeTournoi } from '@/types/enums/typeTournoi';

export interface Props {
  joueur: JoueurModel;
  isInscription: boolean;
  avecEquipes: boolean;
  typeEquipes: TypeEquipes;
  modeTournoi: ModeTournoi;
  typeTournoi: TypeTournoi;
  nbJoueurs: number;
  showCheckbox: boolean;
  tournoiID: number | undefined;
  listesJoueurs: JoueurModel[] | undefined;
  onDeleteJoueur: (id: number) => void;
  onAddEquipeJoueur: (id: number, equipeId: number) => void;
  onUpdateName: (joueurModel: JoueurModel, name: string) => void;
  onCheckJoueur: (joueurModel: JoueurModel, isChecked: boolean) => void;
}

const ListeJoueurItem: React.FC<Props> = ({
  joueur,
  isInscription,
  avecEquipes,
  typeEquipes,
  modeTournoi,
  typeTournoi,
  nbJoueurs,
  showCheckbox,
  tournoiID,
  listesJoueurs,
  onDeleteJoueur,
  onAddEquipeJoueur,
  onUpdateName,
  onCheckJoueur,
}) => {
  const { t } = useTranslation();

  const [renommerOn, setRenommerOn] = useState(false);
  const [joueurText, setJoueurText] = useState('');
  const [modalConfirmUncheckIsOpen, setModalConfirmUncheckIsOpen] =
    useState(false);

  const _showSupprimerJoueur = (
    joueur: JoueurModel,
    isInscription: boolean,
  ) => {
    if (!isInscription) {
      return;
    }
    return (
      <Box className="ml-2">
        <FontAwesome5.Button
          name="times"
          backgroundColor="#E63535"
          iconStyle={{ paddingHorizontal: 2, marginRight: 0 }}
          onPress={() => _supprimerJoueur(joueur.id)}
        />
      </Box>
    );
  };

  const _supprimerJoueur = (idJoueur: number) => {
    setRenommerOn(false);
    onDeleteJoueur(idJoueur);

    if (typeEquipes === TypeEquipes.TETEATETE) {
      /*const actionUpdateEquipe = {
        type: 'UPDATE_ALL_JOUEURS_EQUIPE',
        value: [modeTournoi],
      };
      dispatch(actionUpdateEquipe);*/
    }
  };

  const _showRenommerJoueur = (
    joueur: JoueurModel,
    isInscription: boolean,
    avecEquipes: boolean,
  ) => {
    let name: string;
    let bgColor: string;
    let action;
    if (!renommerOn) {
      name = 'edit';
      bgColor = '#004282';
      action = () => setRenommerOn(true);
    } else if (joueurText === '') {
      name = 'times';
      bgColor = '#5F5F5F';
      action = () => setRenommerOn(false);
    } else {
      name = 'check';
      bgColor = '#348352';
      action = () => _renommerJoueur(joueur, isInscription, avecEquipes);
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

  const _renommerJoueur = (
    joueur: JoueurModel,
    isInscription: boolean,
    avecEquipes: boolean,
  ) => {
    if (joueurText === '') {
      return;
    }
    if (isInscription === true) {
      onUpdateName(joueur, joueurText);
    } else {
      /*let data = { playerId: joueur.id, newName: joueurText };
      const inGameRenamePlayer = {
        type: 'INGAME_RENAME_PLAYER',
        value: data,
      };
      dispatch(inGameRenamePlayer);
      const actionUpdateTournoi = {
        type: 'UPDATE_TOURNOI',
        value: {
          tournoiId: tournoiID,
        },
      };
      dispatch(actionUpdateTournoi);*/
      onUpdateName(joueur, joueurText);
    }
    setRenommerOn(false);
    setJoueurText('');
  };

  const _joueurTxtInputChanged = (text: string) => {
    setJoueurText(text);
    setRenommerOn(true);
  };

  const _joueurName = (
    joueur: JoueurModel,
    isInscription: boolean,
    avecEquipes: boolean,
  ) => {
    if (renommerOn) {
      return (
        <Input variant="underlined">
          <InputField
            className="text-typography-white placeholder:text-typography-white"
            placeholder={joueur.name}
            autoFocus={true}
            onChangeText={(text: string) => _joueurTxtInputChanged(text)}
            onSubmitEditing={() =>
              _renommerJoueur(joueur, isInscription, avecEquipes)
            }
          />
        </Input>
      );
    } else {
      return (
        <Text className="text-typography-white text-xl font-bold break-words">
          {joueur.id + 1}-{joueur.name}
        </Text>
      );
    }
  };

  const _ajoutEquipe = (joueurId: number, equipeId: number) => {
    /*const action = {
      type: 'AJOUT_EQUIPE_JOUEUR',
      value: [ModeTournoi.AVECEQUIPES, joueurId, equipeId],
    };
    dispatch(action);*/
    onAddEquipeJoueur(joueurId, equipeId);
  };

  const _equipePicker = (
    joueur: JoueurModel,
    avecEquipes: boolean,
    typeEquipes: TypeEquipes,
    nbJoueurs: number,
  ) => {
    if (avecEquipes === true && listesJoueurs) {
      let selectedValue = '0';
      if (joueur.equipe) {
        selectedValue = joueur.equipe.toString();
      }
      let nbEquipes = nbJoueurs;
      if (typeEquipes === TypeEquipes.DOUBLETTE) {
        nbEquipes = Math.ceil(nbJoueurs / 2);
      } else if (typeEquipes === TypeEquipes.TRIPLETTE) {
        nbEquipes = Math.ceil(nbJoueurs / 3);
      }

      let pickerItem = [];
      for (let i = 1; i <= nbEquipes; i++) {
        let count = listesJoueurs.reduce(
          (counter: number, obj: JoueurModel) =>
            obj.equipe === i ? (counter += 1) : counter,
          0,
        );
        if (typeEquipes === TypeEquipes.TETEATETE && count < 1) {
          pickerItem.push(_equipePickerItem(i));
        }
        if (typeEquipes === TypeEquipes.DOUBLETTE && count < 2) {
          pickerItem.push(_equipePickerItem(i));
        } else if (typeEquipes === TypeEquipes.TRIPLETTE && count < 3) {
          pickerItem.push(_equipePickerItem(i));
        } else if (joueur.equipe === i) {
          pickerItem.push(_equipePickerItem(i));
        }
      }
      return (
        <Select
          selectedValue={selectedValue}
          aria-label={t('choix_equipe')}
          onValueChange={(itemValue) =>
            _ajoutEquipe(joueur.id, parseInt(itemValue))
          }
        >
          <SelectTrigger className="flex flex-row border-custom-bg-inverse">
            <SelectInput
              className="basis-5/6 text-typography-white placeholder:text-typography-white"
              placeholder={t('choix_equipe')}
            />
            <SelectIcon
              className="basis-1/6 mr-3 text-typography-white"
              as={ChevronDownIcon}
            />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label={t('choisir')} value="0" key="0" />
              {pickerItem}
            </SelectContent>
          </SelectPortal>
        </Select>
      );
    }
  };

  const _equipePickerItem = (equipe: number) => {
    return (
      <SelectItem
        label={equipe.toString()}
        value={equipe.toString()}
        key={equipe}
      />
    );
  };

  const _joueurTypeIcon = (joueurType: JoueurType | undefined) => {
    if (joueurType === undefined) {
      return;
    }
    const showTireurPointeur =
      modeTournoi === ModeTournoi.SAUVEGARDE ||
      (typeTournoi === TypeTournoi.MELEDEMELE &&
        (typeEquipes === TypeEquipes.DOUBLETTE ||
          typeEquipes === TypeEquipes.TRIPLETTE));
    if (showTireurPointeur) {
      return (
        <Box>
          {joueurType === JoueurType.ENFANT && (
            <FontAwesome5 name="child" color="darkgray" size={24} />
          )}
          {joueurType === JoueurType.TIREUR && (
            <Image
              source={require('@assets/images/tireur.png')}
              alt="tireur"
              className="w-[30px] h-[30px]"
            />
          )}
          {joueurType === JoueurType.POINTEUR && (
            <Image
              source={require('@assets/images/pointeur.png')}
              alt="tireur"
              className="w-[30px] h-[30px]"
            />
          )}
        </Box>
      );
    } else {
      return (
        <Box>
          {joueurType === JoueurType.ENFANT && (
            <FontAwesome5 name="child" color="darkgray" size={24} />
          )}
        </Box>
      );
    }
  };

  const _joueurCheckbox = (showCheckbox: boolean, joueur: JoueurModel) => {
    if (!showCheckbox) {
      return;
    }
    let isChecked = true;
    if (joueur.isChecked === undefined || !joueur.isChecked) {
      isChecked = false;
    }
    return (
      <Box className="mr-1 place-self-center">
        <Checkbox
          value="joueurCheckbox"
          onChange={() => _onCheckboxChange(isChecked, joueur)}
          aria-label={t('checkbox_inscription_joueuritem')}
          size="md"
          isChecked={isChecked}
        >
          <CheckboxIndicator className="mr-2 border-typography-white data-[checked=true]:bg-custom-background data-[checked=true]:border-typography-white">
            <CheckboxIcon
              as={CheckIcon}
              className="text-typography-white bg-custom-background"
            />
          </CheckboxIndicator>
          <CheckboxLabel />
        </Checkbox>
      </Box>
    );
  };

  const _onCheckboxChange = (isChecked: boolean, joueurModel: JoueurModel) => {
    if (!isChecked) {
      _ajoutCheck(joueurModel, true);
    } else {
      setModalConfirmUncheckIsOpen(true);
    }
  };

  const _modalConfirmUncheck = () => {
    return (
      <AlertDialog
        isOpen={modalConfirmUncheckIsOpen}
        onClose={() => setModalConfirmUncheckIsOpen(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="color-custom-text-modal">
              {t('confirmer_uncheck_modal_titre')}
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
            <Text>{t('confirmer_uncheck_modal_texte')}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup flexDirection="row">
              <Button
                variant="outline"
                action="secondary"
                onPress={() => setModalConfirmUncheckIsOpen(false)}
              >
                <ButtonText className="color-custom-text-modal">
                  {t('annuler')}
                </ButtonText>
              </Button>
              <Button
                action="negative"
                onPress={() => _ajoutCheck(joueur, false)}
              >
                <ButtonText>{t('oui')}</ButtonText>
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const _ajoutCheck = (joueurModel: JoueurModel, isChecked: boolean) => {
    onCheckJoueur(joueurModel, isChecked);
    setModalConfirmUncheckIsOpen(false);
  };

  let flexsize = avecEquipes
    ? ['basis-6/12', 'basis-6/12', 'basis-6/12', 'basis-3/12']
    : ['basis-9/12', 'basis-3/12', 'basis-0/12', 'basis-6/12'];
  return (
    <HStack className="flex flex-row border border-custom-bg-inverse rounded-xl m-1 px-1 items-center">
      <HStack className={`${flexsize[0]}`}>
        {_joueurCheckbox(showCheckbox, joueur)}
        {_joueurTypeIcon(joueur.type)}
        <Box className="flex-1">
          {_joueurName(joueur, isInscription, avecEquipes)}
        </Box>
      </HStack>
      <HStack className={`${flexsize[1]} justify-end`}>
        {avecEquipes === true && (
          <HStack className={`${flexsize[2]}`}>
            {_equipePicker(joueur, avecEquipes, typeEquipes, nbJoueurs)}
          </HStack>
        )}
        <HStack className={`${flexsize[3]}`}>
          {_showRenommerJoueur(joueur, isInscription, avecEquipes)}
        </HStack>
        <HStack className={`${flexsize[3]}`}>
          {_showSupprimerJoueur(joueur, isInscription)}
        </HStack>
      </HStack>
      {_modalConfirmUncheck()}
    </HStack>
  );
};

export default ListeJoueurItem;
