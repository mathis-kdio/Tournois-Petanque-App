import { KeyboardAvoidingView } from "@/components/ui/keyboard-avoiding-view";
import { ScrollView } from "@/components/ui/scroll-view";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from 'react'
import { withTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@components/TopBarBack';
import AdMobMatchDetailBanner from '../../components/adMob/AdMobMatchDetailBanner';
import { nextMatch } from '../../utils/generations/nextMatch/nextMatch';
import { Platform, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { Joueur } from '@/types/interfaces/joueur';
import { Match } from '@/types/interfaces/match';
import { PropsFromRedux, connector } from '@/store/connector';
import { RouteProp } from '@react-navigation/native';
import { MatchsStackParamList } from '@/navigation/Navigation';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
  route: RouteProp<MatchsStackParamList, 'MatchDetailStack'>;
}

interface State {
  idMatch: number,
  score1: string,
  score2: string
}

class MatchDetail extends React.Component<Props, State> {
  secondInput = React.createRef<TextInput>();

  constructor(props: Props) {
    super(props)
    this.state = {
      idMatch: undefined,
      score1: undefined,
      score2: undefined
    }
  }

  componentDidMount() {
    var idMatch = this.props.route.params.idMatch;
    this.setState({
      idMatch: idMatch,
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
    return <Text className="text-white text-xl text-center">{title}</Text>;
  }

  _displayName(joueurNumber: number, equipe: number) {
    let listeJoueurs = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs;
    let joueur = listeJoueurs.find((item: Joueur) => item.id === joueurNumber);
    if (joueur) {
      if (equipe === 1) {
        return <Text key={joueur.id} className="text-white text-md text-left">{(joueur.id + 1) + ' ' + joueur.name}</Text>;
      } else {
        return <Text key={joueur.id} className="text-white text-md text-right">{joueur.name + ' ' + (joueur.id + 1)}</Text>;
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
      let info = {idMatch: this.state.idMatch, score1: parseInt(this.state.score1), score2: parseInt(this.state.score2)};
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
    let info = {idMatch: this.state.idMatch, score1: undefined, score2: undefined};
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
    );
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
          <ScrollView className="h-1 bg-[#0594ae]">
            <VStack>
              <TopBarBack title={t("detail_match_navigation_title")} navigation={this.props.navigation}/>
              <VStack className="px-10 justify-between">
                <VStack space='xl'>
                  {this._displayTitle(match)}
                  <HStack className="items-center">
                    <Box className="flex-2">
                      {this._displayEquipe(1, match)}
                    </Box>
                    <Box className="flex-1 items-center">
                      <Text className="text-white text-xl">VS</Text>
                    </Box>
                    <Box className="flex-2">
                      {this._displayEquipe(2, match)}
                    </Box>
                  </HStack>
                  <HStack space='lg'>
                    <Box className="flex-1">
                    <Text className="text-white text-md">{t("score_equipe_1")} </Text>
                      <Input size='md' className="border-white">
                        <InputField
                          className='text-white'
                          placeholder={t("score_placeholder", {scoreVictoire: nbPtVictoire})}
                          autoFocus={true}
                          defaultValue={match.score1.toString()}
                          keyboardType='decimal-pad'
                          returnKeyType='next'
                          maxLength={2}
                          onChangeText={(text) => this._ajoutScoreTextInputChanged(text, 1)}
                          onSubmitEditing={() => this.secondInput.current.focus()}
                        />
                      </Input>
                    </Box>
                    <Box className="flex-1">
                    <Text className="text-white text-md self-end">{t("score_equipe_2")} </Text>
                      <Input size='md' className="border-white">
                        <InputField
                          className='text-white'
                          placeholder={t("score_placeholder", {scoreVictoire: nbPtVictoire})}
                          defaultValue={match.score2.toString()}
                          keyboardType='decimal-pad'
                          maxLength={2}
                          onChangeText={(text) => this._ajoutScoreTextInputChanged(text, 2)}
                          onSubmitEditing={() => this._envoyerResultat(match)}
                          ref={this.secondInput}
                        />
                      </Input>
                    </Box>
                  </HStack>
                </VStack>
                <VStack space='lg' className="my-5">
                  <Button action='negative' onPress={() => this._supprimerResultat()}>
                    <ButtonText>{t("supprimer_score")}</ButtonText>
                  </Button>
                  {this._boutonValider(match)}
                </VStack>
                <VStack className="mb-5">
                  <AdMobMatchDetailBanner/>
                </VStack>
              </VStack>
            </VStack>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

export default connector(withTranslation()(MatchDetail))