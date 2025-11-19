import { FlatList } from '@/components/ui/flat-list';
import { VStack } from '@/components/ui/vstack';
import MatchItem from '@components/MatchItem';
import { MatchModel } from '@/types/interfaces/matchModel';
import { ListRenderItem } from 'react-native';
import { OptionsTournoiModel } from '@/types/interfaces/optionsTournoiModel';
import { useSelector } from 'react-redux';
import useExitAlertOnBack from '@/components/with-exit-alert/with-exit-alert';
import { useRouter } from 'expo-router';

interface ListeMatchsProps {
  mancheNumber: number;
}

const ListeMatchs: React.FC<ListeMatchsProps> = ({ mancheNumber }) => {
  useExitAlertOnBack();

  const router = useRouter();
  const tournoi = useSelector((state: any) => state.gestionMatchs.listematchs);

  const _displayDetailForMatch = (idMatch: number) => {
    router.navigate({
      pathname: '/tournoi/match-detail',
      params: {
        idMatch: idMatch,
      },
    });
  };

  const _displayListeMatch = () => {
    let nbMatchs = 0;
    let matchs = [];
    if (tournoi !== undefined) {
      let optionsTournoi = tournoi.at(-1) as OptionsTournoiModel;
      nbMatchs = optionsTournoi.nbMatchs;
      matchs = tournoi.slice(0, -1); //On retire la config et donc seulement la liste des matchs
    }
    matchs = matchs.filter(
      (match: MatchModel) => match.manche === mancheNumber,
    ) as MatchModel[];
    const renderItem: ListRenderItem<MatchModel> = ({ item }) => (
      <MatchItem
        match={item}
        displayDetailForMatch={_displayDetailForMatch}
        manche={mancheNumber}
      />
    );

    return (
      <FlatList
        data={matchs}
        initialNumToRender={nbMatchs}
        keyExtractor={(item: MatchModel) => item.id.toString()}
        renderItem={renderItem}
      />
    );
  };

  return (
    <VStack className="flex-1 bg-custom-background">
      {_displayListeMatch()}
    </VStack>
  );
};

export default ListeMatchs;
