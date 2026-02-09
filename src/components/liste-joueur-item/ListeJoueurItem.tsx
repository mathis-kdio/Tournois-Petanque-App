import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import React, { useState } from 'react';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import ModalConfirmUncheck from './ModalConfirmUncheck';
import JoueurTypeIcon from './JoueurTypeIcon';
import EquipePicker from './EquipePicker';
import JoueurName from './JoueurName';
import DeleteJoueurButton from './DeleteJoueurButton';
import RenameJoueurButton from './RenameJoueurButton';
import JoueurCheckox from './JoueurCheckox';

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
  const [renommerOn, setRenommerOn] = useState(false);
  const [joueurText, setJoueurText] = useState('');
  const [modalConfirmUncheckIsOpen, setModalConfirmUncheckIsOpen] =
    useState(false);

  const { isChecked, type, joueurTournoiId } = joueur;

  const handleRenommerJoueur = () => {
    if (joueurText === '') {
      throw Error('joueurText doit au moins avoir 1 caractère');
    }
    if (isInscription) {
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

  const ajoutCheck = (checked: boolean) => {
    onCheckJoueur(joueur, checked);
    setModalConfirmUncheckIsOpen(false);
  };

  const flexsize = avecEquipes
    ? ['basis-6/12', 'basis-6/12', 'basis-6/12', 'basis-3/12']
    : ['basis-9/12', 'basis-3/12', 'basis-0/12', 'basis-6/12'];
  return (
    <HStack className="flex flex-row border border-custom-bg-inverse rounded-xl m-1 px-1 items-center">
      <HStack className={`${flexsize[0]}`}>
        <JoueurCheckox
          isChecked={isChecked}
          showCheckbox={showCheckbox}
          setModalConfirmUncheckIsOpen={setModalConfirmUncheckIsOpen}
          ajoutCheck={ajoutCheck}
        />
        <JoueurTypeIcon
          joueurType={type}
          typeEquipes={typeEquipes}
          modeTournoi={modeTournoi}
          typeTournoi={typeTournoi}
        />
        <Box className="flex-1">
          <JoueurName
            joueur={joueur}
            renommerOn={renommerOn}
            setRenommerOn={setRenommerOn}
            setJoueurText={setJoueurText}
            handleRenommerJoueur={handleRenommerJoueur}
          />
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
          <RenameJoueurButton
            renommerOn={renommerOn}
            setRenommerOn={setRenommerOn}
            joueurText={joueurText}
            handleRenommerJoueur={handleRenommerJoueur}
          />
        </HStack>
        <HStack className={`${flexsize[3]}`}>
          <DeleteJoueurButton
            joueurTournoiId={joueurTournoiId}
            isInscription={isInscription}
            typeEquipes={typeEquipes}
            setRenommerOn={setRenommerOn}
            onDeleteJoueur={onDeleteJoueur}
          />
        </HStack>
      </HStack>
      <ModalConfirmUncheck
        modalConfirmUncheckIsOpen={modalConfirmUncheckIsOpen}
        setModalConfirmUncheckIsOpen={setModalConfirmUncheckIsOpen}
        onCancel={ajoutCheck}
      />
    </HStack>
  );
};

export default ListeJoueurItem;
