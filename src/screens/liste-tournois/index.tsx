import TopBarBack from '@/components/topBar/TopBarBack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { getJoueursTournoi } from '@/repositories/tournois/tournoisActions';
import { useListeTournois } from '@/repositories/tournois/useListeTournois';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { TournoiModel } from '@/types/interfaces/tournoi';
import {
  LegendList,
  LegendListRenderItemProps,
} from '@legendapp/list/react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ListeTournoiItem from './components/ListeTournoiItem';
import ModalInfosTournoi from './components/ModalInfosTournoi';

export default function ListeTournois() {
  const { t } = useTranslation();

  const [modalTournoiInfosIsOpen, setModalTournoiInfosIsOpen] = useState(false);

  const [infosTournoi, setInfosTournoi] = useState<TournoiModel | undefined>(
    undefined,
  );
  const [listeJoueurs, setListeJoueurs] = useState<JoueurModel[]>([]);

  const { listeTournois } = useListeTournois();

  const showModalInfos = async (tournoi: TournoiModel) => {
    setModalTournoiInfosIsOpen(true);
    setInfosTournoi(tournoi);
    const joueurs = await getJoueursTournoi(tournoi.tournoiId);
    setListeJoueurs(joueurs);
  };

  const renderItem = ({ item }: LegendListRenderItemProps<TournoiModel>) => (
    <ListeTournoiItem tournoi={item} showModalInfos={showModalInfos} />
  );

  return (
    <VStack className="flex-1 bg-custom-background">
      <TopBarBack title={t('choix_tournoi_navigation_title')} />
      <Text className="text-typography-white text-xl text-center px-10">
        {t('nombre_tournois', { nb: listeTournois.length })}
      </Text>
      <LegendList
        data={listeTournois}
        keyExtractor={(item) => item.tournoiId.toString()}
        renderItem={renderItem}
        className="flex-1 h-1"
        getItemType={() => 'ListeTournoiItem'}
        recycleItems
      />
      {modalTournoiInfosIsOpen && infosTournoi && listeJoueurs && (
        <ModalInfosTournoi
          infosTournoi={infosTournoi}
          listeJoueurs={listeJoueurs}
          modalTournoiInfosIsOpen={modalTournoiInfosIsOpen}
          setModalTournoiInfosIsOpen={setModalTournoiInfosIsOpen}
        />
      )}
    </VStack>
  );
}
