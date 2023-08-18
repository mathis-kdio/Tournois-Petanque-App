import React from 'react'
import { StyleSheet, View, Text, Button, FlatList } from 'react-native'
import { connect } from 'react-redux'
import ListeTerrainItem from '@components/ListeTerrainItem';
import { calcNbMatchsParTour } from '@utils/generations/generation';
import { withTranslation } from 'react-i18next';

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
      <View style={styles.ajoutTerrain_container}>
        <Button color="green" title={t("ajouter_terrain")} onPress={() => this._ajoutTerrains()}/>
      </View>
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
      <Button disabled={disabled} color='green' title={title} onPress={() => this._commencer()}/>
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
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View>
            <Text style={styles.title}>{t("nombre_terrains", {nb: this.props.listeTerrains.length})}</Text>
          </View>
          <View style={styles.flatList_container}>
            <FlatList
              data={this.props.listeTerrains}
              initialNumToRender={20}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({item}) => (
                <ListeTerrainItem
                  terrain={item}
                />
              )}
              ListFooterComponent={
                <View style={styles.createBtnView}>
                  {this._ajoutTerrainButton()}
                </View>
              }
            />
            <View style={styles.createBtnView}>
              {this._commencerButton()}
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0594ae"
  },
  body_container: {
    flex: 1
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    color: 'white'
  },
  flatList_container: {
    flex: 1
  },
  ajoutTerrain_container: {
    marginTop: 10
  },
  createBtnView: {
    alignItems: 'center'
  }
})

const mapStateToProps = (state) => {
  return {
    listeTerrains: state.listeTerrains.listeTerrains,
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    optionsTournoi: state.optionsTournoi.options
  }
}

export default connect(mapStateToProps)(withTranslation()(ListeTerrains))