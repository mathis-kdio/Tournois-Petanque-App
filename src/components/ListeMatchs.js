import React from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { connect } from 'react-redux'
import MatchItem from '../components/MatchItem'
import * as NavigationBar from 'expo-navigation-bar';

class ListeMatchs extends React.Component {

  constructor(props) {
    super(props)
  }

  _displayDetailForMatch = (idMatch, match) => {
    this.props.navigation.navigate({
      name: 'MatchDetailStack', 
      params: {
        idMatch: idMatch, 
        match: match,
      }
    })
  }

  _displayListeMatch() {
    let nbMatchs = 0
    let matchs = []
    if (this.props.listeMatchs != undefined) {
      let tournoi = this.props.listeMatchs //tournoi contient les matchs + la config du tournoi en dernière position
      nbMatchs = tournoi[tournoi.length - 1].nbMatchs //On récup nb matchs dans la config
      matchs = tournoi.slice(0, -1) //On retire la config et donc seulement la liste des matchs
    }
    matchs = matchs.filter(match => match.manche == this.props.extraData)
    return (
      <FlatList
        data={matchs}
        initialNumToRender={nbMatchs}
        keyExtractor={(item) => item.id.toString() }
        renderItem={({item}) => (
          <MatchItem
            match={item}
            displayDetailForMatch={this._displayDetailForMatch}
            manche={this.props.extraData}
          />
        )}
      />
    )
  }

  render() {
    NavigationBar.setBackgroundColorAsync("#ffda00");
    return (
      <View style={styles.main_container} >
        {this._displayListeMatch()}
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
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(ListeMatchs)