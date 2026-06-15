import JoueurSuggere from '@/components/joueur-suggere/JoueurSuggere';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useJoueursSuggestion } from '@/repositories/joueursSuggestion/useJoueursSuggestion';
import { JoueurType } from '@/types/enums/joueurType';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { JoueurSuggestionModel } from '@/types/interfaces/joueurSuggestionModel';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import {
  LegendList,
  LegendListRenderItemProps,
} from '@legendapp/list/react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

  const suggestions = useMemo(
    () =>
      joueursSuggestion.filter((suggestion) =>
        listeJoueurs.every((joueur) => joueur.name !== suggestion.name),
      ),
    [joueursSuggestion, listeJoueurs],
  );

  const [nbSuggestions, setNbSuggestions] = useState(5);

  const buttonMoreSuggestedPlayers = () => {
    if (nbSuggestions >= suggestions.length) {
      return;
    }
    return (
      <Button action="primary" onPress={showMoreSuggestedPlayers}>
        <FontAwesome name="chevron-down" className="!text-custom-text-button" />
        <ButtonText>{t('plus_suggestions_joueurs_bouton')}</ButtonText>
        <FontAwesome name="chevron-down" className="!text-custom-text-button" />
      </Button>
    );
  };

  const showMoreSuggestedPlayers = () => {
    setNbSuggestions((prevState) => prevState + 5);
  };

  const partialSuggested = suggestions.slice(0, nbSuggestions);

  if (suggestions.length === 0) {
    return null;
  }

  const renderItem = ({
    item,
  }: LegendListRenderItemProps<JoueurSuggestionModel>) => (
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
      <LegendList
        removeClippedSubviews={false}
        persistentScrollbar={true}
        data={partialSuggested}
        extraData={nbSuggestions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        recycleItems
      />
      <Box className="px-10 pb-2">{buttonMoreSuggestedPlayers()}</Box>
    </VStack>
  );
};

export default InscriptionListeJoueursSuggestions;
