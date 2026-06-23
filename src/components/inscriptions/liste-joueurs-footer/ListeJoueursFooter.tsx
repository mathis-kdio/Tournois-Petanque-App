import { VStack } from '@/components/ui/vstack';
import { JoueurType as JoueurTypeEnum } from '@/types/enums/joueurType';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import React from 'react';
import InscriptionListeJoueursSuggestions from '../InscriptionListeJoueursSuggestions';
import LoadSavedListButton from './LoadSavedListButton';
import RemoveAllButton from './RemoveAllButton';

export interface Props {
  listeJoueurs: JoueurModel[];
  preparationTournoi: PreparationTournoiModel;
  loadListScreen: boolean;
  onAddJoueur: (
    joueurName: string,
    joueurType: JoueurTypeEnum | undefined,
  ) => Promise<void>;
  setModalRemoveIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InscriptionListeJoueursFooter: React.FC<Props> = ({
  listeJoueurs,
  preparationTournoi,
  loadListScreen,
  onAddJoueur,
  setModalRemoveIsOpen,
}) => {
  return (
    <VStack space="md" className="px-0">
      <VStack space="sm" className="px-10">
        <RemoveAllButton setModalRemoveIsOpen={setModalRemoveIsOpen} />
        {!loadListScreen && <LoadSavedListButton />}
      </VStack>
      <InscriptionListeJoueursSuggestions
        listeJoueurs={listeJoueurs}
        preparationTournoi={preparationTournoi}
        onAddJoueur={onAddJoueur}
      />
    </VStack>
  );
};

export default InscriptionListeJoueursFooter;
