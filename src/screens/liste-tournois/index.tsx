import { FlatList } from '@/components/ui/flat-list';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTranslation } from 'react-i18next';
import TopBarBack from '@/components/topBar/TopBarBack';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { ListRenderItem } from 'react-native';
import { useState } from 'react';
import { useTournoisV2 } from '@/repositories/tournois/useTournois';
import ListeTournoiItem from './components/ListeTournoiItem';
import ModalInfosTournoi from './components/ModalInfosTournoi';

export default function ListeTournois() {
  const { t } = useTranslation();

  const [modalTournoiInfosIsOpen, setModalTournoiInfosIsOpen] = useState(false);

  const [infosTournoi, setInfosTournoi] = useState<TournoiModel | undefined>(
    undefined,
  );
  const { listeTournois, actualTournoi, deleteTournoi, renameTournoi } =
    useTournoisV2();

  const handleDelete = (id: number) => {
    deleteTournoi(id);
  };

  const handleUpdateName = (id: number, name: string) => {
    renameTournoi(id, name);
  };

  const showModalInfos = (tournoi: TournoiModel) => {
    setModalTournoiInfosIsOpen(true);
    setInfosTournoi(tournoi);
  };

  const modalTournoiInfos = () => {
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
        showModalInfos={showModalInfos}
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
      {modalTournoiInfos()}
    </VStack>
  );
}
