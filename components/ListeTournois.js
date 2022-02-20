import React from 'react'
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native'
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
          keyExtractor={(item) => item.tournoiId.toString() }
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.main_container}
              onPress={() => this.loadTournoi(item.tournoiId, item)}
            >
              <View>
                <Text>Tournoi n°{item.tournoiId}</Text>
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