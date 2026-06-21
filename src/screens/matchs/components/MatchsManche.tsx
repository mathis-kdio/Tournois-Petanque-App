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

interface Props {
  mancheNumber: number;
}

const renderItem = ({ item }: LegendListRenderItemProps<MatchModel>) => {
  return <MatchItem match={item} />;
};

const MatchsManche: React.FC<Props> = ({ mancheNumber }) => {
  useExitAlertOnBack();

  const { actualTournoi } = useActualTournoi();

  if (!actualTournoi) {
    return <Loading />;
  }

  const { matchs } = actualTournoi;

  const matchsManche = matchs.filter((match) => match.manche === mancheNumber);

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

export default MatchsManche;
