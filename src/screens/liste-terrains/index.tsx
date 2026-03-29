import Loading from '@/components/Loading';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Button, ButtonText } from '@/components/ui/button';
import { FlatList } from '@/components/ui/flat-list';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useJoueursPreparationTournois } from '@/repositories/joueursPreparationTournois/useJoueursPreparationTournois';
import { usePreparationTournoi } from '@/repositories/preparationTournoi/usePreparationTournoi';
import { useTerrainsPreparationTournois } from '@/repositories/terrainsPreparationTournois/useTerrainsPreparationTournois';
import ListeTerrainItem from '@/screens/liste-terrains/components/ListeTerrainItem';
import { TerrainModel } from '@/types/interfaces/terrainModel';
import { screenStackNameType } from '@/types/types/searchParams';
import { useTranslation } from 'react-i18next';
import { ListRenderItem } from 'react-native';
import StartButton from './components/StartButton';

export interface Props {
  screenStackName: screenStackNameType;
}

const ListeTerrains: React.FC<Props> = ({ screenStackName }) => {
  const { t } = useTranslation();

  const { preparationTournoiVM } = usePreparationTournoi();
  const { joueurs } = useJoueursPreparationTournois();
  const { terrains, insertTerrain } = useTerrainsPreparationTournois();

  if (!preparationTournoiVM || !joueurs || !terrains) {
    return <Loading />;
  }

  const ajoutTerrain = async () => {
    await insertTerrain('');
  };

  const renderItem: ListRenderItem<TerrainModel> = ({ item }) => (
    <ListeTerrainItem terrain={item} />
  );

  return (
    <VStack className="flex-1 bg-custom-background">
      <TopBarBack title={t('liste_terrains_navigation_title')} />
      <Text className="text-typography-white text-xl text-center">
        {t('nombre_terrains', { nb: terrains.length })}
      </Text>
      <VStack className="flex-1 my-2">
        <FlatList
          persistentScrollbar={true}
          data={terrains}
          initialNumToRender={20}
          keyExtractor={(item: TerrainModel) => item.id.toString()}
          renderItem={renderItem}
          className="h-1"
        />
      </VStack>
      <VStack space="lg" className="px-10">
        <Button action="primary" onPress={() => ajoutTerrain()}>
          <ButtonText>{t('ajouter_terrain')}</ButtonText>
        </Button>
        <StartButton
          screenStackName={screenStackName}
          joueursModel={joueurs}
          terrainsModel={terrains}
          preparationTournoiModel={preparationTournoiVM}
        />
      </VStack>
    </VStack>
  );
};

export default ListeTerrains;
