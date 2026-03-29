import Loading from '@/components/Loading';
import TopBarBack from '@/components/topBar/TopBarBack';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useMatchs } from '@/repositories/matchs/useMatchs';
import { useTournois } from '@/repositories/tournois/useTournois';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { JoueurModel } from '@/types/interfaces/joueurModel';
import { requestReview } from '@/utils/storeReview/StoreReview';
import AdMobMatchDetailBanner from '@components/adMob/AdMobMatchDetailBanner';
import { nextMatch } from '@utils/generations/nextMatch/nextMatch';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type EquipeId = 1 | 2;

export interface Props {
  idMatch: number;
}

const MatchDetail: React.FC<Props> = ({ idMatch }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [score1, setScore1] = useState<string | undefined>(undefined);
  const [score2, setScore2] = useState<string | undefined>(undefined);

  const secondInput = React.createRef<any>();

  const { updateScore, resetScore } = useMatchs();
  const { actualTournoi } = useTournois();

  if (!actualTournoi) {
    return <Loading />;
  }

  const { nbPtVictoire, nbMatchs, typeTournoi, nbTours, tournoiID } =
    actualTournoi.options;

  const match = actualTournoi.matchs.find((match) => match.matchId === idMatch);
  if (!match) {
    throw Error('match devrait être trouvé');
  }

  const ajoutScoreTextInputChanged = (score: string, equipe: EquipeId) =>
    equipe === 1 ? setScore1(score) : setScore2(score);

  const displayTitle = () => {
    const { matchId, terrain } = match;
    const title = terrain ? terrain.name : `${t('match_numero')}${matchId + 1}`;
    return (
      <Text className="text-typography-white text-xl text-center">{title}</Text>
    );
  };

  const displayName = (joueur: JoueurModel, equipeId: EquipeId) => {
    if (equipeId === 1) {
      return (
        <Text
          key={joueur.joueurTournoiId}
          className="text-typography-white text-md text-left"
        >
          {`${joueur.joueurTournoiId + 1} ${joueur.name}`}
        </Text>
      );
    } else {
      return (
        <Text
          key={joueur.joueurTournoiId}
          className="text-typography-white text-md text-right"
        >
          {`${joueur.name} ${joueur.joueurTournoiId + 1}`}
        </Text>
      );
    }
  };

  const displayEquipe = (equipeId: EquipeId) => {
    const nomsJoueurs = [];
    const equipe = match.equipe[equipeId - 1];
    for (let i = 0; i < 4; i++) {
      const joueur = equipe[i];
      if (joueur && joueur !== -1) {
        nomsJoueurs.push(displayName(joueur, equipeId));
      }
    }
    return nomsJoueurs;
  };

  const envoyerResultat = async () => {
    await requestReview();

    const nombreScore1 = parseInt(score1 ?? '');
    const nombreScore2 = parseInt(score2 ?? '');
    if (isNaN(nombreScore1) || isNaN(nombreScore2)) {
      throw Error('score1 ou score2 pas un nombre');
    }
    await updateScore(match.matchId, nombreScore1, nombreScore2);

    //Actualise les matchs suivants si nécessaire selon le type de tournoi (COUPE & MULTICHANCES)
    await nextMatch(
      match.matchId,
      nombreScore1,
      nombreScore2,
      match.manche,
      nbMatchs,
      typeTournoi,
      nbTours,
      tournoiID,
    );

    router.back();
  };

  const supprimerResultat = async () => {
    await resetScore(match.matchId);
    router.back();
  };

  const boutonValider = () => {
    let btnDisabled: boolean;
    let action: 'warning' | 'positive' | 'negative';
    let text: string;

    const nombreScore1 = parseInt(score1 ?? '');
    const nombreScore2 = parseInt(score2 ?? '');
    const isScore1Valide = !isNaN(nombreScore1);
    const isScore2Valide = !isNaN(nombreScore2);

    if (isScore1Valide && isScore2Valide) {
      const egaliteCoupeMultiChances =
        (typeTournoi === TypeTournoi.MULTICHANCES ||
          typeTournoi === TypeTournoi.COUPE) &&
        nombreScore1 === nombreScore2;

      const aucunGagnant =
        nombreScore1 !== nbPtVictoire && nombreScore2 !== nbPtVictoire;

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
        onPress={envoyerResultat}
      >
        <ButtonText>{text}</ButtonText>
      </Button>
    );
  };

  return (
    <ScrollView className="h-1 bg-custom-background">
      <VStack>
        <TopBarBack title={t('detail_match_navigation_title')} />
        <VStack className="px-10 justify-between">
          <VStack space="xl">
            {displayTitle()}
            <HStack className="items-center">
              <Box className="flex-2">{displayEquipe(1)}</Box>
              <Box className="flex-1 items-center">
                <Text className="text-typography-white text-xl">{t('vs')}</Text>
              </Box>
              <Box className="flex-2">{displayEquipe(2)}</Box>
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
                      match.score1 !== undefined ? match.score1.toString() : ''
                    }
                    keyboardType="decimal-pad"
                    returnKeyType="next"
                    maxLength={2}
                    onChangeText={(text) => ajoutScoreTextInputChanged(text, 1)}
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
                      match.score2 !== undefined ? match.score2.toString() : ''
                    }
                    keyboardType="decimal-pad"
                    maxLength={2}
                    onChangeText={(text) => ajoutScoreTextInputChanged(text, 2)}
                    ref={secondInput}
                  />
                </Input>
              </Box>
            </HStack>
          </VStack>
          <VStack space="lg" className="my-5">
            <Button action="negative" onPress={supprimerResultat}>
              <ButtonText>{t('supprimer_score')}</ButtonText>
            </Button>
            {boutonValider()}
          </VStack>
          <VStack className="mb-5">
            <AdMobMatchDetailBanner />
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default MatchDetail;
