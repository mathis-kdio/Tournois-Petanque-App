import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Divider } from '@/components/ui/divider';
import { Box } from '@/components/ui/box';
import { Joueur } from '@/types/interfaces/joueur';
import { Match } from '@/types/interfaces/match';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

export interface Props {
  match: Match;
  displayDetailForMatch: (idMatch: number) => void;
  manche: number;
  nbPtVictoire: number;
}

const MatchItem: React.FC<Props> = ({
  match,
  displayDetailForMatch,
  manche,
  nbPtVictoire,
}) => {
  const { t } = useTranslation();

  const listeMatchs = useSelector(
    (state: any) => state.gestionMatchs.listematchs,
  );

  const _displayTitle = (match: Match, nbPtVictoire: number) => {
    let txt = t('match_numero') + (match.id + 1);
    if (match.terrain) {
      txt = match.terrain.name;
    }
    return (
      <HStack>
        <Box className="flex-1 items-center">
          {match.score1 === nbPtVictoire && (
            <FontAwesome5 name="trophy" size={20} color="#ffda00" />
          )}
        </Box>
        <Box className="flex-1">
          <Text className="text-typography-white text-2xl p-0.5 text-center">
            {txt}
          </Text>
        </Box>
        <Box className="flex-1 items-center">
          {match.score2 === nbPtVictoire && (
            <FontAwesome5 name="trophy" size={20} color="#ffda00" />
          )}
        </Box>
      </HStack>
    );
  };

  const _displayEquipe = (equipe: number, match: Match) => {
    let nomsJoueurs = [];
    for (let i = 0; i < 4; i++) {
      nomsJoueurs.push(_displayName(match.equipe[equipe - 1][i], equipe));
    }
    return nomsJoueurs;
  };

  const _displayName = (joueurNumber: number, equipe: number) => {
    let joueur = listeMatchs
      .at(-1)
      .listeJoueurs.find((item: Joueur) => item.id === joueurNumber);
    if (joueur) {
      if (equipe === 1) {
        return (
          <Text
            key={joueur.id}
            className="text-typography-white text-left"
            size="xl"
          >
            {joueur.id + 1 + ' ' + joueur.name}
          </Text>
        );
      } else {
        return (
          <Text
            key={joueur.id}
            className="text-typography-white text-right"
            size="xl"
          >
            {joueur.name + ' ' + (joueur.id + 1)}
          </Text>
        );
      }
    }
  };

  const _displayScore = (matchID: number) => {
    let score1 = listeMatchs[matchID].score1 ?? '?';
    let score2 = listeMatchs[matchID].score2 ?? '?';
    return (
      <HStack className="justify-center">
        <Text className="text-typography-white text-2xl p-2">{score1}</Text>
        <Text className="text-typography-white text-2xl p-2"> VS </Text>
        <Text className="text-typography-white text-2xl p-2">{score2}</Text>
      </HStack>
    );
  };

  if (match.manche === manche) {
    return (
      <TouchableOpacity onPress={() => displayDetailForMatch(match.id)}>
        <VStack className="m-2">
          {_displayTitle(match, nbPtVictoire)}
          <HStack className="items-center">
            <Box className="flex-1">{_displayEquipe(1, match)}</Box>
            <Box className="flex-1">{_displayScore(match.id)}</Box>
            <Box className="flex-1">{_displayEquipe(2, match)}</Box>
          </HStack>
        </VStack>
        <Divider />
      </TouchableOpacity>
    );
  }
  return null;
};

export default MatchItem;
