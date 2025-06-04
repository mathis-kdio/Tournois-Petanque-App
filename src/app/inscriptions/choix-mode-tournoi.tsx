import { ScrollView } from '@/components/ui/scroll-view';
import { Box } from '@/components/ui/box';
import { CircleIcon } from '@/components/ui/icon';
import {
  Radio,
  RadioLabel,
  RadioIcon,
  RadioGroup,
  RadioIndicator,
} from '@/components/ui/radio';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBarBack from '@/components/topBar/TopBarBack';
import { useTranslation } from 'react-i18next';
import AdMobInscriptionsBanner from '@/components/adMob/AdMobInscriptionsBanner';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { ModeTournoi } from '@/types/enums/modeTournoi';
import { TypeTournoi } from '@/types/enums/typeTournoi';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigation } from 'expo-router';

const ChoixModeTournoi = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const optionsTournoi = useSelector(
    (state: any) => state.optionsTournoi.options,
  );

  const [typeEquipes, setTypeEquipes] = useState(TypeEquipes.DOUBLETTE);
  const [modeTournoi, setModeTournoi] = useState(ModeTournoi.AVECNOMS);

  const _nextStep = () => {
    let finalModeTournoi = modeTournoi;
    let typeTournoi = optionsTournoi.typeTournoi;
    if (typeTournoi !== TypeTournoi.MELEDEMELE) {
      finalModeTournoi = ModeTournoi.AVECEQUIPES;
    }
    const updateOptionEquipesTournoi = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['typeEquipes', typeEquipes],
    };
    dispatch(updateOptionEquipesTournoi);
    const updateOptionModeTournoi = {
      type: 'UPDATE_OPTION_TOURNOI',
      value: ['mode', finalModeTournoi],
    };
    dispatch(updateOptionModeTournoi);

    if (
      typeTournoi !== TypeTournoi.CHAMPIONNAT &&
      typeTournoi !== TypeTournoi.COUPE &&
      typeTournoi !== TypeTournoi.MULTICHANCES
    ) {
      let screenName =
        modeTournoi === ModeTournoi.SANSNOMS
          ? 'InscriptionsSansNoms'
          : 'InscriptionsAvecNoms';
      navigation.navigate({
        name: 'OptionsTournoi',
        params: {
          screenStackName: screenName,
        },
      });
    } else {
      navigation.navigate('InscriptionsAvecNoms');
    }
  };

  const _validButton = () => {
    let buttonDisabled = false;
    let title = t('valider_et_options');
    let typeTournoi = optionsTournoi.typeTournoi;
    if (
      typeTournoi === TypeTournoi.CHAMPIONNAT ||
      typeTournoi === TypeTournoi.COUPE ||
      typeTournoi === TypeTournoi.MULTICHANCES
    ) {
      title = t('valider_et_inscriptions');
    }
    if (
      modeTournoi === ModeTournoi.AVECEQUIPES &&
      typeEquipes === TypeEquipes.TETEATETE
    ) {
      buttonDisabled = true;
      title = t('erreur_tournoi_tete_a_tete_et_equipes');
    }
    return (
      <Button
        action="primary"
        isDisabled={buttonDisabled}
        onPress={() => _nextStep()}
        size="md"
      >
        <ButtonText>{title}</ButtonText>
      </Button>
    );
  };

  const _modeTournoi = () => {
    let typeTournoi = optionsTournoi.typeTournoi;
    if (typeTournoi !== TypeTournoi.MELEDEMELE) {
      return;
    }
    return (
      <VStack>
        <Text className="text-white text-2xl text-center">
          {t('mode_tournoi')}
        </Text>
        <RadioGroup
          aria-label={t('choix_mode_tournoi')}
          value={modeTournoi}
          onChange={(nextValue) => setModeTournoi(nextValue)}
        >
          <VStack space="lg">
            <Radio value={ModeTournoi.AVECNOMS} size="lg">
              <RadioIndicator className="mr-2 border-white">
                <RadioIcon
                  as={CircleIcon}
                  className="fill-white text-background-white"
                />
              </RadioIndicator>
              <RadioLabel className="text-white">
                {t('melee_demelee_avec_nom')}
              </RadioLabel>
            </Radio>
            <Radio value={ModeTournoi.SANSNOMS} size="lg">
              <RadioIndicator className="mr-2 border-white">
                <RadioIcon
                  as={CircleIcon}
                  className="fill-white text-background-white"
                />
              </RadioIndicator>
              <RadioLabel className="text-white">
                {t('melee_demelee_sans_nom')}
              </RadioLabel>
            </Radio>
            <Radio value={ModeTournoi.AVECEQUIPES} size="lg">
              <RadioIndicator className="mr-2 border-white">
                <RadioIcon
                  as={CircleIcon}
                  className="fill-white text-background-white"
                />
              </RadioIndicator>
              <RadioLabel className="text-white">
                {t('melee_avec_equipes_constituees')}
              </RadioLabel>
            </Radio>
          </VStack>
        </RadioGroup>
      </VStack>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="h-1 bg-[#0594ae]">
        <TopBarBack title={t('mode_tournoi')} />
        <VStack className="flex-1 px-10 justify-between">
          <VStack space="4xl">
            <Text className="text-white text-2xl text-center">
              {t('type_equipes')}
            </Text>
            <RadioGroup
              aria-label={t('choix_type_equipes')}
              value={typeEquipes}
              onChange={(nextValue) => setTypeEquipes(nextValue)}
            >
              <VStack space="lg">
                <Radio value={TypeEquipes.TETEATETE} size="lg">
                  <RadioIndicator className="mr-2 border-white">
                    <RadioIcon
                      as={CircleIcon}
                      className="fill-white text-background-white"
                    />
                  </RadioIndicator>
                  <RadioLabel className="text-white">
                    {t('tete_a_tete')}
                  </RadioLabel>
                </Radio>
                <Radio value={TypeEquipes.DOUBLETTE} size="lg">
                  <RadioIndicator className="mr-2 border-white">
                    <RadioIcon
                      as={CircleIcon}
                      className="fill-white text-background-white"
                    />
                  </RadioIndicator>
                  <RadioLabel className="text-white">
                    {t('doublettes')}
                  </RadioLabel>
                </Radio>
                <Radio value={TypeEquipes.TRIPLETTE} size="lg">
                  <RadioIndicator className="mr-2 border-white">
                    <RadioIcon
                      as={CircleIcon}
                      className="fill-white text-background-white"
                    />
                  </RadioIndicator>
                  <RadioLabel className="text-white">
                    {t('triplettes')}
                  </RadioLabel>
                </Radio>
              </VStack>
            </RadioGroup>
            {_modeTournoi()}
            {_validButton()}
          </VStack>
          <Box className="my-10">
            <AdMobInscriptionsBanner />
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChoixModeTournoi;
