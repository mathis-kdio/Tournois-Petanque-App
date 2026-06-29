import Loading from '@/components/Loading';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useJoueursPreparationTournois } from '@/repositories/joueursPreparationTournois/useJoueursPreparationTournois';
import { usePreparationTournoi } from '@/repositories/preparationTournoi/usePreparationTournoi';
import { insertTerrain } from '@/repositories/terrainsPreparationTournois/terrainsPreparationTournoisActions';
import { useTerrainsPreparationTournois } from '@/repositories/terrainsPreparationTournois/useTerrainsPreparationTournois';
import ListeTerrainItem from '@/screens/liste-terrains/components/ListeTerrainItem';
import { TerrainModel } from '@/types/interfaces/terrainModel';
import { screenStackNameType } from '@/types/types/searchParams';
import {
  LegendList,
  LegendListRenderItemProps,
} from '@legendapp/list/react-native';
import { useTranslation } from 'react-i18next';
import StartButton from './components/StartButton';

export interface Props {
  screenStackName: screenStackNameType;
}

const renderItem = ({
  item,
  index,
}: LegendListRenderItemProps<TerrainModel>) => (
  <ListeTerrainItem index={index + 1} terrain={item} />
);

const ListeTerrains: React.FC<Props> = ({ screenStackName }) => {
  const { t } = useTranslation();

  const { preparationTournoi } = usePreparationTournoi();
  const { joueursPreparationTournois } = useJoueursPreparationTournois();
  const { terrains } = useTerrainsPreparationTournois();

  if (!preparationTournoi || !joueursPreparationTournois || !terrains) {
    return <Loading />;
  }

  const ajoutTerrain = async () => {
    await insertTerrain(`Terrain ${terrains.length + 1}`);
  };

  return (
    <VStack className="flex-1 bg-custom-background">
      <TopBarBack title={t('liste_terrains_navigation_title')} />
      <Text className="text-typography-white text-xl text-center">
        {t('nombre_terrains', { nb: terrains.length })}
      </Text>
      <LegendList
        data={terrains}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        className="flex-1 h-1"
        getItemType={() => 'ListeTerrainItem'}
        recycleItems
      />
      <VStack space="lg" className="px-10">
        <Button action="primary" onPress={() => ajoutTerrain()}>
          <ButtonText>{t('ajouter_terrain')}</ButtonText>
        </Button>
        <StartButton
          screenStackName={screenStackName}
          joueursModel={joueursPreparationTournois}
          terrainsModel={terrains}
          preparationTournoiModel={preparationTournoi}
        />
      </VStack>
    </VStack>
  );
};

export default ListeTerrains;
