import React from 'react'
import { StyleSheet, View, Text, Button, FlatList } from 'react-native'
import { connect } from 'react-redux'
import ListeTerrainItem from '@components/ListeTerrainItem';

class ListeTerrains extends React.Component {

  constructor(props) {
    super(props)
  }

  _ajoutTerrains() {
    const ajoutTerrain = { type: "AJOUT_TERRAIN", value: []};
    this.props.dispatch(ajoutTerrain);
  }

  _ajoutTerrainButton() {
    return (
      <View style={styles.ajoutTerrain_container}>
        <Button color="green" title="Ajouter un terrain" onPress={() => this._ajoutTerrains()}/>
      </View>
    )
  }

  _commencer() {
    let nbTerrainsNecessaires = 0;
    let disabled = true;
    if (nbTerrainsNecessaires < this.props.listeTerrains.length) {
      disabled = false;
    }
    return (
      <Button title="Commencer" disabled={disabled}/>
    )
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View>
            <Text style={styles.title}>Vous avez {this.props.listeTerrains.length} terrains</Text>
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
              {this._commencer()}
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
    listeTerrains: state.listeTerrains.listeTerrains
  }
}

export default connect(mapStateToProps)(ListeTerrains)