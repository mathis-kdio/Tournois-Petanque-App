import { FlatList } from '@/components/ui/flat-list';
import { VStack } from '@/components/ui/vstack';
import MatchItem from '@components/MatchItem';
import { Match } from '@/types/interfaces/match';
import { ListRenderItem } from 'react-native';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import useExitAlertOnBack from '@/app/with-exit-alert/with-exit-alert';

interface ListeMatchsProps {
  mancheNumber: number;
}

const ListeMatchs: React.FC<ListeMatchsProps> = ({ mancheNumber }) => {
  useExitAlertOnBack();

  console.log('mancheNumber', mancheNumber);

  const navigation = useNavigation<StackNavigationProp<any, any>>();
  const tournoi = useSelector((state: any) => state.gestionMatchs.listematchs);

  const _displayDetailForMatch = (
    idMatch: number,
    match: Match,
    nbPtVictoire: number,
  ) => {
    navigation.navigate({
      name: 'MatchDetailStack',
      params: {
        idMatch: idMatch,
        match: match,
        nbPtVictoire: nbPtVictoire,
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
    <VStack className="flex-1 bg-[#0594ae]">{_displayListeMatch()}</VStack>
  );
};

export default ListeMatchs;
