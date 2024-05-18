import { VStack, Text, Input, InputField, Button, HStack, Box, ButtonText, ScrollView, KeyboardAvoidingView } from '@gluestack-ui/themed';
import React from 'react'
import { withTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@components/TopBarBack';
import AdMobMatchDetailBanner from '../../components/adMob/AdMobMatchDetailBanner';
import { nextMatch } from '../../utils/generations/nextMatch/nextMatch';
import { Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { Joueur } from '@/types/interfaces/joueur';
import { Match } from '@/types/interfaces/match';
import { PropsFromRedux, connector } from '@/store/connector';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
}

interface State {
  match: Match,
  score1: string,
  score2: string
}

class MatchDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      match: undefined,
      score1: undefined,
      score2: undefined
    }
  }

  componentDidMount() {
    var idMatch = this.props.route.params.idMatch;
    this.setState({
      match: idMatch,
    });
  }

  _ajoutScoreTextInputChanged = (score: string, equipe: number) => {
    if(equipe === 1) {
      this.setState({
        score1: score
      });
    }
    else if(equipe === 2) {
      this.setState({
        score2: score
      });
    }
  } 

  _displayTitle(match: Match) {
    const { t } = this.props;
    let title = match.terrain ? match.terrain.name : t("match_numero")+(match.id + 1);
    return (
      <Text color='$white' fontSize={'$xl'} textAlign='center'>{title}</Text>
    )
  }

  _displayName(joueurNumber: number, equipe: number) {
    let listeJoueurs = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs;
    let joueur = listeJoueurs.find((item: Joueur) => item.id === joueurNumber);
    if (joueur) {
      if (equipe === 1) {
        return <Text key={joueur.id} color='$white' fontSize={'$md'} textAlign='left'>{(joueur.id + 1) + ' ' + joueur.name}</Text>
      } else {
        return <Text key={joueur.id} color='$white' fontSize={'$md'} textAlign='right'>{joueur.name + ' ' + (joueur.id + 1)}</Text>
      }
    }
  }

  _displayEquipe(equipe: number, match: Match) {
    let nomsJoueurs = [];
    for (let i = 0; i < 3; i++) {
      nomsJoueurs.push(this._displayName(match.equipe[equipe - 1][i], equipe));
    }
    return nomsJoueurs;
  }

  _envoyerResultat(match: Match) {
    if (this.state.score1 && this.state.score2) {
      let info = {idMatch: this.state.match, score1: this.state.score1, score2: this.state.score2};
      const actionAjoutScore = { type: "AJOUT_SCORE", value: info};
      this.props.dispatch(actionAjoutScore);
      //Si tournoi type coupe et pas le dernier match, alors on ajoute les gagnants au match suivant
      let nbMatchs = this.props.listeMatchs[this.props.listeMatchs.length - 1].nbMatchs;
      let typeTournoi = this.props.listeMatchs[this.props.listeMatchs.length - 1].typeTournoi;
      let nbTours = this.props.listeMatchs[this.props.listeMatchs.length - 1].nbTours;
      let actionNextMatch = nextMatch(match, nbMatchs, typeTournoi, nbTours);
      if (actionNextMatch != undefined) {
        this.props.dispatch(actionNextMatch);
      }
      const actionUpdateTournoi = { type: "UPDATE_TOURNOI", value: {tournoi: this.props.listeMatchs, tournoiId: this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID}};
      this.props.dispatch(actionUpdateTournoi);
      this.props.navigation.navigate('ListeMatchsStack');
    }
  }

  _supprimerResultat() {
    let info = {idMatch: this.state.match, score1: undefined, score2: undefined};
    const actionAjoutScore = { type: "AJOUT_SCORE", value: info};
    this.props.dispatch(actionAjoutScore);
    const actionUpdateTournoi = { type: "UPDATE_TOURNOI", value: {tournoi: this.props.listeMatchs, tournoiId: this.props.listeMatchs[this.props.listeMatchs.length - 1].tournoiID}};
    this.props.dispatch(actionUpdateTournoi);
    this.props.navigation.navigate('ListeMatchsStack');
  }

  _boutonValider(match: Match) {
    const { t } = this.props;
    let btnDisabled = !(this.state.score1 && this.state.score2);
    return (
      <Button isDisabled={btnDisabled} action='positive' onPress={() => this._envoyerResultat(match)}>
        <ButtonText>{t("valider_score")}</ButtonText>
      </Button>
    )
  }

  render() {
    const { t } = this.props;
    let { match, nbPtVictoire } = this.props.route.params;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "height" : "height"}
        style={{ flex: 1, zIndex: 999 }}
      >
        <SafeAreaView style={{flex: 1}}>
          <ScrollView bgColor='#0594ae'>
            <VStack>
              <TopBarBack title={t("detail_match_navigation_title")} navigation={this.props.navigation}/>
              <VStack px={'$10'} justifyContent='space-between'>
                <VStack space='xl'>
                  {this._displayTitle(match)}
                  <HStack alignItems='center'>
                    <Box flex={2}>
                      {this._displayEquipe(1, match)}
                    </Box>
                    <Box flex={1} alignItems='center'>
                      <Text color='$white' fontSize={'$xl'}>VS</Text>
                    </Box>
                    <Box flex={2}>
                      {this._displayEquipe(2, match)}
                    </Box>
                  </HStack>
                  <HStack space='lg'>
                    <Box flex={1}>
                    <Text color='$white' fontSize={'$md'}>{t("score_equipe_1")} </Text>
                      <Input size='md'>
                        <InputField
                          placeholder={t("score_placeholder", {scoreVictoire: nbPtVictoire})}
                          autoFocus={true}
                          defaultValue={match.score1}
                          keyboardType='decimal-pad'
                          returnKeyType='next'
                          maxLength={2}
                          onChangeText={(text) => this._ajoutScoreTextInputChanged(text, 1)}
                          onSubmitEditing={() => this.secondInput.focus()}
                        />
                      </Input>
                    </Box>
                    <Box flex={1}>
                    <Text color='$white' fontSize={'$md'} alignSelf='flex-end'>{t("score_equipe_2")} </Text>
                      <Input size='md'>
                        <InputField
                          placeholder={t("score_placeholder", {scoreVictoire: nbPtVictoire})}
                          defaultValue={match.score2}
                          keyboardType='decimal-pad'
                          maxLength={2}
                          onChangeText={(text) => this._ajoutScoreTextInputChanged(text, 2)}
                          onSubmitEditing={() => this._envoyerResultat(match)}
                          ref={ref => {this.secondInput = ref}}
                        />
                      </Input>
                    </Box>
                  </HStack>
                </VStack>
                <VStack space='lg' my={'$5'}>
                  <Button action='negative' onPress={() => this._supprimerResultat()}>
                    <ButtonText>{t("supprimer_score")}</ButtonText>
                  </Button>
                  {this._boutonValider(match)}
                </VStack>
                <VStack mb={'$5'}>
                  <AdMobMatchDetailBanner/>
                </VStack>
              </VStack>
            </VStack>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    )
  }
}

export default connector(withTranslation()(MatchDetail))