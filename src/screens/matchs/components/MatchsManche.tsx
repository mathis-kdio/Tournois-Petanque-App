import { FlatList } from '@/components/ui/flat-list';
import { VStack } from '@/components/ui/vstack';
import MatchItem from '@/screens/matchs/components/MatchItem';
import { MatchModel } from '@/types/interfaces/matchModel';
import { ListRenderItem } from 'react-native';
import useExitAlertOnBack from '@/components/with-exit-alert/with-exit-alert';
import { useTournoisV2 } from '@/repositories/tournois/useTournois';
import Loading from '@/components/Loading';

interface Props {
  mancheNumber: number;
}

const MatchsManche: React.FC<Props> = ({ mancheNumber }) => {
  useExitAlertOnBack();

  const { actualTournoi } = useTournoisV2();

  if (!actualTournoi) {
    return <Loading />;
  }

  const { options, matchs } = actualTournoi;

  const renderItem: ListRenderItem<MatchModel> = ({ item }) => {
    return <MatchItem match={item} />;
  };

  console.log(matchs);
  const matchsManche = matchs.filter((match) => match.manche === mancheNumber);
  console.log(matchsManche);

  return (
    <VStack className="flex-1 bg-custom-background">
      <FlatList
        data={matchsManche}
        initialNumToRender={options.nbMatchs}
        keyExtractor={(item: MatchModel) => item.id.toString()}
        renderItem={renderItem}
      />
    </VStack>
  );
};

export default MatchsManche;
