import JoueurName, { EquipeId } from '@/components/JoueurName';
import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { EquipeType } from '@/types/interfaces/equipeType';
import { MatchModel } from '@/types/interfaces/matchModel';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

export interface Props {
  match: MatchModel;
}

const displayEquipe = (equipeType: EquipeType, equipeId: EquipeId) => {
  return equipeType.map((joueurModel) =>
    joueurModel ? (
      <JoueurName
        key={joueurModel.uniqueBDDId}
        joueur={joueurModel}
        equipeId={equipeId}
        size="xl"
      />
    ) : null,
  );
};

const MatchItem: React.FC<Props> = ({ match }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const isNavigating = useRef(false);

  const { matchId, equipe, terrain, score1, score2 } = match;

  const displayTitle = () => {
    const score1Int = score1 ? score1 : 0;
    const score2Int = score2 ? score2 : 0;
    const txt = terrain ? terrain.name : `${t('match_numero')}${matchId + 1}`;
    return (
      <HStack>
        <Box className="flex-1 items-center">
          {score1Int > score2Int && (
            <FontAwesome name="trophy" size={30} color="#ffda00" />
          )}
        </Box>
        <Box className="flex-1">
          <Text className="text-typography-white text-2xl p-0.5 text-center">
            {txt}
          </Text>
        </Box>
        <Box className="flex-1 items-center">
          {score2Int > score1Int && (
            <FontAwesome name="trophy" size={30} color="#ffda00" />
          )}
        </Box>
      </HStack>
    );
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
    // Empêcher les navigations multiples rapides
    if (isNavigating.current) {
      return;
    }
    isNavigating.current = true;
    
    // Utiliser requestAnimationFrame pour synchroniser avec le prochain frame
    requestAnimationFrame(() => {
      router.navigate({
        pathname: '/tournoi/match-detail',
        params: {
          idMatch: match.matchId,
        },
      });
    });
    
    // Réinitialiser le flag après un délai pour éviter les blocages
    setTimeout(() => {
      isNavigating.current = false;
    }, 1000);
  };

  return (
    <Pressable 
      onPress={navigateMatchDetail}
      // Désactiver pendant la navigation pour éviter les clics multiples
      isDisabled={isNavigating.current}
    >
      <VStack className="m-2">
        {displayTitle()}
        <HStack className="items-center">
          <Box className="flex-1">{displayEquipe(equipe[0], 1)}</Box>
          <Box className="flex-1">{displayScore()}</Box>
          <Box className="flex-1">{displayEquipe(equipe[1], 2)}</Box>
        </HStack>
      </VStack>
      <Divider />
    </Pressable>
  );
};

// Exporter avec memo pour éviter les rendus inutiles
export default React.memo(MatchItem);
