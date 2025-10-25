import { FlatList } from '@/components/ui/flat-list';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import ListeTerrainItem from '@components/ListeTerrainItem';
import { calcNbMatchsParTour } from '@utils/generations/generation';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { TerrainModel } from '@/types/interfaces/terrainModel';
import { ListRenderItem } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '@/components/Loading';
import { screenStackNameType } from '@/types/types/searchParams';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { useEffect, useState } from 'react';
import { usePreparationTournoisRepository } from '@/repositories/preparationTournoi/usePreparationTournoiRepository';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { useTerrainsRepository } from '@/repositories/terrains/useterrainsRepository';

type SearchParams = {
  screenStackName?: string;
};

const ListeTerrains = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const param = useLocalSearchParams<SearchParams>();

  const { getActualPreparationTournoi } = usePreparationTournoisRepository();
  const { insertTerrain } = useTerrainsRepository();

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

  const _ajoutTerrains = () => {
    const terrainModel: TerrainModel = { id: 0, name: '' };
    insertTerrain(terrainModel);
  };

  const _ajoutTerrainButton = () => {
    return (
      <Button action="primary" onPress={() => _ajoutTerrains()}>
        <ButtonText>{t('ajouter_terrain')}</ButtonText>
      </Button>
    );
  };

  const _commencerButton = (
    screenStackName: screenStackNameType,
    preparationTournoiModel: PreparationTournoiModel,
    joueursModel: JoueurModel[],
    terrainsModel: TerrainModel[],
  ) => {
    const { typeEquipes, mode, typeTournoi, complement } =
      preparationTournoiModel;
    if (!typeEquipes || !mode || !typeTournoi || !complement) {
      throw Error;
    }
    const nbJoueurs = joueursModel.length;
    const nbTerrainsNecessaires = calcNbMatchsParTour(
      nbJoueurs,
      typeEquipes,
      mode,
      typeTournoi,
      complement,
    );
    const disabled = terrainsModel.length < nbTerrainsNecessaires;
    const title = disabled ? t('terrains_insuffisants') : t('commencer');
    return (
      <Button
        isDisabled={disabled}
        action="positive"
        onPress={() => _commencer(screenStackName)}
      >
        <ButtonText>{title}</ButtonText>
      </Button>
    );
  };

  const _commencer = (screenStackName: screenStackNameType) => {
    router.navigate({
      pathname: '/inscriptions/generation-matchs',
      params: {
        screenStackName: screenStackName,
      },
    });
  };

  const renderItem: ListRenderItem<TerrainModel> = ({ item }) => (
    <ListeTerrainItem terrain={item} />
  );

  const { screenStackName } = param;
  if (
    screenStackName !== 'inscriptions-avec-noms' &&
    screenStackName !== 'inscriptions-sans-noms'
  ) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          {_ajoutTerrainButton()}
          {_commencerButton(
            screenStackName,
            preparationTournoiModel,
            joueursModel,
            terrainsModel,
          )}
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default ListeTerrains;
