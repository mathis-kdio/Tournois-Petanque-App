import { KeyboardAvoidingView } from '@/components/ui/keyboard-avoiding-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import AdMobMatchDetailBanner from '@components/adMob/AdMobMatchDetailBanner';
import { nextMatch } from '@utils/generations/nextMatch/nextMatch';
import { Platform } from 'react-native';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { MatchModel } from '@/types/interfaces/matchModel';
import { requestReview } from '@/utils/storeReview/StoreReview';
import { useDispatch } from 'react-redux';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '@/components/Loading';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { useMatchsRepository } from '@/repositories/useMatchsRepository';
import { useTournoisRepository } from '@/repositories/useTournoisRepository';
import { TournoiModel } from '@/types/interfaces/tournoi';

type SearchParams = {
  idMatch?: string;
};

type EquipeId = 1 | 2;

const MatchDetail = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const param = useLocalSearchParams<SearchParams>();
  const dispatch = useDispatch();

  const { getMatch, updateScore } = useMatchsRepository();
  const { getActualTournoi } = useTournoisRepository();

  const [match, setMatch] = useState<MatchModel | undefined>(undefined);
  const [tournoi, setTournoi] = useState<TournoiModel | undefined>(undefined);
  const [score1, setScore1] = useState<string | undefined>(undefined);
  const [score2, setScore2] = useState<string | undefined>(undefined);

  const secondInput = React.createRef<any>();

  let idMatchParams = parseInt(param.idMatch ?? '');

  useEffect(() => {
    const fetchData = async () => {
      const result = await getMatch(idMatchParams);
      setMatch(result);
      const resultTournoi = await getActualTournoi();
      setTournoi(resultTournoi);
    };
    fetchData();
  }, [getActualTournoi, getMatch, idMatchParams]);

  if (isNaN(idMatchParams)) {
    return <Loading />;
  }

  if (!match || !tournoi) {
    return <Loading />;
  }

  const _ajoutScoreTextInputChanged = (score: string, equipe: EquipeId) =>
    equipe === 1 ? setScore1(score) : setScore2(score);

  const _displayTitle = (match: MatchModel) => {
    const { id, terrain } = match;
    const title = terrain ? terrain.name : `${t('match_numero')}${id + 1}`;
    return (
      <Text className="text-typography-white text-xl text-center">{title}</Text>
    );
  };

  const _displayName = (joueur: JoueurModel | undefined, equipeId: EquipeId) => {
    if (!joueur) {
      return;
    }
    if (equipeId === 1) {
      return (
        <Text
          key={joueur.id}
          className="text-typography-white text-md text-left"
        >
          {`${joueur.id + 1} ${joueur.name}`}
        </Text>
      );
    } else {
      return (
        <Text
          key={joueur.id}
          className="text-typography-white text-md text-right"
        >
          {`${joueur.name} ${joueur.id + 1}`}
        </Text>
      );
    }
  };

  const _displayEquipe = (equipeId: EquipeId, match: MatchModel) => {
    let nomsJoueurs = [];
    const equipe = match.equipe[equipeId - 1];
    for (let i = 0; i < 4; i++) {
      nomsJoueurs.push(_displayName(equipe[i], equipeId));
    }
    return nomsJoueurs;
  };

  const _envoyerResultat = async (match: MatchModel) => {
    const { nbMatchs, typeTournoi, nbTours, tournoiID } = tournoi.options;
    await requestReview();

    if (!score1 || !score2) {
      return;
    }
    updateScore(match.id, parseInt(score1), parseInt(score2));
    //Si tournoi type coupe et pas le dernier match, alors on ajoute les gagnants au match suivant
    let actionNextMatch = nextMatch(match, nbMatchs, typeTournoi, nbTours);
    if (actionNextMatch !== undefined) {
      dispatch(actionNextMatch);
    }
    const actionUpdateTournoi = {
      type: 'UPDATE_TOURNOI',
      value: {
        tournoi: tournoi,
        tournoiId: tournoiID,
      },
    };
    dispatch(actionUpdateTournoi);

    router.back();
  };

  const _supprimerResultat = () => {
    let info = {
      idMatch: idMatch,
      score1: undefined,
      score2: undefined,
    };
    const actionAjoutScore = { type: 'AJOUT_SCORE', value: info };
    dispatch(actionAjoutScore);
    const actionUpdateTournoi = {
      type: 'UPDATE_TOURNOI',
      value: {
        tournoi: tournoi,
        tournoiId: tournoi.at(-1).tournoiID,
      },
    };
    dispatch(actionUpdateTournoi);
    router.back();
  };

  const _boutonValider = (match: MatchModel) => {
    const { nbPtVictoire, typeTournoi } = tournoi.options;

    let btnDisabled: boolean;
    let action: 'warning' | 'positive' | 'negative';
    let text: string;

    const score1Valide = score1 !== undefined && score1 !== '';
    const score2Valide = score2 !== undefined && score2 !== '';

    if (score1Valide && score2Valide) {
      const egaliteCoupeMultiChances =
        (typeTournoi === TypeTournoi.MULTICHANCES ||
          typeTournoi === TypeTournoi.COUPE) &&
        score1 === score2;

      const aucunGagnant =
        score1 !== nbPtVictoire.toString() &&
        score2 !== nbPtVictoire.toString();

      if (egaliteCoupeMultiChances) {
        btnDisabled = true;
        action = 'negative';
        text = t('valider_score_impossible_coupe_multichance', {
          typeTournoi,
        });
      } else if (aucunGagnant) {
        btnDisabled = false;
        action = 'warning';
        text = t('valider_score_sans_nb_pt_victoire', {
          nbPtVictoire,
        });
      } else {
        btnDisabled = false;
        action = 'positive';
        text = t('valider_score');
      }
    } else {
      btnDisabled = true;
      action = 'positive';
      text = t('valider_score');
    }

    return (
      <Button
        isDisabled={btnDisabled}
        action={action}
        onPress={() => _envoyerResultat(match)}
      >
        <ButtonText>{text}</ButtonText>
      </Button>
    );
  };

  const { nbPtVictoire } = tournoi.options;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : 'height'}
      style={{ flex: 1, zIndex: 999 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="h-1 bg-custom-background">
          <VStack>
            <TopBarBack title={t('detail_match_navigation_title')} />
            <VStack className="px-10 justify-between">
              <VStack space="xl">
                {_displayTitle(match)}
                <HStack className="items-center">
                  <Box className="flex-2">{_displayEquipe(1, match)}</Box>
                  <Box className="flex-1 items-center">
                    <Text className="text-typography-white text-xl">
                      {t('vs')}
                    </Text>
                  </Box>
                  <Box className="flex-2">{_displayEquipe(2, match)}</Box>
                </HStack>
                <HStack space="lg">
                  <Box className="flex-1">
                    <Text className="text-typography-white text-md">
                      {t('score_equipe_1')}{' '}
                    </Text>
                    <Input className="border-custom-bg-inverse">
                      <InputField
                        className="text-typography-white placeholder:text-typography-white"
                        placeholder={t('score_placeholder', {
                          scoreVictoire: nbPtVictoire,
                        })}
                        autoFocus={true}
                        defaultValue={
                          match.score1 !== undefined
                            ? match.score1.toString()
                            : ''
                        }
                        keyboardType="decimal-pad"
                        returnKeyType="next"
                        maxLength={2}
                        onChangeText={(text) =>
                          _ajoutScoreTextInputChanged(text, 1)
                        }
                        onSubmitEditing={() => secondInput.current.focus()}
                      />
                    </Input>
                  </Box>
                  <Box className="flex-1">
                    <Text className="text-typography-white text-md self-end">
                      {t('score_equipe_2')}{' '}
                    </Text>
                    <Input className="border-custom-bg-inverse">
                      <InputField
                        className="text-typography-white placeholder:text-typography-white"
                        placeholder={t('score_placeholder', {
                          scoreVictoire: nbPtVictoire,
                        })}
                        defaultValue={
                          match.score2 !== undefined
                            ? match.score2.toString()
                            : ''
                        }
                        keyboardType="decimal-pad"
                        maxLength={2}
                        onChangeText={(text) =>
                          _ajoutScoreTextInputChanged(text, 2)
                        }
                        ref={secondInput}
                      />
                    </Input>
                  </Box>
                </HStack>
              </VStack>
              <VStack space="lg" className="my-5">
                <Button action="negative" onPress={() => _supprimerResultat()}>
                  <ButtonText>{t('supprimer_score')}</ButtonText>
                </Button>
                {_boutonValider(match)}
              </VStack>
              <VStack className="mb-5">
                <AdMobMatchDetailBanner />
              </VStack>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default MatchDetail;
