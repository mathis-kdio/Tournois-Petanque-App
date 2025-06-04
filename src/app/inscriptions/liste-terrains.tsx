import { FlatList } from '@/components/ui/flat-list';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import ListeTerrainItem from '@components/ListeTerrainItem';
import { calcNbMatchsParTour } from '@utils/generations/generation';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { StackNavigationProp } from '@react-navigation/stack';
import { Terrain } from '@/types/interfaces/terrain';
import { ListRenderItem } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

type ListeTerrainsRouteProp = {
  params: {
    screenStackName: string;
  };
};

const ListeTerrains = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any, any>>();
  const route = useRoute<ListeTerrainsRouteProp>();
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

  const _commencerButton = () => {
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
        onPress={() => _commencer()}
      >
        <ButtonText>{title}</ButtonText>
      </Button>
    );
  };

  const _commencer = () => {
    navigation.navigate({
      name: 'GenerationMatchs',
      params: {
        screenStackName: route.params.screenStackName,
      },
    });
  };

  const renderItem: ListRenderItem<Terrain> = ({ item }) => (
    <ListeTerrainItem terrain={item} />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-[#0594ae]">
        <TopBarBack title={t('liste_terrains_navigation_title')} />
        <Text className="text-white text-xl text-center">
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
          {_commencerButton()}
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default ListeTerrains;
