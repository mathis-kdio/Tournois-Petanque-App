import { FlatList } from '@/components/ui/flat-list';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import ListeTerrainItem from '@/screens/liste-terrains/components/ListeTerrainItem';
import TopBarBack from '@/components/topBar/TopBarBack';
import { TerrainModel } from '@/types/interfaces/terrainModel';
import { ListRenderItem } from 'react-native';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/Loading';
import { screenStackNameType } from '@/types/types/searchParams';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { useEffect, useState } from 'react';
import { usePreparationTournoi } from '@/repositories/preparationTournoi/usePreparationTournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useTerrains } from '@/repositories/terrains/useterrainsRepository';
import StartButton from './components/StartButton';

export interface Props {
  screenStackName: screenStackNameType;
}

const ListeTerrains: React.FC<Props> = ({ screenStackName }) => {
  const { t } = useTranslation();

  const { getActualPreparationTournoi } = usePreparationTournoi();
  const { insertTerrain } = useTerrains();

  const [preparationTournoiModel, setPreparationTournoiModel] = useState<
    PreparationTournoiModel | undefined
  >(undefined);
  const [joueursModel, setJoueursModel] = useState<JoueurModel[] | undefined>(
    undefined,
  );
  const [terrainsModel, setTerrainsModel] = useState<
    TerrainModel[] | undefined
  >(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const resultpreparationTournoi = await getActualPreparationTournoi();
      setPreparationTournoiModel(resultpreparationTournoi);
    };
    fetchData();
  }, [getActualPreparationTournoi]);

  if (!preparationTournoiModel || !joueursModel || !terrainsModel) {
    return <Loading />;
  }

  const ajoutTerrains = () => {
    const terrainModel: TerrainModel = { id: 0, name: '' };
    insertTerrain(terrainModel);
  };

  const renderItem: ListRenderItem<TerrainModel> = ({ item }) => (
    <ListeTerrainItem terrain={item} />
  );

  return (
    <VStack className="flex-1 bg-custom-background">
      <TopBarBack title={t('liste_terrains_navigation_title')} />
      <Text className="text-typography-white text-xl text-center">
        {t('nombre_terrains', { nb: terrainsModel.length })}
      </Text>
      <VStack className="flex-1 my-2">
        <FlatList
          persistentScrollbar={true}
          data={terrainsModel}
          initialNumToRender={20}
          keyExtractor={(item: TerrainModel) => item.id.toString()}
          renderItem={renderItem}
          className="h-1"
        />
      </VStack>
      <VStack space="lg" className="px-10">
        <Button action="primary" onPress={() => ajoutTerrains()}>
          <ButtonText>{t('ajouter_terrain')}</ButtonText>
        </Button>
        <StartButton
          screenStackName={screenStackName}
          joueursModel={joueursModel}
          terrainsModel={terrainsModel}
          preparationTournoiModel={preparationTournoiModel}
        />
      </VStack>
    </VStack>
  );
};

export default ListeTerrains;
