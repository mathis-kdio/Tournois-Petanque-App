import React from 'react'
import { connect } from 'react-redux'
import MatchItem from '@components/MatchItem'
import * as NavigationBar from 'expo-navigation-bar';
import { VStack } from '@gluestack-ui/themed';
import { FlatList } from '@gluestack-ui/themed';

class ListeMatchs extends React.Component {
  constructor(props) {
    super(props)
  }

  _displayDetailForMatch = (idMatch, match, nbPtVictoire) => {
    this.props.navigation.navigate({
      name: 'MatchDetailStack', 
      params: {
        idMatch: idMatch, 
        match: match,
        nbPtVictoire: nbPtVictoire,
      }
    });
  }

  _displayListeMatch() {
    let nbMatchs = 0;
    let matchs = [];
    let nbPtVictoire = 13;
    if (this.props.listeMatchs != undefined) {
      let tournoi = this.props.listeMatchs; //tournoi contient les matchs + la config du tournoi en dernière position
      nbMatchs = tournoi[tournoi.length - 1].nbMatchs; //On récup nb matchs dans la config
      nbPtVictoire = tournoi[tournoi.length - 1].nbPtVictoire ? tournoi[tournoi.length - 1].nbPtVictoire : 13; //On récup le nb de pt pour la victoire sinon 13
      matchs = tournoi.slice(0, -1); //On retire la config et donc seulement la liste des matchs
    }
    matchs = matchs.filter(match => match.manche == this.props.extraData);
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
            nbPtVictoire={nbPtVictoire}
          />
        )}
      />
    )
  }

  render() {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync("#0594ae");
    }
    return (
      <VStack flex={1} bgColor='#0594ae'>
        {this._displayListeMatch()}
      </VStack>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(ListeMatchs)