import { Spinner } from '@/components/ui/spinner';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { generationChampionnat } from '@utils/generations/championnat';
import { generationCoupe } from '@utils/generations/coupe';
import { generationMultiChances } from '@utils/generations/multiChances';
import { generationAvecEquipes } from '@utils/generations/tournoiAvecEquipes';
import { generationDoublettes } from '@utils/generations/tournoiDoublettes';
import { generationTeteATete } from '@utils/generations/tournoiTeteATete';
import { generationTriplettes } from '@utils/generations/tournoiTriplettes';
import { uniqueValueArrayRandOrder } from '@utils/generations/generation';
import { withTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@components/TopBarBack';
import { _adMobGenerationTournoiInterstitiel } from '../../components/adMob/AdMobGenerationTournoiInterstitiel';
import { Platform } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { StackNavigationProp } from '@react-navigation/stack';
import { TFunction } from 'i18next';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { Complement } from '@/types/enums/complement';
import { Match } from '@/types/interfaces/match';
import { PropsFromRedux, connector } from '@/store/connector';
import { RouteProp } from '@react-navigation/native';
import { InscriptionStackParamList } from '@/navigation/Navigation';

export interface Props extends PropsFromRedux {
  navigation: StackNavigationProp<any, any>;
  t: TFunction;
  route: RouteProp<InscriptionStackParamList, 'GenerationMatchs'>;
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
  nbTours: number = 5;
  nbPtVictoire: number = 13;
  speciauxIncompatibles: boolean = true;
  jamaisMemeCoequipier: boolean = true;
  eviterMemeAdversaire: number = 50;
  typeEquipes: TypeEquipes = TypeEquipes.DOUBLETTE;
  typeInscription: ModeTournoi = ModeTournoi.AVECNOMS;
  complement: Complement = Complement.TRIPLETTE;
  typeTournoi: TypeTournoi = TypeTournoi.MELEDEMELE;
  avecTerrains: boolean = false;
  interstitial: void | any;
  listener: string | boolean;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      isValid: false,
      isGenerationSuccess: true,
      erreurSpeciaux: false,
      erreurMemesEquipes: false,
      adLoaded: false,
      adClosed: false,
    };
  }

  _ajoutMatchs = (matchs) => {
    //this._supprimerMatchs();
    const actionAjoutMatchs = { type: 'AJOUT_MATCHS', value: matchs };
    this.props.dispatch(actionAjoutMatchs);
    const actionAjoutTournoi = {
      type: 'AJOUT_TOURNOI',
      value: { tournoi: matchs },
    };
    this.props.dispatch(actionAjoutTournoi);
  };

  _supprimerMatchs() {
    const action = { type: 'SUPPR_MATCHS' };
    this.props.dispatch(action);
  }

  async componentDidMount() {
    this.interstitial = await _adMobGenerationTournoiInterstitiel();
    this.listener = EventRegister.addEventListener(
      'interstitialAdEvent',
      (data) =>
        this.setState({ adLoaded: data.adLoaded, adClosed: data.adClosed }),
    );
    setTimeout(() => {
      this._lanceurGeneration();
    }, 1000);
  }

  componentWillUnmount() {
    if (typeof this.listener === 'string') {
      EventRegister.removeEventListener(this.listener);
    }
  }

  _displayListeMatch() {
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: 'ListeMatchsInscription' }],
    });
  }

  _lanceurGeneration() {
    //Récupération des options que l'utilisateur a modifié ou laissé par défaut
    this.nbTours = this.props.optionsTournoi.nbTours;
    this.nbPtVictoire = this.props.optionsTournoi.nbPtVictoire;
    this.speciauxIncompatibles =
      this.props.optionsTournoi.speciauxIncompatibles;
    this.jamaisMemeCoequipier = this.props.optionsTournoi.memesEquipes;
    this.eviterMemeAdversaire = this.props.optionsTournoi.memesAdversaires;
    this.typeEquipes = this.props.optionsTournoi.typeEquipes;
    this.typeInscription = this.props.optionsTournoi.mode;
    this.complement = this.props.optionsTournoi.complement;
    this.typeTournoi = this.props.optionsTournoi.typeTournoi;
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
      returnType = this._generation();
      if (returnType === 0 || returnType === 2) {
        break;
      } else {
        nbGenerationsRatee++;
      }
    }
    //Si la génération échoue trop de fois à cause du breaker alors affichage d'un message pour indiquer de changer les options
    if (nbGenerationsRatee === nbEssaisPossibles) {
      this.setState({
        isGenerationSuccess: false,
        isLoading: false,
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
    if (this.typeTournoi === TypeTournoi.MELEDEMELE) {
      if (this.typeInscription === ModeTournoi.AVECEQUIPES) {
        ({ matchs, nbMatchs, echecGeneration } = generationAvecEquipes(
          this.props.listesJoueurs.avecEquipes,
          this.nbTours,
          this.typeEquipes,
          this.eviterMemeAdversaire,
        ));
      } else if (this.typeEquipes === TypeEquipes.TETEATETE) {
        ({ matchs, nbMatchs, echecGeneration } = generationTeteATete(
          this.props.listesJoueurs[this.typeInscription],
          this.nbTours,
          this.eviterMemeAdversaire,
        ));
      } else if (this.typeEquipes === TypeEquipes.DOUBLETTE) {
        ({
          matchs,
          nbMatchs,
          erreurMemesEquipes,
          erreurSpeciaux,
          echecGeneration,
        } = generationDoublettes(
          this.props.listesJoueurs[this.typeInscription],
          this.nbTours,
          this.typeEquipes,
          this.complement,
          this.speciauxIncompatibles,
          this.jamaisMemeCoequipier,
          this.eviterMemeAdversaire,
        ));
      } else if (this.typeEquipes === TypeEquipes.TRIPLETTE) {
        ({
          matchs,
          nbMatchs,
          erreurMemesEquipes,
          erreurSpeciaux,
          echecGeneration,
        } = generationTriplettes(
          this.props.listesJoueurs[this.typeInscription],
          this.nbTours,
        ));
      } else {
        echecGeneration = true;
      }
    } else if (this.typeTournoi === TypeTournoi.COUPE) {
      ({ matchs, nbTours, nbMatchs } = generationCoupe(
        this.props.optionsTournoi,
        this.props.listesJoueurs.avecEquipes,
      ));
    } else if (this.typeTournoi === TypeTournoi.CHAMPIONNAT) {
      ({ matchs, nbTours, nbMatchs } = generationChampionnat(
        this.props.optionsTournoi,
        this.props.listesJoueurs.avecEquipes,
      ));
    } else if (this.typeTournoi === TypeTournoi.MULTICHANCES) {
      ({ matchs, nbTours, nbMatchs } = generationMultiChances(
        this.props.listesJoueurs[this.typeInscription],
        this.typeEquipes,
      ));
    } else {
      echecGeneration = true;
    }
    if (erreurMemesEquipes || erreurSpeciaux) {
      this.setState({
        erreurMemesEquipes: erreurMemesEquipes,
        erreurSpeciaux: erreurSpeciaux,
        isLoading: false,
      });
      return 0;
    }
    if (echecGeneration) {
      return 1;
    }

    //attributions des terrains
    if (this.avecTerrains) {
      let manche = matchs[0].manche;
      let arrRandIdsTerrains = uniqueValueArrayRandOrder(
        this.props.listeTerrains.length,
      );
      let i = 0;
      matchs.forEach((match: Match) => {
        if (match.manche !== manche) {
          manche = match.manche;
          arrRandIdsTerrains = uniqueValueArrayRandOrder(
            this.props.listeTerrains.length,
          );
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
      avecTerrains: this.avecTerrains,
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
          <Spinner size={'large'} className="text-[#ffda00]" />
          <Text className="text-white">{t('attente_generation_matchs')}</Text>
        </VStack>
      );
    } else {
      let textInfo = t('erreur_generation_options');
      let textError = '';
      if (!this.state.isGenerationSuccess) {
        textError = t('erreur_generation_options_regles');
      } else if (this.state.erreurSpeciaux) {
        textError = t('erreur_generation_joueurs_speciaux');
      } else if (this.state.erreurMemesEquipes) {
        textError = t('erreur_generation_regle_equipes');
      } else {
        textInfo = t('chargement_publicite');
      }
      return (
        <VStack>
          <Text className="text-white">{textInfo}</Text>
          <Text className="text-white">{textError}</Text>
          <Button action="primary" onPress={() => this._retourInscription()}>
            <ButtonText>{t('retour_inscription')}</ButtonText>
          </Button>
        </VStack>
      );
    }
  }

  _retourInscription() {
    this.props.navigation.navigate(this.props.route.params.screenStackName);
  }

  render() {
    const { t } = this.props;
    if (Platform.OS !== 'web' && this.state.adLoaded && this.state.isValid) {
      this.interstitial.show();
    }
    if ((Platform.OS === 'web' && this.state.isValid) || this.state.adClosed) {
      this._displayListeMatch();
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <VStack className="flex-1 bg-[#0594ae]">
          <TopBarBack
            title={t('generation_matchs_navigation_title')}
            navigation={this.props.navigation}
          />
          <VStack className="flex-1 px-10 justify-center items-center">
            {this._displayLoading()}
          </VStack>
        </VStack>
      </SafeAreaView>
    );
  }
}

export default connector(withTranslation()(GenerationMatchs));
