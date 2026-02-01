import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { FlatList } from '@/components/ui/flat-list';
import { HStack } from '@/components/ui/hstack';
import ListeResultatItem from '@/screens/resultats/components/ListeResultatItem';
import { ranking } from '@utils/ranking';
import { useTranslation } from 'react-i18next';
import { ListRenderItem } from 'react-native';
import { Victoire } from '@/types/interfaces/victoire';
import { useTournoisV2 } from '@/repositories/tournois/useTournois';
import Loading from '@/components/Loading';

const ListeResultats = () => {
  const { t } = useTranslation();

  const { actualTournoi } = useTournoisV2();

  if (!actualTournoi) {
    return <Loading />;
  }

  const { options, matchs } = actualTournoi;

  const renderItem: ListRenderItem<Victoire> = ({ item }) => (
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
        <FlatList
          data={ranking(matchs, options)}
          keyExtractor={(item) => item.joueur.id.toString()}
          renderItem={renderItem}
        />
      </VStack>
    </VStack>
  );
};

export default ListeResultats;
