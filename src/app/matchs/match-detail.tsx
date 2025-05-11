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
import AdMobMatchDetailBanner from '../../components/adMob/AdMobMatchDetailBanner';
import { nextMatch } from '../../utils/generations/nextMatch/nextMatch';
import { Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Joueur } from '@/types/interfaces/joueur';
import { Match } from '@/types/interfaces/match';
import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { requestReview } from '@/utils/storeReview/StoreReview';
import { useDispatch, useSelector } from 'react-redux';
import { OptionsTournoi } from '@/types/interfaces/optionsTournoi';

type DetailsScreenRouteProp = {
  params: {
    idMatch: number;
    match: Match;
    nbPtVictoire: number;
  };
};

const MatchDetail = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any, any>>();
  const route = useRoute<DetailsScreenRouteProp>();
  const dispatch = useDispatch();

  const tournoi = useSelector((state: any) => state.gestionMatchs.listematchs);

  const [idMatch, setIdMatch] = useState<number | undefined>(undefined);
  const [score1, setScore1] = useState<string | undefined>(undefined);
  const [score2, setScore2] = useState<string | undefined>(undefined);

  const secondInput = React.createRef<any>();

  useEffect(() => {
    const idMatch = route.params?.idMatch;
    setIdMatch(idMatch);
  }, [route.params?.idMatch]); // Le tableau de dépendances signifie que cet effet s'exécute lorsque idMatch change

  const _ajoutScoreTextInputChanged = (score: string, equipe: number) => {
    if (equipe === 1) {
      setScore1(score);
    } else if (equipe === 2) {
      setScore2(score);
    }
  };

  const _displayTitle = (match: Match) => {
    let title = match.terrain
      ? match.terrain.name
      : t('match_numero') + (match.id + 1);
    return <Text className="text-white text-xl text-center">{title}</Text>;
  };

  const _displayName = (joueurNumber: number, equipe: number) => {
    let listeJoueurs = tournoi.at(-1).listeJoueurs;
    let joueur = listeJoueurs.find((item: Joueur) => item.id === joueurNumber);
    if (joueur) {
      if (equipe === 1) {
        return (
          <Text key={joueur.id} className="text-white text-md text-left">
            {joueur.id + 1 + ' ' + joueur.name}
          </Text>
        );
      } else {
        return (
          <Text key={joueur.id} className="text-white text-md text-right">
            {joueur.name + ' ' + (joueur.id + 1)}
          </Text>
        );
      }
    }
  };

  const _displayEquipe = (equipe: number, match: Match) => {
    let nomsJoueurs = [];
    for (let i = 0; i < 4; i++) {
      nomsJoueurs.push(_displayName(match.equipe[equipe - 1][i], equipe));
    }
    return nomsJoueurs;
  };

  const _envoyerResultat = async (match: Match) => {
    await requestReview();

    if (score1 && score2) {
      let info = {
        idMatch: idMatch,
        score1: parseInt(score1),
        score2: parseInt(score2),
      };
      const actionAjoutScore = { type: 'AJOUT_SCORE', value: info };
      dispatch(actionAjoutScore);
      //Si tournoi type coupe et pas le dernier match, alors on ajoute les gagnants au match suivant
      let optionsTournoi = tournoi.at(-1) as OptionsTournoi;
      let nbMatchs = optionsTournoi.nbMatchs;
      let typeTournoi = optionsTournoi.typeTournoi;
      let nbTours = optionsTournoi.nbTours;
      let actionNextMatch = nextMatch(match, nbMatchs, typeTournoi, nbTours);
      if (actionNextMatch !== undefined) {
        dispatch(actionNextMatch);
      }
      const actionUpdateTournoi = {
        type: 'UPDATE_TOURNOI',
        value: {
          tournoi: tournoi,
          tournoiId: optionsTournoi.tournoiID,
        },
      };
      dispatch(actionUpdateTournoi);

      navigation.dispatch(StackActions.pop(1));
    }
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
    navigation.navigate('ListeMatchsStack');
  };

  const _boutonValider = (match: Match) => {
    let btnDisabled = !(score1 && score2);
    return (
      <Button
        isDisabled={btnDisabled}
        action="positive"
        onPress={() => _envoyerResultat(match)}
      >
        <ButtonText>{t('valider_score')}</ButtonText>
      </Button>
    );
  };

  let { match, nbPtVictoire } = route.params;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : 'height'}
      style={{ flex: 1, zIndex: 999 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="h-1 bg-[#0594ae]">
          <VStack>
            <TopBarBack
              title={t('detail_match_navigation_title')}
              navigation={navigation}
            />
            <VStack className="px-10 justify-between">
              <VStack space="xl">
                {_displayTitle(match)}
                <HStack className="items-center">
                  <Box className="flex-2">{_displayEquipe(1, match)}</Box>
                  <Box className="flex-1 items-center">
                    <Text className="text-white text-xl">VS</Text>
                  </Box>
                  <Box className="flex-2">{_displayEquipe(2, match)}</Box>
                </HStack>
                <HStack space="lg">
                  <Box className="flex-1">
                    <Text className="text-white text-md">
                      {t('score_equipe_1')}{' '}
                    </Text>
                    <Input className="border-white">
                      <InputField
                        className="text-white placeholder:text-white"
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
                    <Text className="text-white text-md self-end">
                      {t('score_equipe_2')}{' '}
                    </Text>
                    <Input className="border-white">
                      <InputField
                        className="text-white placeholder:text-white"
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
                        onSubmitEditing={() => _envoyerResultat(match)}
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
