import ListeJoueurItem from '@/components/liste-joueur-item/ListeJoueurItem';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { JoueurType as JoueurTypeEnum } from '@/types/enums/joueurType';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { Tri } from '@/types/enums/tri';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import {
  LegendList,
  LegendListRenderItemProps,
} from '@legendapp/list/react-native';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import InscriptionListeJoueursSuggestions from './InscriptionListeJoueursSuggestions';

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
  const { t } = useTranslation();
  const router = useRouter();

  const loadSavedList = useCallback(() => {
    router.navigate({
      pathname: '/listes-joueurs',
      params: {
        loadListScreen: 'true',
      },
    });
  }, [router]);

  const { typeEquipes, mode, typeTournoi, modeCreationEquipes } =
    preparationTournoi;
  if (!typeEquipes || !mode || !typeTournoi) {
    throw Error('typeEquipes, mode ou typeTournoi manquant');
  }

  const sortedListeJoueurs = useMemo(() => {
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

  const avecEquipes =
    mode === ModeTournoi.AVECEQUIPES &&
    modeCreationEquipes === ModeCreationEquipes.MANUELLE;

  const footerComponent = useMemo(() => {
    const renderRemoveAllButton = () => {
      if (sortedListeJoueurs.length === 0) {
        return null;
      }
      return (
        <Button action="negative" onPress={() => setModalRemoveIsOpen(true)}>
          <ButtonText>{t('supprimer_joueurs_bouton')}</ButtonText>
        </Button>
      );
    };

    const renderLoadSavedListButton = () => {
      if (loadListScreen) {
        return null;
      }
      return (
        <Button action="primary" onPress={loadSavedList}>
          <ButtonText>{t('charger_liste_joueurs_bouton')}</ButtonText>
        </Button>
      );
    };

    return (
      <VStack space="md" className="px-0">
        <VStack space="sm" className="px-10">
          {renderRemoveAllButton()}
          {renderLoadSavedListButton()}
        </VStack>
        <InscriptionListeJoueursSuggestions
          listeJoueurs={sortedListeJoueurs}
          preparationTournoi={preparationTournoi}
          onAddJoueur={onAddJoueur}
        />
      </VStack>
    );
  }, [
    sortedListeJoueurs,
    preparationTournoi,
    onAddJoueur,
    loadListScreen,
    t,
    loadSavedList,
    setModalRemoveIsOpen,
  ]);

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
      onDeleteJoueur={onDeleteJoueur}
      onAddEquipeJoueur={onAddEquipeJoueur}
      onUpdateName={onUpdateName}
      onCheckJoueur={onCheckJoueur}
    />
  );
  return (
    <LegendList
      persistentScrollbar={true}
      data={sortedListeJoueurs}
      keyExtractor={(item) => item.uniqueBDDId.toString()}
      renderItem={renderItem}
      ListFooterComponent={footerComponent}
      recycleItems
    />
  );
};

export default InscriptionListeJoueurs;
