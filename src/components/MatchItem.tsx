import { FontAwesome5 } from '@expo/vector-icons';
import { Box, Divider, HStack, Text, VStack } from '@gluestack-ui/themed'
import { TFunction } from 'i18next';
import React from 'react'
import { withTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

export interface Props {
  t: TFunction;
  /*match: ;
  displayDetailForMatch: ;
  manche: ;
  nbPtVictoire: ; */
}

interface State {
}

class MatchItem extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
    }
  }

  _displayTitle(match, nbPtVictoire) {
    const { t } = this.props;
    let txt = t("match_numero") + (match.id + 1);
    if (match.terrain) {
      txt = match.terrain.name;
    }
    return (
      <HStack>
        <Box flex={1} alignItems='center'>
          { match.score1 == nbPtVictoire &&
            <FontAwesome5 name='trophy' size={20} color='#ffda00'/>
          }
        </Box>
        <Box flex={1}>
          <Text color='$white' fontSize={'$2xl'} p={'$0.5'} textAlign='center'>{txt}</Text>
        </Box>
        <Box flex={1} alignItems='center'>
          { match.score2 == nbPtVictoire &&
            <FontAwesome5 name='trophy' size={20} color='#ffda00'/>
          }
        </Box>
      </HStack>
    )
  }

  _displayEquipe(equipe, match) {
    let nomsJoueurs = [];
    for (let i = 0; i < 3; i++) {
      nomsJoueurs.push(this._displayName(match.equipe[equipe - 1][i], equipe));
    }
    return nomsJoueurs;
  }

  _displayName(joueurNumber, equipe) {
    let joueur = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs.find(item => item.id === joueurNumber);
    if (joueur) {
      if (equipe === 1) {
        return <Text key={joueur.id} color='$white' fontSize={'$xl'} textAlign='left'>{(joueur.id + 1) + ' ' + joueur.name}</Text>
      } else {
        return <Text key={joueur.id} color='$white' fontSize={'$xl'} textAlign='right'>{joueur.name + ' ' + (joueur.id + 1)}</Text>
      }
    }
  }

  _displayScore(matchID) {
    let score1 = this.props.listeMatchs[matchID].score1 ?? '?';
    let score2 = this.props.listeMatchs[matchID].score2 ?? '?';
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
            {this._displayTitle(match, nbPtVictoire)}
            <HStack alignItems='center'>
              <Box flex={1}>
                {this._displayEquipe(1, match)}
              </Box>
              <Box flex={1}>
                {this._displayScore(match.id)}
              </Box>
              <Box flex={1}>
                {this._displayEquipe(2, match)}
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