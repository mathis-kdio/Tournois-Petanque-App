import Loading from '@/components/Loading';
import { FlatList } from '@/components/ui/flat-list';
import { VStack } from '@/components/ui/vstack';
import useExitAlertOnBack from '@/components/with-exit-alert/with-exit-alert';
import { useTournois } from '@/repositories/tournois/useTournois';
import MatchItem from '@/screens/matchs/components/MatchItem';
import { MatchModel } from '@/types/interfaces/matchModel';
import { ListRenderItem } from 'react-native';

interface Props {
  mancheNumber: number;
}

const MatchsManche: React.FC<Props> = ({ mancheNumber }) => {
  useExitAlertOnBack();

  const { actualTournoi } = useTournois();

  if (!actualTournoi) {
    return <Loading />;
  }

  const { options, matchs } = actualTournoi;

  const renderItem: ListRenderItem<MatchModel> = ({ item }) => {
    return <MatchItem match={item} />;
  };

  const matchsManche = matchs.filter((match) => match.manche === mancheNumber);

  return (
    <VStack className="flex-1 bg-custom-background">
      <FlatList
        data={matchsManche}
        initialNumToRender={options.nbMatchs}
        keyExtractor={(item: MatchModel) => item.matchId.toString()}
        renderItem={renderItem}
      />
    </VStack>
  );
};

export default MatchsManche;
