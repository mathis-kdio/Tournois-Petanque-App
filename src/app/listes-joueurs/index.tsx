import { Box } from '@/components/ui/box';
import { FlatList } from '@/components/ui/flat-list';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import ListeJoueursItem from '@components/ListeJoueursItem';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { ListRenderItem } from 'react-native';
import {
  ListeJoueursInfos,
  ListeJoueurs as ListeJoueursInterface,
} from '@/types/interfaces/listeJoueurs';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalSearchParams, useRouter } from 'expo-router';

type SearchParams = {
  loadListScreen?: string;
};

const ListesJoueurs = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { loadListScreen = 'false' } = useLocalSearchParams<SearchParams>();
  const dispatch = useDispatch();

  const savedLists = useSelector(
    (state: any) => state.listesJoueurs.listesSauvegarde,
  );

  const _addList = () => {
    const actionRemoveList = {
      type: 'SUPPR_ALL_JOUEURS',
      value: [ModeTournoi.SAUVEGARDE],
    };
    dispatch(actionRemoveList);
    //Sera utilisé par le component inscription
    const updateOptionTypeTournoi = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['typeTournoi', TypeTournoi.MELEDEMELE],
    };
    dispatch(updateOptionTypeTournoi);
    const updateOptionEquipesTournoi = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['typeEquipes', TypeEquipes.TETEATETE],
    };
    dispatch(updateOptionEquipesTournoi);
    const updateOptionModeTournoi = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['mode', ModeTournoi.SAUVEGARDE],
    };
    dispatch(updateOptionModeTournoi);

    router.navigate({
      pathname: '/listes-joueurs/create-liste-joueurs',
      params: {
        type: 'create',
      },
    });
  };

  const _addListButton = () => {
    if (loadListScreen !== 'true') {
      return (
        <Button action="positive" onPress={() => _addList()}>
          <ButtonText>{t('creer_liste')}</ButtonText>
        </Button>
      );
    }
  };

  let nbLists = 0;
  if (savedLists) {
    nbLists += savedLists.avecEquipes.length;
    nbLists += savedLists.avecNoms.length;
    nbLists += savedLists.sansNoms.length;
  }
  const renderItem: ListRenderItem<ListeJoueursInterface> = ({ item }) => (
    <ListeJoueursItem list={item} loadListScreen={loadListScreen === 'true'} />
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-[#0594ae]">
        <TopBarBack title={t('listes_joueurs_navigation_title')} />
        <Text className="text-white text-xl text-center">
          {t('nombre_listes', { nb: nbLists })}
        </Text>
        <Box className="px-10">{_addListButton()}</Box>
        <VStack className="flex-1 my-2">
          <FlatList
            data={savedLists.avecNoms}
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
    </SafeAreaView>
  );
};

export default ListesJoueurs;
