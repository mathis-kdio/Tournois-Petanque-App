import Loading from '@/components/Loading';
import { VStack } from '@/components/ui/vstack';
import useExitAlertOnBack from '@/components/with-exit-alert/with-exit-alert';
import { useActualTournoi } from '@/repositories/tournois/useActualTournoi';
import MatchItem from '@/screens/matchs/components/MatchItem';
import { MatchModel } from '@/types/interfaces/matchModel';
import {
  LegendList,
  LegendListRenderItemProps,
} from '@legendapp/list/react-native';
import React, { memo, useMemo } from 'react';

interface Props {
  mancheNumber: number;
}

// Memoized MatchItem pour éviter les rendus inutiles
const MemoizedMatchItem = memo(MatchItem);

const renderItem = ({ item }: LegendListRenderItemProps<MatchModel>) => {
  return <MemoizedMatchItem match={item} />;
};

const MatchsManche: React.FC<Props> = ({ mancheNumber }) => {
  useExitAlertOnBack();

  const { actualTournoi } = useActualTournoi();

  if (!actualTournoi) {
    return <Loading />;
  }

  const { matchs } = actualTournoi;

  // Memoize les matchs filtrés pour éviter les recalculs
  const matchsManche = useMemo(() => {
    return matchs.filter((match) => match.manche === mancheNumber);
  }, [matchs, mancheNumber]);

  return (
    <VStack className="flex-1 bg-custom-background">
      <LegendList
        data={matchsManche}
        keyExtractor={(item) => item.matchId.toString()}
        renderItem={renderItem}
        className="flex-1"
        getItemType={() => 'MatchItem'}
        recycleItems
      />
    </VStack>
  );
};

// Exporter avec memo pour éviter les rendus inutiles du parent
export default memo(MatchsManche);
