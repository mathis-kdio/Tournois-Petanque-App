import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import ModalConfirmUncheck from './ModalConfirmUncheck';
import JoueurTypeIcon from './JoueurTypeIcon';
import EquipePicker from './EquipePicker';

export interface Props {
  joueur: JoueurModel;
  isInscription: boolean;
  avecEquipes: boolean;
  typeEquipes: TypeEquipes;
  modeTournoi: ModeTournoi;
  typeTournoi: TypeTournoi;
  showCheckbox: boolean;
  listesJoueurs: JoueurModel[];
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
  showCheckbox,
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
          onPress={() => _supprimerJoueur(joueur.joueurTournoiId)}
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
          {joueur.joueurTournoiId + 1}-{joueur.name}
        </Text>
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
        <JoueurTypeIcon
          joueurType={joueur.type}
          typeEquipes={typeEquipes}
          modeTournoi={modeTournoi}
          typeTournoi={typeTournoi}
        />
        <Box className="flex-1">
          {_joueurName(joueur, isInscription, avecEquipes)}
        </Box>
      </HStack>
      <HStack className={`${flexsize[1]} justify-end`}>
        {avecEquipes === true && (
          <HStack className={`${flexsize[2]}`}>
            <EquipePicker
              joueur={joueur}
              typeEquipes={typeEquipes}
              listesJoueurs={listesJoueurs}
              onAddEquipeJoueur={onAddEquipeJoueur}
            />
          </HStack>
        )}
        <HStack className={`${flexsize[3]}`}>
          {_showRenommerJoueur(joueur, isInscription, avecEquipes)}
        </HStack>
        <HStack className={`${flexsize[3]}`}>
          {_showSupprimerJoueur(joueur, isInscription)}
        </HStack>
      </HStack>
      <ModalConfirmUncheck
        joueur={joueur}
        modalConfirmUncheckIsOpen={modalConfirmUncheckIsOpen}
        setModalConfirmUncheckIsOpen={setModalConfirmUncheckIsOpen}
        onCancel={_ajoutCheck}
      />
    </HStack>
  );
};

export default ListeJoueurItem;
