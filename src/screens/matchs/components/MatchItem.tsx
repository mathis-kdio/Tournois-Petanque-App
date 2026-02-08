import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Divider } from '@/components/ui/divider';
import { Box } from '@/components/ui/box';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { MatchModel } from '@/types/interfaces/matchModel';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export interface Props {
  match: MatchModel;
}

type Equipe = 1 | 2;

const MatchItem: React.FC<Props> = ({ match }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const displayTitle = (match: MatchModel) => {
    const { id, terrain, score1, score2 } = match;
    const score1Int = score1 ? score1 : 0;
    const score2Int = score2 ? score2 : 0;
    const txt = terrain ? terrain.name : `${t('match_numero')}${id + 1}`;
    return (
      <HStack>
        <Box className="flex-1 items-center">
          {score1Int > score2Int && (
            <FontAwesome5 name="trophy" size={20} color="#ffda00" />
          )}
        </Box>
        <Box className="flex-1">
          <Text className="text-typography-white text-2xl p-0.5 text-center">
            {txt}
          </Text>
        </Box>
        <Box className="flex-1 items-center">
          {score2Int > score1Int && (
            <FontAwesome5 name="trophy" size={20} color="#ffda00" />
          )}
        </Box>
      </HStack>
    );
  };

  const displayEquipe = (equipe: Equipe, match: MatchModel) => {
    const nomsJoueurs = [];
    const joueursEquipe = match.equipe[equipe - 1];
    for (let i = 0; i < 4; i++) {
      const joueur = joueursEquipe[i];
      if (joueur && joueur !== -1) {
        nomsJoueurs.push(displayName(joueur, equipe));
      }
    }
    return nomsJoueurs;
  };

  const displayName = (joueur: JoueurModel, equipe: Equipe) => {
    if (equipe === 1) {
      return (
        <Text
          key={joueur.joueurTournoiId}
          className="text-typography-white text-left"
          size="xl"
        >
          {`${joueur.joueurTournoiId + 1} ${joueur.name}`}
        </Text>
      );
    } else {
      return (
        <Text
          key={joueur.joueurTournoiId}
          className="text-typography-white text-right"
          size="xl"
        >
          {`${joueur.name} ${joueur.joueurTournoiId + 1}`}
        </Text>
      );
    }
  };

  const displayScore = (match: MatchModel) => {
    const score1 = match.score1 ?? '?';
    const score2 = match.score2 ?? '?';
    return (
      <HStack className="justify-center">
        <Text className="text-typography-white text-2xl p-2">{score1}</Text>
        <Text className="text-typography-white text-2xl p-2"> VS </Text>
        <Text className="text-typography-white text-2xl p-2">{score2}</Text>
      </HStack>
    );
  };

  const navigateMatchDetail = (idMatch: number) => {
    router.navigate({
      pathname: '/tournoi/match-detail',
      params: {
        idMatch: idMatch,
      },
    });
  };

  return (
    <TouchableOpacity onPress={() => navigateMatchDetail(match.id)}>
      <VStack className="m-2">
        {displayTitle(match)}
        <HStack className="items-center">
          <Box className="flex-1">{displayEquipe(1, match)}</Box>
          <Box className="flex-1">{displayScore(match)}</Box>
          <Box className="flex-1">{displayEquipe(2, match)}</Box>
        </HStack>
      </VStack>
      <Divider />
    </TouchableOpacity>
  );
};

export default MatchItem;
