import { FlatList } from '@/components/ui/flat-list';
import { VStack } from '@/components/ui/vstack';
import MatchItem from '@components/MatchItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { Match } from '@/types/interfaces/match';
import { PropsFromRedux, connector } from '@/store/connector';
import { ListRenderItem } from 'react-native';
import WithExitAlert from '@/app/with-exit-alert/with-exit-alert';
import { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
  extraData: number;
}

interface State {}

class ListeMatchs extends WithExitAlert<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  _displayDetailForMatch = (
    idMatch: number,
    match: Match,
    nbPtVictoire: number,
  ) => {
    this.props.navigation.navigate({
      name: 'MatchDetailStack',
      params: {
        idMatch: idMatch,
        match: match,
        nbPtVictoire: nbPtVictoire,
      },
    });
  };

  _displayListeMatch() {
    let nbMatchs = 0;
    let matchs = [];
    let nbPtVictoire = 13;
    if (this.props.listeMatchs !== undefined) {
      let tournoi = this.props.listeMatchs; //tournoi contient les matchs + la config du tournoi en dernière position
      nbMatchs = tournoi[tournoi.length - 1].nbMatchs; //On récup nb matchs dans la config
      nbPtVictoire = tournoi[tournoi.length - 1].nbPtVictoire
        ? tournoi[tournoi.length - 1].nbPtVictoire
        : 13; //On récup le nb de pt pour la victoire sinon 13
      matchs = tournoi.slice(0, -1); //On retire la config et donc seulement la liste des matchs
    }
    matchs = matchs.filter(
      (match: Match) => match.manche === this.props.extraData,
    ) as Match[];
    const renderItem: ListRenderItem<Match> = ({ item }) => (
      <MatchItem
        match={item}
        displayDetailForMatch={this._displayDetailForMatch}
        manche={this.props.extraData}
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
  }

  render() {
    return (
      <VStack className="flex-1 bg-[#0594ae]">
        {this._displayListeMatch()}
      </VStack>
    );
  }
}

export default connector(withTranslation()(ListeMatchs));
