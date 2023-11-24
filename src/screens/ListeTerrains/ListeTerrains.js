import React from 'react'
import { connect } from 'react-redux'
import ListeTerrainItem from '@components/ListeTerrainItem';
import { calcNbMatchsParTour } from '@utils/generations/generation';
import { withTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { VStack, Text, Button, FlatList, ButtonText } from '@gluestack-ui/themed';
import TopBarBack from '../../components/TopBarBack';

class ListeTerrains extends React.Component {

  constructor(props) {
    super(props)
  }

  _ajoutTerrains() {
    const ajoutTerrain = { type: "AJOUT_TERRAIN", value: []};
    this.props.dispatch(ajoutTerrain);
  }

  _ajoutTerrainButton() {
    const { t } = this.props;
    return (
      <Button action='primary' onPress={() => this._ajoutTerrains()}>
        <ButtonText>{t("ajouter_terrain")}</ButtonText>
      </Button>
    )
  }

  _commencerButton() {
    const { t } = this.props;
    const { typeEquipes, mode, type, complement } = this.props.optionsTournoi;
    const { listesJoueurs, listeTerrains } = this.props;
    const nbJoueurs = listesJoueurs[mode].length;
    const nbTerrainsNecessaires = calcNbMatchsParTour(nbJoueurs, typeEquipes, mode, type, complement);
    const disabled = listeTerrains.length < nbTerrainsNecessaires;
    const title = disabled ? t("terrains_insuffisants") : t("commencer");
    return (
      <Button isDisabled={disabled} action='positive' onPress={() => this._commencer()}>
        <ButtonText>{title}</ButtonText>
      </Button>
    )
  }

  _commencer() {
    this.props.navigation.navigate({
      name: "GenerationMatchs",
      params: {
        screenStackName: this.props.route.params.screenStackName
      }
    });
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#0594ae"/>
        <VStack flex={1} bgColor={"#0594ae"}>
          <TopBarBack title={t("liste_terrains_navigation_title")} navigation={this.props.navigation}/>
          <Text color='$white' fontSize={'$xl'} textAlign='center'>{t("nombre_terrains", {nb: this.props.listeTerrains.length})}</Text>
          <VStack flex={1} space='2xl' my={'$2'}>
            <FlatList
              persistentScrollbar={true}
              data={this.props.listeTerrains}
              initialNumToRender={20}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({item}) => (
                <ListeTerrainItem
                  terrain={item}
                />
              )}
              /*ListFooterComponent={
                <Box px={'$10'} mt={'$2'}>
                  {this._ajoutTerrainButton()}
                  {this._commencerButton()}
                </Box>
              }*/
            />
          </VStack>
          <VStack px={'$10'} space='lg'>
            {this._ajoutTerrainButton()}
            {this._commencerButton()}
          </VStack>
        </VStack>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listeTerrains: state.listeTerrains.listeTerrains,
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(withTranslation()(ListeTerrains))