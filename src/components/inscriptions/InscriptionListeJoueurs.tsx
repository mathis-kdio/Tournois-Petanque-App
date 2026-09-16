import ListeJoueurItem from '@/components/liste-joueur-item/ListeJoueurItem';
import { JoueurType as JoueurTypeEnum } from '@/types/enums/joueurType';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { Tri } from '@/types/enums/tri';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { getTeamCounts } from '@/utils/teamUtils';
import {
  LegendList,
  LegendListRenderItemProps,
} from '@legendapp/list/react-native';
import React, { useMemo } from 'react';
import InscriptionListeJoueursFooter from './liste-joueurs-footer/ListeJoueursFooter';

export interface Props {
  listeJoueurs: JoueurModel[];
  preparationTournoi: PreparationTournoiModel;
  loadListScreen: boolean;
  showCheckbox: boolean;
  triType: Tri;
  onAddJoueur: (
    joueurName: string,
    joueurType: JoueurTypeEnum | undefined,
  ) => Promise<void>;
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
  setModalRemoveIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InscriptionListeJoueurs: React.FC<Props> = ({
  listeJoueurs,
  preparationTournoi,
  loadListScreen,
  showCheckbox,
  triType,
  onAddJoueur,
  onDeleteJoueur,
  onAddEquipeJoueur,
  onUpdateName,
  onCheckJoueur,
  setModalRemoveIsOpen,
}) => {
  const { typeEquipes, mode, typeTournoi, modeCreationEquipes } =
    preparationTournoi;
  if (!typeEquipes || !mode || !typeTournoi) {
    throw Error('typeEquipes, mode ou typeTournoi manquant');
  }

  // Memoize sorted list to prevent O(N log N) sorting on every render
  // eslint-disable-next-line react-doctor/react-compiler-no-manual-memoization
  const sortedListeJoueurs = useMemo(() => {
    // eslint-disable-next-line react-doctor/js-tosorted-immutable
    return [...listeJoueurs].sort((a, b) => {
      if (triType === Tri.ID) {
        return a.joueurTournoiId - b.joueurTournoiId;
      } else if (triType === Tri.ALPHA_ASC) {
        return a.name.localeCompare(b.name);
      } else if (triType === Tri.ALPHA_DESC) {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  }, [listeJoueurs, triType]);

  // Pre-compute team counts once for all players - O(N) instead of O(N*M)
  // eslint-disable-next-line react-doctor/react-compiler-no-manual-memoization
  const teamCounts = useMemo(() => {
    return getTeamCounts(listeJoueurs);
  }, [listeJoueurs]);

  const avecEquipes =
    mode === ModeTournoi.AVECEQUIPES &&
    modeCreationEquipes === ModeCreationEquipes.MANUELLE;

  const renderItem = ({ item }: LegendListRenderItemProps<JoueurModel>) => (
    <ListeJoueurItem
      joueur={item}
      isInscription={true}
      avecEquipes={avecEquipes}
      typeEquipes={typeEquipes}
      modeTournoi={mode}
      typeTournoi={typeTournoi}
      showCheckbox={showCheckbox}
      listesJoueurs={sortedListeJoueurs}
      teamCounts={teamCounts}
      onDeleteJoueur={onDeleteJoueur}
      onAddEquipeJoueur={onAddEquipeJoueur}
      onUpdateName={onUpdateName}
      onCheckJoueur={onCheckJoueur}
    />
  );

  return (
    <LegendList
      data={sortedListeJoueurs}
      keyExtractor={(item) => item.uniqueBDDId.toString()}
      renderItem={renderItem}
      className="flex-1"
      ListFooterComponent={
        <InscriptionListeJoueursFooter
          listeJoueurs={sortedListeJoueurs}
          preparationTournoi={preparationTournoi}
          loadListScreen={loadListScreen}
          onAddJoueur={onAddJoueur}
          setModalRemoveIsOpen={setModalRemoveIsOpen}
        />
      }
      getItemType={() => 'ListeJoueurItem'}
      recycleItems
    />
  );
};

export default InscriptionListeJoueurs;
