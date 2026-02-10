import Loading from '@/components/Loading';
import TopBarBack from '@/components/topBar/TopBarBack';
import { FlatList } from '@/components/ui/flat-list';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTournois } from '@/repositories/tournois/useTournois';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItem } from 'react-native';
import ListeTournoiItem from './components/ListeTournoiItem';
import ModalInfosTournoi from './components/ModalInfosTournoi';

export default function ListeTournois() {
  const { t } = useTranslation();

  const [modalTournoiInfosIsOpen, setModalTournoiInfosIsOpen] = useState(false);

  const [infosTournoi, setInfosTournoi] = useState<TournoiModel | undefined>(
    undefined,
  );
  const { listeTournois, actualTournoi, joueursTournoi } = useTournois();

  if (!listeTournois) {
    return <Loading />;
  }

  const showModalInfos = (tournoi: TournoiModel) => {
    setModalTournoiInfosIsOpen(true);
    setInfosTournoi(tournoi);
  };

  const modalTournoiInfos = () => {
    if (!infosTournoi || !joueursTournoi) {
      return;
    }
    return (
      <ModalInfosTournoi
        infosTournoi={infosTournoi}
        listeJoueurs={joueursTournoi}
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
