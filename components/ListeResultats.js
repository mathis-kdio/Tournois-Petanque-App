import React from 'react'
import { StyleSheet, View, FlatList, Text } from 'react-native'
import { connect } from 'react-redux'
import ListeResultatItem from '../components/ListeResultatItem'

class ListeResultats extends React.Component {
  
  _calculVictoire () {
    let victoires = [];
    for (let i = 1; i < this.props.listeJoueurs.length + 1; i++) {
      let nbVictoire = 0;
      let nbPoints = 0;
      this.props.listeMatchs.forEach(element => {
        if ((element.joueur1 == i || element.joueur2 == i) && element.score1  !== undefined) {
          if (element.score1 == 13) {
            nbVictoire++;
            nbPoints += 13 - element.score2;
          }
          else {
            nbPoints -= 13 - element.score1;
          }
         }
        if ((element.joueur3 == i || element.joueur4 == i) && element.score2  !== undefined) {
          if (element.score2 == 13) {
            nbVictoire++;
            nbPoints += 13 - element.score1;
          }
          else {
            nbPoints -= 13 - element.score2;
          }
        }
      });
      victoires[i-1] = {joueurId: i, victoires: nbVictoire, points: nbPoints, position: undefined};
    }
    victoires.sort(
      function(a, b) {          
        if (a.victoires === b.victoires) {
          return b.points - a.points;
        }
        return b.victoires - a.victoires;
      }
    );
    let position = 1;
    for (let i = 0; i < victoires.length; i++) {
      if(i > 0 && victoires[i-1].victoires === victoires[i].victoires && victoires[i-1].points === victoires[i].points) {
        victoires[i].position = victoires[i-1].position;
      }
      else {
        victoires[i].position = position;
      }
      position++;
    }
    return victoires
  }

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
          data={this._calculVictoire()}
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
    listeJoueurs: state.toggleJoueur.listeJoueurs,
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(ListeResultats)