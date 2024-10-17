import { FlatList } from '@/components/ui/flat-list';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import ListeTerrainItem from '@components/ListeTerrainItem';
import { calcNbMatchsParTour } from '@utils/generations/generation';
import { withTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@components/TopBarBack';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { PropsFromRedux, connector } from '@/store/connector';
import { Terrain } from '@/types/interfaces/terrain';
import { ListRenderItem } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { InscriptionStackParamList } from '@/navigation/Navigation';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
  route: RouteProp<InscriptionStackParamList, 'ListeTerrains'>;
}

interface State {}

class ListeTerrains extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  _ajoutTerrains() {
    const ajoutTerrain = { type: 'AJOUT_TERRAIN', value: [] };
    this.props.dispatch(ajoutTerrain);
  }

  _ajoutTerrainButton() {
    const { t } = this.props;
    return (
      <Button action="primary" onPress={() => this._ajoutTerrains()}>
        <ButtonText>{t('ajouter_terrain')}</ButtonText>
      </Button>
    );
  }

  _commencerButton() {
    const { t } = this.props;
    const { typeEquipes, mode, typeTournoi, complement } =
      this.props.optionsTournoi;
    const { listesJoueurs, listeTerrains } = this.props;
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
        onPress={() => this._commencer()}
      >
        <ButtonText>{title}</ButtonText>
      </Button>
    );
  }

  _commencer() {
    this.props.navigation.navigate({
      name: 'GenerationMatchs',
      params: {
        screenStackName: this.props.route.params.screenStackName,
      },
    });
  }

  render() {
    const { t } = this.props;

    const renderItem: ListRenderItem<Terrain> = ({ item }) => (
      <ListeTerrainItem terrain={item} />
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <VStack className="flex-1 bg-[#0594ae]">
          <TopBarBack
            title={t('liste_terrains_navigation_title')}
            navigation={this.props.navigation}
          />
          <Text className="text-white text-xl text-center">
            {t('nombre_terrains', { nb: this.props.listeTerrains.length })}
          </Text>
          <VStack className="flex-1 my-2">
            <FlatList
              persistentScrollbar={true}
              data={this.props.listeTerrains}
              initialNumToRender={20}
              keyExtractor={(item: Terrain) => item.id.toString()}
              renderItem={renderItem}
              className="h-1"
            />
          </VStack>
          <VStack space="lg" className="px-10">
            {this._ajoutTerrainButton()}
            {this._commencerButton()}
          </VStack>
        </VStack>
      </SafeAreaView>
    );
  }
}

export default connector(withTranslation()(ListeTerrains));
