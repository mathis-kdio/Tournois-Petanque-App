import {
  initInterstitial,
  onAdClosed,
  onAdError,
  onAdLoaded,
  showInterstitialAd,
} from '@/components/adMob/AdMobGenerationTournoiInterstitiel';
import Loading from '@/components/Loading';
import { VStack } from '@/components/ui/vstack';
import { useJoueursPreparationTournois } from '@/repositories/joueursPreparationTournois/useJoueursPreparationTournois';
import { usePreparationTournoi } from '@/repositories/preparationTournoi/usePreparationTournoi';
import { useTerrainsPreparationTournois } from '@/repositories/terrainsPreparationTournois/useTerrainsPreparationTournois';
import { ModeCreationEquipes } from '@/types/enums/modeCreationEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { MatchGeneration } from '@/types/interfaces/match-generation';
import { PreparationTournoiModel } from '@/types/interfaces/preparationTournoiModel';
import { screenStackNameType } from '@/types/types/searchParams';
import { generationMelee } from '@/utils/generations/tournoi-melee';
import { CommonActions } from '@react-navigation/native';
import { generationChampionnat } from '@utils/generations/championnat';
import { generationCoupe } from '@utils/generations/coupe';
import {
  attributionEquipes,
  uniqueValueArrayRandOrder,
} from '@utils/generations/generation';
import { generationMultiChances } from '@utils/generations/multiChances';
import { generationDoublettes } from '@utils/generations/tournoiDoublettes';
import { generationTeteATete } from '@utils/generations/tournoiTeteATete';
import { generationTriplettes } from '@utils/generations/tournoiTriplettes';
import { useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import GenerationLoading from './components/GenerationLoading';
import { useCreateTournoi } from './hooks/use-create-tournoi';

export interface Props {
  screenStackName: screenStackNameType;
}

const GenerationMatchs: React.FC<Props> = ({ screenStackName }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { preparationTournoiVM } = usePreparationTournoi();
  const { joueurs } = useJoueursPreparationTournois();
  const { terrains } = useTerrainsPreparationTournois();
  const { addTournoi, addMatchs, clearPreparationTournois } =
    useCreateTournoi();

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerationEnd, setIsGenerationEnd] = useState(false);
  const [isGenerationSuccess, setIsGenerationSuccess] = useState(true);
  const [erreurSpeciaux, setErreurSpeciaux] = useState(false);
  const [erreurMemesEquipes, setErreurMemesEquipes] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adClosed, setAdClosed] = useState(false);

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
    if (!isGenerationEnd) {
      return;
    }

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

  const ajoutMatchs = useCallback(
    async (
      matchs: MatchGeneration[],
      optionsTournoi: PreparationTournoiModel,
    ) => {
      const tournoi = await addTournoi(optionsTournoi);

      await addMatchs(matchs, tournoi.id);

      await clearPreparationTournois();
    },
    [addMatchs, addTournoi, clearPreparationTournois],
  );

  const generation = useCallback(
    (preparationTournoiModel: PreparationTournoiModel) => {
      //Récupération des options que l'utilisateur a modifié ou laissé par défaut
      const {
        avecTerrains,
        complement,
        memesAdversaires,
        memesEquipes,
        mode,
        modeCreationEquipes,
        nbPtVictoire,
        speciauxIncompatibles,
        typeEquipes,
        typeTournoi,
        nbTours,
      } = preparationTournoiModel;
      if (
        avecTerrains === undefined ||
        memesAdversaires === undefined ||
        memesEquipes === undefined ||
        !mode ||
        !modeCreationEquipes ||
        nbPtVictoire === undefined ||
        speciauxIncompatibles === undefined ||
        !typeEquipes ||
        !typeTournoi ||
        nbTours === undefined
      ) {
        throw Error('preparationTournoiModel incomplet');
      }

      let listeJoueursInscrits: JoueurModel[];
      if (
        mode === ModeTournoi.AVECEQUIPES &&
        modeCreationEquipes === ModeCreationEquipes.ALEATOIRE
      ) {
        listeJoueursInscrits = attributionEquipes(joueurs, typeEquipes);
      } else {
        listeJoueursInscrits = joueurs;
      }

      let matchs: MatchGeneration[] | undefined = undefined;
      let nbMatchs: number | undefined = undefined;
      let finalNbTours = nbTours;
      let erreurMemesEquipes: boolean | undefined = undefined;
      let erreurSpeciaux: boolean | undefined = undefined;
      let echecGeneration: boolean | undefined = undefined;
      if (typeTournoi === TypeTournoi.MELEDEMELE) {
        if (typeEquipes === TypeEquipes.TETEATETE) {
          ({ matchs, nbMatchs, echecGeneration } = generationTeteATete(
            listeJoueursInscrits,
            nbTours,
            memesAdversaires,
          ));
        } else if (typeEquipes === TypeEquipes.DOUBLETTE) {
          ({
            matchs,
            nbMatchs,
            erreurMemesEquipes,
            erreurSpeciaux,
            echecGeneration,
          } = generationDoublettes(
            listeJoueursInscrits,
            nbTours,
            complement,
            speciauxIncompatibles,
            memesEquipes,
            memesAdversaires,
          ));
        } else if (typeEquipes === TypeEquipes.TRIPLETTE) {
          ({
            matchs,
            nbMatchs,
            erreurMemesEquipes,
            erreurSpeciaux,
            echecGeneration,
          } = generationTriplettes(
            listeJoueursInscrits,
            nbTours,
            complement,
            speciauxIncompatibles,
            memesEquipes,
            memesAdversaires,
          ));
        } else {
          echecGeneration = true;
        }
      } else if (typeTournoi === TypeTournoi.MELEE) {
        ({ matchs, nbMatchs, echecGeneration } = generationMelee(
          listeJoueursInscrits,
          nbTours,
          typeEquipes,
          memesAdversaires,
        ));
      } else if (typeTournoi === TypeTournoi.COUPE) {
        ({
          matchs,
          nbTours: finalNbTours,
          nbMatchs,
        } = generationCoupe(typeEquipes, listeJoueursInscrits));
      } else if (typeTournoi === TypeTournoi.CHAMPIONNAT) {
        ({
          matchs,
          nbTours: finalNbTours,
          nbMatchs,
        } = generationChampionnat(typeEquipes, listeJoueursInscrits));
      } else if (typeTournoi === TypeTournoi.MULTICHANCES) {
        ({
          matchs,
          nbTours: finalNbTours,
          nbMatchs,
        } = generationMultiChances(listeJoueursInscrits, typeEquipes));
      } else {
        throw new Error('typeTournoi inconnu');
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
        let arrRandIdsTerrains = uniqueValueArrayRandOrder(terrains.length);
        let terrainIndex = 0;
        for (let k = 0; k < matchs.length; k++) {
          const match = matchs[k];
          if (match.manche !== manche) {
            manche = match.manche;
            arrRandIdsTerrains = uniqueValueArrayRandOrder(terrains.length);
            terrainIndex = 0;
          }
          match.terrain = terrains[arrRandIdsTerrains[terrainIndex]];
          terrainIndex += 1;
        }
      }

      //Ajout des options du match à la fin du tableau contenant les matchs
      const tournoiOptions: PreparationTournoiModel = {
        id: 0,
        nbTours: finalNbTours,
        nbMatchs: nbMatchs,
        nbPtVictoire: nbPtVictoire,
        speciauxIncompatibles: speciauxIncompatibles,
        memesEquipes: memesEquipes,
        memesAdversaires: memesAdversaires,
        typeEquipes: typeEquipes,
        complement: complement,
        typeTournoi: typeTournoi,
        avecTerrains: avecTerrains,
        mode: mode,
      };

      //Ajout dans le store
      ajoutMatchs(matchs, tournoiOptions);

      //Désactivation de l'affichage du _displayLoading
      setIsLoading(false);
      setIsGenerationEnd(true);

      //Si génération valide alors return 2
      return 2;
    },
    [ajoutMatchs, joueurs, terrains],
  );

  const lanceurGeneration = useCallback(
    (preparationTournoiModel: PreparationTournoiModel) => {
      const nbjoueurs = joueurs.length;
      const nbEssaisPossibles = nbjoueurs * nbjoueurs;
      let nbGenerationsRatee = 0;
      let returnType = 0;
      // 3 types de retour possible:
      // 0 si trop de personnes de type enfants ou règle pas memeEquipes impossible;
      // 1 si breaker activé
      // 2 si génération réussie
      //Tant que la génération échoue à cause du breaker alors on relancer
      while (nbGenerationsRatee < nbEssaisPossibles) {
        returnType = generation(preparationTournoiModel);
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
    },
    [generation, joueurs],
  );

  useEffect(() => {
    if (!preparationTournoiVM) {
      return;
    }

    const timer = setTimeout(() => {
      lanceurGeneration(preparationTournoiVM);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [lanceurGeneration, preparationTournoiVM]);

  if (!preparationTournoiVM || !joueurs.length) {
    return <Loading />;
  }

  return (
    <VStack className="flex-1 bg-custom-background">
      <VStack className="flex-1 px-10 justify-center items-center">
        <GenerationLoading
          screenStackName={screenStackName}
          isLoading={isLoading}
          isGenerationSuccess={isGenerationSuccess}
          erreurSpeciaux={erreurSpeciaux}
          erreurMemesEquipes={erreurMemesEquipes}
        />
      </VStack>
    </VStack>
  );
};

export default GenerationMatchs;
