import React from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesome5 } from '@expo/vector-icons';

class ListeTerrainItem extends React.Component {
  constructor(props) {
    super(props)
    this.terrainText = "";
    this.state = {
      renommerOn: false,
      disabledBoutonRenommer: true,
    }
  }

  _supprimerTerrain(terrain) {
    this.setState({
      renommerOn: false
    });
    const actionSuppr = {type: "SUPPR_TERRAIN", value: {terrainId: terrain.id}};
    this.props.dispatch(actionSuppr);
  }

  _showRenommerTerrain(terrain) {
    if (this.state.renommerOn == false) {
      return (
        <View>
          <FontAwesome5.Button name="edit" backgroundColor="green" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._renommerTerrainInput(terrain)}/>
        </View>
      )
    }
    else {
      if (this.state.disabledBoutonRenommer == true) {
        return (
          <View>
            <FontAwesome5.Button name="edit" backgroundColor="gray" iconStyle={{paddingHorizontal: 2, marginRight: 0}}/>
          </View>
        )
      }
      else {
        return (
          <View>
            <FontAwesome5.Button name="check" backgroundColor="green" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._renommerTerrain(terrain)}/>
          </View>
        )
      }
    }
  }

  _renommerTerrainInput(terrain) {
    this.setState({
      renommerOn: true
    });
    this.terrainText = terrain.name;
  }

  _renommerTerrain(terrain) {
    if (this.terrainText != "") {
      this.setState({
        renommerOn: false,
        disabledBoutonRenommer: true
      });
      const actionRenommer = { type: "RENOMMER_TERRAIN", value: {terrainId: terrain.id, newName: this.terrainText}};
      this.props.dispatch(actionRenommer);
      this.terrainText = "";
    }
  }

  _terrainTxtInputChanged(text) {
    this.terrainText = text;
    //Le bouton valider est désactivé si aucune lettre
    this.setState({
      disabledBoutonRenommer: this.terrainText == ''
    });
  }

  _terrainName(terrain) {
    if (this.state.renommerOn == true) {
      return(
        <TextInput
          style={styles.text_input}
          placeholder={terrain.name}
          autoFocus={true}
          onChangeText={(text) => this._terrainTxtInputChanged(text)}
          onSubmitEditing={() => this._renommerTerrain(terrain)}
        />
      )
    }
    else {
      return(
        <Text style={styles.name_text}>{(terrain.id+1)} - {terrain.name}</Text>
      )
    }
  }

  render() {
    const { terrain } = this.props;
    return (
      <View style={styles.main_container}>
        <View style={styles.name_container}>
          {this._terrainName(terrain)}
        </View>
        {this._showRenommerTerrain(terrain)}
        <View style={styles.remove_container}>
          <FontAwesome5.Button name="times" backgroundColor="red" iconStyle={{paddingHorizontal: 2, marginRight: 0}} onPress={() => this._supprimerTerrain(terrain)}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: 'white'
  },
  name_container: {
    flex: 1,
    marginLeft: 10
  },
  remove_container: {
    marginLeft: 5,
    marginRight: 10
  },
  name_text: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
  text_input: {
    height: 50,
    paddingLeft: 5,
    color: 'white'
  },
  icon: {
    width: 30,
    height: 30
  }
})

const mapStateToProps = (state) => {
  return {
    listeTerrains: state.listeTerrains.listeTerrains,
  }
}

export default connect(mapStateToProps)(ListeTerrainItem)