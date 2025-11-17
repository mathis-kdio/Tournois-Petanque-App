import { FlatList } from '@/components/ui/flat-list';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import React, { useCallback, useEffect, useState } from 'react';
import JoueurSuggere from '@components/JoueurSuggere';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { ListRenderItem } from 'react-native';
import { JoueurType } from '@/types/enums/joueurType';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';

export interface Props {
  listeJoueurs: JoueurModel[];
  preparationTournoi: PreparationTournoiModel;
  onAddJoueur: (joueurName: string, joueurType: JoueurType | undefined) => void;
}

const InscriptionListeJoueursSuggestions: React.FC<Props> = ({
  listeJoueurs,
  preparationTournoi,
  onAddJoueur,
}) => {
  const { t } = useTranslation();

  const [suggestions, setSuggestions] = useState<JoueurModel[]>([]);
  const [nbSuggestions, setNbSuggestions] = useState(5);

  const _getSuggestions = useCallback(() => {
    /*let listeHistoriqueFiltre = listesJoueurs.historique.filter(
      (item1: JoueurModel) =>
        listesJoueurs[optionsTournoi.mode].every(
          (item2: JoueurModel) => item2.name !== item1.name,
        ),
    );*/
    // TODO
    const listeHistoriqueFiltre: JoueurModel[] = [];
    if (listeHistoriqueFiltre.length > 0) {
      return listeHistoriqueFiltre.sort(function (a, b) {
        return b.nbTournois - a.nbTournois;
      });
    }
    return [];
  }, []);

  useEffect(() => {
    const suggestions = _getSuggestions();
    setSuggestions(suggestions);
  }, [_getSuggestions]);

  useEffect(() => {
    const newSuggestions = _getSuggestions();
    if (newSuggestions.length !== suggestions.length) {
      setSuggestions(newSuggestions);
    }
  }, [_getSuggestions, suggestions]);

  const ajoutJoueur = (
    joueurName: string,
    joueurType: JoueurType | undefined,
  ) => {
    onAddJoueur(joueurName, joueurType);
  };

  const _buttonMoreSuggestedPlayers = () => {
    if (nbSuggestions < suggestions.length) {
      return (
        <Button action="primary" onPress={() => _showMoreSuggestedPlayers()}>
          <FontAwesome5
            name="chevron-down"
            className="text-custom-text-button"
          />
          <ButtonText>{t('plus_suggestions_joueurs_bouton')}</ButtonText>
          <FontAwesome5
            name="chevron-down"
            className="text-custom-text-button"
          />
        </Button>
      );
    }
  };

  const _showMoreSuggestedPlayers = () => {
    setNbSuggestions((prevState) => prevState + 5);
  };

  const { typeTournoi } = preparationTournoi;
  if (!typeTournoi) {
    throw Error('preparationTournoi manquantes');
  }

  if (suggestions.length === 0) {
    return;
  }
  const partialSuggested = suggestions.slice(0, nbSuggestions);
  const renderItem: ListRenderItem<JoueurModel> = ({ item }) => (
    <JoueurSuggere
      joueur={item}
      optionsTournoi={preparationTournoi}
      ajoutJoueur={ajoutJoueur}
      supprimerJoueurSuggerre={function (joueurId: number): void {
        throw new Error('Function not implemented.');
      }}
    />
  );
  return (
    <VStack>
      <Text className="text-typography-white text-xl text-center">
        {t('suggestions_joueurs')}
      </Text>
      <FlatList
        removeClippedSubviews={false}
        persistentScrollbar={true}
        data={partialSuggested}
        keyExtractor={(item: JoueurModel) => item.id.toString()}
        renderItem={renderItem}
      />
      <Box className="px-10 pb-2">{_buttonMoreSuggestedPlayers()}</Box>
    </VStack>
  );
};

export default InscriptionListeJoueursSuggestions;
