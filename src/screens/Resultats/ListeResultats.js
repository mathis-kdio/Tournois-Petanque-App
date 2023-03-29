import React from 'react'
import { StyleSheet, View, FlatList, Text } from 'react-native'
import { connect } from 'react-redux'
import ListeResultatItem from '../../components/ListeResultatItem'
import { rankingCalc } from '../../utils/ranking'

class ListeResultats extends React.Component {

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.entete}>
          <View style={styles.position_container}>
            <Text style={styles.texte}>Place</Text>
          </View>
          <View style={styles.victoires_container}>
            <Text style={styles.texte}>Victoire</Text>
          </View>
          <View style={styles.mj_container}>
            <Text style={styles.texte}>MJ</Text>
          </View>
          <View style={styles.points_container}>
            <Text style={styles.texte}>Point</Text>
          </View>
        </View>
        <FlatList
          data={rankingCalc(this.props.listeMatchs)}
          keyExtractor={(item) => item.joueurId.toString()}
          renderItem={({item}) => (
            <ListeResultatItem
              joueur={item}
            />
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#0594ae"
  },
  entete: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: 'white'
  },
  position_container: {
    flex: 2
  },
  victoires_container: {
    flex: 1,
    alignItems: 'center'
  },
  mj_container: {
    flex: 1,
    alignItems: 'center'
  },
  points_container: {
    flex: 1,
    alignItems: 'flex-end'
  },
  texte: {
    fontSize: 20,
    textAlign: 'left',
    color: 'white'
  },
})

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(ListeResultats)