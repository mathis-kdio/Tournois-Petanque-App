import { Box } from '@/components/ui/box';
import { FlatList } from '@/components/ui/flat-list';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import ListeJoueursItem from '@/screens/listes-joueurs/components/ListeJoueursItem';
import { useTranslation } from 'react-i18next';
import TopBarBack from '@/components/topBar/TopBarBack';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { ListRenderItem } from 'react-native';
import { ListeJoueursInfos } from '@/types/interfaces/listeJoueurs';
import { useDispatch } from 'react-redux';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useListesJoueurs } from '@/repositories/listesJoueurs/useListesJoueurs';
import Loading from '@/components/Loading';

type SearchParams = {
  loadListScreen?: string;
};

const ListesJoueurs = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { loadListScreen = 'false' } = useLocalSearchParams<SearchParams>();
  const dispatch = useDispatch();

  const { allListesJoueurs, deleteListeJoueurs, renameListeJoueurs } =
    useListesJoueurs();

  if (!allListesJoueurs) {
    return <Loading />;
  }

  const handleDelete = (id: number) => {
    deleteListeJoueurs(id);
  };

  const handleUpdateName = (id: number, name: string) => {
    renameListeJoueurs(id, name);
  };

  const addList = () => {
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

  const addListButton = () => {
    if (loadListScreen !== 'true') {
      return (
        <Button action="positive" onPress={() => addList()}>
          <ButtonText>{t('creer_liste')}</ButtonText>
        </Button>
      );
    }
  };

  const renderItem: ListRenderItem<ListeJoueursInfos> = ({ item }) => (
    <ListeJoueursItem
      listeJoueursInfos={item}
      loadListScreen={loadListScreen === 'true'}
      onDelete={handleDelete}
      onUpdateName={handleUpdateName}
    />
  );

  return (
    <VStack className="flex-1 bg-custom-background">
      <TopBarBack title={t('listes_joueurs_navigation_title')} />
      <Text className="text-typography-white text-xl text-center">
        {t('nombre_listes', { nb: allListesJoueurs.length })}
      </Text>
      <Box className="px-10">{addListButton()}</Box>
      <VStack className="flex-1 my-2">
        <FlatList
          data={allListesJoueurs}
          initialNumToRender={20}
          keyExtractor={(item: ListeJoueursInfos) => {
            return item.listId.toString();
          }}
          renderItem={renderItem}
          className="h-1"
        />
      </VStack>
    </VStack>
  );
};

export default ListesJoueurs;
