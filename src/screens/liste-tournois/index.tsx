import { FlatList } from '@/components/ui/flat-list';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTranslation } from 'react-i18next';
import TopBarBack from '@/components/topBar/TopBarBack';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { ListRenderItem } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useTournois } from '@/repositories/tournois/useTournois';
import Loading from '@/components/Loading';
import ListeTournoiItem from './components/ListeTournoiItem';
import ModalInfosTournoi from './components/ModalInfosTournoi';

export default function ListeTournois() {
  const { t } = useTranslation();

  const { getAllTournois, getActualTournoi, deleteTournoi, renameTournoi } =
    useTournois();

  const [modalTournoiInfosIsOpen, setModalTournoiInfosIsOpen] = useState(false);

  const [infosTournoi, setInfosTournoi] = useState<TournoiModel | undefined>(
    undefined,
  );
  const [listeTournois, setListeTournois] = useState<TournoiModel[]>([]);
  const [actualTournoi, setActualTournoi] = useState<TournoiModel | undefined>(
    undefined,
  );
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllTournois();
      setListeTournois(result);
      const resulta = await getActualTournoi();
      setActualTournoi(resulta);
      setloading(false);
    };
    fetchData();
  }, [getActualTournoi, getAllTournois]);

  const handleDelete = useCallback(
    async (id: number) => {
      await deleteTournoi(id);
      setListeTournois((prev) => prev.filter((u) => u.tournoiId !== id));
    },
    [deleteTournoi],
  );

  const handleUpdateName = useCallback(
    async (id: number, name: string) => {
      await renameTournoi(id, name);
      setListeTournois((prev) =>
        prev.map((u) => (u.tournoiId === id ? { ...u, name: name } : u)),
      );
    },
    [renameTournoi],
  );

  if (loading) {
    return <Loading />;
  }

  const showModalInfos = (tournoi: TournoiModel) => {
    setModalTournoiInfosIsOpen(true);
    setInfosTournoi(tournoi);
  };

  const _modalTournoiInfos = () => {
    if (!infosTournoi) {
      return;
    }
    return (
      <ModalInfosTournoi
        infosTournoi={infosTournoi}
        modalTournoiInfosIsOpen={modalTournoiInfosIsOpen}
        setModalTournoiInfosIsOpen={setModalTournoiInfosIsOpen}
      />
    );
  };

  const renderItem: ListRenderItem<TournoiModel> = ({ item }) => {
    const estTournoiActuel = actualTournoi
      ? item.tournoiId === actualTournoi.tournoiId
      : false;
    return (
      <ListeTournoiItem
        tournoi={item}
        estTournoiActuel={estTournoiActuel}
        showModalInfos={(tournoi: TournoiModel) => showModalInfos(tournoi)}
        onDelete={handleDelete}
        onUpdateName={handleUpdateName}
      />
    );
  };

  return (
    <VStack className="flex-1 bg-custom-background">
      <TopBarBack title={t('choix_tournoi_navigation_title')} />
      <Text className="text-typography-white text-xl text-center px-10">
        {t('nombre_tournois', { nb: listeTournois.length })}
      </Text>
      <VStack className="flex-1 my-2">
        <FlatList
          data={listeTournois}
          initialNumToRender={20}
          keyExtractor={(item: TournoiModel) => item.tournoiId.toString()}
          renderItem={renderItem}
          className="h-1"
        />
      </VStack>
      {_modalTournoiInfos()}
    </VStack>
  );
}
