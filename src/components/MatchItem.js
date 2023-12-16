import { Box, Divider, HStack, Text, VStack } from '@gluestack-ui/themed'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

class MatchItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _displayTitle(match) {
    const { t } = this.props;
    let txt = t("match_numero") + (match.id + 1);
    if (match.terrain) {
      txt = match.terrain.name;
    }
    return (
      <Text color='$white' fontSize={'$2xl'} p={'$0.5'} textAlign='center'>{txt}</Text>
    )
  }

  _displayEquipe(equipe, match, nbPtVictoire) {
    let nomsJoueurs = [];
    for (let i = 0; i < 3; i++) {
      nomsJoueurs.push(this._displayName(match.equipe[equipe - 1][i], equipe, match.id, nbPtVictoire));
    }
    return nomsJoueurs;
  }

  _displayName(joueurNumber, equipe, matchID, nbPtVictoire) {
    let colorEquipe1 = '$white';
    let colorEquipe2 = '$white';
    if (this.props.listeMatchs[matchID].score1 == nbPtVictoire) {
      colorEquipe1 = 'green';
      colorEquipe2 = 'red';
    } else if (this.props.listeMatchs[matchID].score2 == nbPtVictoire) {
      colorEquipe1 = 'red';
      colorEquipe2 = 'green';
    }

    let styleColor = (equipe === 1) ? colorEquipe1 : colorEquipe2;
    let joueur = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs.find(item => item.id === joueurNumber);
    if (joueur) {
      if (equipe === 1) {
        return <Text key={joueur.id} color={styleColor} fontSize={'$xl'} textAlign='left'>{(joueur.id + 1) + ' ' + joueur.name}</Text>
      } else {
        return <Text key={joueur.id} color={styleColor} fontSize={'$xl'} textAlign='right'>{joueur.name + ' ' + (joueur.id + 1)}</Text>
      }
    }
  }

  _displayScore(matchID) {
    let score1 = this.props.listeMatchs[matchID].score1;
    let score2 = this.props.listeMatchs[matchID].score2;
    if (score1 == undefined) {
      score1 = '?'
    }
    if (score2 == undefined) {
      score2 = '?'
    }
    return (
      <HStack justifyContent='center'>
        <Text color='$white' fontSize={'$2xl'} p={'$2'}>{score1}</Text>
        <Text color='$white' fontSize={'$2xl'} p={'$2'}> VS </Text>
        <Text color='$white' fontSize={'$2xl'} p={'$2'}>{score2}</Text>
      </HStack>
    )
  }

  render() {
    let { match, displayDetailForMatch, manche, nbPtVictoire } = this.props;
    if (match.manche == manche) {
      return (
        <TouchableOpacity onPress={() => displayDetailForMatch(match.id, match, nbPtVictoire)}>
          <VStack m={'$2'}>
            {this._displayTitle(match)}
            <HStack alignItems='center'>
              <Box flex={1}>
                {this._displayEquipe(1, match, nbPtVictoire)}
              </Box>
              <Box flex={1}>
                {this._displayScore(match.id)}
              </Box>
              <Box flex={1}>
                {this._displayEquipe(2, match, nbPtVictoire)}
              </Box>
            </HStack>
          </VStack>
          <Divider/>
        </TouchableOpacity>
      )
    }
    return (null);
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs
  }
}

export default connect(mapStateToProps)(withTranslation()(MatchItem))