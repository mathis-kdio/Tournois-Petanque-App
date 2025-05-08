import { Box } from '@/components/ui/box';
import { FlatList } from '@/components/ui/flat-list';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import ListeJoueursItem from '@components/ListeJoueursItem';
import { withTranslation } from 'react-i18next';
import TopBarBack from '@/components/topBar/TopBarBack';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { PropsFromRedux, connector } from '@/store/connector';
import { GeneralStackParamList } from '@/navigation/Navigation';
import { RouteProp } from '@react-navigation/native';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { ListRenderItem } from 'react-native';
import {
  ListeJoueursInfos,
  ListeJoueurs as ListeJoueursInterface,
} from '@/types/interfaces/listeJoueurs';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
  route: RouteProp<GeneralStackParamList, 'ListesJoueurs'>;
}

interface State {}

class ListesJoueurs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  _addList() {
    const actionRemoveList = {
      type: 'SUPPR_ALL_JOUEURS',
      value: [ModeTournoi.SAUVEGARDE],
    };
    this.props.dispatch(actionRemoveList);
    //Sera utilisé par le component inscription
    const updateOptionTypeTournoi = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['typeTournoi', TypeTournoi.MELEDEMELE],
    };
    this.props.dispatch(updateOptionTypeTournoi);
    const updateOptionEquipesTournoi = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['typeEquipes', TypeEquipes.TETEATETE],
    };
    this.props.dispatch(updateOptionEquipesTournoi);
    const updateOptionModeTournoi = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['mode', ModeTournoi.SAUVEGARDE],
    };
    this.props.dispatch(updateOptionModeTournoi);

    this.props.navigation.navigate({
      name: 'CreateListeJoueurs',
      params: { type: 'create' },
    });
  }

  _addListButton() {
    const { t } = this.props;
    if (
      this.props.route.params === undefined ||
      this.props.route.params.loadListScreen !== true
    ) {
      return (
        <Button action="positive" onPress={() => this._addList()}>
          <ButtonText>{t('creer_liste')}</ButtonText>
        </Button>
      );
    }
  }

  render() {
    const { t } = this.props;
    let nbLists = 0;
    if (this.props.savedLists) {
      nbLists += this.props.savedLists.avecEquipes.length;
      nbLists += this.props.savedLists.avecNoms.length;
      nbLists += this.props.savedLists.sansNoms.length;
    }
    const renderItem: ListRenderItem<ListeJoueursInterface> = ({ item }) => (
      <ListeJoueursItem
        list={item}
        navigation={this.props.navigation}
        route={this.props.route}
      />
    );
    return (
      <VStack className="flex-1 bg-[#0594ae]">
        <TopBarBack
          title={t('listes_joueurs_navigation_title')}
          navigation={this.props.navigation}
        />
        <Text className="text-white text-xl text-center">
          {t('nombre_listes', { nb: nbLists })}
        </Text>
        <Box className="px-10">{this._addListButton()}</Box>
        <VStack className="flex-1 my-2">
          <FlatList
            data={this.props.savedLists.avecNoms}
            initialNumToRender={20}
            keyExtractor={(item: ListeJoueursInterface) => {
              let listeJoueursInfos = item[
                item.length - 1
              ] as ListeJoueursInfos;
              return listeJoueursInfos.listId.toString();
            }}
            renderItem={renderItem}
            className="h-1"
          />
        </VStack>
      </VStack>
    );
  }
}

export default connector(withTranslation()(ListesJoueurs));
