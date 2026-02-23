import ListeJoueurItem from '@/components/liste-joueur-item/ListeJoueurItem';
import { Button, ButtonText } from '@/components/ui/button';
import { FlatList } from '@/components/ui/flat-list';
import { VStack } from '@/components/ui/vstack';
import { JoueurType as JoueurTypeEnum } from '@/types/enums/joueurType';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { Tri } from '@/types/enums/tri';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { useRouter } from 'expo-router';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItem } from 'react-native';
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
  ) => void;
  onDeleteJoueur: (id: number) => Promise<void>;
  onAddEquipeJoueur: (joueurModel: JoueurModel, equipeId: number) => void;
  onUpdateName: (joueurModel: JoueurModel, name: string) => void;
  onCheckJoueur: (joueurModel: JoueurModel, isChecked: boolean) => void;
  setModalRemoveIsOpen: Dispatch<SetStateAction<boolean>>;
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

  const loadSavedList = () => {
    router.navigate({
      pathname: '/listes-joueurs',
      params: {
        loadListScreen: 'true',
      },
    });
  };

  const buttonRemoveAllPlayers = (listeJoueurs: JoueurModel[]) => {
    if (listeJoueurs.length === 0) {
      return;
    }
    return (
      <Button action="negative" onPress={() => setModalRemoveIsOpen(true)}>
        <ButtonText>{t('supprimer_joueurs_bouton')}</ButtonText>
      </Button>
    );
  };

  const buttonLoadSavedList = () => {
    if (loadListScreen) {
      return;
    }
    return (
      <Button action="primary" onPress={loadSavedList}>
        <ButtonText>{t('charger_liste_joueurs_bouton')}</ButtonText>
      </Button>
    );
  };

  const { typeEquipes, mode, typeTournoi, modeCreationEquipes } =
    preparationTournoi;
  if (!typeEquipes || !mode || !typeTournoi) {
    throw Error('typeEquipes, mode ou typeTournoi manquant');
  }

  if (triType === Tri.ID) {
    listeJoueurs.sort((a, b) => a.joueurTournoiId - b.joueurTournoiId);
  } else if (triType === Tri.ALPHA_ASC) {
    listeJoueurs.sort((a, b) => a.name.localeCompare(b.name));
  } else if (triType === Tri.ALPHA_DESC) {
    listeJoueurs.sort((a, b) => b.name.localeCompare(a.name));
  }
  const avecEquipes =
    mode === ModeTournoi.AVECEQUIPES &&
    modeCreationEquipes === ModeCreationEquipes.MANUELLE;
  const renderItem: ListRenderItem<JoueurModel> = ({ item }) => (
    <ListeJoueurItem
      joueur={item}
      isInscription={true}
      avecEquipes={avecEquipes}
      typeEquipes={typeEquipes}
      modeTournoi={mode}
      typeTournoi={typeTournoi}
      showCheckbox={showCheckbox}
      listesJoueurs={listeJoueurs}
      onDeleteJoueur={onDeleteJoueur}
      onAddEquipeJoueur={onAddEquipeJoueur}
      onUpdateName={onUpdateName}
      onCheckJoueur={onCheckJoueur}
    />
  );
  return (
    <FlatList
      removeClippedSubviews={false}
      persistentScrollbar={true}
      data={listeJoueurs}
      keyExtractor={(item: JoueurModel) => item.joueurTournoiId.toString()}
      renderItem={renderItem}
      ListFooterComponent={
        <VStack space="md" className="flex-1">
          <VStack space="sm" className="px-10">
            {buttonRemoveAllPlayers(listeJoueurs)}
            {buttonLoadSavedList()}
          </VStack>
          <InscriptionListeJoueursSuggestions
            listeJoueurs={listeJoueurs}
            preparationTournoi={preparationTournoi}
            onAddJoueur={onAddJoueur}
          />
        </VStack>
      }
      className="h-1"
    />
  );
};

export default InscriptionListeJoueurs;
