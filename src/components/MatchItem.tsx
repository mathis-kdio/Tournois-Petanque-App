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

export interface Props {
  match: MatchModel;
  displayDetailForMatch: (idMatch: number) => void;
  manche: number;
}

const MatchItem: React.FC<Props> = ({
  match,
  displayDetailForMatch,
  manche,
}) => {
  const { t } = useTranslation();

  const _displayTitle = (match: MatchModel) => {
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

  const _displayEquipe = (equipe: number, match: MatchModel) => {
    let nomsJoueurs = [];
    const joueursEquipe = match.equipe[equipe - 1];
    for (let i = 0; i < 4; i++) {
      let joueur = joueursEquipe[i];
      if (joueur && joueur !== -1) {
        nomsJoueurs.push(_displayName(joueur, equipe));
      }
    }
    return nomsJoueurs;
  };

  const _displayName = (joueur: JoueurModel, equipe: number) => {
    if (equipe === 1) {
      return (
        <Text
          key={joueur.id}
          className="text-typography-white text-left"
          size="xl"
        >
          {`${joueur.id + 1} ${joueur.name}`}
        </Text>
      );
    } else {
      return (
        <Text
          key={joueur.id}
          className="text-typography-white text-right"
          size="xl"
        >
          {`${joueur.name} ${joueur.id + 1}`}
        </Text>
      );
    }
  };

  const _displayScore = (match: MatchModel) => {
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

  if (match.manche === manche) {
    return (
      <TouchableOpacity onPress={() => displayDetailForMatch(match.id)}>
        <VStack className="m-2">
          {_displayTitle(match)}
          <HStack className="items-center">
            <Box className="flex-1">{_displayEquipe(1, match)}</Box>
            <Box className="flex-1">{_displayScore(match)}</Box>
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
