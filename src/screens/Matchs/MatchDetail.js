import { VStack, Text, Input, Button, HStack, Box, ButtonText } from '@gluestack-ui/themed';
import React from 'react'
import { withTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux'
import TopBarBack from '../../components/TopBarBack';
import { InputField } from '@gluestack-ui/themed';
import { Keyboard } from 'react-native';
import AdMobMatchDetailBanner from '../../components/adMob/AdMobMatchDetailBanner';

class MatchDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      match: undefined,
      score1: undefined,
      score2: undefined,
      keyboardOpen: false
    }
  }

  componentDidMount() {
    var idMatch = this.props.route.params.idMatch;
    this.setState({
      match: idMatch,
    });
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  _keyboardDidShow = () => {
    this.setState({keyboardOpen: true});
  }

  _keyboardDidHide = () => {
    this.setState({keyboardOpen: false});
  }

  _ajoutScoreTextInputChanged = (score, equipe) => {
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

  _displayTitle(match) {
    const { t } = this.props;
    let title = match.terrain ? match.terrain.name : t("match_numero")+(match.id + 1);
    return (
      <Text color='$white' fontSize={'$xl'} textAlign='center'>{title}</Text>
    )
  }

  _displayName = (joueurNumber) => {
    let listeJoueurs = this.props.listeMatchs[this.props.listeMatchs.length - 1].listeJoueurs;
    let joueur = listeJoueurs.find(item => item.id === joueurNumber);
    if (joueur) {
      return <Text color='$white' fontSize={'$md'} key={joueur.id}>{joueur.id+1} {joueur.name}</Text>
    }
  }

  _displayEquipe(equipe, match) {
    let nomsJoueurs = [];
    for (let i = 0; i < 3; i++) {
      nomsJoueurs.push(this._displayName(match.equipe[equipe - 1][i], equipe));
    }
    return nomsJoueurs;
  }

  _envoyerResultat(match) {
    if (this.state.score1 && this.state.score2) {
      let info = {idMatch: this.state.match, score1: this.state.score1, score2: this.state.score2};
      const actionAjoutScore = { type: "AJOUT_SCORE", value: info};
      this.props.dispatch(actionAjoutScore);
      //Si tournoi type coupe et pas le dernier match, alors on ajoute les gagnants au match suivant
      let nbMatchs = this.props.listeMatchs[this.props.listeMatchs.length - 1].nbMatchs;
      if (this.props.listeMatchs[this.props.listeMatchs.length - 1].typeTournoi == 'coupe' && match.id + 1 < nbMatchs) {
        let gagnant = match.equipe[0];
        if (parseInt(match.score2) > parseInt(match.score1)) {
          gagnant = match.equipe[1];
        }
        let matchId = null;

        let div = 2;
        for (let i = 2; i <= match.manche; i++) {
          div = div * 2;
        }
        let nbMatchsManche = Math.floor((nbMatchs + 1) / div);

        if (match.manche == 1) {
          if (match.id % 2 != 0) {
            matchId = match.id + (nbMatchsManche - ((match.id + 1) / 2));
          }
          else {
            matchId = match.id + (nbMatchsManche - (match.id / 2));
          }
        }
        else {
          let nbMatchsAvantManche = (nbMatchs + 1) / 2;
          for (let i = 1; i < match.manche - 1; i++) {
            nbMatchsAvantManche += nbMatchsAvantManche / 2;
          }
          matchId = match.id + (nbMatchsManche - (Math.ceil((match.id % nbMatchsAvantManche) / 2)));
        }

        let equipeId = match.id % 2;
        const actionAjoutAdversaire = { type: "COUPE_AJOUT_ADVERSAIRE", value: {gagnant: gagnant, matchId: matchId, equipeId: equipeId}};
        this.props.dispatch(actionAjoutAdversaire);
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

  _boutonValider(match) {
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
    let match = this.props.route.params.match;
    return (
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <VStack flex={1} bgColor={"#0594ae"}>
            <TopBarBack title={t("detail_match_navigation_title")} navigation={this.props.navigation}/>
            <VStack flex={1} px={'$10'} justifyContent='space-between'>
              <VStack space='xl'>
                {this._displayTitle(match)}
                <HStack justifyContent='space-between'>
                  <Box>
                    {this._displayEquipe(1, match)}
                  </Box>
                  <VStack justifyContent='center'>
                    <Text color='$white' fontSize={'$xl'}>VS</Text>
                  </VStack>
                  <Box>
                    {this._displayEquipe(2, match)}
                  </Box>
                </HStack>
                <HStack space='lg'>
                  <Box flex={1}>
                    <Input size='md'>
                      <InputField
                        placeholder={t("score_equipe_1")}
                        autoFocus={true}
                        defaultValue={this.nbToursTxt}
                        keyboardType='decimal-pad'
                        returnKeyType='next'
                        maxLength={2}
                        onChangeText={(text) => this._ajoutScoreTextInputChanged(text, 1)}
                        onSubmitEditing={() => this.secondInput.focus()}
                      />
                    </Input>
                  </Box>
                  <Box flex={1}>
                    <Input size='md'>
                      <InputField
                        placeholder={t("score_equipe_2")}
                        autoFocus={true}
                        defaultValue={this.nbToursTxt}
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
              {!this.state.keyboardOpen &&
                <Box>
                  <AdMobMatchDetailBanner/>
                </Box>
              }
              <VStack space='lg' mb={'$5'}>
                <Button action='negative' onPress={() => this._supprimerResultat()}>
                  <ButtonText>{t("supprimer_score")}</ButtonText>
                </Button>
                {this._boutonValider(match)}
              </VStack>
            </VStack>
          </VStack>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois
  }
}

export default connect(mapStateToProps)(withTranslation()(MatchDetail))