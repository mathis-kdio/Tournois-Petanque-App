import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Divider } from '@/components/ui/divider';
import { Box } from '@/components/ui/box';
import { PropsFromRedux, connector } from '@/store/connector';
import { Joueur } from '@/types/interfaces/joueur';
import { Match } from '@/types/interfaces/match';
import { FontAwesome5 } from '@expo/vector-icons';
import { TFunction } from 'i18next';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

export interface Props extends PropsFromRedux {
  t: TFunction;
  match: Match;
  displayDetailForMatch: (
    idMatch: number,
    match: Match,
    nbPtVictoire: number,
  ) => void;
  manche: number;
  nbPtVictoire: number;
}

interface State {}

class MatchItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  _displayTitle(match: Match, nbPtVictoire: number) {
    const { t } = this.props;
    let txt = t('match_numero') + (match.id + 1);
    if (match.terrain) {
      txt = match.terrain.name;
    }
    return (
      <HStack>
        <Box className="flex-1 items-center">
          {match.score1 === nbPtVictoire && (
            <FontAwesome5 name="trophy" size={20} color="#ffda00" />
          )}
        </Box>
        <Box className="flex-1">
          <Text className="text-white text-2xl p-0.5 text-center">{txt}</Text>
        </Box>
        <Box className="flex-1 items-center">
          {match.score2 === nbPtVictoire && (
            <FontAwesome5 name="trophy" size={20} color="#ffda00" />
          )}
        </Box>
      </HStack>
    );
  }

  _displayEquipe(equipe: number, match: Match) {
    let nomsJoueurs = [];
    for (let i = 0; i < 4; i++) {
      nomsJoueurs.push(this._displayName(match.equipe[equipe - 1][i], equipe));
    }
    return nomsJoueurs;
  }

  _displayName(joueurNumber: number, equipe: number) {
    let joueur = this.props.listeMatchs[
      this.props.listeMatchs.length - 1
    ].listeJoueurs.find((item: Joueur) => item.id === joueurNumber);
    if (joueur) {
      if (equipe === 1) {
        return (
          <Text key={joueur.id} className="text-white text-left" size="xl">
            {joueur.id + 1 + ' ' + joueur.name}
          </Text>
        );
      } else {
        return (
          <Text key={joueur.id} className="text-white text-right" size="xl">
            {joueur.name + ' ' + (joueur.id + 1)}
          </Text>
        );
      }
    }
  }

  _displayScore(matchID: number) {
    let score1 = this.props.listeMatchs[matchID].score1 ?? '?';
    let score2 = this.props.listeMatchs[matchID].score2 ?? '?';
    return (
      <HStack className="justify-center">
        <Text className="text-white text-2xl p-2">{score1}</Text>
        <Text className="text-white text-2xl p-2"> VS </Text>
        <Text className="text-white text-2xl p-2">{score2}</Text>
      </HStack>
    );
  }

  render() {
    let { match, displayDetailForMatch, manche, nbPtVictoire } = this.props;
    if (match.manche === manche) {
      return (
        <TouchableOpacity
          onPress={() => displayDetailForMatch(match.id, match, nbPtVictoire)}
        >
          <VStack className="m-2">
            {this._displayTitle(match, nbPtVictoire)}
            <HStack className="items-center">
              <Box className="flex-1">{this._displayEquipe(1, match)}</Box>
              <Box className="flex-1">{this._displayScore(match.id)}</Box>
              <Box className="flex-1">{this._displayEquipe(2, match)}</Box>
            </HStack>
          </VStack>
          <Divider />
        </TouchableOpacity>
      );
    }
    return null;
  }
}

export default connector(withTranslation()(MatchItem));
