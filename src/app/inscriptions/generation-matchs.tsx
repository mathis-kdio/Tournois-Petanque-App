import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { generationChampionnat } from '@utils/generations/championnat';
import { generationCoupe } from '@utils/generations/coupe';
import { generationMultiChances } from '@utils/generations/multiChances';
import { generationAvecEquipes } from '@utils/generations/tournoiAvecEquipes';
import { generationDoublettes } from '@utils/generations/tournoiDoublettes';
import { generationTeteATete } from '@utils/generations/tournoiTeteATete';
import { generationTriplettes } from '@utils/generations/tournoiTriplettes';
import { uniqueValueArrayRandOrder } from '@utils/generations/generation';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { Match } from '@/types/interfaces/match';
import TopBar from '@/components/topBar/TopBar';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import Loading from '@/components/Loading';
import { CommonActions } from '@react-navigation/native';
import { screenStackNameType } from '@/types/types/searchParams';
import {
  initInterstitial,
  onAdLoaded,
  showInterstitialAd,
  onAdError,
  onAdClosed,
} from '@/components/adMob/AdMobGenerationTournoiInterstitiel';

type SearchParams = {
  screenStackName?: string;
};

const GenerationMatchs = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const param = useLocalSearchParams<SearchParams>();
  const dispatch = useDispatch();

  const optionsTournoi = useSelector(
    (state: any) => state.optionsTournoi.options,
  );
  const listesJoueurs = useSelector(
    (state: any) => state.listesJoueurs.listesJoueurs,
  );
  const listeTerrains = useSelector(
    (state: any) => state.listeTerrains.listeTerrains,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerationEnd, setIsGenerationEnd] = useState(false);
  const [isGenerationSuccess, setIsGenerationSuccess] = useState(true);
  const [erreurSpeciaux, setErreurSpeciaux] = useState(false);
  const [erreurMemesEquipes, setErreurMemesEquipes] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adClosed, setAdClosed] = useState(false);

  const _ajoutMatchs = (matchs) => {
    const actionAjoutMatchs = { type: 'AJOUT_MATCHS', value: matchs };
    dispatch(actionAjoutMatchs);
    const actionAjoutTournoi = {
      type: 'AJOUT_TOURNOI',
      value: { tournoi: matchs },
    };
    dispatch(actionAjoutTournoi);
  };

  useEffect(() => {
    initInterstitial();

    onAdLoaded(() => {
      setAdLoaded(true);
      setAdClosed(false);
    });

    onAdError((err) => {
      setAdLoaded(false);
      setAdClosed(true);
    });

    onAdClosed(() => {
      setAdLoaded(false);
      setAdClosed(true);
    });
  }, []);

  useEffect(() => {
    if (!isGenerationEnd) return;

    if (Platform.OS !== 'web' && adLoaded) {
      showInterstitialAd();
      return;
    }

    if (Platform.OS === 'web' || adClosed) {
      navigation.dispatch(
        CommonActions.reset({
          routes: [{ name: 'tournoi' }],
        }),
      );
      return;
    }
  }, [isGenerationEnd, adLoaded, adClosed, navigation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      _lanceurGeneration();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const _lanceurGeneration = () => {
    let typeInscription = optionsTournoi.mode;
    let listeJoueurs = listesJoueurs[typeInscription];
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
      returnType = _generation();
      if (returnType === 0 || returnType === 2) {
        break;
      } else {
        nbGenerationsRatee++;
      }
    }
    //Si la génération échoue trop de fois à cause du breaker alors affichage d'un message pour indiquer de changer les options
    if (nbGenerationsRatee === nbEssaisPossibles) {
      setIsGenerationSuccess(false);
      setIsLoading(false);
    }
  };

  const _generation = () => {
    //Récupération des options que l'utilisateur a modifié ou laissé par défaut
    let nbTours = optionsTournoi.nbTours;
    let avecTerrains = optionsTournoi.avecTerrains;
    let nbPtVictoire = optionsTournoi.nbPtVictoire;
    let speciauxIncompatibles = optionsTournoi.speciauxIncompatibles;
    let jamaisMemeCoequipier = optionsTournoi.memesEquipes;
    let eviterMemeAdversaire = optionsTournoi.memesAdversaires;
    let typeEquipes = optionsTournoi.typeEquipes;
    let complement = optionsTournoi.complement;
    let typeTournoi = optionsTournoi.typeTournoi;
    let typeInscription = optionsTournoi.mode;

    let matchs = undefined;
    let nbMatchs = undefined;
    let erreurMemesEquipes = undefined;
    let erreurSpeciaux = undefined;
    let echecGeneration = undefined;
    if (typeTournoi === TypeTournoi.MELEDEMELE) {
      if (typeInscription === ModeTournoi.AVECEQUIPES) {
        ({ matchs, nbMatchs, echecGeneration } = generationAvecEquipes(
          listesJoueurs.avecEquipes,
          nbTours,
          typeEquipes,
          eviterMemeAdversaire,
        ));
      } else if (typeEquipes === TypeEquipes.TETEATETE) {
        ({ matchs, nbMatchs, echecGeneration } = generationTeteATete(
          listesJoueurs[typeInscription],
          nbTours,
          eviterMemeAdversaire,
        ));
      } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
        ({
          matchs,
          nbMatchs,
          erreurMemesEquipes,
          erreurSpeciaux,
          echecGeneration,
        } = generationDoublettes(
          listesJoueurs[typeInscription],
          nbTours,
          complement,
          speciauxIncompatibles,
          jamaisMemeCoequipier,
          eviterMemeAdversaire,
        ));
      } else if (typeEquipes === TypeEquipes.TRIPLETTE) {
        ({
          matchs,
          nbMatchs,
          erreurMemesEquipes,
          erreurSpeciaux,
          echecGeneration,
        } = generationTriplettes(
          listesJoueurs[typeInscription],
          nbTours,
          complement,
          speciauxIncompatibles,
          jamaisMemeCoequipier,
          eviterMemeAdversaire,
        ));
      } else {
        echecGeneration = true;
      }
    } else if (typeTournoi === TypeTournoi.COUPE) {
      ({ matchs, nbTours, nbMatchs } = generationCoupe(
        optionsTournoi,
        listesJoueurs.avecEquipes,
      ));
    } else if (typeTournoi === TypeTournoi.CHAMPIONNAT) {
      ({ matchs, nbTours, nbMatchs } = generationChampionnat(
        optionsTournoi,
        listesJoueurs.avecEquipes,
      ));
    } else if (typeTournoi === TypeTournoi.MULTICHANCES) {
      ({ matchs, nbTours, nbMatchs } = generationMultiChances(
        listesJoueurs[typeInscription],
        typeEquipes,
      ));
    } else {
      echecGeneration = true;
    }
    if (erreurMemesEquipes) {
      setErreurMemesEquipes(erreurMemesEquipes);
      setIsLoading(false);
      return 0;
    }
    if (erreurSpeciaux) {
      setErreurSpeciaux(erreurSpeciaux);
      setIsLoading(false);
      return 0;
    }
    if (!matchs || echecGeneration) {
      return 1;
    }

    //attributions des terrains
    if (avecTerrains) {
      let manche = matchs[0].manche;
      let arrRandIdsTerrains = uniqueValueArrayRandOrder(listeTerrains.length);
      let i = 0;
      matchs.forEach((match: Match) => {
        if (match.manche !== manche) {
          manche = match.manche;
          arrRandIdsTerrains = uniqueValueArrayRandOrder(listeTerrains.length);
          i = 0;
        }
        match.terrain = listeTerrains[arrRandIdsTerrains[i]];
        i++;
      });
    }

    //Ajout des options du match à la fin du tableau contenant les matchs
    matchs.push({
      tournoiID: undefined,
      nbTours: nbTours,
      nbMatchs: nbMatchs,
      nbPtVictoire: nbPtVictoire,
      speciauxIncompatibles: speciauxIncompatibles,
      memesEquipes: jamaisMemeCoequipier,
      memesAdversaires: eviterMemeAdversaire,
      typeEquipes: typeEquipes,
      complement: complement,
      typeTournoi: typeTournoi,
      listeJoueurs: listesJoueurs[typeInscription].slice(),
      avecTerrains: avecTerrains,
      mode: typeInscription,
    });

    //Ajout dans le store
    _ajoutMatchs(matchs);

    //Désactivation de l'affichage du _displayLoading
    setIsLoading(false);
    setIsGenerationEnd(true);

    //Si génération valide alors return 2
    return 2;
  };

  const _displayLoading = (screenStackName: screenStackNameType) => {
    if (isLoading) {
      return (
        <VStack>
          <Loading />
          <Text className="text-typography-white">
            {t('attente_generation_matchs')}
          </Text>
        </VStack>
      );
    } else {
      let textInfo = t('erreur_generation_options');
      let textError = '';
      if (!isGenerationSuccess) {
        textError = t('erreur_generation_options_regles');
      } else if (erreurSpeciaux) {
        textError = t('erreur_generation_joueurs_speciaux');
      } else if (erreurMemesEquipes) {
        textError = t('erreur_generation_regle_equipes');
      } else {
        textInfo = t('chargement_publicite');
      }
      return (
        <VStack>
          <Loading />
          <Text className="text-typography-white">{textInfo}</Text>
          <Text className="text-typography-white">{textError}</Text>
          <Button
            action="primary"
            onPress={() => _retourInscription(screenStackName)}
          >
            <ButtonText>{t('retour_inscription')}</ButtonText>
          </Button>
        </VStack>
      );
    }
  };

  const _retourInscription = (screenStackName: screenStackNameType) => {
    router.replace(`/inscriptions/${screenStackName}`);
  };

  if (
    param.screenStackName !== 'inscriptions-avec-noms' &&
    param.screenStackName !== 'inscriptions-sans-noms'
  ) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 bg-custom-background">
        <TopBar title={t('generation_matchs_navigation_title')} />
        <VStack className="flex-1 px-10 justify-center items-center">
          {_displayLoading(param.screenStackName)}
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default GenerationMatchs;
