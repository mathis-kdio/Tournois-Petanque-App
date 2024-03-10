import React from 'react'
import { connect } from 'react-redux'
import { generationChampionnat } from '@utils/generations/championnat'
import { generationCoupe } from '@utils/generations/coupe'
import { generationMultiChances } from '@utils/generations/multiChances'
import { generationAvecEquipes } from '@utils/generations/tournoiAvecEquipes'
import { generationDoublettes } from '@utils/generations/tournoiDoublettes'
import { generationTeteATete } from '@utils/generations/tournoiTeteATete'
import { generationTriplettes } from '@utils/generations/tournoiTriplettes'
import { uniqueValueArrayRandOrder } from '@utils/generations/generation';
import { withTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import { VStack, Text, Button, ButtonText, Spinner } from '@gluestack-ui/themed'
import TopBarBack from '../../components/TopBarBack'
import { _adMobGenerationTournoiInterstitiel } from '../../components/adMob/AdMobGenerationTournoiInterstitiel'
import { AdEventType } from 'react-native-google-mobile-ads';

class GenerationMatchs extends React.Component {
  constructor(props) {
    super(props)
    this.nbTours = 5;
    this.nbPtVictoire = 13;
    this.speciauxIncompatibles = true;
    this.jamaisMemeCoequipier = true;
    this.eviterMemeAdversaire = 50;
    this.typeEquipes = "doublette";
    this.typeInscription = "avecNoms";
    this.complement = "3";
    this.typeTournoi = "mele-demele";
    this.avecTerrains = false;
    this.interstitial;
    this.state = {
      isLoading: true,
      isValid: false,
      isGenerationSuccess: true,
      erreurSpeciaux: false,
      erreurMemesEquipes: false,
      adLoaded: false,
      adClosed: false
    }
  }

  _ajoutMatchs = (matchs) => {
    //this._supprimerMatchs();
    const actionAjoutMatchs = { type: "AJOUT_MATCHS", value: matchs };
    this.props.dispatch(actionAjoutMatchs);
    const actionAjoutTournoi = { type: "AJOUT_TOURNOI", value: {tournoi: matchs} };
    this.props.dispatch(actionAjoutTournoi);
  }

  _supprimerMatchs() {
    const action = { type: "SUPPR_MATCHS" };
    this.props.dispatch(action);
  }

  componentDidMount() {
    _adMobGenerationTournoiInterstitiel().then(interstitial => {
      this.interstitial = interstitial;
      this.interstitial.addAdEventListener(AdEventType.LOADED, () => this.setState({adLoaded: true}));
      this.interstitial.addAdEventListener(AdEventType.ERROR, () => this.setState({adClosed: true, adLoaded: false}));
      this.interstitial.addAdEventListener(AdEventType.CLOSED, () => this.setState({adClosed: true, adLoaded: false}));
      this.interstitial.load();
    });
    setTimeout(() => {
      this._lanceurGeneration();
    }, 1000);
  }

  _displayListeMatch() {
    this.props.navigation.reset({
      index: 0,
      routes: [{name: 'ListeMatchsInscription'}],
    });
  }

  _lanceurGeneration() {
    //Récupération des options que l'utilisateur a modifié ou laissé par défaut
    this.nbTours = this.props.optionsTournoi.nbTours;
    this.nbPtVictoire = this.props.optionsTournoi.nbPtVictoire;
    this.speciauxIncompatibles = this.props.optionsTournoi.speciauxIncompatibles;
    this.jamaisMemeCoequipier = this.props.optionsTournoi.memesEquipes;
    this.eviterMemeAdversaire = this.props.optionsTournoi.memesAdversaires;
    this.typeEquipes = this.props.optionsTournoi.typeEquipes;
    this.typeInscription = this.props.optionsTournoi.mode;
    this.complement = this.props.optionsTournoi.complement;
    this.typeTournoi = this.props.optionsTournoi.type;
    this.avecTerrains = this.props.optionsTournoi.avecTerrains;

    let listeJoueurs = this.props.listesJoueurs[this.typeInscription];
    let nbjoueurs = listeJoueurs.length;
    let nbGenerationsRatee = 0;
    let nbEssaisPossibles = nbjoueurs * nbjoueurs;
    let returnType = 0;
    // 3 types de retour possible: 
    // 0 si trop de personnes de type enfants ou règle pas memeEquipes impossible; 
    // 1 si breaker activé
    // 2 si génération réussie
    //Tant que la génération échoue à cause du breaker alors on relancer
    while (nbGenerationsRatee < nbEssaisPossibles) {
      returnType = this._generation()
      if (returnType == 0 || returnType == 2) {
        break;
      }
      else {
        nbGenerationsRatee++;
      }
    }
    //Si la génération échoue trop de fois à cause du breaker alors affichage d'un message pour indiquer de changer les options
    if (nbGenerationsRatee == nbEssaisPossibles) {
      this.setState({
        isGenerationSuccess: false,
        isLoading: false
      });
    }
  }

  _generation() {
    let matchs = [];
    let nbMatchs = undefined;
    let nbTours = this.nbTours;
    let erreurMemesEquipes = undefined;
    let erreurSpeciaux = undefined;
    let echecGeneration = undefined;
    if (this.typeTournoi == "mele-demele") {
      if (this.typeInscription == 'avecEquipes') {
        ({matchs, nbMatchs, echecGeneration} = generationAvecEquipes(this.props.listesJoueurs.avecEquipes, this.nbTours, this.typeEquipes));
      }
      else if (this.typeEquipes == "teteatete") {
        ({matchs, nbMatchs, erreurMemesEquipes, erreurSpeciaux, echecGeneration} = generationDoublettes(this.props.listesJoueurs[this.typeInscription], this.nbTours, this.typeEquipes, this.complement, this.speciauxIncompatibles, this.jamaisMemeCoequipier, this.eviterMemeAdversaire));
      }
      else if (this.typeEquipes == "doublette") {
        ({matchs, nbMatchs, erreurMemesEquipes, erreurSpeciaux, echecGeneration} = generationDoublettes(this.props.listesJoueurs[this.typeInscription], this.nbTours, this.typeEquipes, this.complement, this.speciauxIncompatibles, this.jamaisMemeCoequipier, this.eviterMemeAdversaire));
      }
      else if (this.typeEquipes == "triplette") {
        ({matchs, nbMatchs, erreurMemesEquipes, erreurSpeciaux, echecGeneration} = generationTriplettes(this.props.listesJoueurs[this.typeInscription], this.nbTours));
      }
      else {
        echecGeneration = true;
      }
    }
    else if (this.typeTournoi == "coupe") {
      ({matchs, nbTours, nbMatchs} = generationCoupe(this.props.optionsTournoi, this.props.listesJoueurs.avecEquipes));
    }
    else if (this.typeTournoi == "championnat") {
      ({matchs, nbTours, nbMatchs} = generationChampionnat(this.props.optionsTournoi, this.props.listesJoueurs.avecEquipes));
    }
    else if (this.typeTournoi == "multi-chances") {
      ({matchs, nbTours, nbMatchs} = generationMultiChances(this.props.listesJoueurs[this.typeInscription], this.typeEquipes));
    }
    else {
      echecGeneration = true;
    }
    if (erreurMemesEquipes || erreurSpeciaux) {
      this.setState({
        erreurMemesEquipes: erreurMemesEquipes,
        erreurSpeciaux: erreurSpeciaux,
        isLoading: false
      });
      return 0;
    }
    if (echecGeneration) {
      return 1;
    }

    //attributions des terrains
    if (this.avecTerrains) {
      let manche = matchs[0].manche;
      let arrRandIdsTerrains = uniqueValueArrayRandOrder(this.props.listeTerrains.length);
      let i = 0;
      matchs.forEach(match => {
        if (match.manche != manche) {
          manche = match.manche;
          arrRandIdsTerrains = uniqueValueArrayRandOrder(this.props.listeTerrains.length);
          i = 0;
        }
        match.terrain = this.props.listeTerrains[arrRandIdsTerrains[i]];
        i++;
      });
    }

    //Ajout des options du match à la fin du tableau contenant les matchs
    matchs.push({
      tournoiID: undefined,
      nbTours: nbTours,
      nbMatchs: nbMatchs,
      nbPtVictoire: this.nbPtVictoire,
      speciauxIncompatibles: this.speciauxIncompatibles,
      memesEquipes: this.jamaisMemeCoequipier,
      memesAdversaires: this.eviterMemeAdversaire,
      typeEquipes: this.typeEquipes,
      complement: this.complement,
      typeTournoi: this.typeTournoi,
      listeJoueurs: this.props.listesJoueurs[this.typeInscription].slice(),
      avecTerrains: this.avecTerrains
    });

    //Ajout dans le store
    this._ajoutMatchs(matchs);

    //Désactivation de l'affichage du _displayLoading 
    this.setState({
      isLoading: false,
      isValid: true,
    });

    //Si génération valide alors return 2
    return 2;
  }

  _displayLoading() {
    const { t } = this.props;
    if (this.state.isLoading) {
      return (
        <VStack>
          <Spinner size={'large'} color="#ffda00"/>
          <Text color='$white'>{t("attente_generation_matchs")}</Text>
        </VStack>
      )
    } else {
      let textInfo = t("erreur_generation_options");
      let textError = '';
      if (!this.state.isGenerationSuccess) {
        textError = t("erreur_generation_options_regles");
      } else if (this.state.erreurSpeciaux) {
        textError = t("erreur_generation_joueurs_speciaux");
      } else if (this.state.erreurMemesEquipes) {
        textError = t("erreur_generation_regle_equipes");
      } else {
        textInfo = t("chargement_publicite")
      }
      return (
        <VStack>
          <Text color='$white'>{textInfo}</Text>
          <Text color='$white'>{textError}</Text>
          <Button action='primary' onPress={() => this._retourInscription()}>
            <ButtonText>{t("retour_inscription")}</ButtonText>
          </Button>
        </VStack>
      )
    }
  }

  _retourInscription() {
    this.props.navigation.navigate(this.props.route.params.screenStackName);
  }

  render() {
    const { t } = this.props;
    if (this.state.adLoaded && this.state.isValid) {
      this.interstitial.show();
    }
    if (this.state.adClosed) {
      this._displayListeMatch();
    }
    return (
      <SafeAreaView style={{flex: 1}}>
        <VStack flex={1} bgColor='#0594ae'>
          <TopBarBack title={t("generation_matchs_navigation_title")} navigation={this.props.navigation}/>
          <VStack flex={1} px={'$10'} justifyContent='center' alignItems='center'>
            {this._displayLoading()}
          </VStack>
        </VStack>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    listesJoueurs: state.listesJoueurs.listesJoueurs,
    listeMatchs: state.gestionMatchs.listematchs,
    listeTournois: state.listeTournois.listeTournois,
    optionsTournoi: state.optionsTournoi.options,
    listeTerrains: state.listeTerrains.listeTerrains
  }
}

export default connect(mapStateToProps)(withTranslation()(GenerationMatchs))