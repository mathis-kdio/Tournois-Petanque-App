import TopBarBack from '@/components/topBar/TopBarBack';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { FlatList } from '@/components/ui/flat-list';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useListesJoueurs } from '@/repositories/listesJoueurs/useListesJoueurs';
import ListeJoueursItem from '@/screens/listes-joueurs/components/ListeJoueursItem';
import { ListeJoueursInfos } from '@/types/interfaces/listeJoueurs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ListRenderItem } from 'react-native';

type SearchParams = {
  loadListScreen?: string;
};

const ListesJoueurs = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { loadListScreen = 'false' } = useLocalSearchParams<SearchParams>();

  const {
    allListesJoueurs,
    deleteListeJoueurs,
    renameListeJoueurs,
    insertListeJoueurs,
  } = useListesJoueurs();

  const handleDelete = async (id: number) => {
    await deleteListeJoueurs(id);
  };

  const handleUpdateName = async (id: number, name: string) => {
    await renameListeJoueurs(id, name);
  };

  const addList = async () => {
    const listeJoueurs = await insertListeJoueurs();
    router.navigate({
      pathname: '/listes-joueurs/create-liste-joueurs',
      params: {
        type: 'create',
        listId: listeJoueurs.id,
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
