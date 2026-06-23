import TopBarBack from '@/components/topBar/TopBarBack';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useListesJoueurs } from '@/repositories/listesJoueurs/useListesJoueurs';
import ListeJoueursItem from '@/screens/listes-joueurs/components/ListeJoueursItem';
import { ListeJoueursInfos } from '@/types/interfaces/listeJoueurs';
import {
  LegendList,
  LegendListRenderItemProps,
} from '@legendapp/list/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

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

  const renderItem = ({
    item,
  }: LegendListRenderItemProps<ListeJoueursInfos>) => (
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
      <LegendList
        data={allListesJoueurs}
        keyExtractor={(item) => item.listId.toString()}
        renderItem={renderItem}
        className="flex-1 h-1"
        getItemType={() => 'ListeJoueursItem'}
        recycleItems
      />
    </VStack>
  );
};

export default ListesJoueurs;
