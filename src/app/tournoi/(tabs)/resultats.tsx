import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { FlatList } from '@/components/ui/flat-list';
import { HStack } from '@/components/ui/hstack';
import ListeResultatItem from '@components/ListeResultatItem';
import { ranking } from '@utils/ranking';
import { useTranslation } from 'react-i18next';
import { ListRenderItem } from 'react-native';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';
import { Victoire } from '@/types/interfaces/victoire';
import { useSelector } from 'react-redux';
import { Match } from '@/types/interfaces/match';
import useExitAlertOnBack from '@/components/with-exit-alert/with-exit-alert';

const ListeResultats = () => {
  useExitAlertOnBack();

  const { t } = useTranslation();
  const tournoi = useSelector((state: any) => state.gestionMatchs.listematchs);

  const listeMatchs = tournoi.slice(0, -1) as Match[];
  const optionsTournois = tournoi.at(-1) as OptionsTournoi;

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
          data={ranking(listeMatchs, optionsTournois)}
          keyExtractor={(item: Victoire) => item.joueurId.toString()}
          renderItem={renderItem}
        />
      </VStack>
    </VStack>
  );
};

export default ListeResultats;
