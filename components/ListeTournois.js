import React from 'react'
import { StyleSheet, View, FlatList, Text, Button } from 'react-native'
import { connect } from 'react-redux'

class ListeTournois extends React.Component {

  constructor(props) {
    super(props)
  }

  _chargerTournoi(tournoiId, tournoi) {
    this.props.navigation.navigate({
      name: 'ListeMatchsInscription', 
      params: {
        tournoiId: tournoiId, 
        tournoi: tournoi,
      }
    })
  }

  _supprimerTournoi(tournoiId) {
    const actionSupprimerTournoi = { type: "SUPPR_TOURNOI", value: {tournoiId: tournoiId}};
    this.props.dispatch(actionSupprimerTournoi);
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.body_container}>
          <View>
            <Text style={styles.titre}>Types d'équipe et de tournoi</Text>
          </View>
          <View style={styles.flatList_container}>
            <FlatList
              data={this.props.listeTournois}
              initialNumToRender={20}
              keyExtractor={(item) => item.tournoiId.toString() }
              renderItem={({item}) => (
                <View style={styles.tournoi_container}>
                  <View style={styles.text_container}>
                    <Text style={styles.tournoi_text}>Tournoi n°{item.tournoiId + 1}</Text>
                  </View>
                  <View style={styles.buttonView}>
                    <Button color="#1c3969" title="Charger" onPress={() => this._chargerTournoi(item.tournoiId, item)}/>
                  </View>
                  <View style={styles.buttonView}>
                    <Button color="red" title="Supprimer" onPress={() => this._supprimerTournoi(item.tournoiId)}/>
                  </View>
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
    flex: 1
  },
  titre: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    color: 'white'
  },
  flatList_container: {
    flex: 1,
    margin: 10
  },
  tournoi_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  text_container: {
    flex: 1,
  },
  tournoi_text: {
    fontSize: 15,
    color: 'white'
  },
  buttonView: {
    flex: 1,
    alignItems: 'flex-end'
  },
})

const mapStateToProps = (state) => {
  return {
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(ListeTournois)