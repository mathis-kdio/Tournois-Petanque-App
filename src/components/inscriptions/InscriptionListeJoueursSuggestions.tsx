import JoueurSuggere from '@/components/joueur-suggere/JoueurSuggere';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { FlatList } from '@/components/ui/flat-list';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useJoueursSuggestion } from '@/repositories/joueursSuggestion/useJoueursSuggestion';
import { JoueurType } from '@/types/enums/joueurType';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { JoueurSuggestionModel } from '@/types/interfaces/joueurSuggestionModel';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItem } from 'react-native';

export interface Props {
  listeJoueurs: JoueurModel[];
  preparationTournoi: PreparationTournoiModel;
  onAddJoueur: (
    joueurName: string,
    joueurType: JoueurType | undefined,
  ) => Promise<void>;
}

const InscriptionListeJoueursSuggestions: React.FC<Props> = ({
  listeJoueurs,
  preparationTournoi,
  onAddJoueur,
}) => {
  const { t } = useTranslation();

  const { joueursSuggestion } = useJoueursSuggestion();

  const [suggestions, setSuggestions] = useState<JoueurSuggestionModel[]>([]);
  const [nbSuggestions, setNbSuggestions] = useState(5);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const suggestionNonInscrits = joueursSuggestion.filter((suggestion) =>
        listeJoueurs.every((joueur) => joueur.name !== suggestion.name),
      );

      setSuggestions(suggestionNonInscrits);
    };
    fetchSuggestions();
  }, [joueursSuggestion, listeJoueurs]);

  const buttonMoreSuggestedPlayers = () => {
    if (nbSuggestions >= suggestions.length) {
      return;
    }
    return (
      <Button action="primary" onPress={showMoreSuggestedPlayers}>
        <FontAwesome5 name="chevron-down" className="text-custom-text-button" />
        <ButtonText>{t('plus_suggestions_joueurs_bouton')}</ButtonText>
        <FontAwesome5 name="chevron-down" className="text-custom-text-button" />
      </Button>
    );
  };

  const showMoreSuggestedPlayers = () => {
    setNbSuggestions((prevState) => prevState + 5);
  };

  if (suggestions.length === 0) {
    return;
  }

  const partialSuggested = suggestions.slice(0, nbSuggestions);
  const renderItem: ListRenderItem<JoueurSuggestionModel> = ({ item }) => (
    <JoueurSuggere
      joueur={item}
      optionsTournoi={preparationTournoi}
      onAddJoueur={onAddJoueur}
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
      <Box className="px-10 pb-2">{buttonMoreSuggestedPlayers()}</Box>
    </VStack>
  );
};

export default InscriptionListeJoueursSuggestions;
