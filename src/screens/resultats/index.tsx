import Loading from '@/components/Loading';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useActualTournoi } from '@/repositories/tournois/useActualTournoi';
import { useJoueursActualTournoi } from '@/repositories/tournois/useJoueursActualTournoi';
import ListeResultatItem from '@/screens/resultats/components/ListeResultatItem';
import { Victoire } from '@/types/interfaces/victoire';
import {
  LegendList,
  LegendListRenderItemProps,
} from '@legendapp/list/react-native';
import { ranking } from '@utils/ranking';
import { useTranslation } from 'react-i18next';

const ListeResultats = () => {
  const { t } = useTranslation();

  const { actualTournoi } = useActualTournoi();
  const { joueursTournoi } = useJoueursActualTournoi();

  if (!actualTournoi || !joueursTournoi) {
    return <Loading />;
  }

  const { options, matchs } = actualTournoi;

  const renderItem = ({ item }: LegendListRenderItemProps<Victoire>) => (
    <ListeResultatItem victoire={item} matchs={matchs} options={options} />
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
        <LegendList
          data={ranking(matchs, joueursTournoi, options)}
          keyExtractor={(item) => item.joueur.uniqueBDDId.toString()}
          renderItem={renderItem}
          className="flex-1"
          getItemType={() => 'ListeResultatItem'}
          recycleItems
        />
      </VStack>
    </VStack>
  );
};

export default ListeResultats;
