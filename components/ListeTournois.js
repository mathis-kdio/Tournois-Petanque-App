import React from 'react'
import { StyleSheet, View, FlatList, Text } from 'react-native'
import { connect } from 'react-redux'

class ListeTournois extends React.Component {

  constructor(props) {
    super(props)
  }

  loadTournoi = (tournoiId, tournoi) => {
    this.props.navigation.navigate({
      name: 'ListeMatchsInscription', 
      params: {
        tournoiId: tournoiId, 
        tournoi: tournoi,
      }
    })
  }

  render() {
    return (
      <View style={styles.main_container}>
        <Text>Liste des Tournois</Text>
        <FlatList
          data={this.props.listeTournois}
          initialNumToRender={this.props.listeTournois.length - 1}
          keyExtractor={(item) => item.id.toString() }
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.main_container}
              onPress={() => loadTournoi(item.id, item)}
            >
              <View>
                <Text>Tournoi n°{item.id}</Text>
              </View>
            </TouchableOpacity>
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
  }
})

const mapStateToProps = (state) => {
  return {
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(ListeTournois)