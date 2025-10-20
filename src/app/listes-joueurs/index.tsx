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
import { ListeJoueursInfos } from '@/types/interfaces/listeJoueurs';
import { useDispatch } from 'react-redux';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getAllListesJoueurs } from '@/repositories/listesJoueursRepository';

type SearchParams = {
  loadListScreen?: string;
};

const ListesJoueurs = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { loadListScreen = 'false' } = useLocalSearchParams<SearchParams>();
  const dispatch = useDispatch();

  const [listesJoueurs, setListesJoueurs] = useState<ListeJoueursInfos[]>([]);

  useEffect(() => {
    const fetchListesJoueurs = async () => {
      setListesJoueurs(await getAllListesJoueurs());
    };

    fetchListesJoueurs();
  }, []);

  console.log(listesJoueurs);

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

  const renderItem: ListRenderItem<ListeJoueursInfos> = ({ item }) => (
    <ListeJoueursItem
      listeJoueursInfos={item}
      loadListScreen={loadListScreen === 'true'}
    />
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-custom-background">
        <TopBarBack title={t('listes_joueurs_navigation_title')} />
        <Text className="text-typography-white text-xl text-center">
          {t('nombre_listes', { nb: listesJoueurs.length })}
        </Text>
        <Box className="px-10">{_addListButton()}</Box>
        <VStack className="flex-1 my-2">
          <FlatList
            data={listesJoueurs}
            initialNumToRender={20}
            keyExtractor={(item: ListeJoueursInfos) => {
              return item.listId.toString();
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
