import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { FlatList } from '@/components/ui/flat-list';
import { HStack } from '@/components/ui/hstack';
import ListeResultatItem from '@components/ListeResultatItem';
import { ranking } from '@utils/ranking';
import { useTranslation } from 'react-i18next';
import { ListRenderItem } from 'react-native';
import { Victoire } from '@/types/interfaces/victoire';
import useExitAlertOnBack from '@/components/with-exit-alert/with-exit-alert';
import { useTournoisRepository } from '@/repositories/tournois/useTournois';
import { TournoiModel } from '@/types/interfaces/tournoi';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';

const ListeResultats = () => {
  useExitAlertOnBack();

  const { t } = useTranslation();

  const { getActualTournoi } = useTournoisRepository();

  const [tournoi, setTournoi] = useState<TournoiModel | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const resultTournoi = await getActualTournoi();
      setTournoi(resultTournoi);
    };
    fetchData();
  }, [getActualTournoi]);

  if (!tournoi) {
    return <Loading />;
  }

  const { options, matchs } = tournoi;

  const renderItem: ListRenderItem<Victoire> = ({ item }) => (
    <ListeResultatItem joueur={item} />
  );

  return (
    <VStack className="flex-1 bg-custom-background">
      <VStack className="flex-1 justify-between">
        <HStack className="flex px-2">
          <Text className="basis-2/5 text-typography-white text-lg">
            {t('place')}
          </Text>
          <Text className="basis-1/5 text-center text-typography-white text-lg">
            {t('victoire')}
          </Text>
          <Text className="basis-1/5 text-center text-typography-white text-lg">
            {t('m_j')}
          </Text>
          <Text className="basis-1/5 text-right text-typography-white text-lg">
            {t('point')}
          </Text>
        </HStack>
        <Divider className="my-0.5" />
        <FlatList
          data={ranking(matchs, options)}
          keyExtractor={(item: Victoire) => item.joueurId.toString()}
          renderItem={renderItem}
        />
      </VStack>
    </VStack>
  );
};

export default ListeResultats;
