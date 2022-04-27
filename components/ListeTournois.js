import React from 'react'
import { StyleSheet, View, FlatList, Text, Button } from 'react-native'
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
        <View style={styles.body_container}>
          <View>
            <Text style={styles.titre}>Types d'équipe et de tournoi</Text>
          </View>
          <View>
            <FlatList
              data={this.props.listeTournois}
              initialNumToRender={this.props.listeTournois.length - 1}
              keyExtractor={(item) => item.tournoiId.toString() }
              renderItem={({item}) => (
                <View style={styles.tournoi_container}>
                  <Text style={styles.tournoi_text}>Tournoi n°{item.tournoiId + 1}</Text>
                  <Button color="#1c3969" title="Charger ce tournoi" onPress={() => this.loadTournoi(item.tournoiId, item)}/>
                </View>
              )}
            />
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
    flex: 1,
    marginHorizontal: '5%',
  },
  titre: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    color: 'white'
  },
  tournoi_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tournoi_text: {
    fontSize: 15,
    color: 'white'
  }
})

const mapStateToProps = (state) => {
  return {
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(ListeTournois)