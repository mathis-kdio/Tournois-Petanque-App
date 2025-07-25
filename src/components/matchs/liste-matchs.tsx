import { FlatList } from '@/components/ui/flat-list';
import { VStack } from '@/components/ui/vstack';
import MatchItem from '@components/MatchItem';
import { Match } from '@/types/interfaces/match';
import { ListRenderItem } from 'react-native';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
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
    let nbPtVictoire = 13;
    if (tournoi !== undefined) {
      let optionsTournoi = tournoi.at(-1) as OptionsTournoi;
      nbMatchs = optionsTournoi.nbMatchs;
      nbPtVictoire = optionsTournoi.nbPtVictoire
        ? optionsTournoi.nbPtVictoire
        : 13;
      matchs = tournoi.slice(0, -1); //On retire la config et donc seulement la liste des matchs
    }
    matchs = matchs.filter(
      (match: Match) => match.manche === mancheNumber,
    ) as Match[];
    const renderItem: ListRenderItem<Match> = ({ item }) => (
      <MatchItem
        match={item}
        displayDetailForMatch={_displayDetailForMatch}
        manche={mancheNumber}
        nbPtVictoire={nbPtVictoire}
      />
    );

    return (
      <FlatList
        data={matchs}
        initialNumToRender={nbMatchs}
        keyExtractor={(item: Match) => item.id.toString()}
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
