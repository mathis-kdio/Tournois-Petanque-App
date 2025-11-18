import { FlatList } from '@/components/ui/flat-list';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import React, { Dispatch, SetStateAction } from 'react';
import ListeJoueurItem from '@components/ListeJoueurItem';
import { useTranslation } from 'react-i18next';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import { Tri } from '@/types/enums/tri';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { JoueurType as JoueurTypeEnum } from '@/types/enums/joueurType';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
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
  onDeleteJoueur: (id: number) => void;
  onAddEquipeJoueur: (id: number, equipeId: number) => void;
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

  const _loadSavedList = () => {
    router.navigate({
      pathname: '/listes-joueurs',
      params: {
        loadListScreen: 'true',
      },
    });
  };

  const _buttonRemoveAllPlayers = (listeJoueurs: JoueurModel[]) => {
    if (listeJoueurs.length === 0) {
      return;
    }
    return (
      <Button action="negative" onPress={() => setModalRemoveIsOpen(true)}>
        <ButtonText>{t('supprimer_joueurs_bouton')}</ButtonText>
      </Button>
    );
  };

  const _buttonLoadSavedList = () => {
    if (loadListScreen) {
      return;
    }
    return (
      <Button action="primary" onPress={() => _loadSavedList()}>
        <ButtonText>{t('charger_liste_joueurs_bouton')}</ButtonText>
      </Button>
    );
  };

  const { typeEquipes, mode } = preparationTournoi;
  if (!typeEquipes || !mode) {
    throw Error('typeEquipes, mode');
  }

  const { modeCreationEquipes, typeTournoi } = preparationTournoi;
  if (!typeTournoi) {
    throw Error('preparationTournoi manquantes');
  }
  if (triType === Tri.ID) {
    listeJoueurs.sort((a, b) => a.id - b.id);
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
      nbJoueurs={listeJoueurs.length}
      showCheckbox={showCheckbox}
      tournoiID={undefined}
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
      keyExtractor={(item: JoueurModel) => item.id.toString()}
      renderItem={renderItem}
      ListFooterComponent={
        <VStack space="md" className="flex-1">
          <VStack space="sm" className="px-10">
            {_buttonRemoveAllPlayers(listeJoueurs)}
            {_buttonLoadSavedList()}
          </VStack>
          <InscriptionListeJoueursSuggestions
            listeJoueurs={[]}
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
