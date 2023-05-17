import React from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesome5 } from '@expo/vector-icons';

class ListeTerrainItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _supprimerTerrain(terrain) {
    this.setState({
      renommerOn: false
    })
    const actionSuppr = {type: "SUPPR_TERRAIN", value: {terrainId: terrain.id}};
    this.props.dispatch(actionSuppr);
  }

  _terrainName(terrain) {
      return(
        <Text style={styles.name_text}>{(terrain.id+1)} {terrain.name}</Text>
      )
  }

  render() {
    const { terrain } = this.props;
    return (
      <View style={styles.main_container}>
        <View style={styles.name_container}>
          {this._terrainName(terrain)}
        </View>
        <View style={{marginLeft: 5}}>
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
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: 'white'
  },
  name_container: {
    flex: 1,
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
  picker_container: {
    flex: 1,
    alignItems: 'flex-end',
  },
  picker: {
    color: 'white',
    width: 115
  },
  type_icon_container: {
    flexDirection: 'row',
    justifyContent:'center'
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