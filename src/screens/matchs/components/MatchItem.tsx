import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { EquipeType } from '@/types/interfaces/equipeType';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { MatchModel } from '@/types/interfaces/matchModel';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

export interface Props {
  match: MatchModel;
}

type Equipe = 0 | 1;

const MatchItem: React.FC<Props> = ({ match }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { matchId, equipe, terrain, score1, score2 } = match;

  const displayTitle = () => {
    const score1Int = score1 ? score1 : 0;
    const score2Int = score2 ? score2 : 0;
    const txt = terrain ? terrain.name : `${t('match_numero')}${matchId + 1}`;
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

  const displayEquipe = (equipeType: EquipeType, equipeId: Equipe) => {
    return equipeType
      .filter((a) => !!a && a !== -1)
      .map((b) => displayName(b, equipeId));
  };

  const displayName = (joueur: JoueurModel, equipe: Equipe) => {
    if (equipe === 0) {
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

  const displayScore = () => {
    return (
      <HStack className="justify-center">
        <Text className="text-typography-white text-2xl p-2">
          {score1 ?? '?'}
        </Text>
        <Text className="text-typography-white text-2xl p-2"> VS </Text>
        <Text className="text-typography-white text-2xl p-2">
          {score2 ?? '?'}
        </Text>
      </HStack>
    );
  };

  const navigateMatchDetail = () => {
    router.navigate({
      pathname: '/tournoi/match-detail',
      params: {
        idMatch: match.matchId,
      },
    });
  };

  return (
    <TouchableOpacity onPress={() => navigateMatchDetail()}>
      <VStack className="m-2">
        {displayTitle()}
        <HStack className="items-center">
          <Box className="flex-1">{displayEquipe(equipe[0], 0)}</Box>
          <Box className="flex-1">{displayScore()}</Box>
          <Box className="flex-1">{displayEquipe(equipe[1], 1)}</Box>
        </HStack>
      </VStack>
      <Divider />
    </TouchableOpacity>
  );
};

export default MatchItem;
