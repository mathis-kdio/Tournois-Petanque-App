import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import React, { useState } from 'react';
import DeleteJoueurButton from './DeleteJoueurButton';
import EquipePicker from './EquipePicker';
import JoueurCheckox from './JoueurCheckox';
import JoueurName from './JoueurName';
import JoueurTypeIcon from './JoueurTypeIcon';
import ModalConfirmUncheck from './ModalConfirmUncheck';
import RenameJoueurButton from './RenameJoueurButton';

export interface Props {
  joueur: JoueurModel;
  isInscription: boolean;
  avecEquipes: boolean;
  typeEquipes: TypeEquipes;
  modeTournoi: ModeTournoi;
  typeTournoi: TypeTournoi;
  showCheckbox: boolean;
  listesJoueurs: JoueurModel[];
  onDeleteJoueur: (id: number) => Promise<void>;
  onAddEquipeJoueur: (
    joueurModel: JoueurModel,
    equipeId: number,
  ) => Promise<void>;
  onUpdateName: (joueurModel: JoueurModel, name: string) => Promise<void>;
  onCheckJoueur: (
    joueurModel: JoueurModel,
    isChecked: boolean,
  ) => Promise<void>;
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

  const { isChecked, type, uniqueBDDId } = joueur;

  const handleRenommerJoueur = async () => {
    if (joueurText === '') {
      throw Error('joueurText doit au moins avoir 1 caractère');
    }
    if (isInscription) {
      await onUpdateName(joueur, joueurText);
    } else {
      await onUpdateName(joueur, joueurText);
    }
    setRenommerOn(false);
    setJoueurText('');
  };

  const ajoutCheck = async (checked: boolean) => {
    await onCheckJoueur(joueur, checked);
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
            joueurUniqueBDDId={uniqueBDDId}
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
