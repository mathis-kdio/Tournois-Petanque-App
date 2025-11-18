import { FlatList } from '@/components/ui/flat-list';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import React, { useEffect, useState } from 'react';
import JoueurSuggere from '@components/JoueurSuggere';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { ListRenderItem } from 'react-native';
import { JoueurType } from '@/types/enums/joueurType';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { useJoueurs } from '@/repositories/joueurs/useJoueurs';

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

  const { getAllJoueurs } = useJoueurs();

  const [suggestions, setSuggestions] = useState<JoueurModel[]>([]);
  const [nbSuggestions, setNbSuggestions] = useState(5);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const joueurs = await getAllJoueurs();

      const uniquesFiltres = Array.from(
        new Map(joueurs.map((i) => [i.name, i])).values(),
      ).filter((unique) =>
        listeJoueurs.every((joueur) => joueur.name !== unique.name),
      );

      const occurrences = uniquesFiltres.reduce<Record<string, number>>(
        (acc, item) => {
          acc[item.name] = (acc[item.name] || 0) + 1;
          return acc;
        },
        {},
      );

      const resultat = uniquesFiltres.sort(
        (a, b) => occurrences[b.name] - occurrences[a.name],
      );

      setSuggestions(resultat);
    };
    fetchSuggestions();
  }, [getAllJoueurs, listeJoueurs]);

  const ajoutJoueur = (
    joueurName: string,
    joueurType: JoueurType | undefined,
  ) => {
    onAddJoueur(joueurName, joueurType);
  };

  const _buttonMoreSuggestedPlayers = () => {
    if (nbSuggestions >= suggestions.length) {
      return;
    }
    return (
      <Button action="primary" onPress={() => _showMoreSuggestedPlayers()}>
        <FontAwesome5 name="chevron-down" className="text-custom-text-button" />
        <ButtonText>{t('plus_suggestions_joueurs_bouton')}</ButtonText>
        <FontAwesome5 name="chevron-down" className="text-custom-text-button" />
      </Button>
    );
  };

  const _showMoreSuggestedPlayers = () => {
    setNbSuggestions((prevState) => prevState + 5);
  };

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
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <Box className="px-10 pb-2">{_buttonMoreSuggestedPlayers()}</Box>
    </VStack>
  );
};

export default InscriptionListeJoueursSuggestions;
