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
import TopBarBack from '@components/TopBarBack'
import { _adMobGenerationTournoiInterstitiel } from '../../components/adMob/AdMobGenerationTournoiInterstitiel'
import { Platform } from 'react-native'
import { EventRegister } from 'react-native-event-listeners'
import { StackNavigationProp } from '@react-navigation/stack'
import { TFunction } from 'i18next'
import { TypeEquipes } from '@/types/enums/typeEquipes'
import { ModeTournoi } from '@/types/enums/modeTournoi'
import { TypeTournoi } from '@/types/enums/typeTournoi'
import { Complement } from '@/types/enums/complement'
import { Match } from '@/types/interfaces/match'

export interface Props {
  navigation: StackNavigationProp<any,any>;
  t: TFunction;
  nbTours: number;
  nbPtVictoire: number;
  speciauxIncompatibles: boolean;
  jamaisMemeCoequipier: boolean;
  eviterMemeAdversaire: number;
  typeEquipes: TypeEquipes;
  typeInscription: ModeTournoi;
  complement: Complement;
  typeTournoi: TypeTournoi;
  avecTerrains: boolean;
  /*interstitial: ;
  listener: ;*/
}

interface State {
  isLoading: boolean;
  isValid: boolean;
  isGenerationSuccess: boolean;
  erreurSpeciaux: boolean;
  erreurMemesEquipes: boolean;
  adLoaded: boolean;
  adClosed: boolean;
}

class GenerationMatchs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    props.nbTours = 5;
    props.nbPtVictoire = 13;
    props.speciauxIncompatibles = true;
    props.jamaisMemeCoequipier = true;
    props.eviterMemeAdversaire = 50;
    props.typeEquipes = TypeEquipes.DOUBLETTE;
    props.typeInscription = ModeTournoi.AVECNOMS;
    props.complement = Complement.TRIPLETTE;
    props.typeTournoi = TypeTournoi.MELEDEMELE;
    props.avecTerrains = false;
    props.interstitial;
    props.listener;
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

  async componentDidMount() {
    this.props.interstitial = await _adMobGenerationTournoiInterstitiel();
    this.props.listener = EventRegister.addEventListener('interstitialAdEvent', (data) => this.setState({ adLoaded: data.adLoaded, adClosed: data.adClosed }));
    setTimeout(() => {
      this._lanceurGeneration();
    }, 1000);
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.props.listener);
  }

  _displayListeMatch() {
    this.props.navigation.reset({
      index: 0,
      routes: [{name: 'ListeMatchsInscription'}],
    });
  }

  _lanceurGeneration() {
    //Récupération des options que l'utilisateur a modifié ou laissé par défaut
    this.props.nbTours = this.props.optionsTournoi.nbTours;
    this.props.nbPtVictoire = this.props.optionsTournoi.nbPtVictoire;
    this.props.speciauxIncompatibles = this.props.optionsTournoi.speciauxIncompatibles;
    this.props.jamaisMemeCoequipier = this.props.optionsTournoi.memesEquipes;
    this.props.eviterMemeAdversaire = this.props.optionsTournoi.memesAdversaires;
    this.props.typeEquipes = this.props.optionsTournoi.typeEquipes;
    this.props.typeInscription = this.props.optionsTournoi.mode;
    this.props.complement = this.props.optionsTournoi.complement;
    this.props.typeTournoi = this.props.optionsTournoi.type;
    this.props.avecTerrains = this.props.optionsTournoi.avecTerrains;

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
    let nbTours = this.props.nbTours;
    let erreurMemesEquipes = undefined;
    let erreurSpeciaux = undefined;
    let echecGeneration = undefined;
    if (this.props.typeTournoi == TypeTournoi.MELEDEMELE) {
      if (this.props.typeInscription == 'avecEquipes') {
        ({matchs, nbMatchs, echecGeneration} = generationAvecEquipes(this.props.listesJoueurs.avecEquipes, this.nbTours, this.typeEquipes, this.eviterMemeAdversaire));
      }
      else if (this.props.typeEquipes == TypeEquipes.TETEATETE) {
        ({matchs, nbMatchs, erreurMemesEquipes, erreurSpeciaux, echecGeneration} = generationDoublettes(this.props.listesJoueurs[this.props.typeInscription], this.props.nbTours, this.typeEquipes, this.complement, this.speciauxIncompatibles, this.jamaisMemeCoequipier, this.eviterMemeAdversaire));
      }
      else if (this.props.typeEquipes == TypeEquipes.DOUBLETTE) {
        ({matchs, nbMatchs, erreurMemesEquipes, erreurSpeciaux, echecGeneration} = generationDoublettes(this.props.listesJoueurs[this.props.typeInscription], this.props.nbTours, this.typeEquipes, this.complement, this.speciauxIncompatibles, this.jamaisMemeCoequipier, this.eviterMemeAdversaire));
      }
      else if (this.props.typeEquipes == TypeEquipes.TRIPLETTE) {
        ({matchs, nbMatchs, erreurMemesEquipes, erreurSpeciaux, echecGeneration} = generationTriplettes(this.props.listesJoueurs[this.props.typeInscription], this.props.nbTours));
      }
      else {
        echecGeneration = true;
      }
    }
    else if (this.props.typeTournoi == TypeTournoi.COUPE) {
      ({matchs, nbTours, nbMatchs} = generationCoupe(this.props.optionsTournoi, this.props.listesJoueurs.avecEquipes));
    }
    else if (this.props.typeTournoi == TypeTournoi.CHAMPIONNAT) {
      ({matchs, nbTours, nbMatchs} = generationChampionnat(this.props.optionsTournoi, this.props.listesJoueurs.avecEquipes));
    }
    else if (this.props.typeTournoi == TypeTournoi.MULTICHANCES) {
      ({matchs, nbTours, nbMatchs} = generationMultiChances(this.props.listesJoueurs[this.props.typeInscription], this.props.typeEquipes));
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
    if (this.props.avecTerrains) {
      let manche = matchs[0].manche;
      let arrRandIdsTerrains = uniqueValueArrayRandOrder(this.props.listeTerrains.length);
      let i = 0;
      matchs.forEach((match: Match) => {
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
      nbPtVictoire: this.props.nbPtVictoire,
      speciauxIncompatibles: this.props.speciauxIncompatibles,
      memesEquipes: this.props.jamaisMemeCoequipier,
      memesAdversaires: this.props.eviterMemeAdversaire,
      typeEquipes: this.props.typeEquipes,
      complement: this.props.complement,
      typeTournoi: this.props.typeTournoi,
      listeJoueurs: this.props.listesJoueurs[this.props.typeInscription].slice(),
      avecTerrains: this.props.avecTerrains
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
    if (Platform.OS !== 'web' && this.state.adLoaded && this.state.isValid) {
      this.props.interstitial.show();
    }
    if (Platform.OS === 'web' && this.state.isValid || this.state.adClosed) {
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