import { FlatList } from '@/components/ui/flat-list';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import ListeTerrainItem from '@components/ListeTerrainItem';
import { calcNbMatchsParTour } from '@utils/generations/generation';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Terrain } from '@/types/interfaces/terrain';
import { ListRenderItem } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '@/components/Loading';
import { screenStackNameType } from '@/types/types/searchParams';

type SearchParams = {
  screenStackName?: string;
};

const ListeTerrains = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const param = useLocalSearchParams<SearchParams>();
  const dispatch = useDispatch();

  const listesJoueurs = useSelector(
    (state: any) => state.listesJoueurs.listesJoueurs,
  );
  const listeTerrains = useSelector(
    (state: any) => state.listeTerrains.listeTerrains,
  );
  const optionsTournoi = useSelector(
    (state: any) => state.optionsTournoi.options,
  );

  const _ajoutTerrains = () => {
    const ajoutTerrain = { type: 'AJOUT_TERRAIN', value: [] };
    dispatch(ajoutTerrain);
  };

  const _ajoutTerrainButton = () => {
    return (
      <Button action="primary" onPress={() => _ajoutTerrains()}>
        <ButtonText>{t('ajouter_terrain')}</ButtonText>
      </Button>
    );
  };

  const _commencerButton = (screenStackName: screenStackNameType) => {
    const { typeEquipes, mode, typeTournoi, complement } = optionsTournoi;
    const nbJoueurs = listesJoueurs[mode].length;
    const nbTerrainsNecessaires = calcNbMatchsParTour(
      nbJoueurs,
      typeEquipes,
      mode,
      typeTournoi,
      complement,
    );
    const disabled = listeTerrains.length < nbTerrainsNecessaires;
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

  const renderItem: ListRenderItem<Terrain> = ({ item }) => (
    <ListeTerrainItem terrain={item} />
  );

  if (
    param.screenStackName !== 'inscriptions-avec-noms' &&
    param.screenStackName !== 'inscriptions-sans-noms'
  ) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-custom-background">
        <TopBarBack title={t('liste_terrains_navigation_title')} />
        <Text className="text-typography-white text-xl text-center">
          {t('nombre_terrains', { nb: listeTerrains.length })}
        </Text>
        <VStack className="flex-1 my-2">
          <FlatList
            persistentScrollbar={true}
            data={listeTerrains}
            initialNumToRender={20}
            keyExtractor={(item: Terrain) => item.id.toString()}
            renderItem={renderItem}
            className="h-1"
          />
        </VStack>
        <VStack space="lg" className="px-10">
          {_ajoutTerrainButton()}
          {_commencerButton(param.screenStackName)}
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default ListeTerrains;
